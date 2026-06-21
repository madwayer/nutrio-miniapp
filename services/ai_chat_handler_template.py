# -*- coding: utf-8 -*-
"""handle_ai_chat и handle_ai_chat_history — диалоговый AI-нутрициолог.

Этот файл ДОБАВЛЯЕТСЯ в api_server.py через apply_ai_chat.py.
"""
# Этот файл используется как шаблон — он не импортируется напрямую.
# Содержимое функций вставляется в api_server.py патч-скриптом.

# ─── Код для вставки ─────────────────────────────────────────────

HANDLER_CODE = """

# ═══════════════════════════════════════════════════════════════════
# AI CHAT — диалоговый нутрициолог
# ═══════════════════════════════════════════════════════════════════
async def handle_ai_chat(request):
    _rl = _check_rate(request, "aichat", max_req=20, window=60)
    if _rl is not None: return _rl
    try:
        body = await request.json()
        tid, _ae = await require_user(request, body=body)
        if _ae: return _ae

        message = str(body.get("message", "")).strip()[:2000]
        lang    = str(body.get("lang", "ru"))
        reset   = bool(body.get("reset", False))

        if not message and not reset:
            return _json_response({"error": "message required"}, 400, request)

        from utils.premium import check_ai_limit, increment_ai_uses, is_premium
        from database.models import AIChatHistory

        if reset:
            async with AsyncSessionLocal() as session:
                rows = (await session.execute(
                    select(AIChatHistory).where(AIChatHistory.telegram_id == tid)
                )).scalars().all()
                for r in rows:
                    await session.delete(r)
                await session.commit()
            return _json_response({"ok": True, "reset": True}, request=request)

        async with AsyncSessionLocal() as session:
            existing_count = (await session.execute(
                select(func.count(AIChatHistory.id))
                .where(AIChatHistory.telegram_id == tid,
                       AIChatHistory.role == "user")
            )).scalar() or 0

        if existing_count % 3 == 0:
            can_use, used, limit = await check_ai_limit(tid)
            if not can_use:
                return _json_response({
                    "error": "limit", "used": used, "limit": limit,
                    "premium": await is_premium(tid),
                    "tip_ru": "Использовано {}/{} запросов. Premium снимает ограничения.".format(used, limit),
                    "tip_en": "Used {}/{} queries. Premium removes limits.".format(used, limit),
                }, 402, request)

        tz    = await get_user_tz(tid)
        today = user_today(tz)
        ds    = datetime.combine(today, dtime.min) - timedelta(days=6, hours=tz)
        de    = datetime.combine(today, dtime.max) - timedelta(hours=tz)

        async with AsyncSessionLocal() as session:
            user, err = await _get_user_or_403(tid, session)
            if err: return err

            entries = (await session.execute(
                select(FoodEntry)
                .where(FoodEntry.telegram_id == tid,
                       FoodEntry.date >= ds, FoodEntry.date <= de)
                .order_by(FoodEntry.date)
            )).scalars().all()

            water_today = (await session.execute(
                select(func.coalesce(func.sum(WaterEntry.amount_ml), 0))
                .where(WaterEntry.telegram_id == tid,
                       WaterEntry.date >= datetime.combine(today, dtime.min) - timedelta(hours=tz),
                       WaterEntry.date <= de)
            )).scalar() or 0

            history_rows = (await session.execute(
                select(AIChatHistory)
                .where(AIChatHistory.telegram_id == tid)
                .order_by(AIChatHistory.created_at.desc())
                .limit(40)
            )).scalars().all()
            history_rows = list(reversed(history_rows))

        from collections import defaultdict
        daily = defaultdict(lambda: {"kcal": 0, "prot": 0, "fat": 0, "carbs": 0, "foods": []})
        for e in entries:
            d = (e.date + timedelta(hours=tz)).date().isoformat()
            daily[d]["kcal"]  += e.calories or 0
            daily[d]["prot"]  += e.protein  or 0
            daily[d]["fat"]   += e.fat      or 0
            daily[d]["carbs"] += e.carbs    or 0
            daily[d]["foods"].append(e.food_name or "")

        diary_lines = []
        for d, v in sorted(daily.items())[-7:]:
            top_foods = ", ".join(list(set(v["foods"]))[:5])
            diary_lines.append(
                d + ": " + str(round(v["kcal"])) + " kcal | "
                + "P:" + str(round(v["prot"])) + "g "
                + "F:" + str(round(v["fat"])) + "g "
                + "C:" + str(round(v["carbs"])) + "g | Foods: " + top_foods
            )
        diary_str = "\\n".join(diary_lines) if diary_lines else "No entries yet."

        is_ru = lang in ("ru", "uk", "be", "kk", "uz")
        lang_rule = (
            "ОБЯЗАТЕЛЬНО отвечай только на русском языке. "
            "Единицы: ккал, г, кг, мл, мин. Без markdown (без **, ##, ---)."
            if is_ru else
            "Respond in English only. No markdown formatting."
        )

        SYSTEM = (
            "You are NutriO — a personal AI nutritionist. You have access to the user nutrition data.\\n\\n"
            "User profile:\\n"
            "- Daily goal: " + str(user.daily_goal or 2000) + " kcal\\n"
            "- Weight: " + str(user.weight or "?") + " kg | Height: " + str(user.height or "?") + " cm\\n"
            "- Target: " + str(user.goal or "not set") + "\\n"
            "- Streak: " + str(user.streak_days or 0) + " days\\n"
            "- Water today: " + str(round(water_today)) + " ml / " + str(user.water_goal or 2000) + " ml\\n"
            "- Language: " + lang + "\\n\\n"
            "Last 7 days diary:\\n" + diary_str + "\\n\\n"
            + lang_rule + "\\n\\n"
            "Be warm, specific, use REAL numbers from data. "
            "Keep answers concise (3-6 sentences) unless asked for detail. "
            "Do NOT repeat the same advice twice in a conversation."
        )

        messages = []
        for row in history_rows[-20:]:
            messages.append({"role": row.role, "content": row.content})
        messages.append({"role": "user", "content": message})

        reply = await _claude("", system=SYSTEM, max_tokens=800, messages=messages)

        if is_ru:
            reply = _ru_normalize(reply)

        async with AsyncSessionLocal() as session:
            session.add(AIChatHistory(telegram_id=tid, role="user", content=message))
            session.add(AIChatHistory(telegram_id=tid, role="assistant", content=reply))
            await session.commit()

        if existing_count % 3 == 0:
            await increment_ai_uses(tid)

        try:
            from utils.levels import add_xp
            await add_xp(tid, 5)
        except Exception:
            pass

        return _json_response({
            "ok": True, "reply": reply,
            "messages_count": existing_count + 1,
        }, request=request)

    except Exception as e:
        logger.error("ai_chat error: %s", e, exc_info=True)
        return _json_response({"error": str(e)}, 500, request)


async def handle_ai_chat_history(request):
    try:
        tid, _ae = await require_user(request)
        if _ae: return _ae
        from database.models import AIChatHistory
        async with AsyncSessionLocal() as session:
            rows = (await session.execute(
                select(AIChatHistory)
                .where(AIChatHistory.telegram_id == tid)
                .order_by(AIChatHistory.created_at.asc())
                .limit(60)
            )).scalars().all()
        return _json_response({
            "ok": True,
            "messages": [{"role": r.role, "content": r.content,
                          "created_at": r.created_at.isoformat() if r.created_at else ""
                         } for r in rows],
        }, request=request)
    except Exception as e:
        return _json_response({"error": str(e)}, 500, request)

"""



# ─── Реальные функции для прямого импорта ─────────────────────
# (дублируем из HANDLER_CODE чтобы api_server мог импортировать напрямую)


# ═══════════════════════════════════════════════════════════════════
# AI CHAT — диалоговый нутрициолог
# ═══════════════════════════════════════════════════════════════════
async def handle_ai_chat(request):
    from api_server import _check_rate, _json_response, _claude, _ru_normalize, _get_user_or_403
    from utils.auth_helper import require_user
    from utils.timezone import get_user_tz, user_today
    from database.models import AsyncSessionLocal, User, FoodEntry, WaterEntry, AIChatHistory
    from datetime import datetime, date, time as dtime, timedelta
    from sqlalchemy import select, func
    _rl = _check_rate(request, "aichat", max_req=20, window=60)
    if _rl is not None: return _rl
    try:
        body = await request.json()
        tid, _ae = await require_user(request, body=body)
        if _ae: return _ae

        message = str(body.get("message", "")).strip()[:2000]
        lang    = str(body.get("lang", "ru"))
        reset   = bool(body.get("reset", False))

        if not message and not reset:
            return _json_response({"error": "message required"}, 400, request)

        from utils.premium import check_ai_limit, increment_ai_uses, is_premium
        from database.models import AIChatHistory, WaterEntry, FoodEntry

        if reset:
            async with AsyncSessionLocal() as session:
                rows = (await session.execute(
                    select(AIChatHistory).where(AIChatHistory.telegram_id == tid)
                )).scalars().all()
                for r in rows:
                    await session.delete(r)
                await session.commit()
            return _json_response({"ok": True, "reset": True}, request=request)

        async with AsyncSessionLocal() as session:
            existing_count = (await session.execute(
                select(func.count(AIChatHistory.id))
                .where(AIChatHistory.telegram_id == tid,
                       AIChatHistory.role == "user")
            )).scalar() or 0

        if existing_count % 3 == 0:
            can_use, used, limit = await check_ai_limit(tid)
            if not can_use:
                return _json_response({
                    "error": "limit", "used": used, "limit": limit,
                    "premium": await is_premium(tid),
                    "tip_ru": "Использовано {}/{} запросов. Premium снимает ограничения.".format(used, limit),
                    "tip_en": "Used {}/{} queries. Premium removes limits.".format(used, limit),
                }, 402, request)

        tz    = await get_user_tz(tid)
        today = user_today(tz)
        ds    = datetime.combine(today, dtime.min) - timedelta(days=6, hours=tz)
        de    = datetime.combine(today, dtime.max) - timedelta(hours=tz)

        async with AsyncSessionLocal() as session:
            user, err = await _get_user_or_403(tid, session)
            if err: return err

            entries = (await session.execute(
                select(FoodEntry)
                .where(FoodEntry.telegram_id == tid,
                       FoodEntry.date >= ds, FoodEntry.date <= de)
                .order_by(FoodEntry.date)
            )).scalars().all()

            water_today = (await session.execute(
                select(func.coalesce(func.sum(WaterEntry.amount_ml), 0))
                .where(WaterEntry.telegram_id == tid,
                       WaterEntry.date >= datetime.combine(today, dtime.min) - timedelta(hours=tz),
                       WaterEntry.date <= de)
            )).scalar() or 0

            history_rows = (await session.execute(
                select(AIChatHistory)
                .where(AIChatHistory.telegram_id == tid)
                .order_by(AIChatHistory.created_at.desc())
                .limit(40)
            )).scalars().all()
            history_rows = list(reversed(history_rows))

        from collections import defaultdict
        daily = defaultdict(lambda: {"kcal": 0, "prot": 0, "fat": 0, "carbs": 0, "foods": []})
        for e in entries:
            d = (e.date + timedelta(hours=tz)).date().isoformat()
            daily[d]["kcal"]  += e.calories or 0
            daily[d]["prot"]  += e.protein  or 0
            daily[d]["fat"]   += e.fat      or 0
            daily[d]["carbs"] += e.carbs    or 0
            daily[d]["foods"].append(e.food_name or "")

        diary_lines = []
        for d, v in sorted(daily.items())[-7:]:
            top_foods = ", ".join(list(set(v["foods"]))[:5])
            diary_lines.append(
                d + ": " + str(round(v["kcal"])) + " kcal | "
                + "P:" + str(round(v["prot"])) + "g "
                + "F:" + str(round(v["fat"])) + "g "
                + "C:" + str(round(v["carbs"])) + "g | Foods: " + top_foods
            )
        diary_str = "\\n".join(diary_lines) if diary_lines else "No entries yet."

        is_ru = lang in ("ru", "uk", "be", "kk", "uz")
        lang_rule = (
            "ОБЯЗАТЕЛЬНО отвечай только на русском языке. "
            "Единицы: ккал, г, кг, мл, мин. Без markdown (без **, ##, ---)."
            if is_ru else
            "Respond in English only. No markdown formatting."
        )

        SYSTEM = (
            "You are NutriO — a personal AI nutritionist. You have access to the user nutrition data.\\n\\n"
            "User profile:\\n"
            "- Daily goal: " + str(user.daily_goal or 2000) + " kcal\\n"
            "- Weight: " + str(user.weight or "?") + " kg | Height: " + str(user.height or "?") + " cm\\n"
            "- Target: " + str(user.goal or "not set") + "\\n"
            "- Streak: " + str(user.streak_days or 0) + " days\\n"
            "- Water today: " + str(round(water_today)) + " ml / " + str(user.water_goal or 2000) + " ml\\n"
            "- Language: " + lang + "\\n\\n"
            "Last 7 days diary:\\n" + diary_str + "\\n\\n"
            + lang_rule + "\\n\\n"
            "Be warm, specific, use REAL numbers from data. "
            "Keep answers concise (3-6 sentences) unless asked for detail. "
            "Do NOT repeat the same advice twice in a conversation."
        )

        messages = []
        for row in history_rows[-20:]:
            messages.append({"role": row.role, "content": row.content})
        messages.append({"role": "user", "content": message})

        reply = await _claude("", system=SYSTEM, max_tokens=800, messages=messages)

        if is_ru:
            reply = _ru_normalize(reply)

        async with AsyncSessionLocal() as session:
            session.add(AIChatHistory(telegram_id=tid, role="user", content=message))
            session.add(AIChatHistory(telegram_id=tid, role="assistant", content=reply))
            await session.commit()

        if existing_count % 3 == 0:
            await increment_ai_uses(tid)

        try:
            from utils.levels import add_xp
            await add_xp(tid, 5)
        except Exception:
            pass

        return _json_response({
            "ok": True, "reply": reply,
            "messages_count": existing_count + 1,
        }, request=request)

    except Exception as e:
        logger.error("ai_chat error: %s", e, exc_info=True)
        return _json_response({"error": str(e)}, 500, request)


async def handle_ai_chat_history(request):
    try:
        tid, _ae = await require_user(request)
        if _ae: return _ae
        from database.models import AIChatHistory
        async with AsyncSessionLocal() as session:
            rows = (await session.execute(
                select(AIChatHistory)
                .where(AIChatHistory.telegram_id == tid)
                .order_by(AIChatHistory.created_at.asc())
                .limit(60)
            )).scalars().all()
        return _json_response({
            "ok": True,
            "messages": [{"role": r.role, "content": r.content,
                          "created_at": r.created_at.isoformat() if r.created_at else ""
                         } for r in rows],
        }, request=request)
    except Exception as e:
        return _json_response({"error": str(e)}, 500, request)

