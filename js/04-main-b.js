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
};

// Определяем язык: localStorage → Telegram → navigator
// СНГ языки → ru, остальное → en
const CIS = new Set(["ru","uk","be","kk","uz","hy","az","ka","tg","ky","mn"]);

function applyLang(code) {
  const base = (code||"ru").toLowerCase().split("-")[0].split("_")[0];
  // Продукт: только русский (основной) и английский. Всё, кроме en → ru.
  LANG = (base === "en") ? "en" : "ru";
  // Мержим: en как база для фолбэка недостающих ключей, поверх — выбранный язык
  const baseI18n = MINI_I18N.en;
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
  ru:'🇷🇺 Русский', en:'🇬🇧 English',
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
  // Тактильный отклик по типу тоста (accent2 → ошибка, green → успех)
  try {
    if (typeof haptic === 'function') {
      if (color && color.indexOf('accent2') >= 0) haptic('error');
      else if (!color || color.indexOf('green') >= 0) haptic('success');
    }
  } catch (e) {}
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => t.classList.remove('show'), 2500);
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
        else showToast('На сегодня лимит фото исчерпан. На Premium — до 80/день.', 'var(--accent2)');
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


// ── Поиск продукта при вводе (автодополнение, как в /Спорт для упражнений) ──
var _manualSearchTimeout = null;
var _manualSearchResults = [];

function manualFoodSearchInput(val) {
  clearTimeout(_manualSearchTimeout);
  if (!val || val.trim().length < 2) {
    _clearManualSearchResults();
    return;
  }
  _manualSearchTimeout = setTimeout(function(){ _doManualFoodSearch(val.trim()); }, 300);
}
window.manualFoodSearchInput = manualFoodSearchInput;

async function _doManualFoodSearch(q) {
  try {
    var d = await apiGet('/api/food/search', {q: q, limit: 8});
    var el = document.getElementById('manual-search-results');
    if (!el) return;
    _manualSearchResults = (d && d.results) || [];
    if (!_manualSearchResults.length) {
      el.innerHTML = '';
      el.style.display = 'none';
      return;
    }
    el.style.display = 'block';
    el.innerHTML = _manualSearchResults.map(function(r, i){
      return '<button onclick="manualSelectFood(' + i + ')" style="'
        + 'display:flex;align-items:center;justify-content:space-between;gap:8px;'
        + 'padding:10px 14px;background:transparent;border:none;'
        + 'border-bottom:1px solid var(--glass-border);font:inherit;cursor:pointer;'
        + 'text-align:left;width:100%">'
        + '<span style="font-size:14px;color:var(--text);font-weight:600;overflow:hidden;'
        + 'text-overflow:ellipsis;white-space:nowrap">' + escHtml(r.name) + '</span>'
        + '<span style="font-size:12px;color:var(--text2);flex-shrink:0">' + Math.round(r.calories) + ' ккал/100г</span>'
        + '</button>';
    }).join('');
  } catch(e) { _clearManualSearchResults(); }
}

function _clearManualSearchResults() {
  var el = document.getElementById('manual-search-results');
  if (el) { el.innerHTML = ''; el.style.display = 'none'; }
}

function manualSelectFood(idx) {
  var r = _manualSearchResults[idx];
  if (!r) return;
  var nameInp = document.getElementById('manual-name');
  if (nameInp) nameInp.value = r.name;
  _clearManualSearchResults();

  // Показываем и заполняем редактируемые КБЖУ на 100г
  var group = document.getElementById('manual-macro-group');
  if (group) group.style.display = 'block';
  var cal  = document.getElementById('manual-cal100');
  var prot = document.getElementById('manual-prot100');
  var fat  = document.getElementById('manual-fat100');
  var carb = document.getElementById('manual-carb100');
  if (cal)  cal.value  = r.calories;
  if (prot) prot.value = r.protein;
  if (fat)  fat.value  = r.fat;
  if (carb) carb.value = r.carbs;

  // Фокус на вес — следующий логичный шаг
  var w = document.getElementById('manual-weight');
  if (w) { w.focus(); }
}
window.manualSelectFood = manualSelectFood;

function sendManual() {
  const name = document.getElementById('manual-name').value.trim();
  const weight = document.getElementById('manual-weight').value;
  const meal = document.getElementById('meal-select-manual').value;
  if (!name || !weight) { showToast(i18n.fill_all||'Fill name and weight', 'var(--accent2)'); return; }
  var userId = tg&&tg.initDataUnsafe&&tg.initDataUnsafe.user&&tg.initDataUnsafe.user.id;
  if(!userId){ try{ var _up=new URLSearchParams(window.location.search); userId=_up.get('user_id')||localStorage.getItem('nutrio_user_id'); }catch(e){} }
  if(!userId){ showToast('❌ Открой из Telegram', 'var(--accent2)'); return; }

  var payload = { user_id: userId, food_name: name.charAt(0).toUpperCase()+name.slice(1), meal_type: meal, weight: parseInt(weight) };

  // Если КБЖУ на 100г заполнены (из поиска или вручную) — масштабируем под вес
  // и шлём готовыми, как это уже делает поток фото/штрихкода. Если поля пустые —
  // ничего не добавляем, бэкенд сам определит КБЖУ по названию (как раньше).
  var cal100  = parseFloat(document.getElementById('manual-cal100').value);
  if (!isNaN(cal100) && cal100 > 0) {
    var factor = parseInt(weight) / 100;
    var prot100 = parseFloat(document.getElementById('manual-prot100').value) || 0;
    var fat100  = parseFloat(document.getElementById('manual-fat100').value)  || 0;
    var carb100 = parseFloat(document.getElementById('manual-carb100').value) || 0;
    payload.calories = Math.round(cal100 * factor);
    payload.protein  = Math.round(prot100 * factor * 10) / 10;
    payload.fat      = Math.round(fat100  * factor * 10) / 10;
    payload.carbs    = Math.round(carb100 * factor * 10) / 10;
  }

  const apiBase = (window.API_BASE || '/api/proxy');
  fetch(apiBase + '/api/manual', {
    method: 'POST',
    headers: (window._authHeaders?window._authHeaders({'Content-Type':'application/json'}):{'Content-Type':'application/json'}),
    body: JSON.stringify(payload)
  }).then(r => r.json())
    .then(d => {
      if(d.ok || d.status === 'ok'){
        showToast('✅ ' + name + ' ' + weight + 'г добавлен!');
        document.getElementById('manual-name').value = '';
        document.getElementById('manual-weight').value = '';
        document.getElementById('manual-cal100').value = '';
        document.getElementById('manual-prot100').value = '';
        document.getElementById('manual-fat100').value = '';
        document.getElementById('manual-carb100').value = '';
        var group = document.getElementById('manual-macro-group');
        if (group) group.style.display = 'none';
        _clearManualSearchResults();
      } else { showToast('❌ ' + (d.error||'Ошибка'), 'var(--accent2)'); }
    })
    .catch(() => showToast('❌ Ошибка подключения', 'var(--accent2)'));
}

// Применяем переводы к UI
