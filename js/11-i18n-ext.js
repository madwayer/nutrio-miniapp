// Phase 3E — i18n extension covering all Phase 2A-3D additions.
// Languages: ru, en, uk, de, fr, es. Others fall back to en via existing applyLang().
// Strings are merged into MINI_I18N, so existing `i18n.key` access just works.

(function(){
  if (typeof MINI_I18N === 'undefined') return;

  // ─── Translation table ────────────────────────────────────────────────
  var EXT = {
    ru: {
      // bottom nav
      nav_diary:"Дневник", nav_progress:"Прогресс", nav_ai:"AI", nav_more:"Ещё",
      nav_add:"Добавить",
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
      more_lb:"Рейтинг", more_micro:"Микроэлементы", more_stats:"Статистика",
      more_game:"Игра", more_pdf:"PDF отчёт", more_import:"Импорт",
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
      help_a2:"Бесплатно — 10 фото в день. С Premium — без ограничений.",
      help_q3:"Что в Premium?",
      help_a3:"Безлимит фото-распознавания, голосовых, AI-нутрициолога, генератор рецептов, планировщик питания, PDF-отчёты до 90 дней, без рекламы.",
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
    },
    en: {
      nav_diary:"Diary", nav_progress:"Progress", nav_ai:"AI", nav_more:"More",
      nav_add:"Add",
      add_sheet_title:"Add entry",
      add_barcode:"Barcode", add_barcode_sub:"Scan package",
      add_photo:"Photo of food", add_photo_sub:"Recognize by photo",
      add_manual_t:"Manual", add_manual_sub:"Enter macros",
      add_calc:"Calculator", add_calc_sub:"Portion calc",
      add_myfoods:"My foods", add_myfoods_sub:"Saved items",
      add_water_t:"Water", add_water_sub:"+ a glass",
      cancel:"Cancel", close:"Close",
      more_sheet_title:"More",
      more_lb:"Leaderboard", more_micro:"Micronutrients", more_stats:"Stats",
      more_game:"Game", more_pdf:"PDF report", more_import:"Import",
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
      help_a2:"Free — 10 photos a day. Premium — unlimited.",
      help_q3:"What's in Premium?",
      help_a3:"Unlimited photo recognition, voice input, AI nutritionist, recipe generator, meal planner, PDF reports up to 90 days, no ads.",
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
    },
    uk: {
      nav_diary:"Щоденник", nav_progress:"Прогрес", nav_ai:"AI", nav_more:"Ще", nav_add:"Додати",
      add_sheet_title:"Додати запис",
      add_barcode:"Штрихкод", add_barcode_sub:"Скан пакування",
      add_photo:"Фото страви", add_photo_sub:"Розпізнати по фото",
      add_manual_t:"Вручну", add_manual_sub:"Ввести КБЖВ",
      add_calc:"Калькулятор", add_calc_sub:"Розрахунок порції",
      add_myfoods:"Мої продукти", add_myfoods_sub:"Збережені",
      add_water_t:"Вода", add_water_sub:"+ склянка",
      cancel:"Скасувати", close:"Закрити",
      more_sheet_title:"Ще",
      more_lb:"Рейтинг", more_micro:"Мікроелементи", more_stats:"Статистика",
      more_game:"Гра", more_pdf:"PDF звіт", more_import:"Імпорт",
      more_premium:"Premium", more_settings:"Налаштування", more_lang:"Мова",
      more_help:"Допомога", more_admin:"Адмін-панель",
      ring_cal:"Калорії", ring_prot:"Білки", ring_fat:"Жири", ring_carb:"Вуглев.",
      hm_title:"Дотримання норми · 35 днів",
      hm_load:"Завантажити", hm_refresh:"Оновити",
      hm_loading:"Завантажую дані...", hm_no_data:"немає даних",
      hm_less:"менше", hm_more:"більше",
      theme_section:"🎨 Тема", theme_dark:"Темна", theme_light:"Світла", theme_auto:"Авто",
      chart_weight_title:"⚖️ Динаміка ваги",
      chart_weight_sub:"за останні записи",
      chart_weight_no_data:"Немає даних про вагу. Додай запис через бот",
      chart_cal_title:"🔥 Калорії · 30 днів",
      chart_cal_sub:"середнє: —",
      chart_cal_avg:"середнє", chart_cal_goal:"мета",
      ai_nutri_title:"Персональний аналіз", ai_nutri_sub:"Нутриціолог AI · останні 14 днів",
      ai_plan_title:"План харчування", ai_recipe_title:"Рецепт від шефа",
      ai_card_sub:"Згенеровано AI",
      ai_copy:"📋 Копіюв.", ai_copied:"✓ Скопійов.", ai_copy_fail:"Не вдалося скопіювати",
      plan_days_3:"3 дні", plan_days_5:"5 днів", plan_days_7:"7 днів",
      arch_open_btn:"Архів AI-генерацій", arch_open_hint:"усі відповіді тут ›",
      arch_sheet_title:"Архів AI",
      arch_tab_all:"Усі", arch_tab_nutri:"🤖 Аналіз",
      arch_tab_recipe:"👨‍🍳 Рецепти", arch_tab_plan:"📅 Плани",
      arch_loading:"Завантаження...", arch_empty:"Поки порожньо. Згенеруй щось!",
      arch_empty_initial:"Усі збережені AI-відповіді з'являться тут",
      arch_open_telegram:"Відкрий Mini App з Telegram",
      arch_load_error:"Помилка завантаження", arch_view_loading:"Відкриваю запис",
      arch_view_error:"Помилка", arch_view_open_fail:"Не вдалося відкрити",
      arch_delete_confirm:"Видалити запис?", arch_delete_btn:"🗑 Видалити",
      arch_deleted:"Видалено", arch_delete_err:"Помилка видалення",
      arch_kind_nutri:"Аналіз", arch_kind_recipe:"Рецепт", arch_kind_plan:"План",
      help_hero_title:"Чим допомогти?",
      help_hero_sub:"Відкрий бота, напиши в підтримку або зазирни у канал NutriO",
      help_btn_bot:"Відкрити бота", help_btn_support:"Підтримка",
      help_btn_channel:"Канал", help_btn_rate:"Оцінити",
      help_btn_rate_thanks:"Дякуємо! 💜",
      help_faq_title:"Часті питання",
      help_q1:"Як рахуються калорії?", help_a1:"AI визначає склад страви за фото або штрихкодом і рахує КБЖВ на вказану порцію.",
      help_q2:"Скільки фото на день можна?", help_a2:"Безкоштовно — 10 фото на день. З Premium — без обмежень.",
      help_q3:"Що у Premium?", help_a3:"Безліміт фото, голосових, AI-нутриціолога, генератор рецептів, планувальник, PDF до 90 днів, без реклами.",
      help_q4:"Як додати свій продукт?", help_a4:"У нижній панелі натисни \u201c+\u201d → Мої продукти → \u201cДодати\u201d.",
      help_q5:"Не працює сканер штрихкоду", help_a5:"Перевір доступ до камери. На старих пристроях потримай штрихкод нерухомо 2-3 секунди.",
      help_q6:"Як змінити мету калорій?", help_a6:"Відкрий Налаштування → Профіль → вага, мета, активність.",
      help_q7:"Чи можна імпортувати дані?", help_a7:"Так. Ще → Імпорт. Підтримуються CSV з MyFitnessPal, FatSecret, Yazio.",
      help_q8:"Де щоденник за минулі дні?", help_a8:"На вкладці Щоденник стрілки ← → перегортають дні.",
      help_footer_prefix:"NutriO · версія Mini App",
      scan_camera_off:"Камеру не запущено",
      scan_warming_up:"Зачекай, камера ще запускається",
      scan_capture_fail:"Не вдалося зняти кадр",
      scan_unknown:"❌ Не вдалося розпізнати. Спробуй ще раз",
      scan_conn_error:"❌ Помилка з'єднання",
      scan_browser_unsupported:"Сканер не підтримується у цьому браузері",
      scan_not_loaded:"Сканер не завантажено, спробуй ще раз",
      scan_init_error:"Помилка ініціалізації сканера",
      scan_camera_denied:"Немає доступу до камери",
      save_food_open_tg:"Відкрий з Telegram",
      save_food_err:"Помилка",
      save_food_conn_err:"Помилка з'єднання",
    },
    de: {
      nav_diary:"Tagebuch", nav_progress:"Fortschritt", nav_ai:"AI", nav_more:"Mehr", nav_add:"Hinzufügen",
      add_sheet_title:"Eintrag hinzufügen",
      add_barcode:"Barcode", add_barcode_sub:"Verpackung scannen",
      add_photo:"Essensfoto", add_photo_sub:"Per Foto erkennen",
      add_manual_t:"Manuell", add_manual_sub:"Makros eingeben",
      add_calc:"Rechner", add_calc_sub:"Portion berechnen",
      add_myfoods:"Meine Produkte", add_myfoods_sub:"Gespeichert",
      add_water_t:"Wasser", add_water_sub:"+ ein Glas",
      cancel:"Abbrechen", close:"Schließen",
      more_sheet_title:"Mehr",
      more_lb:"Rangliste", more_micro:"Mikronährstoffe", more_stats:"Statistik",
      more_game:"Spiel", more_pdf:"PDF-Bericht", more_import:"Import",
      more_premium:"Premium", more_settings:"Einstellungen", more_lang:"Sprache",
      more_help:"Hilfe", more_admin:"Admin-Panel",
      ring_cal:"Kalorien", ring_prot:"Eiweiß", ring_fat:"Fett", ring_carb:"KH",
      hm_title:"Zielerfüllung · 35 Tage",
      hm_load:"Laden", hm_refresh:"Aktualisieren",
      hm_loading:"Lade Daten...", hm_no_data:"keine Daten",
      hm_less:"weniger", hm_more:"mehr",
      theme_section:"🎨 Design", theme_dark:"Dunkel", theme_light:"Hell", theme_auto:"Auto",
      chart_weight_title:"⚖️ Gewichtsverlauf",
      chart_weight_sub:"letzte Einträge",
      chart_weight_no_data:"Keine Gewichtsdaten. Füge einen Eintrag im Bot hinzu",
      chart_cal_title:"🔥 Kalorien · 30 Tage",
      chart_cal_sub:"Ø: —", chart_cal_avg:"Ø", chart_cal_goal:"Ziel",
      ai_nutri_title:"Persönliche Analyse", ai_nutri_sub:"Ernährungsberater AI · letzte 14 Tage",
      ai_plan_title:"Essensplan", ai_recipe_title:"Chefkoch-Rezept",
      ai_card_sub:"Von AI generiert",
      ai_copy:"📋 Kopier.", ai_copied:"✓ Kopiert", ai_copy_fail:"Kopieren fehlgeschlagen",
      plan_days_3:"3 Tage", plan_days_5:"5 Tage", plan_days_7:"7 Tage",
      arch_open_btn:"AI-Generierungen Archiv", arch_open_hint:"alle Antworten hier ›",
      arch_sheet_title:"AI-Archiv",
      arch_tab_all:"Alle", arch_tab_nutri:"🤖 Analyse",
      arch_tab_recipe:"👨‍🍳 Rezepte", arch_tab_plan:"📅 Pläne",
      arch_loading:"Lade...", arch_empty:"Noch leer. Generiere etwas!",
      arch_empty_initial:"Alle gespeicherten AI-Antworten erscheinen hier",
      arch_open_telegram:"Öffne die Mini App aus Telegram",
      arch_load_error:"Ladefehler", arch_view_loading:"Eintrag öffnen",
      arch_view_error:"Fehler", arch_view_open_fail:"Konnte nicht öffnen",
      arch_delete_confirm:"Eintrag löschen?", arch_delete_btn:"🗑 Löschen",
      arch_deleted:"Gelöscht", arch_delete_err:"Löschfehler",
      arch_kind_nutri:"Analyse", arch_kind_recipe:"Rezept", arch_kind_plan:"Plan",
      help_hero_title:"Wie können wir helfen?",
      help_hero_sub:"Öffne den Bot, schreib an den Support oder schau in den NutriO-Kanal",
      help_btn_bot:"Bot öffnen", help_btn_support:"Support",
      help_btn_channel:"Kanal", help_btn_rate:"Bewerten",
      help_btn_rate_thanks:"Danke! 💜",
      help_faq_title:"Häufige Fragen",
      help_q1:"Wie werden Kalorien berechnet?",
      help_a1:"Die AI erkennt das Gericht per Foto oder Barcode und berechnet Makros für die angegebene Portion.",
      help_q2:"Wie viele Fotos pro Tag?", help_a2:"Kostenlos — 10 pro Tag. Premium — unbegrenzt.",
      help_q3:"Was bietet Premium?", help_a3:"Unbegrenzte Foto-Erkennung, Sprach-Eingabe, AI-Ernährungsberater, Rezept-Generator, Essensplaner, PDF bis 90 Tage, werbefrei.",
      help_q4:"Eigenes Produkt hinzufügen?", help_a4:"Unten \u201c+\u201d → Meine Produkte → \u201cHinzufügen\u201d.",
      help_q5:"Barcode-Scanner geht nicht?", help_a5:"Prüfe den Kamera-Zugriff. Auf älteren Geräten halte den Barcode 2-3 Sekunden ruhig.",
      help_q6:"Kalorienziel ändern?", help_a6:"Einstellungen → Profil → Gewicht, Ziel, Aktivität.",
      help_q7:"Daten importieren?", help_a7:"Ja. Mehr → Import. CSV aus MyFitnessPal, FatSecret, Yazio. Bis 5000 Einträge.",
      help_q8:"Wo ist mein Tagebuch alter Tage?", help_a8:"Tagebuch-Tab: Pfeile ← → blättern durch Tage.",
      help_footer_prefix:"NutriO · Mini App-Version",
      scan_camera_off:"Kamera läuft nicht",
      scan_warming_up:"Warte, die Kamera startet noch",
      scan_capture_fail:"Frame konnte nicht aufgenommen werden",
      scan_unknown:"❌ Nicht erkannt. Versuch's nochmal",
      scan_conn_error:"❌ Verbindungsfehler",
      scan_browser_unsupported:"Scanner in diesem Browser nicht unterstützt",
      scan_not_loaded:"Scanner nicht geladen, versuche es erneut",
      scan_init_error:"Scanner-Initialisierungsfehler",
      scan_camera_denied:"Kein Kamerazugriff",
      save_food_open_tg:"Aus Telegram öffnen",
      save_food_err:"Fehler",
      save_food_conn_err:"Verbindungsfehler",
    },
    fr: {
      nav_diary:"Journal", nav_progress:"Progrès", nav_ai:"IA", nav_more:"Plus", nav_add:"Ajouter",
      add_sheet_title:"Ajouter une entrée",
      add_barcode:"Code-barres", add_barcode_sub:"Scanner l'emballage",
      add_photo:"Photo du plat", add_photo_sub:"Reconnaître par photo",
      add_manual_t:"Manuel", add_manual_sub:"Saisir les macros",
      add_calc:"Calculatrice", add_calc_sub:"Calc. portion",
      add_myfoods:"Mes produits", add_myfoods_sub:"Sauvegardés",
      add_water_t:"Eau", add_water_sub:"+ un verre",
      cancel:"Annuler", close:"Fermer",
      more_sheet_title:"Plus",
      more_lb:"Classement", more_micro:"Micronutriments", more_stats:"Stats",
      more_game:"Jeu", more_pdf:"Rapport PDF", more_import:"Import",
      more_premium:"Premium", more_settings:"Paramètres", more_lang:"Langue",
      more_help:"Aide", more_admin:"Panneau admin",
      ring_cal:"Calories", ring_prot:"Protéines", ring_fat:"Lipides", ring_carb:"Glucides",
      hm_title:"Respect de l'objectif · 35 jours",
      hm_load:"Charger", hm_refresh:"Actualiser",
      hm_loading:"Chargement...", hm_no_data:"pas de données",
      hm_less:"moins", hm_more:"plus",
      theme_section:"🎨 Thème", theme_dark:"Sombre", theme_light:"Clair", theme_auto:"Auto",
      chart_weight_title:"⚖️ Évolution du poids",
      chart_weight_sub:"entrées récentes",
      chart_weight_no_data:"Pas de données de poids. Ajoute un enregistrement via le bot",
      chart_cal_title:"🔥 Calories · 30 jours",
      chart_cal_sub:"moy. : —", chart_cal_avg:"moy.", chart_cal_goal:"objectif",
      ai_nutri_title:"Analyse personnelle", ai_nutri_sub:"Nutritionniste IA · 14 derniers jours",
      ai_plan_title:"Plan de repas", ai_recipe_title:"Recette du chef",
      ai_card_sub:"Généré par IA",
      ai_copy:"📋 Copier", ai_copied:"✓ Copié", ai_copy_fail:"Impossible de copier",
      plan_days_3:"3 jours", plan_days_5:"5 jours", plan_days_7:"7 jours",
      arch_open_btn:"Archive des générations IA", arch_open_hint:"toutes les réponses ici ›",
      arch_sheet_title:"Archive IA",
      arch_tab_all:"Tout", arch_tab_nutri:"🤖 Analyse",
      arch_tab_recipe:"👨‍🍳 Recettes", arch_tab_plan:"📅 Plans",
      arch_loading:"Chargement...", arch_empty:"Vide pour l'instant. Génère quelque chose !",
      arch_empty_initial:"Toutes les réponses IA sauvegardées apparaîtront ici",
      arch_open_telegram:"Ouvre la Mini App depuis Telegram",
      arch_load_error:"Erreur de chargement", arch_view_loading:"Ouverture",
      arch_view_error:"Erreur", arch_view_open_fail:"Impossible d'ouvrir",
      arch_delete_confirm:"Supprimer cette entrée ?", arch_delete_btn:"🗑 Supprimer",
      arch_deleted:"Supprimé", arch_delete_err:"Erreur de suppression",
      arch_kind_nutri:"Analyse", arch_kind_recipe:"Recette", arch_kind_plan:"Plan",
      help_hero_title:"Comment t'aider ?",
      help_hero_sub:"Ouvre le bot, écris au support ou jette un œil au canal NutriO",
      help_btn_bot:"Ouvrir le bot", help_btn_support:"Support",
      help_btn_channel:"Canal", help_btn_rate:"Noter",
      help_btn_rate_thanks:"Merci ! 💜",
      help_faq_title:"Questions fréquentes",
      help_q1:"Comment les calories sont calculées ?",
      help_a1:"L'IA détermine la composition par photo ou code-barres et calcule les macros pour la portion indiquée.",
      help_q2:"Combien de photos par jour ?", help_a2:"Gratuit — 10 photos/jour. Premium — illimité.",
      help_q3:"Que contient Premium ?", help_a3:"Reconnaissance photo illimitée, voix, nutritionniste IA, générateur de recettes, planificateur, PDF jusqu'à 90 jours, sans pub.",
      help_q4:"Comment ajouter mon produit ?", help_a4:"En bas \u201c+\u201d → Mes produits → \u201cAjouter\u201d.",
      help_q5:"Scanner ne marche pas ?", help_a5:"Vérifie l'accès caméra. Sur anciens appareils tiens le code 2-3 sec.",
      help_q6:"Changer l'objectif calorique ?", help_a6:"Paramètres → Profil → poids, objectif, activité.",
      help_q7:"Puis-je importer des données ?", help_a7:"Oui. Plus → Import. CSV MyFitnessPal, FatSecret, Yazio. Jusqu'à 5000 entrées.",
      help_q8:"Où est mon journal des jours passés ?", help_a8:"Onglet Journal : flèches ← → pour changer de jour.",
      help_footer_prefix:"NutriO · version Mini App",
      scan_camera_off:"Caméra non démarrée",
      scan_warming_up:"Attends, la caméra démarre encore",
      scan_capture_fail:"Impossible de capturer l'image",
      scan_unknown:"❌ Non reconnu. Réessaie",
      scan_conn_error:"❌ Erreur de connexion",
      scan_browser_unsupported:"Scanner non supporté",
      scan_not_loaded:"Scanner non chargé, réessaie",
      scan_init_error:"Erreur d'initialisation",
      scan_camera_denied:"Pas d'accès caméra",
      save_food_open_tg:"Ouvre depuis Telegram",
      save_food_err:"Erreur",
      save_food_conn_err:"Erreur de connexion",
    },
    es: {
      nav_diary:"Diario", nav_progress:"Progreso", nav_ai:"IA", nav_more:"Más", nav_add:"Añadir",
      add_sheet_title:"Añadir entrada",
      add_barcode:"Código de barras", add_barcode_sub:"Escanear envase",
      add_photo:"Foto del plato", add_photo_sub:"Reconocer por foto",
      add_manual_t:"Manual", add_manual_sub:"Introducir macros",
      add_calc:"Calculadora", add_calc_sub:"Cálc. porción",
      add_myfoods:"Mis productos", add_myfoods_sub:"Guardados",
      add_water_t:"Agua", add_water_sub:"+ un vaso",
      cancel:"Cancelar", close:"Cerrar",
      more_sheet_title:"Más",
      more_lb:"Ranking", more_micro:"Micronutrientes", more_stats:"Stats",
      more_game:"Juego", more_pdf:"Informe PDF", more_import:"Importar",
      more_premium:"Premium", more_settings:"Ajustes", more_lang:"Idioma",
      more_help:"Ayuda", more_admin:"Panel admin",
      ring_cal:"Calorías", ring_prot:"Proteínas", ring_fat:"Grasas", ring_carb:"Carbs",
      hm_title:"Cumplimiento de meta · 35 días",
      hm_load:"Cargar", hm_refresh:"Actualizar",
      hm_loading:"Cargando datos...", hm_no_data:"sin datos",
      hm_less:"menos", hm_more:"más",
      theme_section:"🎨 Tema", theme_dark:"Oscuro", theme_light:"Claro", theme_auto:"Auto",
      chart_weight_title:"⚖️ Evolución del peso",
      chart_weight_sub:"últimas entradas",
      chart_weight_no_data:"Sin datos de peso. Añade un registro vía bot",
      chart_cal_title:"🔥 Calorías · 30 días",
      chart_cal_sub:"prom: —", chart_cal_avg:"prom", chart_cal_goal:"meta",
      ai_nutri_title:"Análisis personal", ai_nutri_sub:"Nutricionista IA · últimos 14 días",
      ai_plan_title:"Plan de comidas", ai_recipe_title:"Receta del chef",
      ai_card_sub:"Generado por IA",
      ai_copy:"📋 Copiar", ai_copied:"✓ Copiado", ai_copy_fail:"No se pudo copiar",
      plan_days_3:"3 días", plan_days_5:"5 días", plan_days_7:"7 días",
      arch_open_btn:"Archivo de IA", arch_open_hint:"todas las respuestas ›",
      arch_sheet_title:"Archivo IA",
      arch_tab_all:"Todas", arch_tab_nutri:"🤖 Análisis",
      arch_tab_recipe:"👨‍🍳 Recetas", arch_tab_plan:"📅 Planes",
      arch_loading:"Cargando...", arch_empty:"Vacío por ahora. ¡Genera algo!",
      arch_empty_initial:"Todas las respuestas guardadas aparecerán aquí",
      arch_open_telegram:"Abre Mini App desde Telegram",
      arch_load_error:"Error de carga", arch_view_loading:"Abriendo",
      arch_view_error:"Error", arch_view_open_fail:"No se pudo abrir",
      arch_delete_confirm:"¿Eliminar esta entrada?", arch_delete_btn:"🗑 Eliminar",
      arch_deleted:"Eliminado", arch_delete_err:"Error de eliminación",
      arch_kind_nutri:"Análisis", arch_kind_recipe:"Receta", arch_kind_plan:"Plan",
      help_hero_title:"¿Cómo te ayudamos?",
      help_hero_sub:"Abre el bot, escribe al soporte o visita el canal NutriO",
      help_btn_bot:"Abrir bot", help_btn_support:"Soporte",
      help_btn_channel:"Canal", help_btn_rate:"Valorar",
      help_btn_rate_thanks:"¡Gracias! 💜",
      help_faq_title:"Preguntas frecuentes",
      help_q1:"¿Cómo se calculan las calorías?",
      help_a1:"La IA reconoce el plato por foto o código y calcula macros para la porción indicada.",
      help_q2:"¿Cuántas fotos al día?", help_a2:"Gratis — 10/día. Premium — sin límite.",
      help_q3:"¿Qué incluye Premium?", help_a3:"Reconocimiento foto ilimitado, voz, nutricionista IA, recetas, planificador, PDF hasta 90 días, sin anuncios.",
      help_q4:"¿Cómo añadir mi producto?", help_a4:"Abajo \u201c+\u201d → Mis productos → \u201cAñadir\u201d.",
      help_q5:"¿No funciona el escáner?", help_a5:"Verifica el acceso a la cámara. En dispositivos antiguos mantén el código 2-3 seg.",
      help_q6:"¿Cambiar la meta de calorías?", help_a6:"Ajustes → Perfil → peso, meta, actividad.",
      help_q7:"¿Puedo importar datos?", help_a7:"Sí. Más → Importar. CSV MyFitnessPal, FatSecret, Yazio. Hasta 5000 entradas.",
      help_q8:"¿Dónde está mi diario de días pasados?", help_a8:"Pestaña Diario: flechas ← → cambian de día.",
      help_footer_prefix:"NutriO · versión Mini App",
      scan_camera_off:"Cámara no iniciada",
      scan_warming_up:"Espera, la cámara está iniciando",
      scan_capture_fail:"No se pudo capturar",
      scan_unknown:"❌ No reconocido. Inténtalo otra vez",
      scan_conn_error:"❌ Error de conexión",
      scan_browser_unsupported:"Escáner no soportado",
      scan_not_loaded:"Escáner no cargado, inténtalo otra vez",
      scan_init_error:"Error de inicialización",
      scan_camera_denied:"Sin acceso a cámara",
      save_food_open_tg:"Abrir desde Telegram",
      save_food_err:"Error",
      save_food_conn_err:"Error de conexión",
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

  // Re-run applyLang() now that MINI_I18N has been extended so `i18n` is refreshed
  try { if (typeof applyLang === 'function') applyLang(LANG); } catch(e){}

  // ─── Helper: T(key, fallback) returns translation in current LANG ──────
  window.T = function(key, fallback) {
    var v = (window.i18n && window.i18n[key]) || (MINI_I18N.en && MINI_I18N.en[key]);
    return v || fallback || key;
  };

  // ─── Apply translations to static HTML labels in nav, sheets, etc. ─────
  function setText(sel, txt) {
    document.querySelectorAll(sel).forEach(function(el){ if (txt) el.textContent = txt; });
  }
  function applyExt() {
    // Bottom nav labels
    var nav = {
      'bnav-diary    .bnav-lbl': T('nav_diary'),
      'bnav-progress .bnav-lbl': T('nav_progress'),
      'bnav-ai       .bnav-lbl': T('nav_ai'),
      'bnav-more     .bnav-lbl': T('nav_more'),
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
      var rowKeys = ['more_lb','more_micro','more_stats','more_game','more_pdf','more_import',
                     'more_premium','more_settings','more_help','more_admin'];
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
