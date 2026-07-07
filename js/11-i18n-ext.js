// Phase 3E — i18n extension covering all Phase 2A-3D additions.
// Languages: ru, en (только русский + английский).
// Strings are merged into MINI_I18N, so existing `i18n.key` access just works.

(function(){
  if (typeof MINI_I18N === 'undefined') return;

  // ─── Translation table ────────────────────────────────────────────────
  var EXT = {
    ru: {
      // bottom nav
      nav_diary:"Дневник", nav_progress:"Прогресс", nav_ai:"AI", nav_more:"Ещё",
      nav_add:"Добавить",
      nav_healthsync:"Здоровье", nav_aichat:"AI-чат", nav_exercise:"Спорт", nav_health:"Score", nav_fast:"Интервал",
      // healthsync tab
      hsync_title:"Здоровье", hsync_no_data:"Данных пока нет. Добавь первую запись!",
      hsync_add:"➕ ДОБАВИТЬ ДАННЫЕ СЕГОДНЯ",
      hsync_steps_lbl:"Шаги", hsync_sleep_lbl:"Сон (часы)", hsync_hr_lbl:"Пульс (уд/мин)",
      hsync_sleep_q:"Качество сна:", hsync_save:"Сохранить",
      // exercise tab  
      ex_title:"Тренировки", ex_search_ph:"Поиск: бег, плавание, йога...",
      ex_minutes_lbl:"Минуты", ex_note_ph:"Заметка (опционально)",
      // health score tab
      hs_title:"Health Score",
      // fasting tab
      fast_title:"Интервал питания", fast_choose:"Выбери протокол:",
      fast_stop:"⏹ Завершить период", fast_stats:"📊 Статистика", fast_history:"📋 История",
      // ai chat tab
      aichat_title:"AI-нутрициолог", aichat_ph:"Спроси о питании, калориях, диете...",
      aichat_clear:"🗑 Очистить", aichat_disclaimer:"AI может ошибаться — проверяй важное с врачом",
      // add sheet
      add_sheet_title:"Добавить запись",
      add_barcode:"Штрихкод", add_barcode_sub:"Скан упаковки",
      add_photo:"Фото блюда", add_photo_sub:"Распознать по фото",
      add_manual_t:"Вручную", add_manual_sub:"Ввести КБЖУ",
      add_calc:"Калькулятор", add_calc_sub:"Расчёт порции",
      add_myfoods:"Мои продукты", add_myfoods_sub:"Сохранённые",
      add_water_t:"Вода", add_water_sub:"+ стакан",
      cancel:"Отмена", close:"Закрыть",
      // more sheet
      more_sheet_title:"Ещё",
      more_sport:"Спорт", more_score:"Индекс здоровья", more_fast:"Интервал питания",
      more_progress:"Прогресс", more_ai:"AI-ассистент",
      more_lb:"Рейтинг", more_micro:"Микронутриенты", more_stats:"Статистика",
      more_game:"Мини-игра", more_pdf:"PDF отчёт", more_import:"Импорт",
      more_premium:"Premium", more_settings:"Настройки", more_lang:"Язык",
      more_help:"Помощь", more_admin:"Админ-панель",
      // rings
      ring_cal:"Калории", ring_prot:"Белки", ring_fat:"Жиры", ring_carb:"Углев.",
      // heatmap
      hm_title:"Соблюдение нормы · 35 дней",
      hm_load:"Загрузить", hm_refresh:"Обновить",
      hm_loading:"Загружаю данные...", hm_no_data:"нет данных",
      hm_less:"меньше", hm_more:"больше",
      // theme
      theme_section:"🎨 Тема оформления",
      theme_dark:"Тёмная", theme_light:"Светлая", theme_auto:"Авто",
      // charts
      chart_weight_title:"⚖️ Динамика веса",
      chart_weight_sub:"за последние записи",
      chart_weight_no_data:"Нет данных о весе. Добавь запись через бота",
      chart_cal_title:"🔥 Калории · 30 дней",
      chart_cal_sub:"среднее: —",
      chart_cal_avg:"среднее", chart_cal_goal:"цель",
      // AI cards
      ai_nutri_title:"Персональный анализ", ai_nutri_sub:"Нутрициолог AI · последние 14 дней",
      ai_plan_title:"План питания", ai_recipe_title:"Рецепт от шефа",
      ai_card_sub:"Сгенерировано AI",
      ai_copy:"📋 Копир.", ai_copied:"✓ Скопир.", ai_copy_fail:"Не удалось скопировать",
      // meal plan picker
      plan_days_3:"3 дня", plan_days_5:"5 дней", plan_days_7:"7 дней",
      // AI archive
      arch_open_btn:"Архив AI-генераций", arch_open_hint:"все ответы здесь ›",
      arch_sheet_title:"Архив AI",
      arch_tab_all:"Все", arch_tab_nutri:"🤖 Анализ",
      arch_tab_recipe:"👨‍🍳 Рецепты", arch_tab_plan:"📅 Планы",
      arch_loading:"Загрузка...", arch_empty:"Пока пусто. Сгенерируй что-нибудь!",
      arch_empty_initial:"Здесь будут все сохранённые AI-ответы",
      arch_open_telegram:"Открой Mini App из Telegram",
      arch_load_error:"Ошибка загрузки", arch_view_loading:"Открываю запись",
      arch_view_error:"Ошибка", arch_view_open_fail:"Не удалось открыть",
      arch_delete_confirm:"Удалить запись?", arch_delete_btn:"🗑 Удалить",
      arch_deleted:"Удалено", arch_delete_err:"Ошибка удаления",
      arch_kind_nutri:"Анализ", arch_kind_recipe:"Рецепт", arch_kind_plan:"План",
      // Help page
      help_hero_title:"Чем тебе помочь?",
      help_hero_sub:"Открой бота, напиши в поддержку или загляни в канал NutriO",
      help_btn_bot:"Открыть бота", help_btn_support:"Поддержка",
      help_btn_channel:"Канал", help_btn_rate:"Оценить",
      help_btn_rate_thanks:"Спасибо! 💜",
      help_faq_title:"Частые вопросы",
      help_q1:"Как считаются калории?",
      help_a1:"AI определяет состав блюда по фото или штрихкоду, затем рассчитывает КБЖУ на указанную порцию. Можно отредактировать вес — пересчёт мгновенный.",
      help_q2:"Сколько фото в день можно?",
      help_a2:"Бесплатно — 5 фото в день. С Premium — до 80 в день.",
      help_q3:"Что в Premium?",
      help_a3:"До 80 фото-распознаваний в день, безлимит голосовых, расширенные лимиты AI-нутрициолога, генератора рецептов и планировщика питания, PDF-отчёты до 90 дней, без рекламы.",
      help_q4:"Как добавить свой продукт?",
      help_a4:"В нижней панели нажми \u201c+\u201d → Мои продукты → \u201cДобавить\u201d. Сохранённое будет в быстром доступе.",
      help_q5:"Не работает сканер штрихкода",
      help_a5:"Проверь что в браузере/Telegram разрешён доступ к камере. На некоторых старых устройствах сканер запускается медленно — подержи штрихкод неподвижно 2-3 секунды.",
      help_q6:"Как сменить цель калорий?",
      help_a6:"Открой Настройки (Ещё → ⚙️) → раздел Профиль → вес, цель, активность. Норма пересчитается автоматически.",
      help_q7:"Можно ли импортировать данные?",
      help_a7:"Да. Ещё → Импорт. Поддерживаются CSV из MyFitnessPal, FatSecret, Yazio. До 5000 записей за раз.",
      help_q8:"Где мой дневник за прошлые дни?",
      help_a8:"На вкладке Дневник стрелочки ← → перелистывают дни. Тапни по дате — откроется календарь.",
      help_footer_prefix:"NutriO · версия Mini App",
      // Scanner / save messages
      scan_camera_off:"Камера не запущена",
      scan_warming_up:"Подожди, камера ещё запускается",
      scan_capture_fail:"Не удалось снять кадр",
      scan_unknown:"❌ Не удалось распознать. Попробуй ещё раз",
      scan_conn_error:"❌ Ошибка соединения",
      scan_browser_unsupported:"Сканер не поддерживается в этом браузере",
      scan_not_loaded:"Сканер не загружен, попробуй ещё раз",
      scan_init_error:"Ошибка инициализации сканера",
      scan_camera_denied:"Нет доступа к камере",
      save_food_open_tg:"Открой из Telegram",
      save_food_err:"Ошибка",
      save_food_conn_err:"Ошибка соединения",
      kcal_short: "ккал",
      kcal_full: "Калории",
      macro_prot: "Белки",
      macro_fat: "Жиры",
      macro_carb: "Углеводы",
      macro_prot_g: "Белки, г",
      macro_fat_g: "Жиры, г",
      macro_carb_g: "Углеводы, г",
      mf_prot_g: "💪 БЕЛКИ, г",
      mf_fat_g: "🧈 ЖИРЫ, г",
      mf_carb_g: "🍞 УГЛЕВ, г",
      cbju_per_100g: "КБЖУ НА 100Г",
      mf_hint_per_100g: "КБЖУ указывается на 100г продукта",
      add_food_btn: "✍️ Добавить еду",
      scan_hero_sub: "Наведи камеру на штрихкод упаковки или еду — бот найдёт КБЖУ автоматически",
      chart_weight_label: "Вес, кг",
      hm_dbl_hint: "· двойной тап — открыть в дневнике",
      months_full: "Январь|Февраль|Март|Апрель|Май|Июнь|Июль|Август|Сентябрь|Октябрь|Ноябрь|Декабрь",
      weekdays_short: "Пн|Вт|Ср|Чт|Пт|Сб|Вс",
      chart_cal_no_data: "Пока нет записей еды за 30 дней. Добавь еду — график оживёт",
      share_day: "Поделиться днём",
      share_title: "Мой день в NutriO",
      share_to_story: "В Stories",
      share_to_chat: "Отправить в чат",
      share_save: "Сохранить картинку",
      share_subtitle: "Умный дневник питания",
      share_of_goal: "из",
      share_streak_days: "дней подряд",
      share_cta: "Считай калории по фото в Telegram",
      share_eaten_today: "Сегодня в дневнике",
      achievements_title: "🏅 Достижения",
    
    
    
    
    
    },
    en: {
      nav_diary:"Diary", nav_progress:"Progress", nav_ai:"AI", nav_more:"More",
      nav_add:"Add",
      nav_healthsync:"Health", nav_aichat:"AI Chat", nav_exercise:"Exercise", nav_health:"Score", nav_fast:"Interval",
      hsync_title:"Health", hsync_no_data:"No data yet. Add your first entry!",
      hsync_add:"➕ ADD TODAY'S DATA",
      hsync_steps_lbl:"Steps", hsync_sleep_lbl:"Sleep (hours)", hsync_hr_lbl:"Heart rate (bpm)",
      hsync_sleep_q:"Sleep quality:", hsync_save:"Save",
      ex_title:"Workouts", ex_search_ph:"Search: running, swimming, yoga...",
      ex_minutes_lbl:"Minutes", ex_note_ph:"Note (optional)",
      hs_title:"Health Score",
      fast_title:"Eating window", fast_choose:"Choose protocol:",
      fast_stop:"⏹ Stop period", fast_stats:"📊 Statistics", fast_history:"📋 History",
      aichat_title:"AI nutritionist", aichat_ph:"Ask about nutrition, calories, diet...",
      aichat_clear:"🗑 Clear", aichat_disclaimer:"AI can make mistakes — verify with a doctor",
      add_sheet_title:"Add entry",
      add_barcode:"Barcode", add_barcode_sub:"Scan package",
      add_photo:"Photo of food", add_photo_sub:"Recognize by photo",
      add_manual_t:"Manual", add_manual_sub:"Enter macros",
      add_calc:"Calculator", add_calc_sub:"Portion calc",
      add_myfoods:"My foods", add_myfoods_sub:"Saved items",
      add_water_t:"Water", add_water_sub:"+ a glass",
      cancel:"Cancel", close:"Close",
      more_sheet_title:"More",
      more_sport:"Sports", more_score:"Health Score", more_fast:"Eating window",
      more_progress:"Progress", more_ai:"AI assistant",
      more_lb:"Leaderboard", more_micro:"Micronutrients", more_stats:"Stats",
      more_game:"Mini-game", more_pdf:"PDF report", more_import:"Import",
      more_premium:"Premium", more_settings:"Settings", more_lang:"Language",
      more_help:"Help", more_admin:"Admin panel",
      ring_cal:"Calories", ring_prot:"Protein", ring_fat:"Fat", ring_carb:"Carbs",
      hm_title:"Daily goal compliance · 35 days",
      hm_load:"Load", hm_refresh:"Refresh",
      hm_loading:"Loading data...", hm_no_data:"no data",
      hm_less:"less", hm_more:"more",
      theme_section:"🎨 Theme",
      theme_dark:"Dark", theme_light:"Light", theme_auto:"Auto",
      chart_weight_title:"⚖️ Weight trend",
      chart_weight_sub:"recent entries",
      chart_weight_no_data:"No weight data. Add a record via the bot",
      chart_cal_title:"🔥 Calories · 30 days",
      chart_cal_sub:"avg: —",
      chart_cal_avg:"avg", chart_cal_goal:"goal",
      ai_nutri_title:"Personal analysis", ai_nutri_sub:"Nutritionist AI · last 14 days",
      ai_plan_title:"Meal plan", ai_recipe_title:"Chef's recipe",
      ai_card_sub:"Generated by AI",
      ai_copy:"📋 Copy", ai_copied:"✓ Copied", ai_copy_fail:"Failed to copy",
      plan_days_3:"3 days", plan_days_5:"5 days", plan_days_7:"7 days",
      arch_open_btn:"AI generations archive", arch_open_hint:"all answers here ›",
      arch_sheet_title:"AI archive",
      arch_tab_all:"All", arch_tab_nutri:"🤖 Analysis",
      arch_tab_recipe:"👨‍🍳 Recipes", arch_tab_plan:"📅 Plans",
      arch_loading:"Loading...", arch_empty:"Empty for now. Generate something!",
      arch_empty_initial:"All saved AI answers will appear here",
      arch_open_telegram:"Open Mini App from Telegram",
      arch_load_error:"Loading error", arch_view_loading:"Opening entry",
      arch_view_error:"Error", arch_view_open_fail:"Failed to open",
      arch_delete_confirm:"Delete this entry?", arch_delete_btn:"🗑 Delete",
      arch_deleted:"Deleted", arch_delete_err:"Deletion error",
      arch_kind_nutri:"Analysis", arch_kind_recipe:"Recipe", arch_kind_plan:"Plan",
      help_hero_title:"How can we help?",
      help_hero_sub:"Open the bot, message support or check NutriO channel",
      help_btn_bot:"Open bot", help_btn_support:"Support",
      help_btn_channel:"Channel", help_btn_rate:"Rate",
      help_btn_rate_thanks:"Thanks! 💜",
      help_faq_title:"FAQ",
      help_q1:"How are calories calculated?",
      help_a1:"AI determines the dish composition by photo or barcode, then calculates macros for the specified portion. You can edit weight — it recalculates instantly.",
      help_q2:"How many photos per day?",
      help_a2:"Free — 5 photos a day. Premium — up to 80 a day.",
      help_q3:"What's in Premium?",
      help_a3:"Up to 80 photo recognitions per day, unlimited voice input, extended limits for the AI nutritionist, recipe generator and meal planner, PDF reports up to 90 days, no ads.",
      help_q4:"How to add my own product?",
      help_a4:"In the bottom panel tap \u201c+\u201d → My foods → \u201cAdd\u201d. Saved items will be quickly accessible.",
      help_q5:"Barcode scanner not working",
      help_a5:"Check that camera access is allowed in the browser/Telegram. On some older devices the scanner takes a moment — hold the barcode steady for 2-3 seconds.",
      help_q6:"How to change calorie goal?",
      help_a6:"Open Settings (More → ⚙️) → Profile section → weight, goal, activity. The target will recalculate automatically.",
      help_q7:"Can I import data?",
      help_a7:"Yes. More → Import. CSV from MyFitnessPal, FatSecret, Yazio are supported. Up to 5000 entries at once.",
      help_q8:"Where is my diary for past days?",
      help_a8:"On the Diary tab the ← → arrows switch days. Tap the date — a calendar opens.",
      help_footer_prefix:"NutriO · Mini App version",
      scan_camera_off:"Camera is not running",
      scan_warming_up:"Wait, camera is still warming up",
      scan_capture_fail:"Couldn't capture frame",
      scan_unknown:"❌ Couldn't recognize. Try again",
      scan_conn_error:"❌ Connection error",
      scan_browser_unsupported:"Scanner not supported in this browser",
      scan_not_loaded:"Scanner not loaded, try again",
      scan_init_error:"Scanner init error",
      scan_camera_denied:"No camera access",
      save_food_open_tg:"Open from Telegram",
      save_food_err:"Error",
      save_food_conn_err:"Connection error",
      kcal_short: "kcal",
      kcal_full: "Calories",
      macro_prot: "Protein",
      macro_fat: "Fat",
      macro_carb: "Carbs",
      macro_prot_g: "Protein, g",
      macro_fat_g: "Fat, g",
      macro_carb_g: "Carbs, g",
      mf_prot_g: "💪 PROTEIN, g",
      mf_fat_g: "🧈 FAT, g",
      mf_carb_g: "🍞 CARBS, g",
      cbju_per_100g: "NUTRITION PER 100G",
      mf_hint_per_100g: "Nutrition values are per 100g of product",
      add_food_btn: "✍️ Add food",
      scan_hero_sub: "Point the camera at a barcode or food — the bot will find macros automatically",
      chart_weight_label: "Weight, kg",
      hm_dbl_hint: "· double-tap — open in diary",
      months_full: "January|February|March|April|May|June|July|August|September|October|November|December",
      weekdays_short: "Mon|Tue|Wed|Thu|Fri|Sat|Sun",
      chart_cal_no_data: "No food entries in the last 30 days yet. Add food and the chart comes alive",
      share_day: "Share my day",
      share_title: "My day in NutriO",
      share_to_story: "To Stories",
      share_to_chat: "Send to chat",
      share_save: "Save image",
      share_subtitle: "Smart nutrition diary",
      share_of_goal: "of",
      share_streak_days: "days streak",
      share_cta: "Track calories by photo on Telegram",
      share_eaten_today: "Today in diary",
      achievements_title: "🏅 Achievements",
    
    
    
    
    
    },
  };

  // Merge extension into MINI_I18N for each language (English fallback for the rest)
  Object.keys(EXT).forEach(function(lang){
    MINI_I18N[lang] = Object.assign({}, EXT.en, MINI_I18N[lang] || {}, EXT[lang]);
  });
  // For languages defined in MINI_I18N but not in EXT, layer EN extension keys
  Object.keys(MINI_I18N).forEach(function(lang){
    if (!EXT[lang]) MINI_I18N[lang] = Object.assign({}, EXT.en, MINI_I18N[lang]);
  });


  // Phase 3I — additional keys merged into EXT
  var EXT_3I = {"ru": {"diary_add_food": "✍️ Добавить еду", "macro_prot_g": "Белки, г", "macro_fat_g": "Жиры, г", "macro_carb_g": "Углеводы, г", "macro_prot": "Белки", "macro_fat": "Жиры", "macro_carb": "Углеводы", "ai_mode_nutri": "🤖 Нутрициолог", "ai_mode_plan": "📅 Планировщик", "ai_mode_recipe": "👨‍🍳 Рецепты", "ai_nutri_intro": "🤖 AI проанализирует твоё питание за последние 14 дней и даст персональные рекомендации.", "ai_nutri_limit": "Бесплатно: 3 раза в месяц · Premium: до 40/мес", "ai_plan_limit": "Бесплатно: 1 раз в месяц · Premium: до 15/мес", "ai_recipe_limit": "Бесплатно: 5 раз в месяц · Premium: до 80/мес", "ai_btn_analyze": "🔍 Проанализировать питание", "ai_btn_create_plan": "📅 Создать план питания", "ai_btn_recipe_gen": "👨‍🍳 Сгенерировать рецепт", "ai_btn_recipe_next": "🔄 Другой рецепт", "ai_plan_days_lbl": "Количество дней:", "ai_plan_restrict_lbl": "Ограничения (необязательно):", "ai_plan_restrict_ph": "Без глютена, вегетарианское...", "ai_recipe_cat_lbl": "Категория:", "recipe_random": "🎲 Случайный", "recipe_fast": "⚡ До 15 мин", "recipe_protein": "💪 Много белка", "recipe_lowcal": "🔥 Мало калорий", "recipe_breakfast": "🌅 Завтрак", "recipe_lunch": "🍽 Обед/Ужин", "recipe_snack": "🥗 Перекус", "recipe_bulk": "📈 На массу", "calc_title": "🧮 Калории", "mf_per_100g": "КБЖУ НА 100Г", "mf_prot_caps": "💪 БЕЛКИ, г", "mf_fat_caps": "🧈 ЖИРЫ, г", "mf_carb_caps": "🍞 УГЛЕВ, г", "mf_hint": "КБЖУ указывается на 100г продукта", "stat_streak_lbl": "🔥 дней подряд", "scan_hero_sub": "Наведи камеру на штрихкод упаковки или еду — бот найдёт КБЖУ автоматически", "chart_weight_label": "Вес, кг"}, "en": {"diary_add_food": "✍️ Add food", "macro_prot_g": "Protein, g", "macro_fat_g": "Fat, g", "macro_carb_g": "Carbs, g", "macro_prot": "Protein", "macro_fat": "Fat", "macro_carb": "Carbs", "ai_mode_nutri": "🤖 Nutritionist", "ai_mode_plan": "📅 Planner", "ai_mode_recipe": "👨‍🍳 Recipes", "ai_nutri_intro": "🤖 AI will analyze your nutrition over the last 14 days and give personal recommendations.", "ai_nutri_limit": "Free: 3 per month · Premium: up to 40/mo", "ai_plan_limit": "Free: 1 per month · Premium: up to 15/mo", "ai_recipe_limit": "Free: 5 per month · Premium: up to 80/mo", "ai_btn_analyze": "🔍 Analyze nutrition", "ai_btn_create_plan": "📅 Create meal plan", "ai_btn_recipe_gen": "👨‍🍳 Generate recipe", "ai_btn_recipe_next": "🔄 Another recipe", "ai_plan_days_lbl": "Number of days:", "ai_plan_restrict_lbl": "Restrictions (optional):", "ai_plan_restrict_ph": "Gluten-free, vegetarian...", "ai_recipe_cat_lbl": "Category:", "recipe_random": "🎲 Random", "recipe_fast": "⚡ Under 15 min", "recipe_protein": "💪 High protein", "recipe_lowcal": "🔥 Low calorie", "recipe_breakfast": "🌅 Breakfast", "recipe_lunch": "🍽 Lunch/Dinner", "recipe_snack": "🥗 Snack", "recipe_bulk": "📈 Bulk-up", "calc_title": "🧮 Calories", "mf_per_100g": "MACROS PER 100G", "mf_prot_caps": "💪 PROTEIN, g", "mf_fat_caps": "🧈 FAT, g", "mf_carb_caps": "🍞 CARBS, g", "mf_hint": "Macros are per 100g of product", "stat_streak_lbl": "🔥 days in a row", "scan_hero_sub": "Point the camera at a package barcode or food — the bot will find macros automatically", "chart_weight_label": "Weight, kg"}};
  Object.keys(EXT_3I).forEach(function(lang){
    if (!MINI_I18N[lang]) MINI_I18N[lang] = {};
    Object.keys(EXT_3I[lang]).forEach(function(k){
      MINI_I18N[lang][k] = EXT_3I[lang][k];
    });
  });
  // Apply EN keys as fallback to languages without explicit translation
  Object.keys(MINI_I18N).forEach(function(lang){
    Object.keys(EXT_3I.en).forEach(function(k){
      if (!MINI_I18N[lang][k]) MINI_I18N[lang][k] = EXT_3I.en[k];
    });
  });
  // Refresh i18n
  try { if (typeof applyLang === 'function') applyLang(LANG); } catch(e){}

  // Re-run applyLang() now that MINI_I18N has been extended so `i18n` is refreshed
  try { if (typeof applyLang === 'function') applyLang(LANG); } catch(e){}

  // ─── Helper: T(key, fallback) returns translation in current LANG ──────
  window.T = function(key, fallback) {
    // i18n may be a top-level `let` (not on window) — try direct access first
    var dict = null;
    try { dict = (typeof i18n !== 'undefined') ? i18n : null; } catch(e){}
    if (!dict) dict = window.i18n || null;
    var v = (dict && dict[key]) || (MINI_I18N.en && MINI_I18N.en[key]);
    return v || fallback || key;
  };

  // ─── Apply translations to static HTML labels in nav, sheets, etc. ─────
  function setText(sel, txt) {
    document.querySelectorAll(sel).forEach(function(el){ if (txt) el.textContent = txt; });
  }
  function applyExt() {
    // ── Apply data-i18n attributes ──────────────────────────────────────
    try {
      document.querySelectorAll('[data-i18n]').forEach(function(el){
        var k = el.getAttribute('data-i18n'); if (k) el.textContent = T(k, el.textContent);
      });
      document.querySelectorAll('[data-i18n-ph]').forEach(function(el){
        var k = el.getAttribute('data-i18n-ph');
        if (k) el.setAttribute('placeholder', T(k, el.getAttribute('placeholder')||''));
      });
      document.querySelectorAll('[data-i18n-html]').forEach(function(el){
        var k = el.getAttribute('data-i18n-html'); if (k) el.innerHTML = T(k, el.innerHTML);
      });
    } catch(e) { console.warn('data-i18n apply failed:', e); }

    // Bottom nav labels
    var nav = {
      'bnav-diary        .bnav-lbl': T('nav_diary'),
      'bnav-progress     .bnav-lbl': T('nav_progress'),
      'bnav-ai           .bnav-lbl': T('nav_ai'),
      'bnav-more         .bnav-lbl': T('nav_more'),
      'bnav-healthsync   .bnav-lbl': T('nav_healthsync'),
      'bnav-aichat       .bnav-lbl': T('nav_aichat'),
      'bnav-exercise     .bnav-lbl': T('nav_exercise'),
      'bnav-healthscore  .bnav-lbl': T('nav_health'),
      'bnav-fast         .bnav-lbl': T('nav_fast'),
    };
    Object.keys(nav).forEach(function(idPath){
      var parts = idPath.trim().split(/\s+/);
      var id = parts.shift();
      var el = document.getElementById(id);
      if (el) {
        var inner = el.querySelector(parts.join(' '));
        if (inner) inner.textContent = nav[idPath];
      }
    });

    // Add sheet
    var s = document.getElementById('add-sheet');
    if (s) {
      var titleEl = s.querySelector('.sheet-title');
      if (titleEl) titleEl.textContent = T('add_sheet_title');
      var cards = s.querySelectorAll('.sheet-card');
      var data = [
        ['add_barcode','add_barcode_sub'], ['add_photo','add_photo_sub'],
        ['add_manual_t','add_manual_sub'], ['add_calc','add_calc_sub'],
        ['add_myfoods','add_myfoods_sub'], ['add_water_t','add_water_sub'],
      ];
      cards.forEach(function(c, i){
        if (data[i]) {
          var t = c.querySelector('.sheet-card-t'); if (t) t.textContent = T(data[i][0]);
          var sub = c.querySelector('.sheet-card-s'); if (sub) sub.textContent = T(data[i][1]);
        }
      });
      var cnl = s.querySelector('.sheet-cancel');
      if (cnl) cnl.textContent = T('cancel');
    }

    // More sheet
    var m = document.getElementById('more-sheet');
    if (m) {
      var titleEl = m.querySelector('.sheet-title');
      if (titleEl) titleEl.textContent = T('more_sheet_title');
      var rows = m.querySelectorAll('.sheet-row');
      var rowKeys = [
        'more_sport','more_score','more_fast',
        'more_lb','more_micro','more_game',
        'more_pdf','more_import',
        'more_premium','more_settings','more_help','more_admin'
      ];
      rows.forEach(function(r, i){
        var t = r.querySelector('.sheet-row-t');
        if (t && rowKeys[i]) t.textContent = T(rowKeys[i]);
      });
      var cnl = m.querySelector('.sheet-cancel');
      if (cnl) cnl.textContent = T('close');
    }

    // Goal rings labels
    var ringCard = document.getElementById('gring-card');
    if (ringCard) {
      var lbls = ringCard.querySelectorAll('.gring-label');
      var keys = ['ring_cal','ring_prot','ring_fat','ring_carb'];
      lbls.forEach(function(el, i){ if (keys[i]) el.textContent = T(keys[i]); });
    }

    // Heatmap card
    var hm = document.querySelector('.hm-card');
    if (hm) {
      var titleEl = hm.querySelector('.hm-title');
      if (titleEl) titleEl.textContent = T('hm_title');
      var btn = hm.querySelector('#hm-load-btn');
      if (btn) {
        var loaded = window._hmAutoLoaded || (window.NutrioHeatmap && window.NutrioHeatmap._loaded);
        btn.textContent = loaded ? T('hm_refresh') : T('hm_load');
      }
      var legend = hm.querySelectorAll('.hm-legend > span');
      // structure: [status, spacer, less, cells-block, more]
      // We re-translate by index — fragile but works for static layout
      if (legend.length >= 4) {
        var less = legend[legend.length - 2];
        var more = legend[legend.length - 1];
        if (less) less.textContent = T('hm_less');
        if (more) more.textContent = T('hm_more');
      }
    }

    // Theme picker label
    document.querySelectorAll('.sett-section .sett-title').forEach(function(t){
      if (t.textContent && /Тема|Theme|Тема оформ|Design|Thème|Tema/.test(t.textContent)) {
        t.textContent = T('theme_section');
      }
    });
    var tp = document.querySelector('.theme-picker');
    if (tp) {
      var btns = tp.querySelectorAll('.theme-picker-btn');
      var keys = ['theme_dark','theme_light','theme_auto'];
      btns.forEach(function(b, i){
        var lbl = b.querySelector('.tp-lbl');
        if (lbl && keys[i]) lbl.textContent = T(keys[i]);
      });
    }

    // Charts titles/subs
    var cw = document.querySelector('#chart-weight');
    if (cw) {
      var card = cw.closest('.chart-card');
      if (card) {
        var t = card.querySelector('.chart-title');
        if (t) t.textContent = T('chart_weight_title');
      }
    }
    var cc = document.querySelector('#chart-cals');
    if (cc) {
      var card = cc.closest('.chart-card');
      if (card) {
        var t = card.querySelector('.chart-title');
        if (t) t.textContent = T('chart_cal_title');
      }
    }

    // AI archive open button
    var aob = document.querySelector('.ai-archive-open');
    if (aob) {
      var spans = aob.querySelectorAll('span');
      if (spans.length >= 3) {
        spans[1].textContent = T('arch_open_btn');
        spans[2].textContent = T('arch_open_hint');
      }
    }
    // AI archive sheet title/tabs/close
    var arch = document.getElementById('ai-archive-sheet');
    if (arch) {
      var titleEl = arch.querySelector('.sheet-title');
      if (titleEl) titleEl.textContent = T('arch_sheet_title');
      var tabs = arch.querySelectorAll('.ai-arch-tab');
      var tk = ['arch_tab_all','arch_tab_nutri','arch_tab_recipe','arch_tab_plan'];
      tabs.forEach(function(b, i){ if (tk[i]) b.textContent = T(tk[i]); });
      var cnl = arch.querySelector('.sheet-cancel');
      if (cnl) cnl.textContent = T('close');
    }

    // Meal plan picker labels
    var pp = document.getElementById('plan-days-picker');
    if (pp) {
      var btns = pp.querySelectorAll('.plan-days-btn');
      var keys = ['plan_days_3','plan_days_5','plan_days_7'];
      btns.forEach(function(b, i){
        if (!keys[i]) return;
        var parts = T(keys[i]).split(' ');
        var nEl = b.querySelector('.pd-n');
        var lEl = b.querySelector('.pd-l');
        if (nEl) nEl.textContent = parts[0] || '';
        if (lEl) lEl.textContent = parts.slice(1).join(' ') || '';
      });
    }

    // Help page — let buildHelp() re-render with current locale
    var helpPage = document.getElementById('page-helppage');
    if (helpPage && helpPage.querySelector('.help-hero')) {
      if (typeof window.initHelpPage === 'function') {
        try { window.initHelpPage(); } catch(e){}
      }
    }
  }

  // Phase 3I — generic data-i18n / data-i18n-ph processor
  function applyDataI18n() {
    document.querySelectorAll('[data-i18n]').forEach(function(el){
      var key = el.getAttribute('data-i18n');
      if (!key) return;
      var val = (window.T ? window.T(key) : null) || (window.i18n && window.i18n[key]) || (MINI_I18N.en && MINI_I18N.en[key]);
      if (val) el.textContent = val;
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(function(el){
      var key = el.getAttribute('data-i18n-ph');
      if (!key) return;
      var val = (window.T ? window.T(key) : null) || (window.i18n && window.i18n[key]) || (MINI_I18N.en && MINI_I18N.en[key]);
      if (val) el.setAttribute('placeholder', val);
    });
  }
  window._applyDataI18n = applyDataI18n;
  // Hook applyDataI18n into applyExt so it runs whenever translations refresh
  var _origApplyExt = applyExt;
  applyExt = function(){
    var r = _origApplyExt.apply(this, arguments);
    try { applyDataI18n(); } catch(e){ console.warn('data-i18n apply failed:', e); }
    return r;
  };
  
  window._applyT3 = applyExt;

  // Re-apply on every language change by wrapping applyTranslations()
  if (typeof window.applyTranslations === 'function') {
    var orig = window.applyTranslations;
    window.applyTranslations = function(){
      var r = orig.apply(this, arguments);
      try { applyExt(); } catch(e){ console.warn('applyExt failed:', e); }
      return r;
    };
  }

  // Initial apply
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function(){ setTimeout(applyExt, 100); });
  } else {
    setTimeout(applyExt, 100);
  }
})();
