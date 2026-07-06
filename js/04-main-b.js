const tg = window.Telegram?.WebApp;
if (tg) { tg.ready(); tg.expand(); }

// ── Переводы Mini App (ru / en) ──────────────────────────────────
const MINI_I18N = {
  ru: {
    water_custom_ph:"мл",
    water_title:"Вода",
    progress_title:"Прогресс",
    today_lbl:"СЕГОДНЯ",
    kcal_lbl:"ККАЛ",
    prot_lbl:"БЕЛКИ",
    fat_lbl:"ЖИРЫ",
    carb_lbl:"УГЛЕВ",
    achievements_lbl:"ДОСТИЖЕНИЯ",
    load_data_btn:"🔄 Загрузить данные из бота",
    sync_note:"Открой бота и нажми кнопку 📈 Прогресс",
    days_row:"дней подряд",
    water_unit:"мл",
    water_unit_l:"л",
    no_data_yet:"Нет данных",
    history_3day:"История за 3 дня:",
    subtitle:"Умный дневник питания",
    tab_scan:"📷 Сканер", tab_manual:"✍️ Вручную", tab_game:"🎮 Игра",
    scan_title:"Сканер штрихкодов и еды",
    scan_sub:"Наведи камеру на штрихкод упаковки или еду — бот найдёт КБЖУ автоматически",
    open_cam:"📷 Открыть камеру", stop:"⏹ Остановить", searching:"Ищу штрихкод...",
    found:"Найдено:", not_found:"Не найдено 😔",
    write:"✅ Записать в дневник", rescan:"🔄 Сканировать снова",
    manual_title:"✍️ Вручную", name_ph:"Например: Курица", name_lbl:"Название продукта", meal_lbl:"Приём пищи", weight_ph:"200",
    add:"✅ Добавить",
    meal_breakfast:"🌅 Завтрак", meal_lunch:"☀️ Обед",
    meal_dinner:"🌙 Ужин",   meal_snack:"🍎 Перекус",
    weight_label:"Вес порции (граммы)",
    kcal:"ККАЛ", protein:"БЕЛКИ", fat:"ЖИРЫ", carbs:"УГЛЕВ",
    fill_all:"Заполни название и вес",
    game:"🎮 Игра",
    healthy:"✓ Полезно", junk:"⚠ Вредно",
    wave:"ВОЛНА", miss:"Мимо!", detox:"🍃 ДЕТОКС",
    combo_bonus:"💪 КОМБО БОНУС!", shield_block:"🛡️ Заблокировано!",
    game_over_score:"СЧЁТ:", game_over_record:"РЕКОРД:", game_over_combo:"МАКС КОМБО:",
    play:"▶  ИГРАТЬ", again:"▶ ЕЩЁ РАЗ", menu_btn:"◀ Меню",
    settings_lbl:"⚙️ НАСТРОЙКИ", settings_btn:"⚙️ Настройки", back_lbl:"◀ Назад",
    location:"🌄 Фон", character:"👤 Персонаж", difficulty:"⚔️ Сложность",
    style_lbl:"Форма", color_lbl:"Цвет",
    gender_m:"👦 Парень", gender_f:"👧 Девушка", preview:"Превью",
    diff_easy:"Лёгкий", diff_normal:"Нормальный", diff_hard:"Сложный",
    diff_desc_easy:"🐢 Медленно, для знакомства",
    diff_desc_normal:"🎮 Стандартно — для большинства",
    diff_desc_hard:"🔥 Быстро и опасно — для опытных",
    record_lbl:"🏆 Рекорд:", how_to:"КАК ИГРАТЬ", start_btn:"▶  НАЧАТЬ",
    choose_char:"Выбери персонажа", choose_loc:"Выбери локацию",

    // === ИГРОВЫЕ КЛЮЧИ ===
    settings_btn:"⚙️ Настройки", gender_lbl:"Пол",
    score_lbl:"СЧЁТ: ", record_lbl2:"РЕКОРД: ", max_combo_lbl:"МАКС КОМБО: x",
    choose_difficulty:"Выбери сложность",
    desc_magnet:"Притягивает полезную еду",
    desc_shield:"Блокирует один вредный продукт",
    desc_pill:"Сбрасывает 20% веса",
    desc_x2:"Удваивает очки",
    desc_life:"Бонусная жизнь (макс. 5)",
    desc_detox:"Каждая 4-я волна — только полезное!",
    desc_combo:"5 подряд = -5% веса",
    bonus_life:"+❤️ Бонусная жизнь!", minus_weight:"-20% веса!", rare_prefix:"★ РЕДКОСТЬ! +",
    catch_food:"Лови — худеешь, зарабатываешь очки", avoid_food:"Избегай — набираешь вес",
    powerup_magnet:"🧲 Магнит", powerup_shield:"🛡️ Щит", powerup_pill:"💊 Таблетка",
    powerup_x2:"⭐ x2 очки", powerup_life:"❤️ +Жизнь", powerup_detox:"🍃 Детокс", powerup_combo:"💪 Комбо",
    pause_lbl:"⏸ ПАУЗА",
    // Вода и прогресс
    tab_water:"💧 Вода", tab_progress:"📈 Прогресс",
    water_goal_lbl:"цель: ", water_history:"История за сегодня:",
    streak_days_text:"дней подряд", streak_days_lbl:"", resume_lbl:"▶ Продолжить",
    hat_none:"Нет", hat_cap:"Кепка", hat_beanie:"Шапка", hat_fedora:"Шляпа",
    hat_hood:"Капюшон", hat_crown:"Корона", hat_headband:"Ободок", hat_beret:"Берет",
    hat_wreath:"Венок", hat_pill:"Шляпка", hat_tiara:"Диадема",
    hair_short:"Короткие", hair_slick:"Зачёс", hair_side:"Косая", hair_messy:"Лохматые",
    hair_bob:"Каре", hair_long:"Длинные", hair_curly:"Кудри", hair_pony:"Хвост",
    shirt_tshirt:"Футболка", shirt_jacket:"Куртка", shirt_hoodie:"Худи",
    shirt_shirt:"Рубашка", shirt_sweater:"Свитер", shirt_sport:"Спорт",
    shirt_dress:"Платье", shirt_blouse:"Блузка",
    pants_jeans:"Джинсы", pants_shorts:"Шорты", pants_sweat:"Спортивки",
    pants_leggings:"Леггинсы", pants_skirt:"Юбка", pants_mini:"Мини",
    boot_sneakers:"Кроссовки", boot_boots:"Ботинки", boot_loafers:"Мокасины",
    boot_heels:"Туфли", boot_slippers:"Шлёпки", boot_keds:"Кеды",
    glass_round:"Круглые", glass_cat:"Кэт-ай", glass_aviator:"Авиатор",
    glass_heart:"Сердечки", glass_mask:"Маска",
    c_red:"Красный", c_green:"Зелёный", c_blue_f:"Синяя", c_yellow:"Жёлтая",
    c_pink_f:"Розовая", c_white_f:"Белая", c_black_f:"Чёрная", c_grey:"Серый",
    c_navy:"Синий", c_beige:"Бежевый", c_brown:"Коричн", c_gold:"Золото",
    c_orange:"Оранж", c_violet:"Фиолет", c_light:"Светлые", c_dark:"Тёмные",
    c_khaki:"Хаки", c_ginger:"Рыжие", c_choco:"Шоколад", c_avocado:"Авокадо",
    c_red_pl:"Красные", c_green_pl:"Зелёные", c_blue_pl:"Голубые",
    c_navy_pl:"Синие", c_white_pl:"Белые", c_black_pl:"Чёрные",
    c_grey_pl:"Серые", c_beige_pl:"Бежевые", c_pink_pl:"Розовые", c_bow:"Бантик",
    f_broccoli:"Брокколи", f_burger:"Бургер", f_grape:"Виноград",
    f_strawberry:"Клубника", f_fries:"Картошка фри", f_lemon:"Лимон",
    f_carrot:"Морковь", f_cucumber:"Огурец", f_croissant:"Круассан",
    f_blueberry:"Черника", f_apple:"Яблоко", f_taco:"Тако", f_cake:"Пирожное",
    f_cake2:"Торт", f_pizza:"Пицца", f_salad:"Салат",
    glass_aviator2:"Авиатор", glass_cat2:"Кэт-ай", hat_wreath2:"Венок",
    lang_toggle:"🇷🇺 RU → EN",
    bg_preview_lbl:["Космос","Лес","Закат","Подземелье"],
    slot_labels:["Гол. убор","Причёска","Рубашка","Брюки","Обувь","Очки"],
    slot_labels_f:["Гол. убор","Причёска","Блузка","Юбка","Обувь","Очки"],
    water_add_200:"💧 +200",
    water_add_300:"💧 +300",
    water_add_500:"💧 +500",
    water_add_custom:"💧 Своя",
    water_reset:"🗑 Сброс",
    water_history_empty:"Записей нет",
    sync_error:"Ошибка подключения. Убедись, что бот запущен.",
  },
  en: {
    water_custom_ph:"ml",
    water_title:"Water",
    progress_title:"Progress",
    today_lbl:"TODAY",
    kcal_lbl:"KCAL",
    prot_lbl:"PROTEIN",
    fat_lbl:"FAT",
    carb_lbl:"CARBS",
    achievements_lbl:"ACHIEVEMENTS",
    load_data_btn:"🔄 Load data from bot",
    sync_note:"Open bot and tap 📈 Progress button",
    days_row:"days in a row",
    water_unit:"ml",
    water_unit_l:"L",
    no_data_yet:"No data yet",
    history_3day:"3-day history:",
    subtitle:"Smart nutrition diary",
    tab_scan:"📷 Сканер", tab_manual:"✍️ Manual", tab_game:"🎮 Game",
    scan_title:"Barcode scanner",
    scan_sub:"Point camera at barcode — bot finds nutrition automatically",
    open_cam:"📷 Open camera", stop:"⏹ Stop", searching:"Scanning...",
    found:"Found:", not_found:"Not found 😔",
    write:"✅ Add to diary", rescan:"🔄 Scan again",
    manual_title:"✍️ Manual", name_ph:"E.g.: Chicken", name_lbl:"Food name", meal_lbl:"Meal", weight_ph:"200",
    add:"✅ Add",
    meal_breakfast:"🌅 Breakfast", meal_lunch:"☀️ Lunch",
    meal_dinner:"🌙 Dinner",    meal_snack:"🍎 Snack",
    weight_label:"Portion weight (grams)",
    kcal:"KCAL", protein:"PROTEIN", fat:"FAT", carbs:"CARBS",
    fill_all:"Fill in name and weight",
    game:"🎮 Game",
    healthy:"✓ Healthy", junk:"⚠ Junk",
    wave:"WAVE", miss:"Miss!", detox:"🍃 DETOX",
    combo_bonus:"💪 COMBO BONUS!", shield_block:"🛡️ Blocked!",
    game_over_score:"SCORE:", game_over_record:"RECORD:", game_over_combo:"MAX COMBO:",
    play:"▶  PLAY", again:"▶ PLAY AGAIN", menu_btn:"◀ Menu",
    settings_lbl:"⚙️ SETTINGS", settings_btn:"⚙️ Settings", back_lbl:"◀ Back",
    location:"🌄 Location", character:"👤 Character", difficulty:"⚔️ Difficulty",
    style_lbl:"Style", color_lbl:"Color",
    gender_m:"👦 Boy", gender_f:"👧 Girl", preview:"Preview",
    diff_easy:"Easy", diff_normal:"Normal", diff_hard:"Hard",
    diff_desc_easy:"🐢 Slow, for beginners",
    diff_desc_normal:"🎮 Standard — for everyone",
    diff_desc_hard:"🔥 Fast and dangerous",
    record_lbl:"🏆 Record:", how_to:"HOW TO PLAY", start_btn:"▶  START",
    choose_char:"Choose character", choose_loc:"Choose location",

    // === GAME KEYS ===
    settings_btn:"⚙️ Settings", gender_lbl:"Gender",
    score_lbl:"SCORE: ", record_lbl2:"RECORD: ", max_combo_lbl:"MAX COMBO: x",
    choose_difficulty:"Choose difficulty",
    desc_magnet:"Attracts healthy food",
    desc_shield:"Blocks one junk food",
    desc_pill:"Resets 20% fat",
    desc_x2:"Doubles points",
    desc_life:"Bonus life (max 5)",
    desc_detox:"Every 4th wave — healthy only!",
    desc_combo:"5 in a row = -5% fat",
    bonus_life:"+❤️ Bonus life!", minus_weight:"-20% fat!", rare_prefix:"★ RARE! +",
    catch_food:"Catch — lose weight, earn points", avoid_food:"Avoid — gain weight",
    powerup_magnet:"🧲 Magnet", powerup_shield:"🛡️ Shield", powerup_pill:"💊 Pill",
    powerup_x2:"⭐ x2 pts", powerup_life:"❤️ +Life", powerup_detox:"🍃 Detox", powerup_combo:"💪 Combo",
    pause_lbl:"⏸ PAUSED",
    // Water and progress
    tab_water:"💧 Water", tab_progress:"📈 Progress",
    water_goal_lbl:"goal: ", water_history:"Today's log:",
    streak_days_text:"days in a row", streak_days_lbl:"", resume_lbl:"▶ Resume",
    hat_none:"None", hat_cap:"Cap", hat_beanie:"Beanie", hat_fedora:"Fedora",
    hat_hood:"Hood", hat_crown:"Crown", hat_headband:"Headband", hat_beret:"Beret",
    hat_wreath:"Wreath", hat_pill:"Pill hat", hat_tiara:"Tiara",
    hair_short:"Short", hair_slick:"Slick", hair_side:"Side", hair_messy:"Messy",
    hair_bob:"Bob", hair_long:"Long", hair_curly:"Curly", hair_pony:"Ponytail",
    shirt_tshirt:"T-Shirt", shirt_jacket:"Jacket", shirt_hoodie:"Hoodie",
    shirt_shirt:"Shirt", shirt_sweater:"Sweater", shirt_sport:"Sport",
    shirt_dress:"Dress", shirt_blouse:"Blouse",
    pants_jeans:"Jeans", pants_shorts:"Shorts", pants_sweat:"Sweatpants",
    pants_leggings:"Leggings", pants_skirt:"Skirt", pants_mini:"Mini",
    boot_sneakers:"Sneakers", boot_boots:"Boots", boot_loafers:"Loafers",
    boot_heels:"Heels", boot_slippers:"Slippers", boot_keds:"Keds",
    glass_round:"Round", glass_cat:"Cat-eye", glass_aviator:"Aviator",
    glass_heart:"Hearts", glass_mask:"Mask",
    c_red:"Red", c_green:"Green", c_blue_f:"Blue", c_yellow:"Yellow",
    c_pink_f:"Pink", c_white_f:"White", c_black_f:"Black", c_grey:"Grey",
    c_navy:"Navy", c_beige:"Beige", c_brown:"Brown", c_gold:"Gold",
    c_orange:"Orange", c_violet:"Violet", c_light:"Light", c_dark:"Dark",
    c_khaki:"Khaki", c_ginger:"Ginger", c_choco:"Choco", c_avocado:"Avocado",
    c_red_pl:"Red", c_green_pl:"Green", c_blue_pl:"Blue",
    c_navy_pl:"Navy", c_white_pl:"White", c_black_pl:"Black",
    c_grey_pl:"Grey", c_beige_pl:"Beige", c_pink_pl:"Pink", c_bow:"Bow",
    f_broccoli:"Broccoli", f_burger:"Burger", f_grape:"Grapes",
    f_strawberry:"Strawberry", f_fries:"Fries", f_lemon:"Lemon",
    f_carrot:"Carrot", f_cucumber:"Cucumber", f_croissant:"Croissant",
    f_blueberry:"Blueberry", f_apple:"Apple", f_taco:"Taco", f_cake:"Pastry",
    f_cake2:"Cake", f_pizza:"Pizza", f_salad:"Salad",
    glass_aviator2:"Aviator", glass_cat2:"Cat-eye", hat_wreath2:"Wreath",
    lang_toggle:"🇬🇧 EN → RU",
    bg_preview_lbl:["Space","Forest","Sunset","Dungeon"],
    slot_labels:["Headwear","Hair","Shirt","Pants","Shoes","Glasses"],
    slot_labels_f:["Headwear","Hair","Top","Skirt","Shoes","Glasses"],
    water_add_200:"💧 +200",
    water_add_300:"💧 +300",
    water_add_500:"💧 +500",
    water_add_custom:"💧 Custom",
    water_reset:"🗑 Reset",
    water_history_empty:"No entries yet",
    sync_error:"Connection error. Make sure the bot is running.",
  },
  uk: {
    water_custom_ph:"мл",
    water_title:"Вода",
    progress_title:"Прогрес",
    today_lbl:"СЬОГОДНІ",
    kcal_lbl:"ККАЛ",
    prot_lbl:"БІЛКИ",
    fat_lbl:"ЖИРИ",
    carb_lbl:"ВУГЛЕВ",
    achievements_lbl:"ДОСЯГНЕННЯ",
    load_data_btn:"🔄 Завантажити дані з бота",
    sync_note:"Відкрий бота і натисни 📈 Прогрес",
    days_row:"днів поспіль",
    water_unit:"мл",
    water_unit_l:"л",
    no_data_yet:"Немає даних",
    history_3day:"Історія за 3 дні:",
    tab_water:"💧 Вода",
    tab_progress:"📈 Прогрес",
    water_goal_lbl:"ціль: ",
    water_history:"Сьогодні:",

    subtitle:"Розумний щоденник харчування",
    tab_scan:"📷 Сканер",
    tab_manual:"✍️ Вручну",
    tab_game:"🎮 Гра",
    scan_title:"Сканер штрихкодів",
    scan_sub:"Наведи камеру на штрихкод — бот знайде КБЖУ",
    open_cam:"📷 Відкрити камеру",
    stop:"⏹ Зупинити",
    searching:"Шукаю...",
    found:"Знайдено:",
    not_found:"Не знайдено 😔",
    write:"✅ Записати у щоденник",
    rescan:"🔄 Сканувати знову",
    manual_title:"✍️ Вручну",
    name_ph:"Наприклад: Курка", name_lbl:"Назва продукту", meal_lbl:"Прийом їжі",
    weight_ph:"200",
    add:"✅ Додати",
    meal_breakfast:"🌅 Сніданок",
    meal_lunch:"☀️ Обід",
    meal_dinner:"🌙 Вечеря",
    meal_snack:"🍎 Перекус",
    weight_label:"Вага порції (грами)",
    kcal:"ККАЛ",
    protein:"БІЛКИ",
    fat:"ЖИРИ",
    carbs:"ВУГЛ",
    fill_all:"Заповни назву і вагу",
    game:"🎮 Гра",
    healthy:"✓ Корисно",
    junk:"⚠ Шкідливо",
    wave:"ХВИЛЯ",
    miss:"Мимо!",
    detox:"🍃 ДЕТОКС",
    combo_bonus:"💪 КОМБО БОНУС!",
    shield_block:"🛡️ Заблоковано!",
    game_over_score:"РАХУНОК:",
    game_over_record:"РЕКОРД:",
    game_over_combo:"МАКС КОМБО:",
    play:"▶  ГРАТИ",
    again:"▶ ЩЕ РАЗ",
    menu_btn:"◀ Меню",
    settings_lbl:"⚙️ НАЛАШТУВАННЯ",
    back_lbl:"◀ Назад",
    location:"🌄 Локація",
    character:"👤 Персонаж",
    difficulty:"⚔️ Складність",
    style_lbl:"Форма",
    color_lbl:"Колір",
    gender_m:"👦 Хлопець",
    gender_f:"👧 Дівчина",
    preview:"Перегляд",
    diff_easy:"Легкий",
    diff_normal:"Нормальний",
    diff_hard:"Складний",
    diff_desc_easy:"🐢 Повільно",
    diff_desc_normal:"🎮 Стандартно",
    diff_desc_hard:"🔥 Швидко",
    record_lbl:"🏆 Рекорд:",
    how_to:"ЯК ГРАТИ",
    start_btn:"▶  ПОЧАТИ",
    choose_char:"Вибери персонажа",
    choose_loc:"Вибери локацію",
    lang_toggle:"🇺🇦 UK",
    bg_preview_lbl:["Космос","Ліс","Захід","Підземелля"],
    slot_labels:["Гол. убір","Зачіска","Сорочка","Штани","Взуття","Окуляри"],
    slot_labels_f:["Гол. убір","Зачіска","Блузка","Спідниця","Взуття","Окуляри"],
    settings_btn:"⚙️ Налаштування",
    gender_lbl:"Стать",
    score_lbl:"РАХУНОК: ",
    record_lbl2:"РЕКОРД: ",
    max_combo_lbl:"МАКС КОМБО: x",
    choose_difficulty:"Вибери складність",
    desc_magnet:"Притягує корисну їжу",
    desc_shield:"Блокує один шкідливий продукт",
    desc_pill:"Скидає 20% ваги",
    desc_x2:"Подвоює очки",
    desc_life:"Бонусне життя (макс. 5)",
    desc_detox:"Кожна 4-я хвиля — лише корисне!",
    desc_combo:"5 підряд = -5% ваги",
    bonus_life:"+❤️ Бонусне життя!",
    minus_weight:"-20% ваги!",
    rare_prefix:"★ РІДКІСТЬ! +",
    catch_food:"Лови — худнеш, заробляєш очки",
    avoid_food:"Уникай — набираєш вагу",
    powerup_magnet:"🧲 Магніт",
    powerup_shield:"🛡️ Щит",
    powerup_pill:"💊 Таблетка",
    powerup_x2:"⭐ x2 очки",
    powerup_life:"❤️ +Життя",
    powerup_detox:"🍃 Детокс",
    powerup_combo:"💪 Комбо",
    pause_lbl:"⏸ ПАУЗА",
    // Вода и прогресс
    tab_water:"💧 Вода", tab_progress:"📈 Прогресс",
    water_goal_lbl:"цель: ", water_history:"История за сегодня:",
    streak_days_text:"дней подряд", streak_days_lbl:"",
    resume_lbl:"▶ Продовжити",
    hat_none:"Немає",
    hat_cap:"Кепка",
    hat_beanie:"Шапка",
    hat_fedora:"Капелюх",
    hat_hood:"Капюшон",
    hat_crown:"Корона",
    hat_headband:"Обідок",
    hat_beret:"Берет",
    hat_wreath:"Вінок",
    hat_pill:"Капелюшок",
    hat_tiara:"Діадема",
    hair_short:"Короткі",
    hair_slick:"Зачіс",
    hair_side:"Коса",
    hair_messy:"Скуйовджені",
    hair_bob:"Каре",
    hair_long:"Довгі",
    hair_curly:"Кучері",
    hair_pony:"Хвіст",
    shirt_tshirt:"Футболка",
    shirt_jacket:"Куртка",
    shirt_hoodie:"Худі",
    shirt_shirt:"Сорочка",
    shirt_sweater:"Светр",
    shirt_sport:"Спорт",
    shirt_dress:"Сукня",
    shirt_blouse:"Блузка",
    pants_jeans:"Джинси",
    pants_shorts:"Шорти",
    pants_sweat:"Спортивки",
    pants_leggings:"Легінси",
    pants_skirt:"Спідниця",
    pants_mini:"Міні",
    boot_sneakers:"Кросівки",
    boot_boots:"Черевики",
    boot_loafers:"Мокасини",
    boot_heels:"Туфлі",
    boot_slippers:"Шльопки",
    boot_keds:"Кеди",
    glass_round:"Круглі",
    glass_cat:"Кет-ай",
    glass_aviator:"Авіатор",
    glass_heart:"Серденька",
    glass_mask:"Маска",
    water_add_200:"💧 +200",
    water_add_300:"💧 +300",
    water_add_500:"💧 +500",
    water_add_custom:"💧 Власна",
    water_reset:"🗑 Скинути",
    water_history_empty:"Записів немає",
    sync_error:"Помилка підключення. Переконайся, що бот запущений.",
  },
  de: {
    water_custom_ph:"ml",
    water_title:"Wasser",
    progress_title:"Fortschritt",
    today_lbl:"HEUTE",
    kcal_lbl:"KCAL",
    prot_lbl:"PROTEIN",
    fat_lbl:"FETT",
    carb_lbl:"KOHLENHYDR",
    achievements_lbl:"ERFOLGE",
    load_data_btn:"🔄 Daten vom Bot laden",
    sync_note:"Bot öffnen und 📈 Fortschritt tippen",
    days_row:"Tage in Folge",
    water_unit:"ml",
    water_unit_l:"L",
    no_data_yet:"Keine Daten",
    history_3day:"3-Tage-Verlauf:",
    tab_water:"💧 Wasser",
    tab_progress:"📈 Fortschritt",
    water_goal_lbl:"Ziel: ",
    water_history:"Heute:",

    subtitle:"Smartes Ernährungstagebuch",
    tab_scan:"📷 Сканер",
    tab_manual:"✍️ Manuell",
    tab_game:"🎮 Spiel",
    scan_title:"Barcode-Scanner",
    scan_sub:"Kamera auf Barcode richten",
    open_cam:"📷 Kamera öffnen",
    stop:"⏹ Stopp",
    searching:"Suche...",
    found:"Gefunden:",
    not_found:"Nicht gefunden 😔",
    write:"✅ Im Tagebuch speichern",
    rescan:"🔄 Erneut scannen",
    manual_title:"✍️ Manuell",
    name_ph:"Z.B.: Hähnchen", name_lbl:"Produktname", meal_lbl:"Mahlzeit",
    weight_ph:"200",
    add:"✅ Hinzufügen",
    meal_breakfast:"🌅 Frühstück",
    meal_lunch:"☀️ Mittagessen",
    meal_dinner:"🌙 Abendessen",
    meal_snack:"🍎 Snack",
    weight_label:"Portionsgewicht (g)",
    kcal:"KCAL",
    protein:"PROTEIN",
    fat:"FETT",
    carbs:"KOHLENHYDR",
    fill_all:"Name und Gewicht",
    game:"🎮 Spiel",
    healthy:"✓ Gesund",
    junk:"⚠ Ungesund",
    wave:"WELLE",
    miss:"Verfehlt!",
    detox:"🍃 DETOX",
    combo_bonus:"💪 COMBO!",
    shield_block:"🛡️ Blockiert!",
    game_over_score:"PUNKTE:",
    game_over_record:"REKORD:",
    game_over_combo:"MAX COMBO:",
    play:"▶  SPIELEN",
    again:"▶ NOCHMAL",
    menu_btn:"◀ Menü",
    settings_lbl:"⚙️ EINSTELLUNGEN",
    back_lbl:"◀ Zurück",
    location:"🌄 Ort",
    character:"👤 Charakter",
    difficulty:"⚔️ Schwierigkeit",
    style_lbl:"Stil",
    color_lbl:"Farbe",
    gender_m:"👦 Junge",
    gender_f:"👧 Mädchen",
    preview:"Vorschau",
    diff_easy:"Leicht",
    diff_normal:"Normal",
    diff_hard:"Schwer",
    diff_desc_easy:"🐢 Langsam",
    diff_desc_normal:"🎮 Standard",
    diff_desc_hard:"🔥 Schnell",
    record_lbl:"🏆 Rekord:",
    how_to:"SPIELANLEITUNG",
    start_btn:"▶  START",
    choose_char:"Charakter wählen",
    choose_loc:"Ort wählen",
    lang_toggle:"🇩🇪 DE",
    bg_preview_lbl:["Weltall","Wald","Sonnenuntergang","Verlies"],
    slot_labels:["Hut","Haar","Hemd","Hose","Schuhe","Brille"],
    slot_labels_f:["Hut","Haar","Bluse","Rock","Schuhe","Brille"],
    settings_btn:"⚙️ Einstellungen",
    gender_lbl:"Geschlecht",
    score_lbl:"PUNKTE: ",
    record_lbl2:"REKORD: ",
    max_combo_lbl:"MAX COMBO: x",
    choose_difficulty:"Schwierigkeit wählen",
    desc_magnet:"Zieht gesundes Essen an",
    desc_shield:"Blockiert ein Junkfood",
    desc_pill:"Setzt 20% Fett zurück",
    desc_x2:"Verdoppelt Punkte",
    desc_life:"Bonusleben (max 5)",
    desc_detox:"Jede 4. Welle — nur gesund!",
    desc_combo:"5 hintereinander = -5% Fett",
    bonus_life:"+❤️ Bonusleben!",
    minus_weight:"-20% Fett!",
    rare_prefix:"★ SELTEN! +",
    catch_food:"Fange — abnehmen, Punkte",
    avoid_food:"Meide — zunehmen",
    powerup_magnet:"🧲 Magnet",
    powerup_shield:"🛡️ Schild",
    powerup_pill:"💊 Pille",
    powerup_x2:"⭐ x2 Pkt",
    powerup_life:"❤️ +Leben",
    powerup_detox:"🍃 Detox",
    powerup_combo:"💪 Kombo",
    pause_lbl:"⏸ PAUSE",
    resume_lbl:"▶ Weiter",
    hat_none:"Keiner",
    hat_cap:"Mütze",
    hat_beanie:"Beanie",
    hat_fedora:"Fedora",
    hat_hood:"Kapuze",
    hat_crown:"Krone",
    hat_headband:"Stirnband",
    hat_beret:"Beret",
    hat_wreath:"Kranz",
    hat_pill:"Pillbox",
    hat_tiara:"Tiara",
    hair_short:"Kurz",
    hair_slick:"Geschniegelt",
    hair_side:"Seitlich",
    hair_messy:"Zerzaust",
    hair_bob:"Bob",
    hair_long:"Lang",
    hair_curly:"Lockig",
    hair_pony:"Zopf",
    shirt_tshirt:"T-Shirt",
    shirt_jacket:"Jacke",
    shirt_hoodie:"Hoodie",
    shirt_shirt:"Hemd",
    shirt_sweater:"Pullover",
    shirt_sport:"Sport",
    shirt_dress:"Kleid",
    shirt_blouse:"Bluse",
    pants_jeans:"Jeans",
    pants_shorts:"Shorts",
    pants_sweat:"Jogger",
    pants_leggings:"Leggings",
    pants_skirt:"Rock",
    pants_mini:"Minirock",
    boot_sneakers:"Sneaker",
    boot_boots:"Stiefel",
    boot_loafers:"Slipper",
    boot_heels:"Absätze",
    boot_slippers:"Schlappen",
    boot_keds:"Keds",
    glass_round:"Rund",
    glass_cat:"Cat-Eye",
    glass_aviator:"Aviator",
    glass_heart:"Herzen",
    glass_mask:"Maske",
    water_add_200:"💧 +200",
    water_add_300:"💧 +300",
    water_add_500:"💧 +500",
    water_add_custom:"💧 Eigene",
    water_reset:"🗑 Zurücksetzen",
    water_history_empty:"Keine Einträge",
    streak_days_lbl:"",
    streak_days_text:"Tage in Folge",
    sync_error:"Verbindungsfehler. Stelle sicher, dass der Bot läuft.",
  },
  fr: {
    water_custom_ph:"ml",
    water_title:"Eau",
    progress_title:"Progrès",
    today_lbl:"AUJOURD'HUI",
    kcal_lbl:"KCAL",
    prot_lbl:"PROTÉINES",
    fat_lbl:"LIPIDES",
    carb_lbl:"GLUCIDES",
    achievements_lbl:"SUCCÈS",
    load_data_btn:"🔄 Charger données du bot",
    sync_note:"Ouvre le bot et appuie 📈 Progrès",
    days_row:"jours consécutifs",
    water_unit:"ml",
    water_unit_l:"L",
    no_data_yet:"Pas de données",
    history_3day:"Historique 3 jours:",
    tab_water:"💧 Eau",
    tab_progress:"📈 Progrès",
    water_goal_lbl:"objectif: ",
    water_history:"Aujourd'hui:",

    subtitle:"Journal nutritionnel intelligent",
    tab_scan:"📷 Сканер",
    tab_manual:"✍️ Manuel",
    tab_game:"🎮 Jeu",
    scan_title:"Scanner code-barres",
    scan_sub:"Pointez la caméra vers le code",
    open_cam:"📷 Ouvrir caméra",
    stop:"⏹ Arrêter",
    searching:"Recherche...",
    found:"Trouvé:",
    not_found:"Non trouvé 😔",
    write:"✅ Ajouter au journal",
    rescan:"🔄 Scanner à nouveau",
    manual_title:"✍️ Manuel",
    name_ph:"Ex: Poulet", name_lbl:"Nom du produit", meal_lbl:"Repas",
    weight_ph:"200",
    add:"✅ Ajouter",
    meal_breakfast:"🌅 Petit-déj",
    meal_lunch:"☀️ Déjeuner",
    meal_dinner:"🌙 Dîner",
    meal_snack:"🍎 Collation",
    weight_label:"Poids portion (g)",
    kcal:"KCAL",
    protein:"PROTÉINES",
    fat:"LIPIDES",
    carbs:"GLUCIDES",
    fill_all:"Remplir nom et poids",
    game:"🎮 Jeu",
    healthy:"✓ Sain",
    junk:"⚠ Malsain",
    wave:"VAGUE",
    miss:"Raté!",
    detox:"🍃 DÉTOX",
    combo_bonus:"💪 COMBO!",
    shield_block:"🛡️ Bloqué!",
    game_over_score:"SCORE:",
    game_over_record:"RECORD:",
    game_over_combo:"MAX COMBO:",
    play:"▶  JOUER",
    again:"▶ REJOUER",
    menu_btn:"◀ Menu",
    settings_lbl:"⚙️ PARAMÈTRES",
    back_lbl:"◀ Retour",
    location:"🌄 Lieu",
    character:"👤 Personnage",
    difficulty:"⚔️ Difficulté",
    style_lbl:"Style",
    color_lbl:"Couleur",
    gender_m:"👦 Garçon",
    gender_f:"👧 Fille",
    preview:"Aperçu",
    diff_easy:"Facile",
    diff_normal:"Normal",
    diff_hard:"Difficile",
    diff_desc_easy:"🐢 Lent",
    diff_desc_normal:"🎮 Standard",
    diff_desc_hard:"🔥 Rapide",
    record_lbl:"🏆 Record:",
    how_to:"COMMENT JOUER",
    start_btn:"▶  COMMENCER",
    choose_char:"Choisir personnage",
    choose_loc:"Choisir lieu",
    lang_toggle:"🇫🇷 FR",
    bg_preview_lbl:["Espace","Forêt","Coucher","Donjon"],
    slot_labels:["Chapeau","Cheveux","Chemise","Pantalon","Chaussures","Lunettes"],
    slot_labels_f:["Chapeau","Cheveux","Blouse","Jupe","Chaussures","Lunettes"],
    settings_btn:"⚙️ Paramètres",
    gender_lbl:"Genre",
    score_lbl:"SCORE: ",
    record_lbl2:"RECORD: ",
    max_combo_lbl:"MAX COMBO: x",
    choose_difficulty:"Choisir difficulté",
    desc_magnet:"Attire la nourriture saine",
    desc_shield:"Bloque un aliment malsain",
    desc_pill:"Réinitialise 20% de graisse",
    desc_x2:"Double les points",
    desc_life:"Vie bonus (max 5)",
    desc_detox:"Chaque 4e vague — sain!",
    desc_combo:"5 de suite = -5% graisse",
    bonus_life:"+❤️ Vie bonus!",
    minus_weight:"-20% graisse!",
    rare_prefix:"★ RARE! +",
    catch_food:"Attrape — maigrir, gagner",
    avoid_food:"Évite — grossir",
    powerup_magnet:"🧲 Aimant",
    powerup_shield:"🛡️ Bouclier",
    powerup_pill:"💊 Pilule",
    powerup_x2:"⭐ x2 pts",
    powerup_life:"❤️ +Vie",
    powerup_detox:"🍃 Détox",
    powerup_combo:"💪 Combo",
    pause_lbl:"⏸ PAUSE",
    resume_lbl:"▶ Reprendre",
    hat_none:"Aucun",
    hat_cap:"Casquette",
    hat_beanie:"Bonnet",
    hat_fedora:"Fedora",
    hat_hood:"Capuche",
    hat_crown:"Couronne",
    hat_headband:"Bandeau",
    hat_beret:"Béret",
    hat_wreath:"Couronne florale",
    hat_pill:"Pillbox",
    hat_tiara:"Tiare",
    hair_short:"Courts",
    hair_slick:"Lissés",
    hair_side:"Côté",
    hair_messy:"Ébouriffés",
    hair_bob:"Carré",
    hair_long:"Longs",
    hair_curly:"Bouclés",
    hair_pony:"Queue de cheval",
    shirt_tshirt:"T-shirt",
    shirt_jacket:"Veste",
    shirt_hoodie:"Sweat",
    shirt_shirt:"Chemise",
    shirt_sweater:"Pull",
    shirt_sport:"Sport",
    shirt_dress:"Robe",
    shirt_blouse:"Blouse",
    pants_jeans:"Jean",
    pants_shorts:"Short",
    pants_sweat:"Jogging",
    pants_leggings:"Legging",
    pants_skirt:"Jupe",
    pants_mini:"Mini",
    boot_sneakers:"Baskets",
    boot_boots:"Bottes",
    boot_loafers:"Mocassins",
    boot_heels:"Talons",
    boot_slippers:"Claquettes",
    boot_keds:"Tennis",
    glass_round:"Rondes",
    glass_cat:"Œil de chat",
    glass_aviator:"Aviateur",
    glass_heart:"Cœurs",
    glass_mask:"Masque",
    water_add_200:"💧 +200",
    water_add_300:"💧 +300",
    water_add_500:"💧 +500",
    water_add_custom:"💧 Perso",
    water_reset:"🗑 Réinitialiser",
    water_history_empty:"Aucune entrée",
    streak_days_lbl:"",
    streak_days_text:"jours consécutifs",
    sync_error:"Erreur de connexion. Vérifie que le bot est actif.",
  },
  es: {
    water_custom_ph:"ml",
    water_title:"Agua",
    progress_title:"Progreso",
    today_lbl:"HOY",
    kcal_lbl:"KCAL",
    prot_lbl:"PROTEÍNA",
    fat_lbl:"GRASA",
    carb_lbl:"CARBS",
    achievements_lbl:"LOGROS",
    load_data_btn:"🔄 Cargar datos del bot",
    sync_note:"Abre el bot y toca 📈 Progreso",
    days_row:"días seguidos",
    water_unit:"ml",
    water_unit_l:"L",
    no_data_yet:"Sin datos",
    history_3day:"Historial 3 días:",
    tab_water:"💧 Agua",
    tab_progress:"📈 Progreso",
    water_goal_lbl:"meta: ",
    water_history:"Hoy:",

    subtitle:"Diario nutricional inteligente",
    tab_scan:"📷 Сканер",
    tab_manual:"✍️ Manual",
    tab_game:"🎮 Juego",
    scan_title:"Escáner de código",
    scan_sub:"Apunta la cámara al código",
    open_cam:"📷 Abrir cámara",
    stop:"⏹ Parar",
    searching:"Buscando...",
    found:"Encontrado:",
    not_found:"No encontrado 😔",
    write:"✅ Añadir al diario",
    rescan:"🔄 Escanear de nuevo",
    manual_title:"✍️ Manual",
    name_ph:"Ej: Pollo", name_lbl:"Nombre del producto", meal_lbl:"Comida",
    weight_ph:"200",
    add:"✅ Añadir",
    meal_breakfast:"🌅 Desayuno",
    meal_lunch:"☀️ Almuerzo",
    meal_dinner:"🌙 Cena",
    meal_snack:"🍎 Merienda",
    weight_label:"Peso porción (g)",
    kcal:"KCAL",
    protein:"PROTEÍNA",
    fat:"GRASA",
    carbs:"CARB",
    fill_all:"Rellenar nombre y peso",
    game:"🎮 Juego",
    healthy:"✓ Saludable",
    junk:"⚠ No saludable",
    wave:"OLA",
    miss:"¡Fallaste!",
    detox:"🍃 DETOX",
    combo_bonus:"💪 ¡COMBO!",
    shield_block:"🛡️ ¡Bloqueado!",
    game_over_score:"PUNTOS:",
    game_over_record:"RÉCORD:",
    game_over_combo:"MAX COMBO:",
    play:"▶  JUGAR",
    again:"▶ OTRA VEZ",
    menu_btn:"◀ Menú",
    settings_lbl:"⚙️ AJUSTES",
    back_lbl:"◀ Atrás",
    location:"🌄 Lugar",
    character:"👤 Personaje",
    difficulty:"⚔️ Dificultad",
    style_lbl:"Estilo",
    color_lbl:"Color",
    gender_m:"👦 Chico",
    gender_f:"👧 Chica",
    preview:"Vista previa",
    diff_easy:"Fácil",
    diff_normal:"Normal",
    diff_hard:"Difícil",
    diff_desc_easy:"🐢 Lento",
    diff_desc_normal:"🎮 Estándar",
    diff_desc_hard:"🔥 Rápido",
    record_lbl:"🏆 Récord:",
    how_to:"CÓMO JUGAR",
    start_btn:"▶  EMPEZAR",
    choose_char:"Elige personaje",
    choose_loc:"Elige lugar",
    lang_toggle:"🇪🇸 ES",
    bg_preview_lbl:["Espacio","Bosque","Atardecer","Mazmorra"],
    slot_labels:["Sombrero","Cabello","Camisa","Pantalón","Zapatos","Gafas"],
    slot_labels_f:["Sombrero","Cabello","Blusa","Falda","Zapatos","Gafas"],
    settings_btn:"⚙️ Ajustes",
    gender_lbl:"Género",
    score_lbl:"PUNTOS: ",
    record_lbl2:"RÉCORD: ",
    max_combo_lbl:"MAX COMBO: x",
    choose_difficulty:"Elige dificultad",
    desc_magnet:"Atrae comida saludable",
    desc_shield:"Bloquea comida basura",
    desc_pill:"Elimina 20% de grasa",
    desc_x2:"Duplica puntos",
    desc_life:"Vida extra (máx 5)",
    desc_detox:"¡Cada 4a ola — solo sano!",
    desc_combo:"5 seguidos = -5% grasa",
    bonus_life:"+❤️ ¡Vida extra!",
    minus_weight:"-20% grasa!",
    rare_prefix:"★ ¡RARO! +",
    catch_food:"Atrapa — adelgazar, ganar",
    avoid_food:"Evita — engordar",
    powerup_magnet:"🧲 Imán",
    powerup_shield:"🛡️ Escudo",
    powerup_pill:"💊 Píldora",
    powerup_x2:"⭐ x2 pts",
    powerup_life:"❤️ +Vida",
    powerup_detox:"🍃 Detox",
    powerup_combo:"💪 Combo",
    pause_lbl:"⏸ PAUSA",
    resume_lbl:"▶ Continuar",
    hat_none:"Ninguno",
    hat_cap:"Gorra",
    hat_beanie:"Gorro",
    hat_fedora:"Fedora",
    hat_hood:"Capucha",
    hat_crown:"Corona",
    hat_headband:"Diadema",
    hat_beret:"Boina",
    hat_wreath:"Corona flores",
    hat_pill:"Pillbox",
    hat_tiara:"Tiara",
    hair_short:"Corto",
    hair_slick:"Peinado",
    hair_side:"Lateral",
    hair_messy:"Despeinado",
    hair_bob:"Bob",
    hair_long:"Largo",
    hair_curly:"Rizado",
    hair_pony:"Cola caballo",
    shirt_tshirt:"Camiseta",
    shirt_jacket:"Chaqueta",
    shirt_hoodie:"Sudadera",
    shirt_shirt:"Camisa",
    shirt_sweater:"Jersey",
    shirt_sport:"Deportivo",
    shirt_dress:"Vestido",
    shirt_blouse:"Blusa",
    pants_jeans:"Vaqueros",
    pants_shorts:"Cortos",
    pants_sweat:"Chándal",
    pants_leggings:"Mallas",
    pants_skirt:"Falda",
    pants_mini:"Mini",
    boot_sneakers:"Zapatillas",
    boot_boots:"Botas",
    boot_loafers:"Mocasines",
    boot_heels:"Tacones",
    boot_slippers:"Chanclas",
    boot_keds:"Keds",
    glass_round:"Redondas",
    glass_cat:"Ojo gato",
    glass_aviator:"Aviador",
    glass_heart:"Corazones",
    glass_mask:"Máscara",
    water_add_200:"💧 +200",
    water_add_300:"💧 +300",
    water_add_500:"💧 +500",
    water_add_custom:"💧 Personal",
    water_reset:"🗑 Reiniciar",
    water_history_empty:"Sin entradas",
    streak_days_lbl:"",
    streak_days_text:"días seguidos",
    sync_error:"Error de conexión. Asegúrate de que el bot esté activo.",
  },
  it: {
    water_custom_ph:"ml",
    water_title:"Acqua",
    progress_title:"Progresso",
    today_lbl:"OGGI",
    kcal_lbl:"KCAL",
    prot_lbl:"PROTEINE",
    fat_lbl:"GRASSI",
    carb_lbl:"CARBOIDR",
    achievements_lbl:"OBIETTIVI",
    load_data_btn:"🔄 Carica dati dal bot",
    sync_note:"Apri il bot e tocca 📈 Progresso",
    days_row:"giorni di fila",
    water_unit:"ml",
    water_unit_l:"L",
    no_data_yet:"Nessun dato",
    history_3day:"Storico 3 giorni:",
    tab_water:"💧 Acqua",
    tab_progress:"📈 Progresso",
    water_goal_lbl:"obiettivo: ",
    water_history:"Oggi:",

    subtitle:"Diario nutrizionale smart",
    tab_scan:"📷 Сканер",
    tab_manual:"✍️ Manuale",
    tab_game:"🎮 Gioco",
    scan_title:"Scanner codice",
    scan_sub:"Punta la fotocamera sul codice",
    open_cam:"📷 Apri fotocamera",
    stop:"⏹ Ferma",
    searching:"Ricerca...",
    found:"Trovato:",
    not_found:"Non trovato 😔",
    write:"✅ Aggiungi al diario",
    rescan:"🔄 Scansiona di nuovo",
    manual_title:"✍️ Manuale",
    name_ph:"Es: Pollo", name_lbl:"Nome prodotto", meal_lbl:"Pasto",
    weight_ph:"200",
    add:"✅ Aggiungi",
    meal_breakfast:"🌅 Colazione",
    meal_lunch:"☀️ Pranzo",
    meal_dinner:"🌙 Cena",
    meal_snack:"🍎 Spuntino",
    weight_label:"Peso porzione (g)",
    kcal:"KCAL",
    protein:"PROTEINE",
    fat:"GRASSI",
    carbs:"CARB",
    fill_all:"Compila nome e peso",
    game:"🎮 Gioco",
    healthy:"✓ Sano",
    junk:"⚠ Non sano",
    wave:"ONDATA",
    miss:"Mancato!",
    detox:"🍃 DETOX",
    combo_bonus:"💪 COMBO!",
    shield_block:"🛡️ Bloccato!",
    game_over_score:"PUNTI:",
    game_over_record:"RECORD:",
    game_over_combo:"MAX COMBO:",
    play:"▶  GIOCA",
    again:"▶ ANCORA",
    menu_btn:"◀ Menu",
    settings_lbl:"⚙️ IMPOSTAZIONI",
    back_lbl:"◀ Indietro",
    location:"🌄 Luogo",
    character:"👤 Personaggio",
    difficulty:"⚔️ Difficoltà",
    style_lbl:"Stile",
    color_lbl:"Colore",
    gender_m:"👦 Ragazzo",
    gender_f:"👧 Ragazza",
    preview:"Anteprima",
    diff_easy:"Facile",
    diff_normal:"Normale",
    diff_hard:"Difficile",
    diff_desc_easy:"🐢 Lento",
    diff_desc_normal:"🎮 Standard",
    diff_desc_hard:"🔥 Veloce",
    record_lbl:"🏆 Record:",
    how_to:"COME GIOCARE",
    start_btn:"▶  INIZIA",
    choose_char:"Scegli personaggio",
    choose_loc:"Scegli luogo",
    lang_toggle:"🇮🇹 IT",
    bg_preview_lbl:["Spazio","Foresta","Tramonto","Dungeon"],
    slot_labels:["Cappello","Capelli","Camicia","Pantaloni","Scarpe","Occhiali"],
    slot_labels_f:["Cappello","Capelli","Camicetta","Gonna","Scarpe","Occhiali"],
    settings_btn:"⚙️ Impostazioni",
    gender_lbl:"Genere",
    score_lbl:"PUNTI: ",
    record_lbl2:"RECORD: ",
    max_combo_lbl:"MAX COMBO: x",
    choose_difficulty:"Scegli difficoltà",
    desc_magnet:"Attira cibo sano",
    desc_shield:"Blocca un junk food",
    desc_pill:"Elimina 20% di grasso",
    desc_x2:"Raddoppia punti",
    desc_life:"Vita bonus (max 5)",
    desc_detox:"Ogni 4a ondata — solo sano!",
    desc_combo:"5 di fila = -5% grasso",
    bonus_life:"+❤️ Vita bonus!",
    minus_weight:"-20% grasso!",
    rare_prefix:"★ RARO! +",
    catch_food:"Cattura — dimagrire, guadagnare",
    avoid_food:"Evita — ingrassare",
    powerup_magnet:"🧲 Magnete",
    powerup_shield:"🛡️ Scudo",
    powerup_pill:"💊 Pillola",
    powerup_x2:"⭐ x2 pt",
    powerup_life:"❤️ +Vita",
    powerup_detox:"🍃 Detox",
    powerup_combo:"💪 Combo",
    pause_lbl:"⏸ PAUSA",
    resume_lbl:"▶ Riprendi",
    water_add_200:"💧 +200",
    water_add_300:"💧 +300",
    water_add_500:"💧 +500",
    water_add_custom:"💧 Personaliz.",
    water_reset:"🗑 Azzera",
    water_history_empty:"Nessuna voce",
    streak_days_lbl:"",
    streak_days_text:"giorni di fila",
    sync_error:"Errore di connessione. Verifica che il bot sia attivo.",
  },
  pt: {
    water_custom_ph:"ml",
    water_title:"Água",
    progress_title:"Progresso",
    today_lbl:"HOJE",
    kcal_lbl:"KCAL",
    prot_lbl:"PROTEÍNA",
    fat_lbl:"GORDURA",
    carb_lbl:"CARBOIDR",
    achievements_lbl:"CONQUISTAS",
    load_data_btn:"🔄 Carregar dados do bot",
    sync_note:"Abra o bot e toque 📈 Progresso",
    days_row:"dias seguidos",
    water_unit:"ml",
    water_unit_l:"L",
    no_data_yet:"Sem dados",
    history_3day:"Histórico 3 dias:",
    tab_water:"💧 Água",
    tab_progress:"📈 Progresso",
    water_goal_lbl:"meta: ",
    water_history:"Hoje:",

    subtitle:"Diário nutricional inteligente",
    tab_scan:"📷 Сканер",
    tab_manual:"✍️ Manual",
    tab_game:"🎮 Jogo",
    scan_title:"Scanner de código",
    scan_sub:"Aponte a câmera para o código",
    open_cam:"📷 Abrir câmera",
    stop:"⏹ Parar",
    searching:"Procurando...",
    found:"Encontrado:",
    not_found:"Não encontrado 😔",
    write:"✅ Adicionar ao diário",
    rescan:"🔄 Escanear novamente",
    manual_title:"✍️ Manual",
    name_ph:"Ex: Frango", name_lbl:"Nome do produto", meal_lbl:"Refeição",
    weight_ph:"200",
    add:"✅ Adicionar",
    meal_breakfast:"🌅 Café da manhã",
    meal_lunch:"☀️ Almoço",
    meal_dinner:"🌙 Jantar",
    meal_snack:"🍎 Lanche",
    weight_label:"Peso porção (g)",
    kcal:"KCAL",
    protein:"PROTEÍNA",
    fat:"GORDURA",
    carbs:"CARB",
    fill_all:"Preencha nome e peso",
    game:"🎮 Jogo",
    healthy:"✓ Saudável",
    junk:"⚠ Não saudável",
    wave:"ONDA",
    miss:"Errou!",
    detox:"🍃 DETOX",
    combo_bonus:"💪 COMBO!",
    shield_block:"🛡️ Bloqueado!",
    game_over_score:"PONTOS:",
    game_over_record:"RECORDE:",
    game_over_combo:"MAX COMBO:",
    play:"▶  JOGAR",
    again:"▶ DE NOVO",
    menu_btn:"◀ Menu",
    settings_lbl:"⚙️ CONFIGURAÇÕES",
    back_lbl:"◀ Voltar",
    location:"🌄 Local",
    character:"👤 Personagem",
    difficulty:"⚔️ Dificuldade",
    style_lbl:"Estilo",
    color_lbl:"Cor",
    gender_m:"👦 Menino",
    gender_f:"👧 Menina",
    preview:"Pré-visualização",
    diff_easy:"Fácil",
    diff_normal:"Normal",
    diff_hard:"Difícil",
    diff_desc_easy:"🐢 Lento",
    diff_desc_normal:"🎮 Padrão",
    diff_desc_hard:"🔥 Rápido",
    record_lbl:"🏆 Recorde:",
    how_to:"COMO JOGAR",
    start_btn:"▶  COMEÇAR",
    choose_char:"Escolher personagem",
    choose_loc:"Escolher local",
    lang_toggle:"🇧🇷 PT",
    bg_preview_lbl:["Espaço","Floresta","Pôr do sol","Masmorra"],
    slot_labels:["Chapéu","Cabelo","Camisa","Calça","Sapatos","Óculos"],
    slot_labels_f:["Chapéu","Cabelo","Blusa","Saia","Sapatos","Óculos"],
    settings_btn:"⚙️ Configurações",
    gender_lbl:"Gênero",
    score_lbl:"PONTOS: ",
    record_lbl2:"RECORDE: ",
    max_combo_lbl:"MAX COMBO: x",
    choose_difficulty:"Escolher dificuldade",
    desc_magnet:"Atrai comida saudável",
    desc_shield:"Bloqueia um junk food",
    desc_pill:"Remove 20% de gordura",
    desc_x2:"Dobra pontos",
    desc_life:"Vida bônus (máx 5)",
    desc_detox:"Cada 4ª onda — só saudável!",
    desc_combo:"5 seguidos = -5% gordura",
    bonus_life:"+❤️ Vida bônus!",
    minus_weight:"-20% gordura!",
    rare_prefix:"★ RARO! +",
    catch_food:"Pegue — emagrecer, ganhar",
    avoid_food:"Evite — engordar",
    powerup_magnet:"🧲 Ímã",
    powerup_shield:"🛡️ Escudo",
    powerup_pill:"💊 Pílula",
    powerup_x2:"⭐ x2 pts",
    powerup_life:"❤️ +Vida",
    powerup_detox:"🍃 Detox",
    powerup_combo:"💪 Combo",
    pause_lbl:"⏸ PAUSA",
    resume_lbl:"▶ Continuar",
    water_add_200:"💧 +200",
    water_add_300:"💧 +300",
    water_add_500:"💧 +500",
    water_add_custom:"💧 Personaliz.",
    water_reset:"🗑 Reiniciar",
    water_history_empty:"Sem registros",
    streak_days_lbl:"",
    streak_days_text:"dias seguidos",
    sync_error:"Erro de conexão. Certifique-se de que o bot está rodando.",
  },
  tr: {
    water_custom_ph:"ml",
    water_title:"Su",
    progress_title:"İlerleme",
    today_lbl:"BUGÜN",
    kcal_lbl:"KCAL",
    prot_lbl:"PROTEİN",
    fat_lbl:"YAĞ",
    carb_lbl:"KARB",
    achievements_lbl:"BAŞARILAR",
    load_data_btn:"🔄 Bottan veri yükle",
    sync_note:"Botu aç ve 📈 İlerleme'ye dokun",
    days_row:"gün üst üste",
    water_unit:"ml",
    water_unit_l:"L",
    no_data_yet:"Veri yok",
    history_3day:"3 günlük geçmiş:",
    tab_water:"💧 Su",
    tab_progress:"📈 İlerleme",
    water_goal_lbl:"hedef: ",
    water_history:"Bugün:",

    subtitle:"Akıllı beslenme günlüğü",
    tab_scan:"📷 Сканер",
    tab_manual:"✍️ Manuel",
    tab_game:"🎮 Oyun",
    scan_title:"Barkod tarayıcı",
    scan_sub:"Kamerayı barkoda doğrult",
    open_cam:"📷 Kamerayı aç",
    stop:"⏹ Durdur",
    searching:"Aranıyor...",
    found:"Bulundu:",
    not_found:"Bulunamadı 😔",
    write:"✅ Günlüğe ekle",
    rescan:"🔄 Tekrar tara",
    manual_title:"✍️ Manuel",
    name_ph:"Ör: Tavuk", name_lbl:"Ürün adı", meal_lbl:"Öğün",
    weight_ph:"200",
    add:"✅ Ekle",
    meal_breakfast:"🌅 Kahvaltı",
    meal_lunch:"☀️ Öğle",
    meal_dinner:"🌙 Akşam",
    meal_snack:"🍎 Atıştırmalık",
    weight_label:"Porsiyon ağırlığı (g)",
    kcal:"KCAL",
    protein:"PROTEİN",
    fat:"YAĞ",
    carbs:"KARB",
    fill_all:"Ad ve ağırlık girin",
    game:"🎮 Oyun",
    healthy:"✓ Sağlıklı",
    junk:"⚠ Zararlı",
    wave:"DALGA",
    miss:"Iskaladın!",
    detox:"🍃 DETOKS",
    combo_bonus:"💪 KOMBO!",
    shield_block:"🛡️ Engellendi!",
    game_over_score:"SKOR:",
    game_over_record:"REKOR:",
    game_over_combo:"MAX KOMBO:",
    play:"▶  OYNA",
    again:"▶ TEKRAR",
    menu_btn:"◀ Menü",
    settings_lbl:"⚙️ AYARLAR",
    back_lbl:"◀ Geri",
    location:"🌄 Yer",
    character:"👤 Karakter",
    difficulty:"⚔️ Zorluk",
    style_lbl:"Stil",
    color_lbl:"Renk",
    gender_m:"👦 Erkek",
    gender_f:"👧 Kız",
    preview:"Önizleme",
    diff_easy:"Kolay",
    diff_normal:"Normal",
    diff_hard:"Zor",
    diff_desc_easy:"🐢 Yavaş",
    diff_desc_normal:"🎮 Standart",
    diff_desc_hard:"🔥 Hızlı",
    record_lbl:"🏆 Rekor:",
    how_to:"NASIL OYNANIR",
    start_btn:"▶  BAŞLA",
    choose_char:"Karakter seç",
    choose_loc:"Yer seç",
    lang_toggle:"🇹🇷 TR",
    bg_preview_lbl:["Uzay","Orman","Gün batımı","Zindan"],
    slot_labels:["Şapka","Saç","Gömlek","Pantolon","Ayakkabı","Gözlük"],
    slot_labels_f:["Şapka","Saç","Bluz","Etek","Ayakkabı","Gözlük"],
    settings_btn:"⚙️ Ayarlar",
    gender_lbl:"Cinsiyet",
    score_lbl:"SKOR: ",
    record_lbl2:"REKOR: ",
    max_combo_lbl:"MAX KOMBO: x",
    choose_difficulty:"Zorluk seç",
    desc_magnet:"Sağlıklı yiyecekleri çeker",
    desc_shield:"Bir junk food engeller",
    desc_pill:"%20 yağ sıfırlar",
    desc_x2:"Puanları ikiye katlar",
    desc_life:"Bonus can (maks 5)",
    desc_detox:"Her 4. dalga — yalnızca sağlıklı!",
    desc_combo:"5 üst üste = -%5 yağ",
    bonus_life:"+❤️ Bonus can!",
    minus_weight:"-%20 yağ!",
    rare_prefix:"★ NADİR! +",
    catch_food:"Yakala — zayıfla, puan kazan",
    avoid_food:"Kaçın — şişman ol",
    powerup_magnet:"🧲 Mıknatıs",
    powerup_shield:"🛡️ Kalkan",
    powerup_pill:"💊 Hap",
    powerup_x2:"⭐ x2 puan",
    powerup_life:"❤️ +Can",
    powerup_detox:"🍃 Detoks",
    powerup_combo:"💪 Kombo",
    pause_lbl:"⏸ DURAKLAT",
    resume_lbl:"▶ Devam",
    water_add_200:"💧 +200",
    water_add_300:"💧 +300",
    water_add_500:"💧 +500",
    water_add_custom:"💧 Özel",
    water_reset:"🗑 Sıfırla",
    water_history_empty:"Kayıt yok",
    streak_days_lbl:"",
    streak_days_text:"gün üst üste",
    sync_error:"Bağlantı hatası. Botun çalıştığından emin ol.",
  },
  pl: {
    water_custom_ph:"ml",
    water_title:"Woda",
    progress_title:"Postęp",
    today_lbl:"DZIŚ",
    kcal_lbl:"KCAL",
    prot_lbl:"BIAŁKO",
    fat_lbl:"TŁUSZCZ",
    carb_lbl:"WĘGL",
    achievements_lbl:"OSIĄGNIĘCIA",
    load_data_btn:"🔄 Załaduj dane z bota",
    sync_note:"Otwórz bota i dotknij 📈 Postęp",
    days_row:"dni z rzędu",
    water_unit:"ml",
    water_unit_l:"L",
    no_data_yet:"Brak danych",
    history_3day:"Historia 3 dni:",
    tab_water:"💧 Woda",
    tab_progress:"📈 Postęp",
    water_goal_lbl:"cel: ",
    water_history:"Dziś:",

    subtitle:"Inteligentny dziennik żywienia",
    tab_scan:"📷 Сканер",
    tab_manual:"✍️ Ręcznie",
    tab_game:"🎮 Gra",
    scan_title:"Skaner kodów",
    scan_sub:"Skieruj aparat na kod",
    open_cam:"📷 Otwórz aparat",
    stop:"⏹ Stop",
    searching:"Szukam...",
    found:"Znaleziono:",
    not_found:"Nie znaleziono 😔",
    write:"✅ Dodaj do dziennika",
    rescan:"🔄 Skanuj ponownie",
    manual_title:"✍️ Ręcznie",
    name_ph:"Np: Kurczak", name_lbl:"Nazwa produktu", meal_lbl:"Posiłek",
    weight_ph:"200",
    add:"✅ Dodaj",
    meal_breakfast:"🌅 Śniadanie",
    meal_lunch:"☀️ Obiad",
    meal_dinner:"🌙 Kolacja",
    meal_snack:"🍎 Przekąska",
    weight_label:"Waga porcji (g)",
    kcal:"KCAL",
    protein:"BIAŁKO",
    fat:"TŁUSZCZ",
    carbs:"WĘGL",
    fill_all:"Podaj nazwę i wagę",
    game:"🎮 Gra",
    healthy:"✓ Zdrowe",
    junk:"⚠ Niezdrowe",
    wave:"FALA",
    miss:"Pudło!",
    detox:"🍃 DETOKS",
    combo_bonus:"💪 KOMBO!",
    shield_block:"🛡️ Zablokowane!",
    game_over_score:"WYNIK:",
    game_over_record:"REKORD:",
    game_over_combo:"MAX KOMBO:",
    play:"▶  GRAJ",
    again:"▶ JESZCZE RAZ",
    menu_btn:"◀ Menu",
    settings_lbl:"⚙️ USTAWIENIA",
    back_lbl:"◀ Wstecz",
    location:"🌄 Miejsce",
    character:"👤 Postać",
    difficulty:"⚔️ Trudność",
    style_lbl:"Styl",
    color_lbl:"Kolor",
    gender_m:"👦 Chłopak",
    gender_f:"👧 Dziewczyna",
    preview:"Podgląd",
    diff_easy:"Łatwy",
    diff_normal:"Normalny",
    diff_hard:"Trudny",
    diff_desc_easy:"🐢 Wolno",
    diff_desc_normal:"🎮 Standard",
    diff_desc_hard:"🔥 Szybko",
    record_lbl:"🏆 Rekord:",
    how_to:"JAK GRAĆ",
    start_btn:"▶  START",
    choose_char:"Wybierz postać",
    choose_loc:"Wybierz miejsce",
    lang_toggle:"🇵🇱 PL",
    bg_preview_lbl:["Kosmos","Las","Zachód słońca","Loch"],
    slot_labels:["Czapka","Włosy","Koszula","Spodnie","Buty","Okulary"],
    slot_labels_f:["Czapka","Włosy","Bluzka","Spódnica","Buty","Okulary"],
    settings_btn:"⚙️ Ustawienia",
    gender_lbl:"Płeć",
    score_lbl:"WYNIK: ",
    record_lbl2:"REKORD: ",
    max_combo_lbl:"MAX KOMBO: x",
    choose_difficulty:"Wybierz poziom",
    desc_magnet:"Przyciąga zdrowe jedzenie",
    desc_shield:"Blokuje jeden junk food",
    desc_pill:"Resetuje 20% tłuszczu",
    desc_x2:"Podwaja punkty",
    desc_life:"Bonus życie (maks 5)",
    desc_detox:"Co 4. fala — tylko zdrowe!",
    desc_combo:"5 z rzędu = -5% tłuszczu",
    bonus_life:"+❤️ Bonus życie!",
    minus_weight:"-20% tłuszczu!",
    rare_prefix:"★ RZADKI! +",
    catch_food:"Łap — chudnąć, zdobywać",
    avoid_food:"Unikaj — tyć",
    powerup_magnet:"🧲 Magnes",
    powerup_shield:"🛡️ Tarcza",
    powerup_pill:"💊 Tabletka",
    powerup_x2:"⭐ x2 pkt",
    powerup_life:"❤️ +Życie",
    powerup_detox:"🍃 Detoks",
    powerup_combo:"💪 Kombo",
    pause_lbl:"⏸ PAUZA",
    resume_lbl:"▶ Wznów",
    water_add_200:"💧 +200",
    water_add_300:"💧 +300",
    water_add_500:"💧 +500",
    water_add_custom:"💧 Własna",
    water_reset:"🗑 Resetuj",
    water_history_empty:"Brak wpisów",
    streak_days_lbl:"",
    streak_days_text:"dni z rzędu",
    sync_error:"Błąd połączenia. Upewnij się, że bot działa.",
  },
  kk: {
    water_custom_ph:"мл",
    water_title:"Су",
    progress_title:"Прогресс",
    today_lbl:"БҮГІН",
    kcal_lbl:"ККАЛ",
    prot_lbl:"АҚУЫЗ",
    fat_lbl:"МАЙ",
    carb_lbl:"КӨМІРСУ",
    achievements_lbl:"ЖЕТІСТІКТЕР",
    load_data_btn:"🔄 Деректерді жүктеу",
    sync_note:"Ботты ашып 📈 Прогресс басыңыз",
    days_row:"күн қатарынан",
    water_unit:"мл",
    water_unit_l:"л",
    no_data_yet:"Деректер жоқ",
    history_3day:"3 күн тарихы:",
    tab_water:"💧 Су",
    tab_progress:"📈 Прогресс",
    water_goal_lbl:"мақсат: ",
    water_history:"Бүгін:",

    subtitle:"Ақылды тамақтану күнделігі",
    tab_scan:"📷 Сканер",
    tab_manual:"✍️ Қолмен",
    tab_game:"🎮 Ойын",
    scan_title:"Штрих-код сканері",
    scan_sub:"Камераны штрих-кодқа бағыттаңыз",
    open_cam:"📷 Камера",
    stop:"⏹ Тоқтату",
    searching:"Іздеу...",
    found:"Табылды:",
    not_found:"Табылмады 😔",
    write:"✅ Күнделікке қосу",
    rescan:"🔄 Қайта сканерлеу",
    manual_title:"✍️ Қолмен",
    name_ph:"Мысалы: Тауық", name_lbl:"Өнім атауы", meal_lbl:"Тамақ",
    weight_ph:"200",
    add:"✅ Қосу",
    meal_breakfast:"🌅 Таңғы ас",
    meal_lunch:"☀️ Түскі ас",
    meal_dinner:"🌙 Кешкі ас",
    meal_snack:"🍎 Жеңіл тамақ",
    weight_label:"Порция салмағы (г)",
    kcal:"ККАЛ",
    protein:"АҚУЫЗ",
    fat:"МАЙ",
    carbs:"КӨМІРСУ",
    fill_all:"Атау мен салмақты толтырыңыз",
    game:"🎮 Ойын",
    healthy:"✓ Пайдалы",
    junk:"⚠ Зиянды",
    wave:"ТОЛҚЫН",
    miss:"Өтіп кетті!",
    detox:"🍃 ДЕТОКС",
    combo_bonus:"💪 КОМБО!",
    shield_block:"🛡️ Бұғатталды!",
    game_over_score:"ҰПАЙ:",
    game_over_record:"РЕКОРД:",
    game_over_combo:"МАКС КОМБО:",
    play:"▶  ОЙНАУ",
    again:"▶ ҚАЙТА",
    menu_btn:"◀ Мәзір",
    settings_lbl:"⚙️ ПАРАМЕТРЛЕР",
    back_lbl:"◀ Артқа",
    location:"🌄 Орын",
    character:"👤 Кейіпкер",
    difficulty:"⚔️ Қиындық",
    style_lbl:"Пішін",
    color_lbl:"Түс",
    gender_m:"👦 Ұл",
    gender_f:"👧 Қыз",
    preview:"Алдын ала",
    diff_easy:"Оңай",
    diff_normal:"Қалыпты",
    diff_hard:"Қиын",
    diff_desc_easy:"🐢 Баяу",
    diff_desc_normal:"🎮 Стандарт",
    diff_desc_hard:"🔥 Жылдам",
    record_lbl:"🏆 Рекорд:",
    how_to:"ҚАЛАЙ ОЙНАУ",
    start_btn:"▶  БАСТАУ",
    choose_char:"Кейіпкерді таңдау",
    choose_loc:"Орынды таңдау",
    lang_toggle:"🇰🇿 KK",
    bg_preview_lbl:["Ғарыш","Орман","Күн батуы","Зындан"],
    slot_labels:["Бас киім","Шаш","Көйлек","Шалбар","Аяқкиім","Көзәйнек"],
    slot_labels_f:["Бас киім","Шаш","Блузка","Юбка","Аяқкиім","Көзәйнек"],
    settings_btn:"⚙️ Баптаулар",
    gender_lbl:"Жыныс",
    score_lbl:"ҰПАЙ: ",
    record_lbl2:"РЕКОРД: ",
    max_combo_lbl:"МАКС КОМБО: x",
    choose_difficulty:"Қиындықты таңда",
    desc_magnet:"Пайдалы тамақты тартады",
    desc_shield:"Бір зиянды тамақты блоктайды",
    desc_pill:"20% майды сыпырады",
    desc_x2:"Ұпайды екіге көбейтеді",
    desc_life:"Бонус өмір (макс 5)",
    desc_detox:"Әр 4-ші толқын — тек пайдалы!",
    desc_combo:"5 қатарынан = -5% май",
    bonus_life:"+❤️ Бонус өмір!",
    minus_weight:"-20% май!",
    rare_prefix:"★ СИРЕК! +",
    catch_food:"Ұста — арық, ұпай жина",
    avoid_food:"Аулан — толы бол",
    powerup_magnet:"🧲 Магнит",
    powerup_shield:"🛡️ Қалқан",
    powerup_pill:"💊 Таблетка",
    powerup_x2:"⭐ x2 ұпай",
    powerup_life:"❤️ +Өмір",
    powerup_detox:"🍃 Детокс",
    powerup_combo:"💪 Комбо",
    pause_lbl:"⏸ ТОҚТА",
    resume_lbl:"▶ Жалғастыру",
    water_add_200:"💧 +200",
    water_add_300:"💧 +300",
    water_add_500:"💧 +500",
    water_add_custom:"💧 Өз мөлшері",
    water_reset:"🗑 Тастау",
    water_history_empty:"Жазба жоқ",
    streak_days_lbl:"",
    streak_days_text:"күн қатарынан",
    sync_error:"Байланыс қатесі. Бот іске қосылғанын тексер.",
  },
  uz: {
    water_custom_ph:"ml",
    subtitle:"Aqlli ovqatlanish kundaligi",
    tab_scan:"📷 Сканер",
    tab_manual:"✍️ Qo'lda",
    tab_game:"🎮 O'yin",
    scan_title:"Shtrix-kod skaneri",
    scan_sub:"Kamerani shtrix-kodga to'g'rilang",
    open_cam:"📷 Kamerani ochish",
    stop:"⏹ To'xtatish",
    searching:"Qidirilmoqda...",
    found:"Topildi:",
    not_found:"Topilmadi 😔",
    write:"✅ Kundalikka qo'shish",
    rescan:"🔄 Qayta skanlash",
    manual_title:"✍️ Qo'lda",
    name_ph:"Masalan: Tovuq", name_lbl:"Mahsulot nomi", meal_lbl:"Ovqat",
    weight_ph:"200",
    add:"✅ Qo'shish",
    meal_breakfast:"🌅 Nonushta",
    meal_lunch:"☀️ Tushlik",
    meal_dinner:"🌙 Kechki ovqat",
    meal_snack:"🍎 Yengil ovqat",
    weight_label:"Porsiya og'irligi (g)",
    kcal:"KKAL",
    protein:"OQSIL",
    fat:"YOG'",
    carbs:"UGLEVOD",
    fill_all:"Nom va og'irlikni to'ldiring",
    game:"🎮 O'yin",
    healthy:"✓ Foydali",
    junk:"⚠ Zararli",
    wave:"TO'LQIN",
    miss:"O'tib ketdi!",
    detox:"🍃 DETOKS",
    combo_bonus:"💪 KOMBO!",
    shield_block:"🛡️ Bloklandi!",
    game_over_score:"BALL:",
    game_over_record:"REKORD:",
    game_over_combo:"MAX KOMBO:",
    play:"▶  O'YNASH",
    again:"▶ QAYTA",
    menu_btn:"◀ Menyu",
    settings_lbl:"⚙️ SOZLAMALAR",
    back_lbl:"◀ Orqaga",
    location:"🌄 Joy",
    character:"👤 Personaj",
    difficulty:"⚔️ Qiyinlik",
    style_lbl:"Shakl",
    color_lbl:"Rang",
    gender_m:"👦 O'g'il",
    gender_f:"👧 Qiz",
    preview:"Ko'rib chiqish",
    diff_easy:"Oson",
    diff_normal:"Oddiy",
    diff_hard:"Qiyin",
    diff_desc_easy:"🐢 Sekin",
    diff_desc_normal:"🎮 Standart",
    diff_desc_hard:"🔥 Tez",
    record_lbl:"🏆 Rekord:",
    how_to:"QANDAY O'YNASH",
    start_btn:"▶  BOSHLASH",
    choose_char:"Personajni tanlang",
    choose_loc:"Joyni tanlang",
    lang_toggle:"🇺🇿 UZ",
    bg_preview_lbl:["Kosmos","O'rmon","Quyosh botishi","Zindon"],
    slot_labels:["Bosh kiyim","Soch","Ko'ylak","Shim","Oyoq kiyim","Ko'zoynak"],
    slot_labels_f:["Bosh kiyim","Soch","Bluzka","Yubka","Oyoq kiyim","Ko'zoynak"],
    settings_btn:"⚙️ Sozlamalar",
    gender_lbl:"Jins",
    score_lbl:"BALL: ",
    record_lbl2:"REKORD: ",
    max_combo_lbl:"MAKS KOMBO: x",
    choose_difficulty:"Qiyinlikni tanlang",
    desc_magnet:"Foydali ovqatni tortadi",
    desc_shield:"Bir zararli mahsulotni bloklaydi",
    desc_pill:"20% yog'ni tozalaydi",
    desc_x2:"Ballarni ikki marta ko'paytiradi",
    desc_life:"Bonus hayot (maks 5)",
    desc_detox:"Har 4-chi to'lqin — faqat foydali!",
    desc_combo:"5 ketma-ket = -5% yog'",
    bonus_life:"+❤️ Bonus hayot!",
    minus_weight:"-20% yog'!",
    rare_prefix:"★ NOYOB! +",
    catch_food:"Ushla — ozgin bo'l, ball yig'",
    avoid_food:"Qoching — semiring",
    powerup_magnet:"🧲 Magnet",
    powerup_shield:"🛡️ Qalqon",
    powerup_pill:"💊 Tabletka",
    powerup_x2:"⭐ x2 ball",
    powerup_life:"❤️ +Hayot",
    powerup_detox:"🍃 Detoks",
    powerup_combo:"💪 Kombo",
    pause_lbl:"⏸ TO'XTAT",
    resume_lbl:"▶ Davom etish",
    water_unit:"ml",
    water_unit_l:"l",
    water_title:"Suv",
    water_goal_lbl:"maqsad: ",
    water_history:"Bugungi jurnal:",
    water_history_empty:"Yozuv yo'q",
    water_add_200:"💧 +200",
    water_add_300:"💧 +300",
    water_add_500:"💧 +500",
    water_add_custom:"💧 O'z miqdori",
    water_reset:"🗑 Tozalash",
    progress_title:"Jarayon",
    today_lbl:"BUGUN",
    kcal_lbl:"KKAL",
    prot_lbl:"OQSIL",
    fat_lbl:"YOG'",
    carb_lbl:"UGLEVOD",
    achievements_lbl:"YUTUQLAR",
    no_data_yet:"Ma'lumot yo'q",
    days_row:"kun ketma-ket",
    load_data_btn:"🔄 Botdan ma'lumot yuklash",
    sync_note:"Botni oching va Jarayon tugmasini bosing",
    streak_days_lbl:"",
    streak_days_text:"kun ketma-ket",
    tab_water:"💧 Suv",
    tab_progress:"📈 Jarayon",
    sync_error:"Ulanish xatosi. Bot ishga tushirilganini tekshiring.",
  },
  ar: {
    water_custom_ph:"ml",
    subtitle:"مذكرة التغذية الذكية",
    tab_scan:"📷 Сканер",
    tab_manual:"✍️ يدوي",
    tab_game:"🎮 لعبة",
    scan_title:"ماسح الباركود",
    scan_sub:"وجه الكاميرا نحو الباركود",
    open_cam:"📷 فتح الكاميرا",
    stop:"⏹ إيقاف",
    searching:"جاري البحث...",
    found:"تم العثور:",
    not_found:"لم يتم العثور 😔",
    write:"✅ أضف إلى المذكرة",
    rescan:"🔄 مسح مرة أخرى",
    manual_title:"✍️ يدوي",
    name_ph:"مثال: دجاج", name_lbl:"Назва прадукту", meal_lbl:"Прыём ежы",
    weight_ph:"200",
    add:"✅ إضافة",
    meal_breakfast:"🌅 فطور",
    meal_lunch:"☀️ غداء",
    meal_dinner:"🌙 عشاء",
    meal_snack:"🍎 وجبة خفيفة",
    weight_label:"وزن الحصة (غ)",
    kcal:"سعرة",
    protein:"بروتين",
    fat:"دهون",
    carbs:"كربوهيدرات",
    fill_all:"املأ الاسم والوزن",
    game:"🎮 لعبة",
    healthy:"✓ صحي",
    junk:"⚠ غير صحي",
    wave:"موجة",
    miss:"فاتك!",
    detox:"🍃 ديتوكس",
    combo_bonus:"💪 كومبو!",
    shield_block:"🛡️ محجوب!",
    game_over_score:"النتيجة:",
    game_over_record:"الرقم القياسي:",
    game_over_combo:"أقصى كومبو:",
    play:"▶  العب",
    again:"▶ مرة أخرى",
    menu_btn:"◀ القائمة",
    settings_lbl:"⚙️ الإعدادات",
    back_lbl:"◀ رجوع",
    location:"🌄 المكان",
    character:"👤 الشخصية",
    difficulty:"⚔️ الصعوبة",
    style_lbl:"النمط",
    color_lbl:"اللون",
    gender_m:"👦 ولد",
    gender_f:"👧 بنت",
    preview:"معاينة",
    diff_easy:"سهل",
    diff_normal:"عادي",
    diff_hard:"صعب",
    diff_desc_easy:"🐢 بطيء",
    diff_desc_normal:"🎮 قياسي",
    diff_desc_hard:"🔥 سريع",
    record_lbl:"🏆 الرقم القياسي:",
    how_to:"كيفية اللعب",
    start_btn:"▶  ابدأ",
    choose_char:"اختر شخصية",
    choose_loc:"اختر مكان",
    lang_toggle:"🇸🇦 AR",
    bg_preview_lbl:["فضاء","غابة","غروب","زنزانة"],
    slot_labels:["قبعة","شعر","قميص","سروال","حذاء","نظارات"],
    slot_labels_f:["قبعة","شعر","بلوزة","تنورة","حذاء","نظارات"],
    settings_btn:"⚙️ الإعدادات",
    gender_lbl:"الجنس",
    score_lbl:"النتيجة: ",
    record_lbl2:"الرقم القياسي: ",
    max_combo_lbl:"أقصى كومبو: x",
    choose_difficulty:"اختر الصعوبة",
    desc_magnet:"يجذب الطعام الصحي",
    desc_shield:"يحجب غذاءً غير صحي",
    desc_pill:"يزيل 20% من الدهون",
    desc_x2:"يضاعف النقاط",
    desc_life:"حياة إضافية (أقصى 5)",
    desc_detox:"كل موجة 4 — صحي فقط!",
    desc_combo:"5 متتالية = -5% دهون",
    bonus_life:"+❤️ حياة إضافية!",
    minus_weight:"-20% دهون!",
    rare_prefix:"★ نادر! +",
    catch_food:"امسك — أنقص وزنك",
    avoid_food:"تجنب — تسمن",
    powerup_magnet:"🧲 مغناطيس",
    powerup_shield:"🛡️ درع",
    powerup_pill:"💊 حبة",
    powerup_x2:"⭐ x2 نقاط",
    powerup_life:"❤️ +حياة",
    powerup_detox:"🍃 ديتوكس",
    powerup_combo:"💪 كومبو",
    pause_lbl:"⏸ إيقاف",
    resume_lbl:"▶ استمرار",
    water_unit:"مل",
    water_unit_l:"ل",
    water_title:"الماء",
    water_goal_lbl:"الهدف: ",
    water_history:"سجل اليوم:",
    water_history_empty:"لا توجد إدخالات",
    water_add_200:"💧 +200",
    water_add_300:"💧 +300",
    water_add_500:"💧 +500",
    water_add_custom:"💧 مخصص",
    water_reset:"🗑 إعادة تعيين",
    progress_title:"التقدم",
    today_lbl:"اليوم",
    kcal_lbl:"سعرة",
    prot_lbl:"بروتين",
    fat_lbl:"دهون",
    carb_lbl:"كارب",
    achievements_lbl:"الإنجازات",
    no_data_yet:"لا بيانات بعد",
    days_row:"أيام متتالية",
    load_data_btn:"🔄 تحميل البيانات من البوت",
    sync_note:"افتح البوت واضغط على التقدم",
    streak_days_lbl:"",
    streak_days_text:"أيام متتالية",
    tab_water:"💧 ماء",
    tab_progress:"📈 تقدم",
    sync_error:"خطأ في الاتصال. تأكد أن البوت يعمل.",
  },
  he: {
    water_custom_ph:"ml",
    subtitle:"יומן תזונה חכם",
    tab_scan:"📷 Сканер",
    tab_manual:"✍️ ידני",
    tab_game:"🎮 משחק",
    scan_title:"סורק ברקוד",
    scan_sub:"כוון את המצלמה לברקוד",
    open_cam:"📷 פתח מצלמה",
    stop:"⏹ עצור",
    searching:"מחפש...",
    found:"נמצא:",
    not_found:"לא נמצא 😔",
    write:"✅ הוסף ליומן",
    rescan:"🔄 סרוק שוב",
    manual_title:"✍️ ידני",
    name_ph:"לדוגמה: עוף", name_lbl:"اسم المنتج", meal_lbl:"وجبة",
    weight_ph:"200",
    add:"✅ הוסף",
    meal_breakfast:"🌅 ארוחת בוקר",
    meal_lunch:"☀️ ארוחת צהריים",
    meal_dinner:"🌙 ארוחת ערב",
    meal_snack:"🍎 חטיף",
    weight_label:"משקל מנה (ג)",
    kcal:"קק\"ל",
    protein:"חלבון",
    fat:"שומן",
    carbs:"פחמ\"מ",
    fill_all:"מלא שם ומשקל",
    game:"🎮 משחק",
    healthy:"✓ בריא",
    junk:"⚠ לא בריא",
    wave:"גל",
    miss:"פספסת!",
    detox:"🍃 ניקוי",
    combo_bonus:"💪 קומבו!",
    shield_block:"🛡️ נחסם!",
    game_over_score:"ניקוד:",
    game_over_record:"שיא:",
    game_over_combo:"קומבו מקס:",
    play:"▶  שחק",
    again:"▶ שוב",
    menu_btn:"◀ תפריט",
    settings_lbl:"⚙️ הגדרות",
    back_lbl:"◀ חזור",
    location:"🌄 מקום",
    character:"👤 דמות",
    difficulty:"⚔️ קושי",
    style_lbl:"סגנון",
    color_lbl:"צבע",
    gender_m:"👦 בן",
    gender_f:"👧 בת",
    preview:"תצוגה מקדימה",
    diff_easy:"קל",
    diff_normal:"רגיל",
    diff_hard:"קשה",
    diff_desc_easy:"🐢 איטי",
    diff_desc_normal:"🎮 רגיל",
    diff_desc_hard:"🔥 מהיר",
    record_lbl:"🏆 שיא:",
    how_to:"איך לשחק",
    start_btn:"▶  התחל",
    choose_char:"בחר דמות",
    choose_loc:"בחר מקום",
    lang_toggle:"🇮🇱 HE",
    bg_preview_lbl:["חלל","יער","שקיעה","צינוק"],
    slot_labels:["כובע","שיער","חולצה","מכנסיים","נעליים","משקפיים"],
    slot_labels_f:["כובע","שיער","חולצה","חצאית","נעליים","משקפיים"],
    settings_btn:"⚙️ הגדרות",
    gender_lbl:"מין",
    score_lbl:"ניקוד: ",
    record_lbl2:"שיא: ",
    max_combo_lbl:"מקס קומבו: x",
    choose_difficulty:"בחר קושי",
    desc_magnet:"מושך אוכל בריא",
    desc_shield:"חוסם מוצר מזיק אחד",
    desc_pill:"מסיר 20% שומן",
    desc_x2:"מכפיל נקודות",
    desc_life:"חיים בונוס (מקס 5)",
    desc_detox:"כל גל 4 — רק בריא!",
    desc_combo:"5 ברצף = -5% שומן",
    bonus_life:"+❤️ חיים בונוס!",
    minus_weight:"-20% שומן!",
    rare_prefix:"★ נדיר! +",
    catch_food:"תפוס — לרזות, לצבור נקודות",
    avoid_food:"הימנע — להשמין",
    powerup_magnet:"🧲 מגנט",
    powerup_shield:"🛡️ מגן",
    powerup_pill:"💊 כדור",
    powerup_x2:"⭐ x2 נק",
    powerup_life:"❤️ +חיים",
    powerup_detox:"🍃 ניקוי",
    powerup_combo:"💪 קומבו",
    pause_lbl:"⏸ הפסקה",
    resume_lbl:"▶ המשך",
    water_unit:"מ\"ל",
    water_unit_l:"ל",
    water_title:"מים",
    water_goal_lbl:"יעד: ",
    water_history:"יומן היום:",
    water_history_empty:"אין רשומות",
    water_add_200:"💧 +200",
    water_add_300:"💧 +300",
    water_add_500:"💧 +500",
    water_add_custom:"💧 מותאם",
    water_reset:"🗑 איפוס",
    progress_title:"התקדמות",
    today_lbl:"היום",
    kcal_lbl:"קלק",
    prot_lbl:"חלבון",
    fat_lbl:"שומן",
    carb_lbl:"פחמימות",
    achievements_lbl:"הישגים",
    no_data_yet:"אין נתונים",
    days_row:"ימים ברצף",
    load_data_btn:"🔄 טען נתונים מהבוט",
    sync_note:"פתח את הבוט ולחץ על התקדמות",
    streak_days_lbl:"",
    streak_days_text:"ימים ברצף",
    tab_water:"💧 מים",
    tab_progress:"📈 התקדמות",
    sync_error:"שגיאת חיבור. ודא שהבוט פועל.",
  },
  zh: {
    water_custom_ph:"ml",
    water_title:"水",
    progress_title:"进度",
    today_lbl:"今日",
    kcal_lbl:"卡路里",
    prot_lbl:"蛋白质",
    fat_lbl:"脂肪",
    carb_lbl:"碳水",
    achievements_lbl:"成就",
    load_data_btn:"🔄 从机器人加载数据",
    sync_note:"打开机器人并点击📈进度",
    days_row:"天连续",
    water_unit:"ml",
    water_unit_l:"L",
    no_data_yet:"暂无数据",
    history_3day:"3天记录:",
    tab_water:"💧 水",
    tab_progress:"📈 进度",
    water_goal_lbl:"目标: ",
    water_history:"今天:",

    subtitle:"智能营养日记",
    tab_scan:"📷 Сканер",
    tab_manual:"✍️ 手动",
    tab_game:"🎮 游戏",
    scan_title:"条形码扫描器",
    scan_sub:"将相机对准条形码",
    open_cam:"📷 打开相机",
    stop:"⏹ 停止",
    searching:"搜索中...",
    found:"已找到:",
    not_found:"未找到 😔",
    write:"✅ 添加到日记",
    rescan:"🔄 重新扫描",
    manual_title:"✍️ 手动",
    name_ph:"例如: 鸡肉", name_lbl:"שם המוצר", meal_lbl:"ארוחה",
    weight_ph:"200",
    add:"✅ 添加",
    meal_breakfast:"🌅 早餐",
    meal_lunch:"☀️ 午餐",
    meal_dinner:"🌙 晚餐",
    meal_snack:"🍎 小食",
    weight_label:"份量重量 (克)",
    kcal:"千卡",
    protein:"蛋白质",
    fat:"脂肪",
    carbs:"碳水",
    fill_all:"填写名称和重量",
    game:"🎮 游戏",
    healthy:"✓ 健康",
    junk:"⚠ 不健康",
    wave:"波次",
    miss:"错过!",
    detox:"🍃 排毒",
    combo_bonus:"💪 连击!",
    shield_block:"🛡️ 已阻挡!",
    game_over_score:"分数:",
    game_over_record:"记录:",
    game_over_combo:"最大连击:",
    play:"▶  开始",
    again:"▶ 再玩",
    menu_btn:"◀ 菜单",
    settings_lbl:"⚙️ 设置",
    back_lbl:"◀ 返回",
    location:"🌄 地点",
    character:"👤 角色",
    difficulty:"⚔️ 难度",
    style_lbl:"样式",
    color_lbl:"颜色",
    gender_m:"👦 男孩",
    gender_f:"👧 女孩",
    preview:"预览",
    diff_easy:"简单",
    diff_normal:"普通",
    diff_hard:"困难",
    diff_desc_easy:"🐢 慢速",
    diff_desc_normal:"🎮 标准",
    diff_desc_hard:"🔥 快速",
    record_lbl:"🏆 记录:",
    how_to:"如何游玩",
    start_btn:"▶  开始",
    choose_char:"选择角色",
    choose_loc:"选择地点",
    lang_toggle:"🇨🇳 ZH",
    bg_preview_lbl:["太空","森林","日落","地牢"],
    slot_labels:["帽子","头发","衬衫","裤子","鞋子","眼镜"],
    slot_labels_f:["帽子","头发","上衣","裙子","鞋子","眼镜"],
    settings_btn:"⚙️ 设置",
    gender_lbl:"性别",
    score_lbl:"分数: ",
    record_lbl2:"记录: ",
    max_combo_lbl:"最大连击: x",
    choose_difficulty:"选择难度",
    desc_magnet:"吸引健康食品",
    desc_shield:"阻挡一个垃圾食品",
    desc_pill:"重置20%脂肪",
    desc_x2:"双倍积分",
    desc_life:"奖励生命 (最多5)",
    desc_detox:"每第4波 — 只有健康!",
    desc_combo:"连续5个 = -5%脂肪",
    bonus_life:"+❤️ 奖励生命!",
    minus_weight:"-20%脂肪!",
    rare_prefix:"★ 稀有! +",
    catch_food:"接住 — 减重，赚积分",
    avoid_food:"避开 — 增重",
    powerup_magnet:"🧲 磁铁",
    powerup_shield:"🛡️ 护盾",
    powerup_pill:"💊 药丸",
    powerup_x2:"⭐ x2分",
    powerup_life:"❤️ +生命",
    powerup_detox:"🍃 排毒",
    powerup_combo:"💪 连击",
    pause_lbl:"⏸ 暂停",
    resume_lbl:"▶ 继续",
    water_add_200:"💧 +200",
    water_add_300:"💧 +300",
    water_add_500:"💧 +500",
    water_add_custom:"💧 自定义",
    water_reset:"🗑 重置",
    water_history_empty:"暂无记录",
    streak_days_lbl:"",
    streak_days_text:"连续天数",
    sync_error:"连接错误。请确保机器人正在运行。",
  },
  ja: {
    water_custom_ph:"ml",
    water_title:"水",
    progress_title:"進捗",
    today_lbl:"今日",
    kcal_lbl:"カロリー",
    prot_lbl:"タンパク質",
    fat_lbl:"脂質",
    carb_lbl:"炭水化物",
    achievements_lbl:"実績",
    load_data_btn:"🔄 ボットからデータを読込",
    sync_note:"ボットを開いて📈進捗をタップ",
    days_row:"日連続",
    water_unit:"ml",
    water_unit_l:"L",
    no_data_yet:"データなし",
    history_3day:"3日間の記録:",
    tab_water:"💧 水",
    tab_progress:"📈 進捗",
    water_goal_lbl:"目標: ",
    water_history:"今日:",

    subtitle:"スマート栄養日記",
    tab_scan:"📷 Сканер",
    tab_manual:"✍️ 手動",
    tab_game:"🎮 ゲーム",
    scan_title:"バーコードスキャナー",
    scan_sub:"カメラをバーコードに向ける",
    open_cam:"📷 カメラを開く",
    stop:"⏹ 停止",
    searching:"検索中...",
    found:"見つかりました:",
    not_found:"見つかりません 😔",
    write:"✅ 日記に追加",
    rescan:"🔄 もう一度スキャン",
    manual_title:"✍️ 手動",
    name_ph:"例: チキン", name_lbl:"产品名称", meal_lbl:"餐类",
    weight_ph:"200",
    add:"✅ 追加",
    meal_breakfast:"🌅 朝食",
    meal_lunch:"☀️ 昼食",
    meal_dinner:"🌙 夕食",
    meal_snack:"🍎 おやつ",
    weight_label:"分量 (g)",
    kcal:"カロリー",
    protein:"タンパク質",
    fat:"脂質",
    carbs:"炭水化物",
    fill_all:"名前と重量を入力",
    game:"🎮 ゲーム",
    healthy:"✓ 健康的",
    junk:"⚠ 不健康",
    wave:"ウェーブ",
    miss:"ミス！",
    detox:"🍃 デトックス",
    combo_bonus:"💪 コンボ！",
    shield_block:"🛡️ ブロック！",
    game_over_score:"スコア:",
    game_over_record:"記録:",
    game_over_combo:"最大コンボ:",
    play:"▶  プレイ",
    again:"▶ もう一度",
    menu_btn:"◀ メニュー",
    settings_lbl:"⚙️ 設定",
    back_lbl:"◀ 戻る",
    location:"🌄 場所",
    character:"👤 キャラクター",
    difficulty:"⚔️ 難易度",
    style_lbl:"スタイル",
    color_lbl:"色",
    gender_m:"👦 男の子",
    gender_f:"👧 女の子",
    preview:"プレビュー",
    diff_easy:"簡単",
    diff_normal:"普通",
    diff_hard:"難しい",
    diff_desc_easy:"🐢 ゆっくり",
    diff_desc_normal:"🎮 標準",
    diff_desc_hard:"🔥 速い",
    record_lbl:"🏆 記録:",
    how_to:"遊び方",
    start_btn:"▶  スタート",
    choose_char:"キャラ選択",
    choose_loc:"場所選択",
    lang_toggle:"🇯🇵 JA",
    bg_preview_lbl:["宇宙","森","夕焼け","ダンジョン"],
    slot_labels:["帽子","髪","シャツ","パンツ","靴","メガネ"],
    slot_labels_f:["帽子","髪","ブラウス","スカート","靴","メガネ"],
    settings_btn:"⚙️ 設定",
    gender_lbl:"性別",
    score_lbl:"スコア: ",
    record_lbl2:"記録: ",
    max_combo_lbl:"最大コンボ: x",
    choose_difficulty:"難易度を選択",
    desc_magnet:"健康的な食べ物を引き付ける",
    desc_shield:"ジャンクフードを1つブロック",
    desc_pill:"脂肪を20%リセット",
    desc_x2:"ポイント2倍",
    desc_life:"ボーナスライフ (最大5)",
    desc_detox:"4波ごとに健康のみ!",
    desc_combo:"5連続 = -5%脂肪",
    bonus_life:"+❤️ ボーナスライフ!",
    minus_weight:"-20%脂肪!",
    rare_prefix:"★ レア! +",
    catch_food:"つかむ — 痩せる、ポイント獲得",
    avoid_food:"避ける — 太る",
    powerup_magnet:"🧲 磁石",
    powerup_shield:"🛡️ シールド",
    powerup_pill:"💊 薬",
    powerup_x2:"⭐ x2pt",
    powerup_life:"❤️ +ライフ",
    powerup_detox:"🍃 デトックス",
    powerup_combo:"💪 コンボ",
    pause_lbl:"⏸ 一時停止",
    resume_lbl:"▶ 再開",
    water_add_200:"💧 +200",
    water_add_300:"💧 +300",
    water_add_500:"💧 +500",
    water_add_custom:"💧 カスタム",
    water_reset:"🗑 リセット",
    water_history_empty:"記録なし",
    streak_days_lbl:"",
    streak_days_text:"日連続",
    sync_error:"接続エラー。ボットが起動していることを確認してください。",
  },
  ko: {
    water_custom_ph:"ml",
    water_title:"물",
    progress_title:"진행",
    today_lbl:"오늘",
    kcal_lbl:"칼로리",
    prot_lbl:"단백질",
    fat_lbl:"지방",
    carb_lbl:"탄수화물",
    achievements_lbl:"업적",
    load_data_btn:"🔄 봇에서 데이터 로드",
    sync_note:"봇을 열고 📈 진행 버튼을 탭",
    days_row:"일 연속",
    water_unit:"ml",
    water_unit_l:"L",
    no_data_yet:"데이터 없음",
    history_3day:"3일 기록:",
    tab_water:"💧 물",
    tab_progress:"📈 진행",
    water_goal_lbl:"목표: ",
    water_history:"오늘:",

    subtitle:"스마트 영양 일기",
    tab_scan:"📷 Сканер",
    tab_manual:"✍️ 수동",
    tab_game:"🎮 게임",
    scan_title:"바코드 스캐너",
    scan_sub:"카메라를 바코드에 향하게 하세요",
    open_cam:"📷 카메라 열기",
    stop:"⏹ 중지",
    searching:"검색 중...",
    found:"발견:",
    not_found:"찾을 수 없음 😔",
    write:"✅ 일기에 추가",
    rescan:"🔄 다시 스캔",
    manual_title:"✍️ 수동",
    name_ph:"예: 닭고기", name_lbl:"食品名", meal_lbl:"食事",
    weight_ph:"200",
    add:"✅ 추가",
    meal_breakfast:"🌅 아침",
    meal_lunch:"☀️ 점심",
    meal_dinner:"🌙 저녁",
    meal_snack:"🍎 간식",
    weight_label:"분량 (g)",
    kcal:"칼로리",
    protein:"단백질",
    fat:"지방",
    carbs:"탄수화물",
    fill_all:"이름과 무게를 입력",
    game:"🎮 게임",
    healthy:"✓ 건강",
    junk:"⚠ 정크",
    wave:"웨이브",
    miss:"놓침!",
    detox:"🍃 디톡스",
    combo_bonus:"💪 콤보!",
    shield_block:"🛡️ 차단됨!",
    game_over_score:"점수:",
    game_over_record:"기록:",
    game_over_combo:"최대 콤보:",
    play:"▶  플레이",
    again:"▶ 다시",
    menu_btn:"◀ 메뉴",
    settings_lbl:"⚙️ 설정",
    back_lbl:"◀ 뒤로",
    location:"🌄 장소",
    character:"👤 캐릭터",
    difficulty:"⚔️ 난이도",
    style_lbl:"스타일",
    color_lbl:"색상",
    gender_m:"👦 남자",
    gender_f:"👧 여자",
    preview:"미리보기",
    diff_easy:"쉬움",
    diff_normal:"보통",
    diff_hard:"어려움",
    diff_desc_easy:"🐢 느림",
    diff_desc_normal:"🎮 표준",
    diff_desc_hard:"🔥 빠름",
    record_lbl:"🏆 기록:",
    how_to:"플레이 방법",
    start_btn:"▶  시작",
    choose_char:"캐릭터 선택",
    choose_loc:"장소 선택",
    lang_toggle:"🇰🇷 KO",
    bg_preview_lbl:["우주","숲","일몰","던전"],
    slot_labels:["모자","머리","셔츠","바지","신발","안경"],
    slot_labels_f:["모자","머리","블라우스","치마","신발","안경"],
    settings_btn:"⚙️ 설정",
    gender_lbl:"성별",
    score_lbl:"점수: ",
    record_lbl2:"기록: ",
    max_combo_lbl:"최대 콤보: x",
    choose_difficulty:"난이도 선택",
    desc_magnet:"건강한 음식을 끌어당김",
    desc_shield:"정크 푸드 하나 차단",
    desc_pill:"지방 20% 제거",
    desc_x2:"점수 2배",
    desc_life:"보너스 생명 (최대 5)",
    desc_detox:"4번째 파도마다 — 건강만!",
    desc_combo:"5연속 = -5% 지방",
    bonus_life:"+❤️ 보너스 생명!",
    minus_weight:"-20% 지방!",
    rare_prefix:"★ 희귀! +",
    catch_food:"잡아라 — 살 빼고 점수 얻기",
    avoid_food:"피해라 — 살찌기",
    powerup_magnet:"🧲 자석",
    powerup_shield:"🛡️ 방패",
    powerup_pill:"💊 알약",
    powerup_x2:"⭐ x2점",
    powerup_life:"❤️ +생명",
    powerup_detox:"🍃 디톡스",
    powerup_combo:"💪 콤보",
    pause_lbl:"⏸ 일시정지",
    resume_lbl:"▶ 계속",
    water_add_200:"💧 +200",
    water_add_300:"💧 +300",
    water_add_500:"💧 +500",
    water_add_custom:"💧 직접입력",
    water_reset:"🗑 초기화",
    water_history_empty:"기록 없음",
    streak_days_lbl:"",
    streak_days_text:"일 연속",
    sync_error:"연결 오류. 봇이 실행 중인지 확인하세요.",
  },
};

// Определяем язык: localStorage → Telegram → navigator
// СНГ языки → ru, остальное → en
const CIS = new Set(["ru","uk","be","kk","uz","hy","az","ka","tg","ky","mn"]);

function applyLang(code) {
  const base = (code||"ru").toLowerCase().split("-")[0].split("_")[0];
  LANG = CIS.has(base) ? "ru" : (MINI_I18N[base] ? base : "en");
  // Мержим: берём en как базу, поверх накладываем выбранный язык
  const baseI18n = CIS.has(base) ? MINI_I18N.ru : MINI_I18N.en;
  i18n = Object.assign({}, baseI18n, MINI_I18N[LANG]||{});
  // Expose on window so other modules (Phase 3E i18n extension) can read current state
  window.LANG = LANG;
  window.i18n = i18n;
}

let LANG = "ru", i18n = MINI_I18N.ru;

(function initLang(){
  // 1. Ручной выбор пользователя — ВЫСШИЙ приоритет
  try {
    const saved = localStorage.getItem("nutrio_lang");
    if(saved){ applyLang(saved); return; }
  } catch(e){}
  // 2. Telegram language_code — для первого запуска
  const tgLang = tg && tg.initDataUnsafe && tg.initDataUnsafe.user && tg.initDataUnsafe.user.language_code;
  if(tgLang){
    applyLang(tgLang);
    try{ localStorage.setItem("nutrio_lang", LANG); }catch(e){}
    return;
  }
  // 3. Язык браузера — fallback
  applyLang(navigator.language || "ru");
})();

function toggleLang(){
  const newLang = LANG==="ru" ? "en" : "ru";
  applyLang(newLang);
  try { localStorage.setItem("nutrio_lang", LANG); } catch(e){}
  applyTranslations();
  // Если в настройках — перерисовываем canvas (игра)
  if(GS && SCREEN==="settings") { /* canvas перерисуется в следующем кадре */ }
}

function applyTranslations(){
  const byId = (id) => document.getElementById(id);
  const set  = (id, val) => { const el=byId(id); if(el) el.textContent=val; };

  // Вкладки
  const setTabLbl = (id, val) => { const btn=byId(id); if(!btn)return; const lbl=btn.querySelector('.tab-lbl'); if(lbl)lbl.textContent=(val||'').replace(/^[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}\uFE0F\u20E3 ]+/u,'').trim(); else btn.textContent=val; };
  setTabLbl("tab-scanner",  i18n.tab_scan || "Сканер");
  setTabLbl("tab-manual",   i18n.tab_manual || "Вручную");
  setTabLbl("tab-water",    i18n.tab_water || "Вода");
  setTabLbl("tab-progress", i18n.tab_progress || "Прогресс");
  setTabLbl("tab-game",     i18n.tab_game || "Игра");
  const langBtn = byId("tab-lang");
  if(langBtn){
    const _F={ru:"🇷🇺",en:"🇬🇧",uk:"🇺🇦",de:"🇩🇪",fr:"🇫🇷",es:"🇪🇸",it:"🇮🇹",pt:"🇧🇷",tr:"🇹🇷",pl:"🇵🇱",kk:"🇰🇿",uz:"🇺🇿",be:"🇧🇾",ar:"🇸🇦",he:"🇮🇱",zh:"🇨🇳",ja:"🇯🇵",ko:"🇰🇷"};
    var _li=langBtn.querySelector(".tab-icon"); if(_li) _li.textContent=_F[LANG]||"🌍"; else langBtn.textContent=_F[LANG] || "🌍";
  }

  // Сканер
  const h2 = document.querySelector(".scanner-hero h2");
  const p  = document.querySelector(".scanner-hero p");
  if(h2) h2.textContent = i18n.scan_title;
  if(p)  p.textContent  = i18n.scan_sub;
  const scanBtn = byId("scan-btn"); if(scanBtn) scanBtn.textContent = i18n.open_cam;
  const stopBtn = byId("stop-btn"); if(stopBtn) stopBtn.innerHTML = i18n.stop;

  // Кнопки действий
  const writeBtn  = document.querySelector("[onclick='saveProduct()']");
  const rescanBtn = document.querySelector("[onclick='resetScanner()']");
  const addBtn    = document.querySelector("[onclick='sendManual()']");
  if(writeBtn)  writeBtn.textContent  = i18n.write;
  if(rescanBtn) rescanBtn.textContent = i18n.rescan;
  if(addBtn)    addBtn.textContent    = i18n.add;

  // Приёмы пищи в select
  // Only translate meal selects (not settings selects)
  const MEAL_SELECT_IDS = ["manual-meal","diary-add-meal","mf-use-meal","calc-meal-select"];
  document.querySelectorAll("select").forEach(sel => {
    if (!MEAL_SELECT_IDS.includes(sel.id)) return;  // skip settings selects
    const keys = ["meal_breakfast","meal_lunch","meal_dinner","meal_snack"];
    sel.querySelectorAll("option").forEach((opt,idx) => { if(keys[idx]) opt.textContent = i18n[keys[idx]]; });
  });

  // КБЖУ метки
  const labels = document.querySelectorAll(".macro-label");
  const macroKeys = ["kcal","protein","fat","carbs"];
  labels.forEach((el,i) => { if(macroKeys[i]) el.textContent = i18n[macroKeys[i]]; });

  // Плейсхолдеры и лейблы
  const nameInput   = byId("manual-name");   if(nameInput)   nameInput.placeholder   = i18n.name_ph;
  const weightInput = byId("weight-input");  if(weightInput) weightInput.placeholder = i18n.weight_ph;
  const wl = document.querySelector("label[for='weight-input']");
  if(wl) wl.textContent = i18n.weight_label;
  // Settings button under game
  const sbl = byId("settings-btn-lbl");
  if(sbl) sbl.textContent = LANG==="ru"?"Настройки":"Settings";
  var _sub = document.getElementById("app-subtitle"); if(_sub) _sub.textContent = i18n.subtitle||(CIS.has(LANG)?"Умный дневник питания":"Smart nutrition diary");

  // ── Вода ──────────────────────────────────────────────────────
  var _u = i18n.water_unit||"мл";
  var _ul = i18n.water_unit_l||"л";
  var _wt = document.getElementById("lbl-water-title");
  if(_wt) _wt.textContent = i18n.water_title||"Water";
  document.querySelectorAll(".wunit").forEach(function(el){ el.textContent=" "+_u; });
  document.querySelectorAll(".wunit-l").forEach(function(el){ el.textContent=" "+_ul; });
  var _wcp = document.getElementById("water-custom");
  if(_wcp) _wcp.placeholder = i18n.water_custom_ph||_u;
  var _wgl = document.getElementById("water-goal-lbl");
  if(_wgl) _wgl.textContent = (i18n.water_goal_lbl||"goal: ")+(typeof waterGoal!=="undefined"?waterGoal:2000)+" "+_u;
  // Кнопки добавления воды — обновляем единицы измерения
  var _wbtns = document.querySelectorAll(".water-btn-ml");
  _wbtns.forEach(function(btn){
    var ml = btn.getAttribute("data-ml");
    if(ml) btn.innerHTML = "💧 +" + ml + " <span class=\"wunit\">" + _u + "</span>";
  });
  var _wHistTitle = document.getElementById("water-history-title");
  if(_wHistTitle) _wHistTitle.textContent = i18n.water_history||"Today\'s log:";
  var _wHistEmpty = document.getElementById("water-history-empty");
  if(_wHistEmpty) _wHistEmpty.textContent = i18n.water_history_empty||"No entries yet";

  // ── Прогресс ───────────────────────────────────────────────────
  var _s2 = function(id,v){ var e=document.getElementById(id); if(e) e.textContent=v; };
  _s2("lbl-progress-title", i18n.progress_title||"Progress");
  _s2("today-kcal-title",   i18n.today_lbl||"TODAY");
  _s2("lbl-kcal",           i18n.kcal_lbl||"KCAL");
  _s2("lbl-prot",           i18n.prot_lbl||"PROTEIN");
  _s2("lbl-fat",            i18n.fat_lbl||"FAT");
  _s2("lbl-carb",           i18n.carb_lbl||"CARBS");
  _s2("achievements-title", i18n.achievements_lbl||"ACHIEVEMENTS");
  _s2("achievements-placeholder", i18n.no_data_yet||"No data yet");
  _s2("streak-label",       i18n.days_row||"days in a row");
  _s2("lbl-manual-title",  i18n.manual_title||"✍️ Вручную");
  _s2("lbl-manual-name",   i18n.name_ph ? "Название продукта" : "Food name");
  _s2("lbl-manual-weight", i18n.weight_label||"Вес (г)");
  _s2("lbl-manual-meal",   "Приём пищи");
  _s2("opt-breakfast", i18n.meal_breakfast||"🌅 Завтрак");
  _s2("opt-lunch",     i18n.meal_lunch||"☀️ Обед");
  _s2("opt-dinner",    i18n.meal_dinner||"🌙 Ужин");
  _s2("opt-snack",     i18n.meal_snack||"🍎 Перекус");
  _s2("lbl-manual-add", i18n.add||"✅ Добавить");
  // manual placeholder
  var _mn = document.getElementById("manual-name");
  if(_mn) _mn.placeholder = i18n.name_ph||"Например: Курица";
  _s2("lbl-manual-title",  i18n.manual_title||"✍️ Вручную");
  _s2("lbl-manual-name",   i18n.name_lbl||i18n.manual_name_lbl||"Название продукта");
  _s2("lbl-manual-weight", i18n.weight_label||"Вес (г)");
  _s2("lbl-manual-meal",   i18n.meal_lbl||i18n.manual_meal_lbl||"Приём пищи");
  _s2("opt-breakfast", i18n.meal_breakfast||"🌅 Завтрак");
  _s2("opt-lunch",     i18n.meal_lunch||"☀️ Обед");
  _s2("opt-dinner",    i18n.meal_dinner||"🌙 Ужин");
  _s2("opt-snack",     i18n.meal_snack||"🍎 Перекус");
  _s2("lbl-manual-add", i18n.add||"✅ Добавить");
  var _mn=document.getElementById("manual-name"); if(_mn) _mn.placeholder=i18n.name_ph||"Например: Курица";
  _s2("sync-btn",           i18n.load_data_btn||"🔄 Load data from bot");
  _s2("progress-note",      i18n.sync_note||"Open bot and tap Progress");
  // Phase 3E — always refresh Phase 2-3 labels (rings, sheets, archive, charts, help, theme picker)
  try { if (typeof window._applyT3 === 'function') window._applyT3(); } catch(e){ console.warn('_applyT3 failed:', e); }
}

// Запускаем переводы + вешаем кнопку языка когда DOM готов
// Language picker modal
const LANG_FLAGS = {
  ru:'🇷🇺 Русский', en:'🇬🇧 English', uk:'🇺🇦 Українська',
  de:'🇩🇪 Deutsch', fr:'🇫🇷 Français', es:'🇪🇸 Español',
  it:'🇮🇹 Italiano', pt:'🇧🇷 Português', tr:'🇹🇷 Türkçe',
  pl:'🇵🇱 Polski', kk:'🇰🇿 Қазақша', uz:"🇺🇿 O'zbek",
  be:'🇧🇾 Беларуская', ar:'🇸🇦 العربية', he:'🇮🇱 עברית',
  zh:'🇨🇳 中文', ja:'🇯🇵 日本語', ko:'🇰🇷 한국어',
};

function showLangPicker(){
  let modal = document.getElementById('lang-modal');
  if(!modal){
    modal = document.createElement('div');
    modal.id = 'lang-modal';
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:9999;display:flex;align-items:center;justify-content:center;';
    const box = document.createElement('div');
    box.style.cssText = 'background:#1a1a2e;border-radius:16px;padding:16px;max-width:320px;width:90%;max-height:80vh;overflow-y:auto;';
    const title = document.createElement('p');
    title.style.cssText = 'color:#ffe066;font-weight:700;text-align:center;margin:0 0 12px;font-size:16px;';
    title.textContent = '🌍 Choose language';
    box.appendChild(title);
    Object.entries(LANG_FLAGS).forEach(([code, label]) => {
      const btn = document.createElement('button');
      btn.style.cssText = 'width:100%;background:#223;border:none;color:#eee;padding:10px 14px;border-radius:8px;margin-bottom:6px;text-align:left;font-size:14px;cursor:pointer;';
      btn.textContent = label;
      btn.addEventListener('click', () => {
        applyLang(code);
        try{ localStorage.setItem('nutrio_lang', LANG); }catch(e){}
        applyTranslations();
        document.body.removeChild(modal);
      });
      box.appendChild(btn);
    });
    const close = document.createElement('button');
    close.style.cssText = 'width:100%;background:#334;border:none;color:#aaa;padding:10px;border-radius:8px;cursor:pointer;margin-top:4px;';
    close.textContent = '✕ Close';
    close.addEventListener('click', () => document.body.removeChild(modal));
    box.appendChild(close);
    modal.appendChild(box);
  }
  document.body.appendChild(modal);
}

  // ── Вода (если вкладка уже открыта) ─────────────────────────
  var _gi = function(id){ return document.getElementById(id); };
  var _u  = i18n.water_unit||'мл';
  var _ul = i18n.water_unit_l||'л';
  var _wt2 = _gi('lbl-water-title');
  if(_wt2) _wt2.textContent = i18n.water_title||'Water';
  document.querySelectorAll('.wunit').forEach(function(el){ el.textContent=' '+_u; });
  document.querySelectorAll('.wunit-l').forEach(function(el){ el.textContent=' '+_ul; });
  var _wcp = _gi('water-custom');
  if(_wcp) _wcp.placeholder = _u;
  var _wgl2 = _gi('water-goal-lbl');
  if(_wgl2) _wgl2.textContent = (i18n.water_goal_lbl||'goal: ')+(typeof waterGoal!=='undefined'?waterGoal:2000)+' '+_u;
  // ── Прогресс (если вкладка уже открыта) ───────────────────────
  var _spp = function(id,v){ var e=_gi(id); if(e) e.textContent=v; };
  _spp('lbl-progress-title', i18n.progress_title||'Progress');
  _spp('today-kcal-title',   i18n.today_lbl||'TODAY');
  _spp('lbl-kcal',           i18n.kcal_lbl||'KCAL');
  _spp('lbl-prot',           i18n.prot_lbl||'PROTEIN');
  _spp('lbl-fat',            i18n.fat_lbl||'FAT');
  _spp('lbl-carb',           i18n.carb_lbl||'CARBS');
  _spp('achievements-title', i18n.achievements_lbl||'ACHIEVEMENTS');
  _spp('achievements-placeholder', i18n.no_data_yet||'No data yet');
  _spp('streak-label',       i18n.days_row||'days in a row');
  _spp('sync-btn',           i18n.load_data_btn||'🔄 Load data from bot');
  _spp('progress-note',      i18n.sync_note||'Open bot and tap Progress');

function _initUI(){
  applyTranslations();
}
if(document.readyState === "loading"){
  document.addEventListener("DOMContentLoaded", _initUI);
} else {
  _initUI();
}


let currentProduct = null;
let stream = null;
let detecting = false;
let animFrame = null;

function switchTab(tab) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const tabBtn = document.getElementById('tab-' + tab);
  if (tabBtn) tabBtn.classList.add('active');
  const page = document.getElementById('page-' + tab);
  if (page) page.classList.add('active');
  if (tab !== 'scanner') stopScanner();
  if (tab === 'scanner')  refreshPhotoQuota();
  if (tab === 'game')     setTimeout(initGame, 100);
  if (tab === 'water')    initWaterPage();
  if (tab === 'progress') initProgressPage();
  if (tab === 'diary')    initDiaryPage();
  if (tab === 'calc')     initCalcPage();
  if (tab === 'myfoods')  initMyFoodsPage();
  if (tab === 'statpage') initStatPage();
  if (tab === 'aipage')   initAiPage();
  if (tab === 'micropage') initMicroPage();
  if (tab === 'lbpage')   initLbPage();
  if (tab === 'pdfpage')   initPdfPage();
  if (tab === 'importpage') initImportPage();
  if (tab === 'settingspage') initSettingsPage();
  if (tab === 'prempage')     initPremPage();
  if (tab === 'helppage')     initHelpPage();
  if (tab === 'healthsync'){ if (typeof initHealthSyncPage === 'function') initHealthSyncPage(); }
  if (tab === 'aichat')     { if (typeof initAiChatPage === 'function') initAiChatPage(); }
  if (tab === 'exercise')   { if (typeof initExercisePage === 'function') initExercisePage(); }
  if (tab === 'fast')       { if (typeof initFastPage === 'function') initFastPage(); }
  if (tab === 'healthscore'){ if (typeof initHealthScorePage === 'function') initHealthScorePage(); }
  if (tab === 'adminpage')   initAdminPage();
  // Применяем переводы после инициализации страницы
  applyTranslations();
}

function showToast(msg, color) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.style.background = color || 'var(--green)';
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

function setStatus(type, text) {
  const area = document.getElementById('status-area');
  if (!text) { area.innerHTML = ''; return; }
  area.innerHTML = `<div class="status-badge status-${type}"><div class="status-dot"></div>${text}</div>`;
}


function stopScanner() { if(typeof scanStop==='function') scanStop(); }


async function lookupBarcode(code) {
  setStatus('scanning', `🔍 ${i18n.searching||'Поиск...'}`);

  // 1. Open Food Facts (международная)
  let product = await tryOpenFoodFacts(code);
  // 2. UPC Item DB
  if (!product) product = await tryUPCItemDB(code);
  // 3. Наша база 5.7M штрихкодов через бот API
  if (!product) product = await tryBotBarcodeDB(code);

  if (!product) {
    _scanSetStatus('Штрихкод ' + code + ' не найден 😔');
    document.getElementById('scan-start-btn').style.display = 'block';
    document.getElementById('scan-stop-btn').style.display  = 'none';
    return;
  }

  // Show result using new UI
  _onBarcodeFound({
    name:     product.name,
    calories: product.cal,
    protein:  product.prot,
    fat:      product.fat,
    carbs:    product.carb
  });
}

function parseOFFProduct(data) {
  if (data.status !== 1) return null;
  const p = data.product;
  const n = p.nutriments || {};
  const name = p.product_name_ru || p.product_name_en || p.product_name || '';
  if (!name) return null;
  let cal = n['energy-kcal_100g'] || (n['energy_100g'] ? n['energy_100g'] / 4.184 : 0);
  return {
    name: name.trim(),
    cal: Math.round(cal),
    prot: Math.round((n['proteins_100g'] || 0) * 10) / 10,
    fat: Math.round((n['fat_100g'] || 0) * 10) / 10,
    carb: Math.round((n['carbohydrates_100g'] || 0) * 10) / 10,
  };
}

async function tryOpenFoodFacts(code) {
  // Сначала русский сервер — больше РФ/СНГ продуктов
  const urls = [
    `https://ru.openfoodfacts.org/api/v0/product/${code}.json`,
    `https://world.openfoodfacts.org/api/v0/product/${code}.json`,
  ];
  for (const url of urls) {
    try {
      const res = await fetch(url);
      const data = await res.json();
      const product = parseOFFProduct(data);
      if (product) return product;
    } catch(e) {}
  }
  return null;
}

async function tryUPCItemDB(code) {
  try {
    const res = await fetch(`https://api.upcitemdb.com/prod/trial/lookup?upc=${code}`);
    const data = await res.json();
    if (data.code !== 'OK' || !data.items?.length) return null;
    const item = data.items[0];
    const name = item.title || item.brand || '';
    if (!name) return null;
    // UPCItemDB не всегда даёт КБЖУ — ставим 0, юзер сам введёт
    const n = item.nutrition || {};
    return {
      name: name.trim(),
      cal: Math.round(n.calories || 0),
      prot: Math.round((n.protein || 0) * 10) / 10,
      fat: Math.round((n.fat || 0) * 10) / 10,
      carb: Math.round((n.carbohydrate || 0) * 10) / 10,
    };
  } catch(e) { return null; }
}

async function tryBotBarcodeDB(code) {
  try {
    const userId = tg && tg.initDataUnsafe && tg.initDataUnsafe.user && tg.initDataUnsafe.user.id;
    const apiBase = (window.API_BASE || '/api/proxy');
    const res = await fetch(`${apiBase}/api/barcode?code=${code}&user_id=${userId||0}`, {
      signal: AbortSignal.timeout(8000)
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.name) return null;
    return {
      name: data.name,
      cal: data.calories || 0,
      prot: data.protein || 0,
      fat: data.fat || 0,
      carb: data.carbs || 0,
    };
  } catch(e) { return null; }
}

function adjustWeight(delta) {
  const inp = document.getElementById('weight-input');
  inp.value = Math.max(1, parseInt(inp.value || 100) + delta);
}

function saveProduct() {
  if (!currentProduct) return;
  const weight = parseInt(document.getElementById('weight-input').value) || 100;
  const meal = document.getElementById('meal-select-scanner').value;
  const ratio = weight / 100;

  // Если КБЖУ известно — сохраняем напрямую, иначе отдаём боту на расчёт через AI
  const hasNutrition = currentProduct.cal > 0;
  const data = hasNutrition ? {
    action: 'add_food',
    food_name: currentProduct.name,
    meal_type: meal,
    weight: weight,
    calories: Math.round(currentProduct.cal * ratio * 10) / 10,
    protein: Math.round(currentProduct.prot * ratio * 10) / 10,
    fat: Math.round(currentProduct.fat * ratio * 10) / 10,
    carbs: Math.round(currentProduct.carb * ratio * 10) / 10,
  } : {
    action: 'add_manual',
    food_name: currentProduct.name,
    meal_type: meal,
    weight: weight,
  };

  // Save via direct HTTP webhook — works for both KeyboardButton and InlineKeyboardButton openings,
  // unlike tg.sendData() which only delivers from KeyboardButton-launched Mini Apps.
  var uid = getUserId();
  if (!uid) { showToast((typeof T==='function'?T('save_food_open_tg','Открой из Telegram'):'Открой из Telegram'), 'var(--accent2)'); return; }
  var payload = {
    user_id:   uid,
    food_name: data.food_name,
    meal_type: data.meal_type,
    weight:    data.weight,
    calories:  data.calories || 0,
    protein:   data.protein  || 0,
    fat:       data.fat      || 0,
    carbs:     data.carbs    || 0,
  };
  fetch((window.API_BASE || '/api/proxy') + '/api/save_food', {
    method: 'POST',
    headers: (window._authHeaders?window._authHeaders({'Content-Type':'application/json'}):{'Content-Type':'application/json'}),
    body: JSON.stringify(payload),
  }).then(function(r){ return r.json().catch(function(){ return {}; }); })
    .then(function(resp){
      if (resp && resp.ok) {
        showToast('✅ ' + currentProduct.name + ' ' + weight + (LANG==='ru'?'г':'g') + ' ' + (i18n.write || 'saved') + '!', 'var(--green)');
        try { if (window.Telegram && Telegram.WebApp && Telegram.WebApp.HapticFeedback) Telegram.WebApp.HapticFeedback.notificationOccurred('success'); } catch(e){}
        // Optional secondary signal for legacy KeyboardButton flow — same payload
        try { if (tg && tg.sendData) tg.sendData(JSON.stringify(data)); } catch(e){}
        // Reset scanner UI
        try { resetScanner(); } catch(e){}
        // Refresh diary if currently open
        try { if (typeof loadDiary === 'function') loadDiary(); } catch(e){}
      } else {
        showToast('Ошибка: ' + ((resp && resp.error) || 'не удалось сохранить'), 'var(--accent2)');
      }
    })
    .catch(function(e){
      showToast('Ошибка соединения: ' + e.message, 'var(--accent2)');
    });
}

function resetScanner() { if(typeof scanReset==='function') scanReset(); }



// ════════════════════════════════════════════
// SCANNER — clean rewrite
// ════════════════════════════════════════════
var _scanMode    = 'barcode'; // 'barcode' | 'photo'
var _scanCapturing = false;
var _scanStream  = null;
var _scanActive  = false;
var _scanData    = null;     // last barcode result data
var photoResultData = null;  // last photo result data

function scanSetMode(mode) {
  _scanMode = mode;
  var bb = document.getElementById('scan-mode-barcode');
  var pb = document.getElementById('scan-mode-photo');
  if (bb) { bb.style.background = mode==='barcode'?'var(--accent)':'transparent'; bb.style.color = mode==='barcode'?'#fff':'var(--text2)'; }
  if (pb) { pb.style.background = mode==='photo'  ?'var(--accent)':'transparent'; pb.style.color = mode==='photo'  ?'#fff':'var(--text2)'; }
  scanReset();
}

function scanStart() {
  if (_scanMode === 'barcode') _scanStartBarcode();
  else _scanStartPhoto();
}

function scanStop() {
  _scanActive = false;
  // Stop stream
  if (_scanStream) { _scanStream.getTracks().forEach(function(t){t.stop();}); _scanStream = null; }
  var v = document.getElementById('scan-video'); if(v) v.srcObject = null;
  // Stop ZXing safely
  try { if (window._zxReader) window._zxReader.reset(); } catch(e) {}
  if (_barcodeAnimFrame) { cancelAnimationFrame(_barcodeAnimFrame); _barcodeAnimFrame=null; }
  // UI
  var wrap = document.getElementById('scan-camera-wrap');   if(wrap) wrap.style.display='none';
  var qrt2 = document.getElementById('scan-qr-target'); if(qrt2) qrt2.style.display='none';
  var startBtn = document.getElementById('scan-start-btn'); if(startBtn) startBtn.style.display='block';
  var sh3=document.getElementById('scan-hero'); if(sh3) sh3.style.display='block';
  var stopBtn  = document.getElementById('scan-stop-btn');  if(stopBtn)  stopBtn.style.display='none';
  var overlay  = document.getElementById('scan-barcode-overlay'); if(overlay) overlay.style.display='none';
  var photoCtrl = document.getElementById('scan-photo-ctrl'); if(photoCtrl) photoCtrl.style.display='none';
  _scanSetStatus('');
}

function scanReset() {
  scanStop();
  document.getElementById('scan-barcode-result').style.display = 'none';
  document.getElementById('scan-photo-result').style.display   = 'none';
  _scanData = null; photoResultData = null;
}

function _scanSetStatus(msg) {
  var el = document.getElementById('scan-status');
  if (el) el.textContent = msg;
}

// ── BARCODE ──────────────────────────────────────────────────────
// ── BARCODE ──────────────────────────────────────────────────────
var _barcodeAnimFrame = null;

function _scanStartBarcode() {
  _scanActive = true;
  var wrap = document.getElementById('scan-camera-wrap');
  if (wrap) wrap.style.display = 'block';
  document.getElementById('scan-start-btn').style.display = 'none';
  document.getElementById('scan-stop-btn').style.display  = 'block';
  document.getElementById('scan-barcode-result').style.display = 'none';
  document.getElementById('scan-photo-ctrl').style.display     = 'none';
  var sh = document.getElementById('scan-hero'); if(sh) sh.style.display='none';
  _scanSetStatus('📷 Наведи камеру на штрихкод...');

  var video = document.getElementById('scan-video');
  if (video) video.style.display = 'block';
  var qrTarget = document.getElementById('scan-qr-target');
  if (qrTarget) qrTarget.style.display = 'none';

  if (_scanStream) { _scanStream.getTracks().forEach(function(t){t.stop();}); _scanStream=null; }
  if (video) video.srcObject = null;
  try { if (window._zxReader) window._zxReader.reset(); } catch(e) {}
  if (_barcodeAnimFrame) { cancelAnimationFrame(_barcodeAnimFrame); _barcodeAnimFrame=null; }

  navigator.mediaDevices.getUserMedia({
    video: {
      facingMode: {ideal:'environment'},
      aspectRatio: {ideal: 4/3},
      width:  {ideal: 1280},
      height: {ideal: 960},
      advanced: [
        { focusMode: 'continuous' },
        { focusDistance: 0.20 },
        { whiteBalanceMode: 'continuous' },
        { exposureMode: 'continuous' }
      ]
    }
  }).then(function(s) {
    // Apply additional track constraints once track exists (some browsers ignore advanced[] in getUserMedia)
    try {
      var trk = s.getVideoTracks && s.getVideoTracks()[0];
      var caps = trk && trk.getCapabilities ? trk.getCapabilities() : {};
      var apply = {};
      if (caps.focusMode && caps.focusMode.indexOf && caps.focusMode.indexOf('continuous') >= 0) apply.focusMode = 'continuous';
      if (caps.exposureMode && caps.exposureMode.indexOf && caps.exposureMode.indexOf('continuous') >= 0) apply.exposureMode = 'continuous';
      if (caps.whiteBalanceMode && caps.whiteBalanceMode.indexOf && caps.whiteBalanceMode.indexOf('continuous') >= 0) apply.whiteBalanceMode = 'continuous';
      if (Object.keys(apply).length && trk.applyConstraints) trk.applyConstraints({ advanced: [apply] }).catch(function(){});
    } catch(e){}
    _scanStream = s;
    if (!_scanActive) { s.getTracks().forEach(function(t){t.stop()}); return; }
    video.srcObject = s;
    video.play();
    var overlay = document.getElementById('scan-barcode-overlay');
    if (overlay) overlay.style.display = 'flex';

    video.addEventListener('loadedmetadata', function onMeta() {
      video.removeEventListener('loadedmetadata', onMeta);
      if ('BarcodeDetector' in window) {
        try {
          var detector = new BarcodeDetector({formats:['ean_13','ean_8','upc_a','upc_e','code_128','code_39']});
          _scanWithDetector(detector, video);
        } catch(e) { _scanWithZXing(video); }
      } else {
        _scanWithZXing(video);
      }
    }, {once: true});
    // If already loaded
    if (video.readyState >= 2) {
      if ('BarcodeDetector' in window) {
        try {
          var det2 = new BarcodeDetector({formats:['ean_13','ean_8','upc_a','upc_e','code_128','code_39']});
          _scanWithDetector(det2, video);
        } catch(e) { _scanWithZXing(video); }
      } else { _scanWithZXing(video); }
    }
  }).catch(function(e) {
    showToast((typeof T==='function'?T('scan_camera_denied','Нет доступа к камере'):'Нет доступа к камере') + ': ' + e.message, 'var(--accent2)');
    scanStop();
  });
}

function _scanWithDetector(detector, video) {
  if (!_scanActive) return;
  detector.detect(video).then(function(codes) {
    if (!_scanActive) return;
    if (codes && codes.length > 0) {
      var code = codes[0].rawValue;
      if (code && code.length >= 6) {
        _scanActive = false;
        if (_barcodeAnimFrame) { cancelAnimationFrame(_barcodeAnimFrame); _barcodeAnimFrame=null; }
        _scanSetStatus('🔍 ' + code);
        lookupBarcode(code);
        return;
      }
    }
    _barcodeAnimFrame = requestAnimationFrame(function(){ _scanWithDetector(detector, video); });
  }).catch(function() {
    _barcodeAnimFrame = requestAnimationFrame(function(){ _scanWithDetector(detector, video); });
  });
}

function _scanWithZXing(video) {
  // Prefer native BarcodeDetector if available; this function is the fallback.
  if (typeof ZXingBrowser === 'undefined') {
    showToast((typeof T==='function'?T('scan_not_loaded','Сканер не загружен, попробуй ещё раз'):'Сканер не загружен, попробуй ещё раз'), 'var(--accent2)');
    return;
  }
  try {
    var ZX = ZXingBrowser;
    // Lazy-create reader
    if (!window._zxReader) {
      var fmts = [];
      try {
        var BF = ZX.BarcodeFormat;
        fmts = [BF.EAN_13, BF.EAN_8, BF.UPC_A, BF.UPC_E, BF.CODE_128, BF.CODE_39, BF.ITF];
      } catch(e) {}
      var hints = new Map();
      try { hints.set(ZX.DecodeHintType.POSSIBLE_FORMATS, fmts); } catch(e) {}
      try { hints.set(ZX.DecodeHintType.TRY_HARDER, true); } catch(e) {}
      window._zxReader = new ZX.BrowserMultiFormatReader(hints, 250);
    }
    var reader = window._zxReader;
    // Stop any prior session
    try { reader.reset(); } catch(e) {}
    reader.decodeFromVideoElement(video, function(result, err){
      if (!_scanActive) return;
      if (result) {
        var code = (result.getText && result.getText()) || result.text || '';
        if (code && String(code).length >= 6) {
          _scanActive = false;
          try { reader.reset(); } catch(e) {}
          _scanSetStatus('🔍 ' + code);
          lookupBarcode(code);
        }
      }
      // err is NotFoundException on each empty frame — ignore.
    }).catch(function(e){
      console.warn('zxing decodeFromVideoElement failed', e);
    });
  } catch(e) {
    showToast((typeof T==='function'?T('scan_init_error','Ошибка инициализации сканера'):'Ошибка инициализации сканера'), 'var(--accent2)');
    console.error(e);
  }
}

// ── PHOTO ────────────────────────────────────────────────────────
function _scanStartPhoto() {
  _scanActive = true;
  var wrap = document.getElementById('scan-camera-wrap');
  if (wrap) wrap.style.display = 'block';
  document.getElementById('scan-start-btn').style.display  = 'none';
  document.getElementById('scan-stop-btn').style.display   = 'block';
  document.getElementById('scan-photo-result').style.display = 'none';
  var sh2=document.getElementById('scan-hero'); if(sh2) sh2.style.display='none';
  document.getElementById('scan-barcode-overlay').style.display = 'none';
  _scanSetStatus('');

  var video = document.getElementById('scan-video');
  if (video) video.style.display = 'block';
  var qrt = document.getElementById('scan-qr-target');
  if (qrt) qrt.style.display = 'none';

  if (_scanStream) { _scanStream.getTracks().forEach(function(t){t.stop();}); _scanStream=null; }
  if (video) video.srcObject = null;

  var camConstraints = {
    facingMode: {ideal: 'environment'},
    aspectRatio: {ideal: 4/3},
    width: {min: 640, ideal: 1920},
    height: {min: 480, ideal: 1440}
  };
  navigator.mediaDevices.getUserMedia({ video: camConstraints }).then(function(s) {
    // Check if ultrawide was selected and try to avoid it
    var track = s.getVideoTracks()[0];
    if (track) {
      var settings = track.getSettings();
      // If aspect ratio is too wide (16:9 or wider), try to apply 4:3 constraint
      if (settings.width && settings.height && settings.width/settings.height > 1.5) {
        try { track.applyConstraints({ aspectRatio: {ideal: 4/3} }); } catch(e) {}
      }
    }
    _scanStream = s;
    if (!_scanActive) { s.getTracks().forEach(function(t){t.stop();}); return; }
    video.srcObject = s;
    video.play();
    document.getElementById('scan-photo-ctrl').style.display = 'block';
    // Wait until frame is actually available before allowing capture; retry only if truly stuck
    var _photoReadyChecked = false;
    var _photoReadyCheck = function() {
      if (_photoReadyChecked || !_scanStream) return;
      if (video.videoWidth > 0 && video.videoHeight > 0) {
        _photoReadyChecked = true;
        return;
      }
      // Still 0×0 after >4s → really broken, restart once
      setTimeout(function() {
        if (_photoReadyChecked || _scanCapturing) return;
        if (_scanStream && video.videoWidth === 0) {
          _scanStream.getTracks().forEach(function(t){t.stop();}); _scanStream=null;
          video.srcObject = null;
          _scanStartPhoto();
        }
      }, 4000);
    };
    if (video.readyState >= 2) _photoReadyCheck();
    else video.addEventListener('loadedmetadata', _photoReadyCheck, { once: true });
  }).catch(function(e) {
    showToast('Нет доступа к камере: ' + e.message, 'var(--accent2)');
    scanStop();
  });
}

function _scanCaptureSend(b64, video) {
  var captureBtn = document.getElementById('scan-photo-ctrl');
  _scanSetStatus('⏳ Анализирую...');
  if (captureBtn) captureBtn.style.display = 'none';

  var userId = typeof getUserId === 'function' ? getUserId() : null;
  if (!userId) { try { userId = new URLSearchParams(window.location.search).get('user_id') || localStorage.getItem('nutrio_user_id'); } catch(e){} }

  var apiBase = (window.API_BASE || '/api/proxy');
  fetch(apiBase + '/api/photo', {
    method: 'POST', headers: (window._authHeaders?window._authHeaders({'Content-Type':'application/json'}):{'Content-Type':'application/json'}),
    body: JSON.stringify({user_id: userId||0, image: b64, meal_type:'другое', save: false})
  }).then(function(r){ return r.json().then(function(j){ j._status = r.status; return j; }); })
    .then(function(d) {
      _scanSetStatus('');
      // Лимит фото исчерпан (HTTP 402)
      if (d.error === 'photo_limit' || d._status === 402) {
        _scanCapturing = false;
        try { video.play(); } catch(e) {}
        if (captureBtn) captureBtn.style.display = 'block';
        if (typeof showPhotoLimitModal === 'function') showPhotoLimitModal();
        else showToast('На сегодня лимит фото исчерпан. Открой Premium для безлимита.', 'var(--accent2)');
        return;
      }
      // Обновляем счётчик в UI если бэк прислал quota
      if (d.quota && typeof updatePhotoQuotaUI === 'function') updatePhotoQuotaUI(d.quota);
      if (d.error || d.name === 'unknown') {
        showToast((typeof T==='function'?T('scan_unknown','❌ Не удалось распознать. Попробуй ещё раз'):'❌ Не удалось распознать. Попробуй ещё раз'), 'var(--accent2)');
        _scanCapturing = false;
        try { video.play(); } catch(e) {}
        if (captureBtn) captureBtn.style.display = 'block';
        _scanSetStatus('');
        return;
      }
      if (_scanStream) { _scanStream.getTracks().forEach(function(t){t.stop();}); _scanStream=null; }
      video.srcObject = null;
      document.getElementById('scan-camera-wrap').style.display = 'none';
      document.getElementById('scan-stop-btn').style.display    = 'none';
      document.getElementById('scan-start-btn').style.display   = 'block';
      var name = (d.name||'').charAt(0).toUpperCase() + (d.name||'').slice(1);
      var w0 = d.weight || 100;
      // Сохраняем КБЖУ на 100г для пересчёта при изменении порции
      var ratio0 = w0 / 100;
      photoResultData = {
        name: name, weight: w0,
        calories: d.calories, protein: d.protein, fat: d.fat, carbs: d.carbs,
        cal100: d.calories / ratio0, prot100: d.protein / ratio0,
        fat100: d.fat / ratio0, carbs100: d.carbs / ratio0,
      };
      document.getElementById('scan-pr-name').textContent = name;
      document.getElementById('scan-pr-weight').value = w0;
      document.getElementById('scan-pr-cal').textContent  = d.calories;
      document.getElementById('scan-pr-prot').textContent = d.protein;
      document.getElementById('scan-pr-fat').textContent  = d.fat;
      document.getElementById('scan-pr-carb').textContent = d.carbs;
      document.getElementById('scan-photo-result').style.display = 'block';
      var _h = new Date().getHours();
      var _am = _h<10?'завтрак':_h<14?'обед':_h<18?'обед':_h<21?'ужин':'перекус';
      var _ms = document.getElementById('scan-pr-meal'); if(_ms) _ms.value = _am;
      _scanCapturing = false;
    })
    .catch(function(e) {
      _scanSetStatus('');
      _scanCapturing = false;
      try { video.play(); } catch(ex) {}
      showToast((typeof T==='function'?T('scan_conn_error','❌ Ошибка соединения'):'❌ Ошибка соединения'), 'var(--accent2)');
      if (captureBtn) captureBtn.style.display = 'block';
    });
}

function scanCapture() {
  var video = document.getElementById('scan-video');
  if (!video || !_scanStream) { showToast((typeof T==='function'?T('scan_camera_off','Камера не запущена'):'Камера не запущена'), 'var(--accent2)'); return; }
  if (!video.videoWidth || !video.videoHeight) { showToast((typeof T==='function'?T('scan_warming_up','Подожди, камера ещё запускается'):'Подожди, камера ещё запускается'), 'var(--accent2)'); return; }
  _scanCapturing = true;
  // Grab the freshest frame; rVFC if available gives us a frame that is guaranteed painted
  var doGrab = function() {
    var canvas = document.createElement('canvas');
    canvas.width  = video.videoWidth  || 1280;
    canvas.height = video.videoHeight || 960;
    try { canvas.getContext('2d').drawImage(video, 0, 0); }
    catch(e) { _scanCapturing = false; showToast((typeof T==='function'?T('scan_capture_fail','Не удалось снять кадр'):'Не удалось снять кадр'), 'var(--accent2)'); return; }
    var b64 = canvas.toDataURL('image/jpeg', 0.92).split(',')[1];
    try { video.pause(); } catch(e) {}
    _scanCaptureSend(b64, video);
  };
  if (typeof video.requestVideoFrameCallback === 'function') {
    video.requestVideoFrameCallback(function(){ doGrab(); });
  } else {
    doGrab();
  }
}

function scanPhotoSave() {
  if (!photoResultData) return;
  var userId = typeof getUserId === 'function' ? getUserId() : null;
  if (!userId) { showToast('❌ Открой из Telegram', 'var(--accent2)'); return; }
  var meal = document.getElementById('scan-pr-meal');
  var apiBase = (window.API_BASE || '/api/proxy');
  fetch(apiBase + '/api/manual', {
    method: 'POST', headers: (window._authHeaders?window._authHeaders({'Content-Type':'application/json'}):{'Content-Type':'application/json'}),
    body: JSON.stringify({user_id:userId, food_name:photoResultData.name,
      meal_type:(meal&&meal.value)||'другое', weight:photoResultData.weight,
      calories:photoResultData.calories, protein:photoResultData.protein,
      fat:photoResultData.fat, carbs:photoResultData.carbs})
  }).then(function(r){ return r.json(); })
    .then(function(d){ if(d.ok){showToast('✅ Записано!','var(--green)'); scanReset();} else showToast('❌'+(d.error||'Ошибка'),'var(--accent2)'); })
    .catch(function(){ showToast('❌ Ошибка подключения','var(--accent2)'); });
}

function scanBrSave() {
  if (!_scanData) return;
  var userId = typeof getUserId === 'function' ? getUserId() : null;
  if (!userId) { showToast('❌ Открой из Telegram', 'var(--accent2)'); return; }
  var w    = parseFloat(document.getElementById('scan-br-weight').value) || 100;
  var meal = document.getElementById('scan-br-meal');
  var factor = w / 100;
  var apiBase = (window.API_BASE || '/api/proxy');
  fetch(apiBase + '/api/manual', {
    method: 'POST', headers: (window._authHeaders?window._authHeaders({'Content-Type':'application/json'}):{'Content-Type':'application/json'}),
    body: JSON.stringify({user_id:userId, food_name:_scanData.name,
      meal_type:(meal&&meal.value)||'другое', weight:w,
      calories:Math.round(_scanData.calories*factor), protein:Math.round(_scanData.protein*factor*10)/10,
      fat:Math.round(_scanData.fat*factor*10)/10, carbs:Math.round(_scanData.carbs*factor*10)/10})
  }).then(function(r){ return r.json(); })
    .then(function(d){ if(d.ok){showToast('✅ Записано!','var(--green)'); scanReset();} else showToast('❌'+(d.error||'Ошибка'),'var(--accent2)'); })
    .catch(function(){ showToast('❌ Ошибка','var(--accent2)'); });
}

function scanAdjWeight(delta) {
  var inp = document.getElementById('scan-br-weight');
  if (!inp) return;
  var v = Math.max(1, (parseInt(inp.value)||100) + delta);
  inp.value = v;
}

// Called from lookupBarcode (existing function)
function _onBarcodeFound(data) {
  _scanData = data;
  scanStop();
  var name = (data.name||'').charAt(0).toUpperCase()+(data.name||'').slice(1);
  _scanData.name = name;
  document.getElementById('scan-br-name').textContent  = name;
  document.getElementById('scan-br-cal').textContent   = data.calories || '—';
  document.getElementById('scan-br-prot').textContent  = data.protein  || '—';
  document.getElementById('scan-br-fat').textContent   = data.fat      || '—';
  document.getElementById('scan-br-carb').textContent  = data.carbs    || '—';
  document.getElementById('scan-barcode-result').style.display = 'block';
  var _hh = new Date().getHours();
  var _bm = _hh<10?'завтрак':_hh<14?'обед':_hh<18?'обед':_hh<21?'ужин':'перекус';
  var _bms = document.getElementById('scan-br-meal'); if(_bms) _bms.value = _bm;
  _scanSetStatus('');
}

// photoRename uses photoResultData — update to use new name field
function scanPhotoAdjWeight(delta) {
  var inp = document.getElementById('scan-pr-weight');
  if (!inp) return;
  var w = (parseFloat(inp.value) || 100) + delta;
  w = Math.max(1, Math.min(5000, w));
  inp.value = w;
  scanPhotoWeightChanged();
}
window.scanPhotoAdjWeight = scanPhotoAdjWeight;

function scanPhotoWeightChanged() {
  if (!photoResultData) return;
  var inp = document.getElementById('scan-pr-weight');
  var w = Math.max(1, Math.min(5000, parseFloat(inp.value) || 100));
  var ratio = w / 100;
  photoResultData.weight   = w;
  photoResultData.calories = Math.round(photoResultData.cal100   * ratio);
  photoResultData.protein  = Math.round(photoResultData.prot100  * ratio * 10) / 10;
  photoResultData.fat      = Math.round(photoResultData.fat100   * ratio * 10) / 10;
  photoResultData.carbs    = Math.round(photoResultData.carbs100 * ratio * 10) / 10;
  document.getElementById('scan-pr-cal').textContent  = photoResultData.calories;
  document.getElementById('scan-pr-prot').textContent = photoResultData.protein;
  document.getElementById('scan-pr-fat').textContent  = photoResultData.fat;
  document.getElementById('scan-pr-carb').textContent = photoResultData.carbs;
}
window.scanPhotoWeightChanged = scanPhotoWeightChanged;

function photoRename() {
  if (!photoResultData) return;
  var existing = document.getElementById('photo-rename-modal');
  if (existing) document.body.removeChild(existing);
  var overlay = document.createElement('div');
  overlay.id = 'photo-rename-modal';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px';
  overlay.innerHTML = '<div style="background:var(--surface);border-radius:16px;padding:24px;width:100%;max-width:300px">'
    + '<div style="font-weight:700;font-size:15px;margin-bottom:12px">✏️ Переименовать</div>'
    + '<input id="photo-rename-input" type="text" value="' + escHtml(photoResultData.name||'') + '"'
    + ' style="width:100%;box-sizing:border-box;padding:12px;background:var(--bg2);border:none;border-radius:10px;color:var(--text);font-size:15px;margin-bottom:12px">'
    + '<div style="display:flex;gap:8px">'
    + '<button onclick="photoRenameConfirm()" style="flex:1;padding:11px;background:var(--green);color:#fff;border:none;border-radius:10px;font-weight:700;cursor:pointer;touch-action:manipulation">✅ Сохранить</button>'
    + '<button onclick="photoRenameCancel()" style="flex:1;padding:11px;background:var(--bg2);color:var(--text2);border:none;border-radius:10px;cursor:pointer;touch-action:manipulation">Отмена</button>'
    + '</div></div>';
  overlay.addEventListener('click', function(e){ if(e.target===overlay) document.body.removeChild(overlay); });
  document.body.appendChild(overlay);
  setTimeout(function(){ var inp=document.getElementById('photo-rename-input'); if(inp){inp.focus();inp.select();} },100);
}

function photoRenameConfirm() {
  var inp = document.getElementById('photo-rename-input');
  if (!inp || !inp.value.trim()) return;
  var newName = inp.value.trim().charAt(0).toUpperCase() + inp.value.trim().slice(1);
  var overlay = document.getElementById('photo-rename-modal');
  if (overlay) document.body.removeChild(overlay);
  if (photoResultData) photoResultData.name = newName;
  document.getElementById('scan-pr-name').textContent = newName + ' — ' + (photoResultData?photoResultData.weight:'') + 'г';
  showToast('✅ Переименовано', 'var(--green)');
}

window.photoRenameCancel = function(){ var m=document.getElementById('photo-rename-modal'); if(m) document.body.removeChild(m); };

function scanPhotoAgain() {
  photoResultData = null;
  document.getElementById('scan-photo-result').style.display = 'none';
  // restart photo camera directly
  _scanStartPhoto();
}
window.scanPhotoAgain = scanPhotoAgain;
window.scanSetMode    = scanSetMode;
window.scanStart      = scanStart;
window.scanStop       = scanStop;
window.scanReset      = scanReset;
window.scanCapture    = scanCapture;
window.scanPhotoSave  = scanPhotoSave;
window.scanBrSave     = scanBrSave;
window.scanAdjWeight  = scanAdjWeight;
window.photoRename    = photoRename;
window.photoRenameConfirm = photoRenameConfirm;


function sendManual() {
  const name = document.getElementById('manual-name').value.trim();
  const weight = document.getElementById('manual-weight').value;
  const meal = document.getElementById('meal-select-manual').value;
  if (!name || !weight) { showToast(i18n.fill_all||'Fill name and weight', 'var(--accent2)'); return; }
  var userId = tg&&tg.initDataUnsafe&&tg.initDataUnsafe.user&&tg.initDataUnsafe.user.id;
  if(!userId){ try{ var _up=new URLSearchParams(window.location.search); userId=_up.get('user_id')||localStorage.getItem('nutrio_user_id'); }catch(e){} }
  if(!userId){ showToast('❌ Открой из Telegram', 'var(--accent2)'); return; }
  const apiBase = (window.API_BASE || '/api/proxy');
  fetch(apiBase + '/api/manual', {
    method: 'POST',
    headers: (window._authHeaders?window._authHeaders({'Content-Type':'application/json'}):{'Content-Type':'application/json'}),
    body: JSON.stringify({ user_id: userId, food_name: name.charAt(0).toUpperCase()+name.slice(1), meal_type: meal, weight: parseInt(weight) })
  }).then(r => r.json())
    .then(d => {
      if(d.ok || d.status === 'ok'){
        showToast('✅ ' + name + ' ' + weight + 'г добавлен!');
        document.getElementById('manual-name').value = '';
        document.getElementById('manual-weight').value = '';
      } else { showToast('❌ ' + (d.error||'Ошибка'), 'var(--accent2)'); }
    })
    .catch(() => showToast('❌ Ошибка подключения', 'var(--accent2)'));
}

// Применяем переводы к UI
