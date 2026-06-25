// ============================================================
// NUTRIO RUNNER v7
// ============================================================
const PX=3;
const STORE={
  get:(k,d)=>{try{const v=localStorage.getItem('nr7_'+k);return v!==null?JSON.parse(v):d;}catch(e){return d;}},
  set:(k,v)=>{try{localStorage.setItem('nr7_'+k,JSON.stringify(v));}catch(e){}},
};

// ============================================================
// СТИЛИ (ФОРМЫ) — отдельно от цветов
// ============================================================
const STYLES={
  male:{
    hat:[ {n:(i18n.hat_none||'None'),k:''},{n:(i18n.hat_cap||'Cap'),k:'cap'},{n:(i18n.hat_beanie||'Beanie'),k:'beanie'},{n:(i18n.hat_fedora||'Fedora'),k:'fedora'},{n:(i18n.hat_hood||'Hood'),k:'hood'},{n:(i18n.hat_crown||'Crown'),k:'crown'} ],
    hair:[ {n:(i18n.hair_short||'Short'),k:'short'},{n:(i18n.hair_slick||'Slick'),k:'slick'},{n:(i18n.hair_side||'Side'),k:'side'},{n:(i18n.hair_messy||'Messy'),k:'messy'} ],
    shirt:[ {n:(i18n.shirt_tshirt||'T-Shirt'),k:'tshirt'},{n:(i18n.shirt_jacket||'Jacket'),k:'jacket'},{n:(i18n.shirt_hoodie||'Hoodie'),k:'hoodie'},{n:(i18n.shirt_shirt||'Shirt'),k:'shirt'} ],
    pants:[ {n:(i18n.pants_jeans||'Jeans'),k:'jeans'},{n:(i18n.pants_shorts||'Shorts'),k:'shorts'},{n:(i18n.pants_sweat||'Sweatpants'),k:'sweat'},{n:(i18n.pants_jeans||'Pants'),k:'trousers'} ],
    boot:[ {n:(i18n.boot_sneakers||'Sneakers'),k:'sneakers'},{n:(i18n.boot_boots||'Boots'),k:'boots'},{n:(i18n.boot_slippers||'Slippers'),k:'sandals'},{n:(i18n.boot_loafers||'Loafers'),k:'loafers'} ],
    glass:[ {n:(i18n.hat_none||'None'),k:''},{n:(i18n.glass_aviator2||i18n.glass_aviator||'Aviator'),k:'aviator'},{n:(i18n.glass_round||'Round'),k:'round'},{n:(i18n.shirt_sport||'Sport'),k:'sport'},{n:(i18n.glass_mask||'Mask'),k:'visor'} ],
  },
  female:{
    hat:[ {n:(i18n.hat_none||'None'),k:''},{n:(i18n.hat_headband||'Headband'),k:'headband'},{n:(i18n.hat_pill||'Pill hat'),k:'pillbox'},{n:(i18n.c_bow||'Bow'),k:'bow'},{n:(i18n.hat_wreath2||i18n.hat_wreath||'Wreath'),k:'wreath'},{n:(i18n.hat_tiara||'Tiara'),k:'tiara'} ],
    hair:[ {n:(i18n.hair_long||'Long'),k:'long'},{n:(i18n.hair_pony||'Ponytail'),k:'ponytail'},{n:(i18n.hair_bob||'Bob'),k:'bob'},{n:(i18n.hair_curly||'Curly'),k:'curly'} ],
    shirt:[ {n:(i18n.shirt_blouse||'Blouse'),k:'blouse'},{n:(i18n.shirt_dress||'Dress'),k:'dress'},{n:(i18n.shirt_jacket||'Jacket'),k:'jacket'},{n:(i18n.shirt_sweater||'Sweater'),k:'sweater'} ],
    pants:[ {n:(i18n.pants_skirt||'Skirt'),k:'skirt'},{n:(i18n.pants_mini||'Mini'),k:'mini'},{n:(i18n.pants_jeans||'Jeans'),k:'jeans'},{n:(i18n.pants_leggings||'Leggings'),k:'leggings'} ],
    boot:[ {n:(i18n.boot_heels||'Heels'),k:'heels'},{n:(i18n.boot_keds||'Keds'),k:'sneakers'},{n:(i18n.boot_boots||'Boots'),k:'boots'},{n:(i18n.boot_slippers||'Slippers'),k:'sandals'} ],
    glass:[ {n:(i18n.hat_none||'None'),k:''},{n:(i18n.glass_cat2||i18n.glass_cat||'Cat-eye'),k:'cateye'},{n:(i18n.glass_round||'Round'),k:'round'},{n:(i18n.glass_aviator2||i18n.glass_aviator||'Aviator'),k:'aviator'},{n:(i18n.glass_heart||'Hearts'),k:'hearts'} ],
  },
};

// ============================================================
// ЦВЕТОВЫЕ ПАЛИТРЫ — для каждого слота
// ============================================================
const PAL={
  hat:[
    {n:(i18n.c_black_f||'Black'),c:'#111122',c2:'#333355'},
    {n:(i18n.c_navy||'Navy'),  c:'#1a3a90',c2:'#4466cc'},
    {n:(i18n.c_red||'Red'),c:'#991122',c2:'#cc3344'},
    {n:(i18n.c_green||'Green'),c:'#1a5522',c2:'#339944'},
    {n:(i18n.c_grey||'Grey'),  c:'#445566',c2:'#778899'},
    {n:(i18n.c_beige||'Beige'),c:'#9a7a55',c2:'#ccaa88'},
    {n:(i18n.c_violet||'Violet'), c:'#551188',c2:'#9933cc'},
    {n:(i18n.c_orange||'Orange'),  c:'#aa4400',c2:'#ee7722'},
  ],
  hair:[
    {n:(i18n.c_dark||'Dark'), c:'#3a1800',hl:'#7a4020'},
    {n:(i18n.c_black_pl||'Black'), c:'#111111',hl:'#333333'},
    {n:(i18n.c_ginger||'Ginger'),  c:'#bb3300',hl:'#ff6622'},
    {n:(i18n.c_light||'Light'),c:'#ccaa33',hl:'#ffdd77'},
    {n:(i18n.c_grey_pl||'Grey'),  c:'#667788',hl:'#aabbcc'},
    {n:(i18n.c_white_pl||'White'),  c:'#ddddee',hl:'#ffffff'},
    {n:(i18n.c_pink_pl||'Pink'),c:'#cc1177',hl:'#ff44aa'},
    {n:(i18n.c_blue_pl||'Blue'),c:'#1177bb',hl:'#44aaff'},
  ],
  shirt:[
    {n:(i18n.c_blue_f||'Blue'),  c:'#1a5ab4',hl:'#4a8ae4'},
    {n:(i18n.c_red_f||'Red'),c:'#aa1111',hl:'#ee4444'},
    {n:(i18n.c_green_f||'Green'),c:'#116611',hl:'#339933'},
    {n:(i18n.c_black_f||'Black'), c:'#111111',hl:'#333333'},
    {n:(i18n.c_yellow||'Yellow'), c:'#997700',hl:'#ddbb22'},
    {n:(i18n.c_white_f||'White'),  c:'#ccccdd',hl:'#eeeeff'},
    {n:(i18n.c_violet||'Violet'), c:'#551188',hl:'#9933cc'},
    {n:(i18n.c_orange||'Orange'),  c:'#aa4400',hl:'#ee7722'},
  ],
  pants:[
    {n:(i18n.c_navy_pl||'Navy'),  c:'#1a3a80',hl:'#3a5aaa'},
    {n:(i18n.c_black_pl||'Black'), c:'#0a0a22',hl:'#222244'},
    {n:(i18n.c_grey_pl||'Grey'),  c:'#333344',hl:'#555577'},
    {n:(i18n.c_khaki||'Khaki'),   c:'#3a4411',hl:'#556633'},
    {n:(i18n.c_beige_pl||'Beige'),c:'#776644',hl:'#998866'},
    {n:(i18n.c_red_pl||'Red'),c:'#771111',hl:'#993333'},
    {n:(i18n.c_white_pl||'White'),  c:'#ccccdd',hl:'#eeeeff'},
    {n:(i18n.c_green_pl||'Green'),c:'#1a4a22',hl:'#336633'},
  ],
  boot:[
    {n:(i18n.c_black_pl||'Black'), c:'#0a0a0a'},
    {n:(i18n.c_brown||'Brown'), c:'#331100'},
    {n:(i18n.c_white_pl||'White'),  c:'#aabbcc'},
    {n:(i18n.c_navy_pl||'Navy'),  c:'#0a1a40'},
    {n:(i18n.c_red_pl||'Red'),c:'#770011'},
    {n:(i18n.c_grey_pl||'Grey'),  c:'#445566'},
    {n:(i18n.c_beige_pl||'Beige'),c:'#9a7a55'},
    {n:(i18n.c_gold||'Gold'), c:'#aa8800'},
  ],
  glass:[
    {n:(i18n.c_black_f||'Black'), c:'#111111',lc:'#00000055'},
    {n:(i18n.c_brown||'Brown'), c:'#331100',lc:'#66330055'},
    {n:(i18n.c_blue_f||'Blue'),  c:'#003366',lc:'#0066ff44'},
    {n:(i18n.c_red_f||'Red'),c:'#660011',lc:'#cc003344'},
    {n:(i18n.c_gold||'Gold'), c:'#aa8800',lc:'#ffdd0033'},
    {n:(i18n.c_pink_f||'Pink'),c:'#991144',lc:'#ff446633'},
  ],
};

// Состояние
const DFLT={gender:null,bg:0,diff:1,highScore:0,hat_s:0,hat_c:0,hair_s:0,hair_c:0,shirt_s:0,shirt_c:0,pants_s:0,pants_c:0,boot_s:0,boot_c:0,glass_s:0,glass_c:0};
let S={};
Object.keys(DFLT).forEach(k=>S[k]=STORE.get(k,DFLT[k]));
function saveS(k){STORE.set(k,S[k]);}
function saveSAll(){Object.keys(DFLT).forEach(k=>saveS(k));}

function getOutfit(){
  const g=S.gender||'male';
  const hs=STYLES[g], hp=PAL;
  const hCol=hp.hat[S.hat_c]||hp.hat[0];
  const hairCol=hp.hair[S.hair_c]||hp.hair[0];
  const shCol=hp.shirt[S.shirt_c]||hp.shirt[0];
  const paCol=hp.pants[S.pants_c]||hp.pants[0];
  const boCol=hp.boot[S.boot_c]||hp.boot[0];
  const glCol=hp.glass[S.glass_c]||hp.glass[0];
  return {
    hatStyle:  (hs.hat[S.hat_s]||hs.hat[0]).k,
    hatC: hCol.c, hatC2: hCol.c2||hCol.c,
    hairStyle: (hs.hair[S.hair_s]||hs.hair[0]).k,
    hairC: hairCol.c, hairHL: hairCol.hl||'#888',
    shirtStyle:(hs.shirt[S.shirt_s]||hs.shirt[0]).k,
    shirtC: shCol.c, shirtHL: shCol.hl||'#888',
    pantsStyle:(hs.pants[S.pants_s]||hs.pants[0]).k,
    pantsC: paCol.c, pantsHL: paCol.hl||'#888',
    bootStyle: (hs.boot[S.boot_s]||hs.boot[0]).k,
    bootC: boCol.c,
    glassStyle:(hs.glass[S.glass_s]||hs.glass[0]).k,
    glassC: glCol.c, glassL: glCol.lc||'#00000033',
    skinC:'#f4c07a', skinD:'#d4905a',
  };
}

const DIFFICULTY=[
  {name:i18n.diff_easy,     baseSpeed:0.70,spawnBase:72,wavePts:280,speedInc:0.09,fatMult:0.65,maxItems:4,laneCool:20},
  {name:i18n.diff_normal, baseSpeed:0.90,spawnBase:56,wavePts:210,speedInc:0.12,fatMult:0.95,maxItems:5,laneCool:16},
  {name:i18n.diff_hard,    baseSpeed:1.15,spawnBase:42,wavePts:155,speedInc:0.17,fatMult:1.35,maxItems:6,laneCool:11},
];
const BACKGROUNDS=[
  {name:i18n.bg_preview_lbl[0],     sky:['#060612','#0d0d22'],starField:true, ground:'#1a3a0a',grass:'#2a5a1a'},
  {name:i18n.bg_preview_lbl[1],        sky:['#081408','#142210'],trees:true,     ground:'#2a1a0a',grass:'#3a6a1a',rain:true},
  {name:i18n.bg_preview_lbl[2],      sky:['#200808','#401020'],sunset:true,    ground:'#3a2a1a',grass:'#2a4a0a'},
  {name:i18n.bg_preview_lbl[3], sky:['#080808','#101010'],dungeon:true,   ground:'#2a2a2a',grass:'#444444'},
];
const FOOD_ITEMS={
  healthy:[
    {emoji:'🥦',name:(i18n.f_broccoli||'Broccoli'),pts:12,color:'#44cc44'},{emoji:'🍎',name:'Яблоко',pts:10,color:'#ee4444'},
    {emoji:'🥕',name:(i18n.f_carrot||'Carrot'),pts:8,color:'#ff8800'},{emoji:'🥒',name:(i18n.f_cucumber||'Cucumber'),pts:8,color:'#55cc55'},
    {emoji:'🫐',name:(i18n.f_blueberry||'Blueberry'),pts:15,color:'#8844ee'},{emoji:'🍋',name:(i18n.f_lemon||'Lemon'),pts:7,color:'#eedd00'},
    {emoji:'🥑',name:(i18n.c_avocado||'Avocado'),pts:12,color:'#448833'},{emoji:'🍓',name:(i18n.f_strawberry||'Strawberry'),pts:10,color:'#ee2244'},
    {emoji:'🥗',name:(i18n.f_salad||'Salad'),pts:35,color:'#22ff88',rare:true},{emoji:'🍇',name:(i18n.f_grape||'Grapes'),pts:28,color:'#aa44ff',rare:true},
  ],
  junk:[
    {emoji:'🍕',name:(i18n.f_pizza||'Pizza'),fat:8,color:'#ff6622'},{emoji:'🍔',name:(i18n.f_burger||'Burger'),fat:10,color:'#cc8833'},
    {emoji:'🧁',name:(i18n.f_cake||'Pastry'),fat:7,color:'#ff88cc'},{emoji:'🍰',name:(i18n.f_cake2||'Cake'),fat:11,color:'#ffaacc'},
    {emoji:'🍫',name:(i18n.c_choco||'Choco'),fat:6,color:'#884422'},{emoji:'🍟',name:(i18n.f_fries||'Fries'),fat:9,color:'#eebb22'},
    {emoji:'🌮',name:(i18n.f_taco||'Taco'),fat:7,color:'#ffcc44'},{emoji:'🥐',name:(i18n.f_croissant||'Croissant'),fat:6,color:'#ddaa44'},
  ],
  powerup:[
    {emoji:'🧲',name:(i18n.powerup_magnet||'🧲 Magnet'),type:'magnet',color:'#22aaff',dur:320},
    {emoji:'🛡️',name:(i18n.powerup_shield||'🛡️ Shield'),type:'shield',color:'#aaaaff',dur:240},
    {emoji:'💊',name:(i18n.powerup_pill||'💊 Pill'),type:'pill',color:'#ff44aa',dur:0},
    {emoji:'⭐',name:(i18n.powerup_x2||'x2 pts'),type:'double',color:'#ffee00',dur:260},
    {emoji:'❤️',name:(i18n.powerup_life||'+Life'),type:'life',color:'#ff4466',dur:0},
  ],
};
let GS=null,SCREEN='start',settingsTab='bg',charSlot=0,charSubtab='style';var PAUSED=false;
let laneLastSpawn=[0,0,0,0];
const SLOTS=['hat','hair','shirt','pants','boot','glass'];
const SLOT_ICONS=['🎩','💇','👕','👖','👟','🕶️'];
const SLOT_LBL_M=[i18n.slot_labels[0],i18n.slot_labels[1],(i18n.shirt_shirt||'Shirt'),(i18n.pants_jeans||'Pants'),i18n.slot_labels[4],i18n.slot_labels[5]];
const SLOT_LBL_F=[i18n.slot_labels[0],i18n.slot_labels[1],(i18n.shirt_blouse||'Blouse'),(i18n.pants_skirt||'Skirt'),i18n.slot_labels[4],i18n.slot_labels[5]];

// ============================================================
// UTILS
// ============================================================
function px(ctx,x,y,c,s=PX){ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(y),s,s);}
function pxRect(ctx,x,y,w,h,fill,stroke=null){ctx.fillStyle=fill;ctx.fillRect(x,y,w,h);if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=PX;ctx.strokeRect(x+PX/2,y+PX/2,w-PX,h-PX);}}
function pxText(ctx,t,x,y,c,sz=12,align='center'){ctx.fillStyle=c;ctx.font=`bold ${sz}px monospace`;ctx.textAlign=align;ctx.fillText(t,x,y);}
function pxBtn(ctx,x,y,w,h,text,bg='#6c63ff',fg='#fff',sz=11){pxRect(ctx,x,y,w,h,bg,'#ffffff22');pxText(ctx,text,x+w/2,y+h/2+sz*0.38,fg,sz);}

// ============================================================
// РИСОВАНИЕ ПЕРСОНАЖА
// ============================================================
function drawHat(ctx,cx,headX,headY,headS,isFem,style,c,c2){
  if(!style)return;
  ctx.save();
  if(!isFem){
    if(style==='cap'){
      pxRect(ctx,headX-PX,headY-PX*4,headS+PX*2,PX*4,c,'#0a0a1e');
      pxRect(ctx,headX+headS,headY-PX*2,PX*6,PX*2,c);// козырёк
      px(ctx,headX+PX*2,headY-PX*3,c2,PX*2);
    } else if(style==='beanie'){
      pxRect(ctx,headX,headY-PX*6,headS,PX*6,c,'#0a0a1e');
      pxRect(ctx,headX-PX,headY-PX*2,headS+PX*2,PX*2,c);
      pxRect(ctx,headX+PX,headY-PX*5,headS-PX*2,PX*2,c2+'88');
      px(ctx,cx-PX,headY-PX*7,c2,PX*2);// помпон
    } else if(style==='fedora'){
      pxRect(ctx,headX-PX*4,headY,headS+PX*8,PX*2,c,'#0a0a1e');
      pxRect(ctx,headX+PX,headY-PX*7,headS-PX*2,PX*7,c,'#0a0a1e');
      pxRect(ctx,headX+PX,headY-PX*2,headS-PX*2,PX*2,c2+'88');
    } else if(style==='hood'){
      ctx.fillStyle=c;
      ctx.beginPath();ctx.arc(cx,headY-PX*2,headS*0.72,Math.PI,0);ctx.fill();
      pxRect(ctx,headX-PX*3,headY-PX*2,PX*3,headS*0.65,c);
      pxRect(ctx,headX+headS,headY-PX*2,PX*3,headS*0.65,c);
      ctx.strokeStyle='#0a0a1e';ctx.lineWidth=PX;
      ctx.beginPath();ctx.arc(cx,headY-PX*2,headS*0.72,Math.PI,0);ctx.stroke();
      ctx.fillStyle=c2+'33';ctx.beginPath();ctx.arc(cx-PX*2,headY-PX*4,headS*0.38,Math.PI,0);ctx.fill();
    } else if(style==='crown'){
      for(let i=0;i<5;i++){const tx=headX+PX+i*(headS-PX*2)/4,th=i%2===0?PX*5:PX*3;pxRect(ctx,tx,headY-th,PX*2,th,c);}
      pxRect(ctx,headX-PX,headY-PX*2,headS+PX*2,PX*2,c,'#0a0a1e');
      px(ctx,cx-PX,headY-PX*5,c2,PX*2);
    }
  } else {
    if(style==='headband'){
      pxRect(ctx,headX+PX,headY+PX,headS-PX*2,PX*2,c);
      // цветок
      [[-PX,0],[PX,0],[0,-PX],[0,PX]].forEach(([dx,dy])=>px(ctx,headX+PX*2+dx,headY-PX*2+dy,c2,PX));
      px(ctx,headX+PX*2,headY-PX*2,c,PX);
    } else if(style==='pillbox'){
      // Шляпка-таблетка (плоский цилиндр)
      pxRect(ctx,headX-PX*2,headY-PX,headS+PX*4,PX*2,c,'#0a0a1e');// поля
      pxRect(ctx,headX+PX,headY-PX*5,headS-PX*2,PX*4,c,'#0a0a1e');// верх
      pxRect(ctx,headX+PX,headY-PX*2,headS-PX*2,PX,c2+'aa');// блик
    } else if(style==='bow'){
      ctx.save();ctx.translate(cx-PX*6,headY-PX*5);ctx.rotate(-0.35);
      ctx.fillStyle=c;ctx.beginPath();ctx.ellipse(0,0,PX*5,PX*3,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#0a0a1e';ctx.lineWidth=1;ctx.stroke();ctx.restore();
      ctx.save();ctx.translate(cx+PX*6,headY-PX*5);ctx.rotate(0.35);
      ctx.fillStyle=c;ctx.beginPath();ctx.ellipse(0,0,PX*5,PX*3,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#0a0a1e';ctx.lineWidth=1;ctx.stroke();ctx.restore();
      pxRect(ctx,cx-PX*1.5,headY-PX*6,PX*3,PX*3,c2,'#0a0a1e');
    } else if(style==='wreath'){
      // Цветочный венок — кружочки по верхней части головы
      const flowers=[['#ff4488',0.15],['#ffee00',0.35],['#44cc44',0.5],['#ffee00',0.65],['#ff4488',0.85]];
      flowers.forEach(([fc,t])=>{
        const fx=headX+headS*t, fy=headY-PX*3;
        ctx.fillStyle=fc;ctx.beginPath();ctx.arc(fx,fy,PX*1.8,0,Math.PI*2);ctx.fill();
        ctx.strokeStyle='#1a1a2e';ctx.lineWidth=1;ctx.stroke();
        px(ctx,fx-PX*0.5,fy-PX*0.5,'#ffee8888',PX);// блик
      });
      // Листья
      ctx.fillStyle='#226622';ctx.beginPath();ctx.ellipse(headX+PX,headY-PX,PX*3,PX*1.5,-0.5,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.ellipse(headX+headS-PX,headY-PX,PX*3,PX*1.5,0.5,0,Math.PI*2);ctx.fill();
    } else if(style==='tiara'){
      for(let i=0;i<5;i++){const tx=headX+PX+i*(headS-PX*2)/4;px(ctx,tx,headY-PX*(i===2?6:4),c,PX*2);}
      px(ctx,cx-PX,headY-PX*6,c2,PX*2);
      // Основа
      pxRect(ctx,headX+PX,headY-PX*2,headS-PX*2,PX*2,c+'88');
    }
  }
  ctx.restore();
}

function drawHair(ctx,cx,headX,headY,headS,isFem,style,c,hl){
  // Базовые волосы всегда
  pxRect(ctx,headX,headY,headS,PX*2,c);
  px(ctx,headX+PX,headY,hl,PX);px(ctx,headX+PX*3,headY,hl,PX);
  if(isFem){
    if(style==='long'||style===''){
      pxRect(ctx,headX-PX,headY+PX,PX*2,headS*0.86,c);
      pxRect(ctx,headX+headS-PX,headY+PX,PX*2,headS*0.80,c);
      pxRect(ctx,headX+headS,headY+PX*2,PX*2,headS*0.52,c);
    } else if(style==='ponytail'){
      pxRect(ctx,headX-PX,headY+PX,PX*2,headS*0.60,c);
      pxRect(ctx,headX+headS-PX,headY+PX,PX*2,headS*0.50,c);
      // Хвост сзади более выраженный
      pxRect(ctx,headX+headS,headY+PX,PX*3,headS*0.85,c);
      pxRect(ctx,headX+headS+PX,headY+headS*0.7,PX*2,headS*0.5,c);
      px(ctx,headX+headS+PX,headY+headS*0.65,'#ffee22',PX*2);// резинка
    } else if(style==='bob'){
      pxRect(ctx,headX-PX,headY+PX,PX*2,headS*0.50,c);
      pxRect(ctx,headX+headS-PX,headY+PX,PX*2,headS*0.50,c);
    } else if(style==='curly'){
      // Кудри — несколько окружностей
      pxRect(ctx,headX-PX,headY+PX,PX*2,headS*0.80,c);
      pxRect(ctx,headX+headS-PX,headY+PX,PX*2,headS*0.75,c);
      [[-PX,0.3],[headS,0.3],[-PX*2,0.6],[headS+PX,0.5]].forEach(([dx,dy])=>{
        ctx.fillStyle=c;ctx.beginPath();ctx.arc(headX+headS*0.5+dx,headY+headS*dy,PX*2.5,0,Math.PI*2);ctx.fill();
      });
    }
  } else {
    if(style==='short'||style===''){
      pxRect(ctx,headX,headY+PX,PX*2,headS*0.52,c);
    } else if(style==='slick'){
      pxRect(ctx,headX,headY,headS,PX*3,c);
      // зачёс вправо
      for(let i=0;i<4;i++)px(ctx,headX+headS-PX*2+i,headY-PX*2,hl,PX);
    } else if(style==='side'){
      pxRect(ctx,headX,headY,PX*4,headS*0.6,c);
      pxRect(ctx,headX+headS-PX*2,headY,PX*2,PX*3,c);
    } else if(style==='messy'){
      pxRect(ctx,headX,headY,headS,PX*4,c);
      [PX,PX*3,PX*5,PX*7].forEach((ox,i)=>px(ctx,headX+ox,headY-PX*(i%2+1),c,PX*2));
    }
  }
}

function drawShirt(ctx,cx,bodyX,bodyY,bodyW,bodyH,shW,hipW,isFem,style,c,hl){
  if(isFem){
    const drawTrapBody=()=>{
      ctx.beginPath();ctx.moveTo(cx-shW*0.5,bodyY);ctx.lineTo(cx+shW*0.5,bodyY);
      ctx.lineTo(cx+hipW*0.5,bodyY+bodyH);ctx.lineTo(cx-hipW*0.5,bodyY+bodyH);
      ctx.closePath();ctx.fillStyle=c;ctx.fill();ctx.strokeStyle='#1a1a2e';ctx.lineWidth=PX*0.7;ctx.stroke();
      ctx.fillStyle=hl+'44';ctx.beginPath();ctx.moveTo(cx-shW*0.38,bodyY+PX);ctx.lineTo(cx-shW*0.38+PX*2,bodyY+PX);ctx.lineTo(cx-hipW*0.3+PX*2,bodyY+bodyH-PX);ctx.lineTo(cx-hipW*0.3,bodyY+bodyH-PX);ctx.closePath();ctx.fill();
    };
    if(style==='blouse'||style===''){drawTrapBody();}
    else if(style==='dress'){// Платье — тело + юбка единая
      drawTrapBody();
      // Юбка уже нарисуется в drawLegs, здесь только тело
    } else if(style==='jacket'){
      drawTrapBody();
      // Лацканы
      ctx.fillStyle='#1a1a2e';
      ctx.beginPath();ctx.moveTo(cx,bodyY+PX*2);ctx.lineTo(cx-shW*0.28,bodyY);ctx.lineTo(cx-shW*0.5,bodyY);ctx.lineTo(cx-hipW*0.2,bodyY+bodyH*0.55);ctx.closePath();ctx.fill();
      ctx.beginPath();ctx.moveTo(cx,bodyY+PX*2);ctx.lineTo(cx+shW*0.28,bodyY);ctx.lineTo(cx+shW*0.5,bodyY);ctx.lineTo(cx+hipW*0.2,bodyY+bodyH*0.55);ctx.closePath();ctx.fill();
    } else if(style==='sweater'){
      drawTrapBody();
      // Рёбра снизу
      pxRect(ctx,cx-hipW*0.48,bodyY+bodyH-PX*3,hipW*0.96,PX*3,hl+'55');
      for(let x=cx-hipW*0.45;x<cx+hipW*0.45;x+=PX*3)pxRect(ctx,x,bodyY+bodyH-PX*3,PX,PX*3,'#00000022');
    }
  } else {
    const bx=Math.round(cx-shW/2);
    pxRect(ctx,bx,bodyY,shW,bodyH,c,'#1a1a2e');
    pxRect(ctx,bx+PX,bodyY+PX,PX*2,bodyH-PX*2,hl+'44');
    if(style==='tshirt'||style===''){
      pxRect(ctx,bx,bodyY+bodyH-PX*3,shW,PX*3,'#1a1a2e');
      pxRect(ctx,Math.round(cx-PX*1.5),bodyY+bodyH-PX*3,PX*3,PX*3,'#ddaa22');
    } else if(style==='jacket'){
      pxRect(ctx,bx,bodyY+bodyH-PX*3,shW,PX*3,'#1a1a2e');
      pxRect(ctx,Math.round(cx-PX*1.5),bodyY+bodyH-PX*3,PX*3,PX*3,'#ddaa22');
      ctx.fillStyle='#0a0a22';
      ctx.beginPath();ctx.moveTo(cx,bodyY+PX*2);ctx.lineTo(cx-shW*0.28,bodyY);ctx.lineTo(bx,bodyY);ctx.lineTo(cx-shW*0.2,bodyY+bodyH*0.6);ctx.closePath();ctx.fill();
      ctx.beginPath();ctx.moveTo(cx,bodyY+PX*2);ctx.lineTo(cx+shW*0.28,bodyY);ctx.lineTo(bx+shW,bodyY);ctx.lineTo(cx+shW*0.2,bodyY+bodyH*0.6);ctx.closePath();ctx.fill();
      // Пуговицы
      for(let i=0;i<3;i++)px(ctx,cx-PX*0.5,bodyY+bodyH*0.3+i*PX*3,'#cccccc',PX);
    } else if(style==='hoodie'){
      pxRect(ctx,bx,bodyY+bodyH-PX*3,shW,PX*3,'#1a1a2e');
      pxRect(ctx,Math.round(cx-PX*1.5),bodyY+bodyH-PX*3,PX*3,PX*3,'#ddaa22');
      // Карман
      pxRect(ctx,Math.round(cx-shW*0.3),bodyY+bodyH-PX*7,shW*0.6,PX*4,hl+'55','#1a1a2e22');
      // Шнурки
      px(ctx,cx-PX*2,bodyY+PX,'#cccccc',PX);px(ctx,cx+PX,bodyY+PX,'#cccccc',PX);
    } else if(style==='shirt'){
      pxRect(ctx,bx,bodyY+bodyH-PX*3,shW,PX*3,'#1a1a2e');
      pxRect(ctx,Math.round(cx-PX*1.5),bodyY+bodyH-PX*3,PX*3,PX*3,'#ddaa22');
      // Воротник
      px(ctx,cx-PX*3,bodyY,hl,PX*3);px(ctx,cx,bodyY,hl,PX*3);
      // Пуговицы
      for(let i=0;i<4;i++)px(ctx,cx-PX*0.5,bodyY+PX*3+i*PX*3,'#cccccc',PX);
    }
  }
}

function drawLegs(ctx,cx,bodyY,bodyH,legH,bodyW,hipW,isFem,pantsStyle,pantsC,pantsHL,bootStyle,bootC,skinC){
  const lw=4*PX, ly=bodyY+bodyH;
  if(isFem){
    // Рисуем низ в зависимости от стиля
    if(pantsStyle==='skirt'||pantsStyle===''){
      const sf=0.52;
      ctx.beginPath();ctx.moveTo(cx-hipW*0.50,ly-PX*2);ctx.lineTo(cx+hipW*0.50,ly-PX*2);
      ctx.lineTo(cx+hipW*sf,ly+legH*0.62);ctx.lineTo(cx-hipW*sf,ly+legH*0.62);ctx.closePath();
      ctx.fillStyle=pantsC;ctx.fill();ctx.strokeStyle='#1a1a2e22';ctx.lineWidth=1;ctx.stroke();
      pxRect(ctx,cx-hipW*0.42,ly+PX*2,hipW*0.84,PX*2,pantsHL+'44');
      // Ноги
      pxRect(ctx,Math.round(cx-lw*1.1),ly+legH*0.6,lw,legH*0.42,skinC);
      pxRect(ctx,Math.round(cx+lw*0.1), ly+legH*0.6,lw,legH*0.42,skinC);
    } else if(pantsStyle==='mini'){
      const sf=0.62;
      ctx.beginPath();ctx.moveTo(cx-hipW*0.50,ly-PX*2);ctx.lineTo(cx+hipW*0.50,ly-PX*2);
      ctx.lineTo(cx+hipW*sf,ly+legH*0.32);ctx.lineTo(cx-hipW*sf,ly+legH*0.32);ctx.closePath();
      ctx.fillStyle=pantsC;ctx.fill();ctx.strokeStyle='#1a1a2e22';ctx.lineWidth=1;ctx.stroke();
      // Голые ноги длиннее
      pxRect(ctx,Math.round(cx-lw*1.1),ly+legH*0.32,lw,legH*0.70,skinC);
      pxRect(ctx,Math.round(cx+lw*0.1), ly+legH*0.32,lw,legH*0.70,skinC);
    } else if(pantsStyle==='jeans'){
      pxRect(ctx,Math.round(cx-lw*1.2),ly,lw,legH,pantsC,'#1a1a2e');
      pxRect(ctx,Math.round(cx+lw*0.2), ly,lw,legH,pantsC,'#1a1a2e');
      // Шов на джинсах
      px(ctx,Math.round(cx-lw*0.7),ly+PX,'#0a0a2288',PX);
      px(ctx,Math.round(cx+lw*0.7),ly+PX,'#0a0a2288',PX);
    } else if(pantsStyle==='leggings'){
      const llw=lw-PX;
      pxRect(ctx,Math.round(cx-llw*1.1),ly,llw,legH,pantsC);
      pxRect(ctx,Math.round(cx+llw*0.1), ly,llw,legH,pantsC);
      pxRect(ctx,Math.round(cx-llw*1.1),ly+legH-PX*2,llw,PX*2,pantsHL+'88');
      pxRect(ctx,Math.round(cx+llw*0.1), ly+legH-PX*2,llw,PX*2,pantsHL+'88');
    }
    // Обувь
    drawBoots(ctx,cx,ly,legH,lw,isFem,bootStyle,bootC);
  } else {
    pxRect(ctx,Math.round(cx-bodyW*0.3-lw/2),ly,lw,legH,pantsC,'#1a1a2e');
    pxRect(ctx,Math.round(cx+bodyW*0.3-lw/2),ly,lw,legH,pantsC,'#1a1a2e');
    if(pantsStyle==='shorts'){
      // Шорты — рисуем поверх нижнюю часть кожей
      const shortH=Math.round(legH*0.52);
      pxRect(ctx,Math.round(cx-bodyW*0.3-lw/2),ly+shortH,lw,legH-shortH,skinC);
      pxRect(ctx,Math.round(cx+bodyW*0.3-lw/2),ly+shortH,lw,legH-shortH,skinC);
      pxRect(ctx,Math.round(cx-bodyW*0.3-lw/2),ly+shortH-PX*2,lw,PX*2,pantsHL+'66');
      pxRect(ctx,Math.round(cx+bodyW*0.3-lw/2),ly+shortH-PX*2,lw,PX*2,pantsHL+'66');
    } else if(pantsStyle==='sweat'){
      // Резинка снизу
      pxRect(ctx,Math.round(cx-bodyW*0.3-lw/2),ly+legH-PX*3,lw+PX*2,PX*3,pantsHL+'88');
      pxRect(ctx,Math.round(cx+bodyW*0.3-lw/2-PX),ly+legH-PX*3,lw+PX*2,PX*3,pantsHL+'88');
    } else if(pantsStyle==='trousers'){
      // Линия-стрелка по центру брюк
      px(ctx,Math.round(cx-bodyW*0.3),ly+PX,'#0a0a1a44',PX);
      px(ctx,Math.round(cx+bodyW*0.3),ly+PX,'#0a0a1a44',PX);
    }
    drawBoots(ctx,cx,ly,legH,lw,isFem,bootStyle,bootC,bodyW);
  }
}

function drawBoots(ctx,cx,ly,legH,lw,isFem,style,c,bodyW=0){
  const bly=ly+legH;
  if(isFem){
    const lx1=Math.round(cx-lw*1.2),lx2=Math.round(cx+lw*0.0);
    if(style===''||style==='heels'){
      pxRect(ctx,lx1,bly,lw+PX*2,PX*3,c);pxRect(ctx,lx2,bly,lw+PX*2,PX*3,c);
      // Каблук
      pxRect(ctx,lx1+lw,bly+PX,PX*2,PX*4,c);pxRect(ctx,lx2+lw,bly+PX,PX*2,PX*4,c);
    } else if(style==='sneakers'){
      pxRect(ctx,lx1,bly,lw+PX*3,PX*3,c);pxRect(ctx,lx2,bly,lw+PX*3,PX*3,c);
      pxRect(ctx,lx1,bly+PX,lw+PX*3,PX,'#ffffff44');
    } else if(style==='boots'){
      // Голенище
      pxRect(ctx,lx1,bly-PX*5,lw,PX*5,c,'#0a0a1e');pxRect(ctx,lx2,bly-PX*5,lw,PX*5,c,'#0a0a1e');
      pxRect(ctx,lx1,bly,lw+PX*2,PX*3,c);pxRect(ctx,lx2,bly,lw+PX*2,PX*3,c);
    } else if(style==='sandals'){
      pxRect(ctx,lx1,bly+PX,lw+PX*3,PX*2,c);pxRect(ctx,lx2,bly+PX,lw+PX*3,PX*2,c);
      // Ремешок
      pxRect(ctx,lx1,bly-PX*2,lw,PX,c);pxRect(ctx,lx2,bly-PX*2,lw,PX,c);
    }
  } else {
    const lx1=Math.round(cx-bodyW*0.3-lw/2),lx2=Math.round(cx+bodyW*0.3-lw/2);
    if(style===''||style==='sneakers'){
      pxRect(ctx,lx1,bly,lw+PX*2,PX*2,c);pxRect(ctx,lx2,bly,lw+PX*2,PX*2,c);
      pxRect(ctx,lx1+PX,bly,lw,PX,'#ffffff33');
    } else if(style==='boots'){
      pxRect(ctx,lx1,bly-PX*4,lw-PX,PX*4,c,'#0a0a1e');pxRect(ctx,lx2,bly-PX*4,lw-PX,PX*4,c,'#0a0a1e');
      pxRect(ctx,lx1,bly,lw+PX,PX*2,c);pxRect(ctx,lx2,bly,lw+PX,PX*2,c);
    } else if(style==='sandals'){
      pxRect(ctx,lx1,bly+PX,lw+PX*2,PX,c);pxRect(ctx,lx2,bly+PX,lw+PX*2,PX,c);
      pxRect(ctx,lx1,bly-PX,lw,PX,c);pxRect(ctx,lx2,bly-PX,lw,PX,c);
    } else if(style==='loafers'){
      pxRect(ctx,lx1-PX,bly,lw+PX*3,PX*2,c);pxRect(ctx,lx2-PX,bly,lw+PX*3,PX*2,c);
      px(ctx,lx1,bly,'#ffffff22',PX);
    }
  }
}

function drawGlasses(ctx,headX,headY,headS,isFem,style,c,lc){
  if(!style)return;
  const gy=headY+PX*3;
  ctx.save();
  if(style==='aviator'){
    ctx.fillStyle=lc;ctx.fillRect(headX+PX,gy,PX*4,PX*3);ctx.fillRect(headX+PX*5,gy,PX*4,PX*3);
    ctx.strokeStyle=c;ctx.lineWidth=PX*0.8;ctx.strokeRect(headX+PX,gy,PX*4,PX*3);ctx.strokeRect(headX+PX*5,gy,PX*4,PX*3);
    ctx.fillStyle=c;ctx.fillRect(headX+PX*5-1,gy+PX,2,PX);// мост
  } else if(style==='round'){
    [headX+PX*3,headX+PX*7].forEach(hx=>{
      ctx.fillStyle=lc;ctx.beginPath();ctx.arc(hx,gy+PX*1.5,PX*2.2,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle=c;ctx.lineWidth=PX*0.8;ctx.beginPath();ctx.arc(hx,gy+PX*1.5,PX*2.2,0,Math.PI*2);ctx.stroke();
    });
    ctx.fillStyle=c;ctx.fillRect(headX+PX*5-1,gy+PX,2,PX);
  } else if(style==='sport'||style==='visor'){
    ctx.fillStyle=lc;ctx.fillRect(headX+PX,gy,headS-PX*2,PX*3);
    ctx.strokeStyle=c;ctx.lineWidth=PX*0.8;ctx.strokeRect(headX+PX,gy,headS-PX*2,PX*3);
  } else if(style==='cateye'){
    [[headX+PX,PX*4],[headX+PX*5,PX*4]].forEach(([bx,bw])=>{
      ctx.fillStyle=lc;
      ctx.beginPath();ctx.moveTo(bx,gy+PX*3);ctx.lineTo(bx,gy+PX);ctx.lineTo(bx+PX*2,gy-PX);ctx.lineTo(bx+bw,gy);ctx.lineTo(bx+bw,gy+PX*3);ctx.closePath();ctx.fill();
      ctx.strokeStyle=c;ctx.lineWidth=PX*0.7;ctx.stroke();
    });
    ctx.fillStyle=c;ctx.fillRect(headX+PX*5-1,gy+PX,2,PX);
  } else if(style==='hearts'){
    [[headX+PX*3,headX+PX*7]].flat().forEach(hx=>{
      ctx.fillStyle=lc;
      ctx.beginPath();ctx.arc(hx-PX,gy,PX*1.5,Math.PI,0);ctx.arc(hx+PX,gy,PX*1.5,Math.PI,0);
      ctx.lineTo(hx,gy+PX*3);ctx.closePath();ctx.fill();
      ctx.strokeStyle=c;ctx.lineWidth=1;ctx.stroke();
    });
  }
  ctx.restore();
}

function drawPlayerAt(ctx,cx,py,fat,gender,outfit,frame=0,mL=false,mR=false,shield=0,magnet=0,W=400,dbl=0){
  const fatN=Math.min(fat/100,1);
  const isFem=gender==='female';
  const bodyBaseW=isFem?7:9;
  const bodyW=Math.round((bodyBaseW+fatN*10)*PX);
  const headS=8*PX,legH=7*PX;
  const shW=isFem?bodyW*(0.70+fatN*0.20):bodyW;
  const hipW=isFem?bodyW*(0.76+fatN*0.30):bodyW*0.9;
  const bodyH=Math.round((6+fatN*4)*PX);
  const bodyY=py-bodyH-legH,headY=bodyY-headS,headX=Math.round(cx-headS/2);
  const moving=mL||mR,legA=Math.sin(frame*0.22)*3*(moving?1:0);

  if(shield>0){ctx.strokeStyle=`rgba(100,150,255,${0.35+Math.sin(frame*0.15)*0.3})`;ctx.lineWidth=PX*2;ctx.beginPath();ctx.ellipse(cx,bodyY+bodyH/2,bodyW+PX*5,bodyH+headS+PX*5,0,0,Math.PI*2);ctx.stroke();}
  if(magnet>0){ctx.strokeStyle='rgba(34,170,255,0.12)';ctx.lineWidth=PX;ctx.beginPath();ctx.arc(cx,bodyY,W*0.22,0,Math.PI*2);ctx.stroke();}
  if(dbl>0){ctx.strokeStyle=`rgba(255,238,0,${0.2+Math.sin(frame*0.2)*0.15})`;ctx.lineWidth=PX*1.5;ctx.beginPath();ctx.arc(cx,bodyY+bodyH/2,bodyW+PX*7,0,Math.PI*2);ctx.stroke();}

  ctx.fillStyle='rgba(0,0,0,0.22)';ctx.beginPath();ctx.ellipse(cx,py+2,bodyW*0.5,4,0,0,Math.PI*2);ctx.fill();

  // Ноги + обувь (рисуем под телом)
  if(!isFem){
    // Временные ноги (под анимацию ходьбы)
    const lx1=Math.round(cx-bodyW*0.3-2*PX),lx2=Math.round(cx+bodyW*0.3-2*PX);
    pxRect(ctx,lx1,bodyY+bodyH+legA,4*PX,legH-legA,outfit.pantsC,'#1a1a2e');
    pxRect(ctx,lx2,bodyY+bodyH-legA,4*PX,legH+legA,outfit.pantsC,'#1a1a2e');
    if(outfit.pantsStyle==='shorts'){const sh=Math.round(legH*0.52);[lx1,lx2].forEach(lx=>{pxRect(ctx,lx,bodyY+bodyH+sh,4*PX,legH-sh,outfit.skinC);pxRect(ctx,lx,bodyY+bodyH+sh-PX*2,4*PX,PX*2,outfit.pantsHL+'66');});}
    else if(outfit.pantsStyle==='sweat'){[lx1,lx2].forEach(lx=>pxRect(ctx,lx-PX,bodyY+bodyH+legH-PX*3,4*PX+PX*2,PX*3,outfit.pantsHL+'88'));}
    else if(outfit.pantsStyle==='trousers'){[lx1,lx2].forEach(lx=>px(ctx,lx+PX*2,bodyY+bodyH+PX,'#0a0a1a44',PX));}
    drawBoots(ctx,cx,bodyY+bodyH,legH,4*PX,false,outfit.bootStyle,outfit.bootC,bodyW);
  } else {
    drawLegs(ctx,cx,bodyY,bodyH,legH,bodyW,hipW,true,outfit.pantsStyle,outfit.pantsC,outfit.pantsHL,outfit.bootStyle,outfit.bootC,outfit.skinC);
  }

  // Тело (рубашка)
  drawShirt(ctx,cx,Math.round(cx-shW/2),bodyY,bodyW,bodyH,shW,hipW,isFem,outfit.shirtStyle,outfit.shirtC,outfit.shirtHL);

  // Руки
  const aW=3*PX,aH=isFem?3*PX:5*PX,aY=bodyY+PX*2;
  const aS=Math.sin(frame*0.22)*4*(moving?1:0);
  pxRect(ctx,Math.round(cx-shW/2)-aW,aY+aS, aW,aH,outfit.skinC,'#1a1a2e');
  pxRect(ctx,Math.round(cx+shW/2),   aY-aS,aW,aH,outfit.skinC,'#1a1a2e');

  // Голова
  pxRect(ctx,headX,headY,headS,headS,outfit.skinC,'#1a1a2e');
  ctx.fillStyle=outfit.skinD+'55';ctx.fillRect(headX+PX,headY+PX*3,PX*2,PX*2);ctx.fillRect(headX+PX*5,headY+PX*3,PX*2,PX*2);

  // Волосы (под шапку)
  drawHair(ctx,cx,headX,headY,headS,isFem,outfit.hairStyle,outfit.hairC,outfit.hairHL);

  // Шапка (поверх волос)
  drawHat(ctx,cx,headX,headY,headS,isFem,outfit.hatStyle,outfit.hatC,outfit.hatC2);

  // Глаза
  const eY=headY+PX*3,eS=mR?PX:(mL?-PX:0);
  pxRect(ctx,headX+PX*2-1,eY-1,PX*2+2,PX*2+2,'#fffde8');pxRect(ctx,headX+PX*5-1,eY-1,PX*2+2,PX*2+2,'#fffde8');
  px(ctx,headX+PX*2+eS,eY,'#1a1a1a',PX*2);px(ctx,headX+PX*5+eS,eY,'#1a1a1a',PX*2);
  px(ctx,headX+PX*2+eS,eY,'#ffffffaa',PX);px(ctx,headX+PX*5+eS,eY,'#ffffffaa',PX);
  if(isFem){[headX+PX*2-PX,headX+PX*2,headX+PX*2+PX,headX+PX*5-PX,headX+PX*5,headX+PX*5+PX].forEach(rx=>px(ctx,rx,eY-PX*2,outfit.hairC,PX));[headX+PX*2+PX*2,headX+PX*5+PX*2].forEach(rx=>px(ctx,rx,eY-PX,outfit.hairC,PX));}

  // Очки (поверх всего)
  drawGlasses(ctx,headX,headY,headS,isFem,outfit.glassStyle,outfit.glassC,outfit.glassL);

  // Рот
  const mY=headY+PX*5;
  if(fatN<0.58){px(ctx,headX+PX*2,mY+PX,'#333',PX);px(ctx,headX+PX*3,mY+PX*2,'#333',PX);px(ctx,headX+PX*4,mY+PX*2,'#333',PX);px(ctx,headX+PX*5,mY+PX,'#333',PX);}
  else if(fatN<0.82){ctx.fillStyle='#333';ctx.fillRect(headX+PX*2,mY+PX,PX*4,PX);}
  else{px(ctx,headX+PX*2,mY+PX*2,'#333',PX);px(ctx,headX+PX*3,mY+PX,'#333',PX);px(ctx,headX+PX*4,mY+PX,'#333',PX);px(ctx,headX+PX*5,mY+PX*2,'#333',PX);}
  if(isFem)px(ctx,headX+PX*3,headY+PX*6,'#ff3377',PX*2);
  if(fatN>0.72){px(ctx,headX+headS+PX,headY+PX*3,'#44aaff',PX);px(ctx,headX+headS+PX,headY+PX*5,'#44aaff',PX);}
}

// ============================================================
// ФОН
// ============================================================
function drawBGFull(ctx,gs,bgIdx){
  const bg=BACKGROUNDS[bgIdx],{W,H,frame:fr}=gs||{W:400,H:560,frame:0};
  const grad=ctx.createLinearGradient(0,0,0,H);grad.addColorStop(0,bg.sky[0]);grad.addColorStop(1,bg.sky[1]);
  ctx.fillStyle=grad;ctx.fillRect(0,0,W,H);
  if(bg.starField&&gs&&gs.bgStars) gs.bgStars.forEach(s=>{const t=Math.sin(fr*0.05+s.blink)*0.5+0.5;ctx.fillStyle=`rgba(200,220,255,${0.3+t*0.7})`;ctx.fillRect(s.x,s.y,s.s,s.s);});
  if(bg.sunset){ctx.fillStyle='#ff880099';ctx.beginPath();ctx.arc(W*0.75,H*0.18,32,0,Math.PI*2);ctx.fill();ctx.fillStyle='#ff440033';ctx.beginPath();ctx.arc(W*0.75,H*0.18,50,0,Math.PI*2);ctx.fill();for(let i=0;i<6;i++){const a=i*Math.PI/3+(fr*0.005);ctx.strokeStyle='rgba(255,180,0,0.07)';ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(W*0.75,H*0.18);ctx.lineTo(W*0.75+Math.cos(a)*120,H*0.18+Math.sin(a)*120);ctx.stroke();}}
  if(bg.dungeon){for(let y=0;y<H-30;y+=PX*6){const off=(Math.floor(y/(PX*6))%2)*PX*5;for(let x=-off;x<W;x+=PX*10){ctx.strokeStyle='#1a1a1a44';ctx.lineWidth=1;ctx.strokeRect(x,y,PX*10,PX*6);}}[W*0.1,W*0.9].forEach(tx=>{ctx.font='15px serif';ctx.textAlign='center';ctx.fillText('🔥',tx,H*0.22+Math.sin(fr*0.12)*2);});}
  if(bg.trees){[0.07,0.20,0.80,0.93].forEach(tx=>{ctx.fillStyle='#0a1a0a';ctx.fillRect(W*tx-4,H-90,8,60);ctx.beginPath();ctx.arc(W*tx,H-92,24,0,Math.PI*2);ctx.fill();});if(gs&&!gs.detoxRound){ctx.strokeStyle='rgba(100,150,220,0.32)';ctx.lineWidth=1;for(let i=0;i<28;i++){const rx=((i*137+(fr*3))%W),ry=((i*53+(fr*4))%H);ctx.beginPath();ctx.moveTo(rx,ry);ctx.lineTo(rx-2,ry+8);ctx.stroke();}}}
  if(bg.starField&&gs&&fr%400<3){const mx=(fr*7)%W,my=(fr*5)%H;ctx.strokeStyle='rgba(200,200,255,0.7)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(mx,my);ctx.lineTo(mx+30,my+15);ctx.stroke();}
  const gy=H-30;for(let x=0;x<W;x+=PX*2){px(ctx,x,gy,bg.ground,PX*2);px(ctx,x,gy+PX*2,bg.ground,PX*2);}for(let x=0;x<W;x+=PX*4)px(ctx,x,gy-PX,bg.grass,PX*2);
  if(gs&&gs.detoxRound){ctx.fillStyle=`rgba(0,200,80,${0.05+Math.sin(fr*0.1)*0.03})`;ctx.fillRect(0,0,W,H);}
}

function drawBGPreview(ctx,x,y,w,h,bgIdx){
  const bg=BACKGROUNDS[bgIdx];const g=ctx.createLinearGradient(x,y,x,y+h);g.addColorStop(0,bg.sky[0]);g.addColorStop(1,bg.sky[1]);ctx.fillStyle=g;ctx.fillRect(x,y,w,h);
  if(bg.starField){for(let i=0;i<14;i++)px(ctx,x+Math.random()*w,y+Math.random()*h*0.75,'#ffffffbb',1);}
  if(bg.sunset){ctx.fillStyle='#ff9900cc';ctx.beginPath();ctx.arc(x+w*0.75,y+h*0.22,7,0,Math.PI*2);ctx.fill();}
  if(bg.trees){ctx.fillStyle='#0a1a0a';ctx.fillRect(x+w*0.2-2,y+h-14,4,10);ctx.beginPath();ctx.arc(x+w*0.2,y+h-16,7,0,Math.PI*2);ctx.fill();ctx.strokeStyle='rgba(100,150,220,0.5)';ctx.lineWidth=1;for(let i=0;i<4;i++){const rx=x+i*(w/4);ctx.beginPath();ctx.moveTo(rx,y+h*0.3);ctx.lineTo(rx-1,y+h*0.3+6);ctx.stroke();}}
  if(bg.dungeon){for(let dy=0;dy<h;dy+=6){ctx.strokeStyle='#33333366';ctx.lineWidth=1;ctx.strokeRect(x,y+dy,w,6);}}
  ctx.fillStyle=bg.ground;ctx.fillRect(x,y+h-7,w,7);ctx.fillStyle=bg.grass;ctx.fillRect(x,y+h-9,w,3);
}

// ============================================================
// НАСТРОЙКИ
// ============================================================
function drawSettings(ctx,W,H){
  ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,W,H);
  for(let x=0;x<W;x+=16)for(let y=0;y<H;y+=16){ctx.fillStyle='#0d0d22';ctx.fillRect(x,y,14,14);}
  ctx.strokeStyle='#6c63ff44';ctx.lineWidth=1;for(let x=0;x<W;x+=32){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}for(let y=0;y<H;y+=32){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
  ctx.strokeStyle='#6c63ff';ctx.lineWidth=PX;ctx.strokeRect(PX,PX,W-PX*2,H-PX*2);
  pxText(ctx,i18n.settings_lbl,W/2,26,'#ffe066',14);
  const tabs=[[i18n.location,'bg'],[i18n.character,'char'],[i18n.difficulty,'diff']];
  tabs.forEach(([l,id],i)=>{const bx=W*0.04+i*(W*0.32),bw=W*0.29;pxBtn(ctx,bx,36,bw,22,l,settingsTab===id?'#6c63ff':'#223344',settingsTab===id?'#fff':'#aaaacc',8);});

  if(settingsTab==='bg'){
    pxText(ctx,i18n.choose_loc,W/2,72,'#aaaacc',10);
    const pw=Math.round(W*0.42),ph=50,gap=8,ox=(W-pw*2-gap)/2;
    BACKGROUNDS.forEach((bg,i)=>{const col=i%2,row=Math.floor(i/2),bx=ox+col*(pw+gap),by=84+row*(ph+26);drawBGPreview(ctx,bx,by,pw,ph,i);const sel=i===S.bg;ctx.strokeStyle=sel?'#6c63ff':'#334466';ctx.lineWidth=sel?PX*1.5:1;ctx.strokeRect(bx,by,pw,ph);pxBtn(ctx,bx,by+ph+2,pw,18,bg.name,sel?'#6c63ff':'#223344',sel?'#fff':'#aaaacc',8);});
  }

  if(settingsTab==='char'){
    const g=S.gender||'male';
    const outfit=getOutfit();
    // Превью
    const preX=Math.round(W*0.22),preY=Math.round(H*0.44);
    pxText(ctx,i18n.preview,preX,65,'#aaaacc',8);
    drawPlayerAt(ctx,preX,preY,15,g,outfit,0);

    // Пол
    pxText(ctx,(i18n.gender_lbl||'Gender'),W*0.70,65,'#aaaacc',8,'center');
    [['👦',W*0.52,'male'],['👧',W*0.76,'female']].forEach(([l,bx,gv])=>pxBtn(ctx,bx-2,68,W*0.22,20,l,g===gv?'#6c63ff':'#223344',g===gv?'#fff':'#aaaacc',9));

    // Иконки слотов
    const sx0=W*0.48,sw=(W*0.49)/6;
    SLOT_ICONS.forEach((ico,i)=>{const bx=sx0+i*sw;pxRect(ctx,bx,92,sw-2,22,charSlot===i?'#6c63ff':'#223344',charSlot===i?'#aaaaff':'#334466');pxText(ctx,ico,bx+sw/2-1,108,'#fff',12);});

    const lbl=(g==='male'?(i18n.slot_labels||SLOT_LBL_M):(i18n.slot_labels_f||SLOT_LBL_F))[charSlot];
    pxText(ctx,lbl,W*0.73,128,'#ffe066',9);

    // Подвкладки: ФОРМА / ЦВЕТ
    pxBtn(ctx,W*0.48,132,W*0.24,18,i18n.style_lbl,charSubtab==='style'?'#6c63ff':'#223344',charSubtab==='style'?'#fff':'#aaaacc',8);
    pxBtn(ctx,W*0.73,132,W*0.24,18,i18n.color_lbl,charSubtab==='color'?'#6c63ff':'#223344',charSubtab==='color'?'#fff':'#aaaacc',8);

    const pool=charSubtab==='style'
      ? STYLES[g][SLOTS[charSlot]]
      : (PAL[SLOTS[charSlot].replace('glass','glass')]||PAL.shirt);
    const curVal=charSubtab==='style'
      ? [S.hat_s,S.hair_s,S.shirt_s,S.pants_s,S.boot_s,S.glass_s][charSlot]
      : [S.hat_c,S.hair_c,S.shirt_c,S.pants_c,S.boot_c,S.glass_c][charSlot];

    // Отрисовка вариантов (2 ряда по 4)
    const swW=Math.round(W*0.115),swH=20,swGap=3,swTW=4*(swW+swGap)-swGap,swOx=W*0.48+(W*0.49-swTW)/2;
    pool.forEach((item,i)=>{
      const col=i%4,row=Math.floor(i/4);
      const bx=swOx+col*(swW+swGap),by=156+row*(swH+14);
      const sel=curVal===i;
      if(charSubtab==='style'){
        pxRect(ctx,bx,by,swW,swH,sel?'#334488':'#1a1a2a',sel?'#aaaaff':'#333366');
        pxText(ctx,item.n,bx+swW/2,by+swH/2+4,sel?'#ffe066':'#aaaacc',7);
      } else {
        const c=item.c||'#1a1a2a';
        pxRect(ctx,bx,by,swW,swH,c,sel?'#ffffff':'#333366');
        if(item.c2)pxRect(ctx,bx+swW*0.6,by,swW*0.4,swH,item.c2);
        if(sel){ctx.strokeStyle='#ffe066';ctx.lineWidth=2;ctx.strokeRect(bx,by,swW,swH);}
        pxText(ctx,item.n,bx+swW/2,by+swH+10,'#aaaacc',6);
      }
    });
  }

  if(settingsTab==='diff'){
    pxText(ctx,(i18n.choose_difficulty||'Difficulty'),W/2,72,'#aaaacc',10);
    DIFFICULTY.forEach((d,i)=>{const by=84+i*66,sel=i===S.diff;pxRect(ctx,W*0.06,by,W*0.88,56,sel?'#1a1a44':'#0f0f22',sel?'#6c63ff':'#334466');pxText(ctx,d.name,W/2,by+22,sel?'#ffe066':'#aaaacc',13);pxText(ctx,[i18n.diff_desc_easy,i18n.diff_desc_normal,i18n.diff_desc_hard][i],W/2,by+40,'#666688',8);});
    pxText(ctx,i18n.record_lbl+' '+S.highScore,W/2,292,'#ffe066',12);
  }
  pxBtn(ctx,W*0.05,H-52,W*0.90,34,i18n.back_lbl||'◀ Back','#334455','#aaccff',11);
}

// ============================================================
// HUD
// ============================================================
function drawHUD(ctx,gs){
  const{W}=gs;
  if(gs.fat>82){ctx.fillStyle=`rgba(180,0,0,${0.06+Math.sin(gs.frame*0.2)*0.04})`;ctx.fillRect(0,0,W,gs.H);}
  ctx.fillStyle='rgba(6,6,18,0.92)';ctx.fillRect(0,0,W,36);
  pxText(ctx,'⚙️',16,24,'#aaaacc',13,'left');
  pxText(ctx,'⭐'+gs.score+(gs.combo>1?' x'+gs.combo:''),W/2,24,'#ffe066',12);
  ctx.textAlign='right';ctx.font='11px monospace';ctx.fillStyle='#fff';ctx.fillText('❤️'.repeat(gs.lives),W-6,24);
  const bY=36,bH=10;ctx.fillStyle='#080818';ctx.fillRect(0,bY,W,bH);
  const fc=gs.fat<40?'#44ee44':gs.fat<70?'#eebb22':gs.fat<85?'#ee7700':'#ee2200';
  ctx.fillStyle=fc;ctx.fillRect(0,bY,W*(gs.fat/100),bH);
  for(let i=1;i<10;i++){ctx.fillStyle='rgba(0,0,0,0.4)';ctx.fillRect(W/10*i-1,bY,2,bH);}
  pxText(ctx,'⚖️ '+Math.round(gs.fat)+'%',W/2,bY+8,'#ffffffaa',8);
  if(gs.detoxRound)pxText(ctx,i18n.detox,8,bY+8,'#44ff88',8,'left');else pxText(ctx,i18n.wave+' '+gs.wave,8,bY+8,'#5566aa',8,'left');
  let bx=W-8;[gs.double>0&&'⭐',gs.magnet>0&&'🧲',gs.shield>0&&'🛡️'].filter(Boolean).forEach(ic=>{ctx.textAlign='right';ctx.font='12px serif';ctx.fillText(ic,bx,bY+8);bx-=17;});
}

// ============================================================
// ЕДА
// ============================================================
function drawFood(ctx,f){
  ctx.shadowColor=f.isPowerup?'#ffff88':f.isJunk?'#ff4444':'#44ff44';ctx.shadowBlur=f.rare?20:10;
  ctx.font=`${f.size}px serif`;ctx.textAlign='center';ctx.fillText(f.emoji,f.x,f.y+f.size*0.8);ctx.shadowBlur=0;
  if(f.rare)pxText(ctx,'★',f.x+f.size*0.42,f.y,'#ffee00',10);
  pxText(ctx,f.isPowerup?f.name:f.isJunk?i18n.junk:i18n.healthy,f.x,f.y+f.size+11,f.isPowerup?'#ffee88':f.isJunk?'#ff8888':'#88ff88',8);
}

// ============================================================
// СПАВН
// ============================================================
function spawnFood(){
  const gs=GS,diff=DIFFICULTY[S.diff];
  const maxOS=Math.min(diff.maxItems,3+Math.floor(gs.wave*0.75));
  if(gs.foods.length>=maxOS)return;
  const LANES=4,laneW=gs.W/LANES,avail=[];
  for(let i=0;i<LANES;i++){if(gs.frame-laneLastSpawn[i]<diff.laneCool)continue;const lx=laneW*(i+0.5);if(!gs.foods.some(f=>Math.abs(f.x-lx)<50&&f.y<gs.H*0.28))avail.push(i);}
  if(!avail.length)return;
  const lane=avail[Math.floor(Math.random()*avail.length)];
  laneLastSpawn[lane]=gs.frame;
  const lx=laneW*(lane+0.5)+(Math.random()-0.5)*laneW*0.22;
  const roll=Math.random();let pool,isJunk=false,isPowerup=false,isRare=false;
  if(gs.detoxRound){pool=FOOD_ITEMS.healthy.filter(f=>!f.rare);}
  else if(roll<0.07&&gs.score>30){pool=FOOD_ITEMS.powerup;isPowerup=true;}
  else if(roll<0.10&&gs.score>80){pool=FOOD_ITEMS.healthy.filter(f=>f.rare);isRare=true;}
  else if(roll<0.44){pool=FOOD_ITEMS.junk;isJunk=true;}
  else{pool=FOOD_ITEMS.healthy.filter(f=>!f.rare);}
  if(!pool||!pool.length)pool=FOOD_ITEMS.healthy.filter(f=>!f.rare);
  const item=pool[Math.floor(Math.random()*pool.length)];
  GS.foods.push({x:lx,y:-34,size:30,speed:gs.speed*(0.78+Math.random()*0.44),...item,isJunk,isPowerup,rare:isRare,wobble:Math.random()*Math.PI*2,wobbleSpeed:(Math.random()-0.5)*0.022});
}
function spawnParticles(x,y,c,n=6){for(let i=0;i<n;i++)GS.particles.push({x,y,vx:(Math.random()-0.5)*4,vy:-Math.random()*3-1,color:c,life:1,size:PX*(1+Math.floor(Math.random()*2))});}

// ============================================================
// ЭКРАНЫ
// ============================================================
function drawStart(ctx,W,H){
  ctx.fillStyle='rgba(6,6,18,0.88)';ctx.fillRect(0,H*0.04,W,H*0.89);
  ctx.strokeStyle='#6c63ff';ctx.lineWidth=PX;ctx.strokeRect(PX,H*0.04+PX,W-PX*2,H*0.89-PX*2);
  pxText(ctx,'NUTRIO RUNNER',W/2,H*0.11,'#ffe066',17);
  [[i18n.healthy,(i18n.catch_food||'Catch — earn points'),'#88ff88'],[i18n.junk,i18n.avoid_food,'#ff8888'],[(i18n.powerup_magnet||'🧲 Magnet'),i18n.desc_magnet,'#aaddff'],[(i18n.powerup_shield||'🛡️ Shield'),i18n.desc_shield,'#aaaaff'],[(i18n.powerup_pill||'💊 Pill'),i18n.desc_pill,'#ff88ff'],[(i18n.powerup_x2||'⭐ x2'),i18n.desc_x2,'#ffee66'],[(i18n.powerup_life||'❤️ +Life'),i18n.desc_life,'#ff6666'],[(i18n.powerup_detox||'🍃 Detox'),i18n.desc_detox,'#88ffaa'],[(i18n.powerup_combo||'💪 Combo'),(i18n.desc_combo||'5 in a row = -5% fat'),'#aaffcc']].forEach(([icon,desc,c],i)=>{pxText(ctx,icon,W*0.07,H*0.20+i*22,c,8,'left');pxText(ctx,desc,W*0.39,H*0.20+i*22,'#888899',8,'left');});
  pxBtn(ctx,W/2-65,H*0.86,130,36,i18n.play);
  pxBtn(ctx,W/2-65,H*0.93,130,26,(i18n.settings_btn||'⚙️ Settings'),'#334455','#aaccff',10);
}
function drawGender(ctx,W,H){
  ctx.fillStyle='rgba(6,6,18,0.94)';ctx.fillRect(0,0,W,H);ctx.strokeStyle='#6c63ff';ctx.lineWidth=PX;ctx.strokeRect(PX*3,H*0.2,W-PX*6,H*0.6);
  pxText(ctx,i18n.choose_char,W/2,H*0.29,'#ffe066',15);pxText(ctx,lang==='ru'?(LANG==='ru'?(LANG==='ru'?'(можно сменить в настройках)':'(change in settings)'):'(change in settings)'):'(can be changed in settings)',W/2,H*0.36,'#555577',8);
  pxBtn(ctx,W*0.10,H*0.44,W*0.34,50,i18n.gender_m,'#3a5fa0');pxBtn(ctx,W*0.56,H*0.44,W*0.34,50,i18n.gender_f,'#a03a7a');
}
function drawOver(ctx,gs){
  const{W,H,score,maxCombo}=gs;ctx.fillStyle='rgba(4,4,16,0.93)';ctx.fillRect(0,0,W,H);ctx.strokeStyle='#ff4444';ctx.lineWidth=PX;ctx.strokeRect(PX*2,H*0.13,W-PX*4,H*0.74);
  pxText(ctx,'GAME OVER',W/2,H*0.24,'#ff4444',20);pxText(ctx,i18n.score_lbl+score,W/2,H*0.34,'#ffe066',15);pxText(ctx,i18n.record_lbl2+S.highScore,W/2,H*0.42,'#aaaacc',10);pxText(ctx,i18n.max_combo_lbl+maxCombo,W/2,H*0.49,'#ff88ff',10);
  const medal=score>=500?'🏆':score>=200?'🥈':score>=100?'🥉':'💪';ctx.font='30px serif';ctx.textAlign='center';ctx.fillText(medal,W/2,H*0.59);
  pxBtn(ctx,W/2-65,H*0.67,130,36,i18n.again);pxBtn(ctx,W/2-65,H*0.77,130,28,i18n.menu_btn,'#334455','#aaccff',10);
}

// ============================================================
// ИНИЦИАЛИЗАЦИЯ
// ============================================================
function _drawPause(gs){
  var ctx=gs.ctx,W=gs.W,H=gs.H;
  ctx.fillStyle='rgba(0,0,0,0.55)';ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#ffe066';ctx.font='bold 18px monospace';ctx.textAlign='center';
  ctx.fillText(i18n&&i18n.pause_lbl?i18n.pause_lbl:'⏸ PAUSED',W/2,H*0.42);
  ctx.fillStyle='#334488';ctx.beginPath();
  var bx=W*0.25,by=H*0.5,bw=W*0.5,bh=34;
  ctx.roundRect(bx,by,bw,bh,8);ctx.fill();
  ctx.fillStyle='#ffffff';ctx.font='13px monospace';
  ctx.fillText(i18n&&i18n.resume_lbl?i18n.resume_lbl:'▶ Resume',W/2,by+22);
}

function _saveGameSettings(){
  try{
    // Сохраняем настройки текущего пола отдельно
    var g = S.char.gender;
    var key = g === 'male' ? 'slots_m' : 'slots_f';
    var pkey = g === 'male' ? 'palette_m' : 'palette_f';
    S[key] = S.char.slots.slice();
    S[pkey] = S.char.palette.slice();
    localStorage.setItem('nutrio_game_settings', JSON.stringify({
      bg: S.bg, diff: S.diff,
      gender: S.char.gender,
      slots_m: S.slots_m || [0,0,0,0,0,0],
      palette_m: S.palette_m || [0,0,0,0,0,0],
      slots_f: S.slots_f || [0,0,0,0,0,0],
      palette_f: S.palette_f || [0,0,0,0,0,0],
    }));
  }catch(e){}
}

function _loadGameSettings(){
  try{
    var saved = localStorage.getItem('nutrio_game_settings');
    if(!saved) return;
    var d = JSON.parse(saved);
    if(d.bg !== undefined) S.bg = d.bg;
    if(d.diff !== undefined) S.diff = d.diff;
    // Загружаем оба набора кастомизации
    S.slots_m   = d.slots_m   || [0,0,0,0,0,0];
    S.palette_m = d.palette_m || [0,0,0,0,0,0];
    S.slots_f   = d.slots_f   || [0,0,0,0,0,0];
    S.palette_f = d.palette_f || [0,0,0,0,0,0];
    // Восстанавливаем текущий пол
    if(d.gender) S.char.gender = d.gender;
    // Применяем слоты для текущего пола
    var isM = S.char.gender === 'male';
    S.char.slots   = (isM ? S.slots_m   : S.slots_f).slice();
    S.char.palette = (isM ? S.palette_m : S.palette_f).slice();
  }catch(e){}
}

function initGame(){
  const canvas=document.getElementById('gameCanvas');if(!canvas)return;
  if(GS&&GS.raf){cancelAnimationFrame(GS.raf);GS.raf=null;}
  const pw=canvas.parentElement.clientWidth-24,W=Math.min(pw,400),H=Math.round(W*1.44);
  canvas.width=W;canvas.height=H;canvas.style.width=W+'px';canvas.style.height=H+'px';
  const diff=DIFFICULTY[S.diff];laneLastSpawn=[0,0,0,0];
  GS={canvas,ctx:canvas.getContext('2d'),W,H,score:0,combo:0,maxCombo:0,fat:50,lives:5,frame:0,wave:1,speed:diff.baseSpeed,over:false,started:false,detoxRound:false,player:{x:W/2,y:H-32,w:16*PX,moveL:false,moveR:false},foods:[],effects:[],particles:[],magnet:0,shield:0,double:0,flashColor:null,flashA:0,raf:null,bgStars:Array.from({length:32},()=>({x:Math.random()*W,y:Math.random()*H,s:Math.random()<0.5?1:2,blink:Math.random()*60}))};
  ['btn-left','btn-right'].forEach((id,side)=>{const el=document.getElementById(id);if(!el)return;const on=(evs,fn)=>evs.forEach(e=>el.addEventListener(e,fn,{passive:false}));on(['touchstart','mousedown'],e=>{e.preventDefault();side===0?GS.player.moveL=true:GS.player.moveR=true;});on(['touchend','mouseup','mouseleave'],e=>{e.preventDefault();side===0?GS.player.moveL=false:GS.player.moveR=false;});});
  document.addEventListener('keydown',e=>{ if(e.key==='Escape'&&SCREEN==='game'){PAUSED=!PAUSED;return;}if(!GS)return;if(e.key==='ArrowLeft'||e.key==='a')GS.player.moveL=true;if(e.key==='ArrowRight'||e.key==='d')GS.player.moveR=true;});
  document.addEventListener('keyup',e=>{if(!GS)return;if(e.key==='ArrowLeft'||e.key==='a')GS.player.moveL=false;if(e.key==='ArrowRight'||e.key==='d')GS.player.moveR=false;});
  canvas.addEventListener('click',e=>{const r=canvas.getBoundingClientRect();handleClick((e.clientX-r.left)*(GS.W/r.width),(e.clientY-r.top)*(GS.H/r.height));});
  SCREEN=S.gender?'start':'gender';gameLoop();
}

function handleClick(cx,cy){
  const{W,H}=GS;
  if(SCREEN==='gender'){S.gender=cx<W/2?'male':'female';saveS('gender');SCREEN='start';return;}
  if(SCREEN==='start'){if(cy>H*0.86&&cy<H*0.86+36){SCREEN='game';GS.started=true;return;}if(cy>H*0.93&&cy<H*0.93+26)SCREEN='settings';return;}
  if(SCREEN==='settings'){
    [['bg',0],['char',1],['diff',2]].forEach(([t,i])=>{const bx=W*0.04+i*(W*0.32),bw=W*0.29;if(cx>bx&&cx<bx+bw&&cy>36&&cy<58)settingsTab=t;});
    if(settingsTab==='bg'){const pw=Math.round(W*0.42),ph=50,gap=8,ox=(W-pw*2-gap)/2;BACKGROUNDS.forEach((bg,i)=>{const col=i%2,row=Math.floor(i/2),bx=ox+col*(pw+gap),by=84+row*(ph+26);if(cx>bx&&cx<bx+pw&&cy>by&&cy<by+ph+20){S.bg=i;saveS('bg');}});}
    if(settingsTab==='char'){
      const g=S.gender||'male';
      // Пол
      if(cy>68&&cy<88){const ng=cx<W*0.63?'male':'female';if(ng!==S.gender){
          // Сохраняем кастомизацию текущего пола
          const oldG=S.gender||'male';
          Object.keys(DFLT).filter(k=>k.includes('_')).forEach(k=>{
            STORE.set(oldG+'_'+k, S[k]);
          });
          // Переключаем пол
          S.gender=ng; saveS('gender');
          // Загружаем кастомизацию нового пола
          Object.keys(DFLT).filter(k=>k.includes('_')).forEach(k=>{
            S[k]=STORE.get(ng+'_'+k, DFLT[k]); saveS(k);
          });
        }}
      // Слоты
      const sx0=W*0.48,sw=(W*0.49)/6;
      SLOT_ICONS.forEach((_,i)=>{const bx=sx0+i*sw;if(cx>bx&&cx<bx+sw-2&&cy>92&&cy<114){if(charSlot!==i){charSlot=i;charSubtab='style';}}});
      // Подвкладки стиль/цвет
      if(cy>128&&cy<154){if(cx>W*0.48&&cx<W*0.72)charSubtab='style';else if(cx>W*0.73&&cx<W*0.97)charSubtab='color';}
      // Свотчи
      const pool=charSubtab==='style'?STYLES[g][SLOTS[charSlot]]:(PAL[SLOTS[charSlot]]||PAL.shirt);
      const swW=Math.round(W*0.115),swH=20,swGap=3,swTW=4*(swW+swGap)-swGap,swOx=W*0.48+(W*0.49-swTW)/2;
      pool.forEach((item,i)=>{
        const col=i%4,row=Math.floor(i/4),bx=swOx+col*(swW+swGap),by=156+row*(swH+14);
        if(cx>bx&&cx<bx+swW&&cy>by&&cy<by+swH){
          const sk=SLOTS[charSlot],key=charSubtab==='style'?sk+'_s':sk+'_c';
          S[key]=i;saveS(key);
        }
      });
    }
    if(settingsTab==='diff'){DIFFICULTY.forEach((d,i)=>{const by=84+i*66;if(cy>by&&cy<by+56){S.diff=i;_saveGameSettings();saveS('diff');}});}
    // Назад
    if(cy>H-52&&cy<H-18&&cx>W*0.52&&cx<W)SCREEN='start';

    return;
  }
  if(SCREEN==='game'){
    if(cx<35&&cy<30){SCREEN='settings';return;}
    if(PAUSED){
      var bby=GS.H*0.5;
      if(cy>bby&&cy<bby+34&&cx>GS.W*0.25&&cx<GS.W*0.75){PAUSED=false;}
      return;
    }
    if(cx>GS.W-38&&cy<32){PAUSED=true;return;}
    return;
  }
  if(SCREEN==='over'){if(cy>H*0.67&&cy<H*0.67+36)restartGame();else if(cy>H*0.77&&cy<H*0.77+28)SCREEN='start';return;}
}

function restartGame(){
  const diff=DIFFICULTY[S.diff];laneLastSpawn=[0,0,0,0];
  Object.assign(GS,{score:0,combo:0,maxCombo:0,fat:50,lives:5,frame:0,wave:1,speed:diff.baseSpeed,over:false,started:true,detoxRound:false,foods:[],effects:[],particles:[],magnet:0,shield:0,double:0,flashA:0});
  SCREEN='game';
}

// ============================================================
// ГЛАВНЫЙ ЦИКЛ
// ============================================================
function gameLoop(){
  const gs=GS;if(!gs)return;
  gs.raf=requestAnimationFrame(gameLoop);
  const{ctx,W,H}=gs;
  const outfit=getOutfit();
  const gender=S.gender||'male';
  drawBGFull(ctx,gs,S.bg);

  if(SCREEN==='gender'){drawPlayerAt(ctx,W/2,H-65,15,gender,outfit,gs.frame);gs.frame++;drawGender(ctx,W,H);return;}
  if(SCREEN==='start'){drawPlayerAt(ctx,W/2,H-65,15,gender,outfit,gs.frame);gs.frame++;drawStart(ctx,W,H);return;}
  if(SCREEN==='settings'){drawSettings(ctx,W,H);return;}

  const GRACE=280;
  if(SCREEN==='game'&&!gs.over){
    gs.frame++;
    const p=gs.player,spd=W*0.016;
    if(p.moveL)p.x=Math.max(p.w/2,p.x-spd);if(p.moveR)p.x=Math.min(W-p.w/2,p.x+spd);
    if(gs.magnet>0)gs.magnet--;if(gs.shield>0)gs.shield--;if(gs.double>0)gs.double--;
    const diff=DIFFICULTY[S.diff];
    const nw=Math.floor(gs.score/diff.wavePts)+1;
    if(nw>gs.wave){gs.wave=nw;gs.speed+=diff.speedInc;gs.detoxRound=(gs.wave%4===0);gs.effects.push({x:W/2,y:H*0.44,text:gs.detoxRound?i18n.detox+'!':i18n.wave+' '+gs.wave+'!',color:gs.detoxRound?'#44ff88':'#ffe066',vy:-0.7,a:1,size:15});spawnParticles(W/2,H/2,gs.detoxRound?'#44ff44':'#6c63ff',14);if(gs.wave%3===0&&gs.lives<5){gs.lives++;gs.effects.push({x:W/2,y:H*0.37,text:(i18n.bonus_life||'+❤️ Bonus life!'),color:'#ff6666',vy:-0.5,a:1,size:12});}}
    const interval=Math.max(26,diff.spawnBase-gs.wave*3);if(gs.frame%interval===0)spawnFood();
    const fatW=(7+(gs.fat/100)*10)*PX,catchY=gs.player.y-24;
    gs.foods=gs.foods.filter(f=>{
      f.y+=f.speed;f.x+=Math.sin(gs.frame*f.wobbleSpeed+f.wobble)*0.4;
      if(gs.magnet>0&&!f.isJunk&&!f.isPowerup){const dx=p.x-f.x,dy=catchY-f.y,dist=Math.sqrt(dx*dx+dy*dy);if(dist<W*0.23){f.x+=dx*0.08;f.y+=dy*0.06;}}
      if(Math.abs(f.x-p.x)<fatW+f.size*0.8&&Math.abs(f.y-catchY)<f.size*1.4){
        if(f.isPowerup){if(f.type==='magnet')gs.magnet=f.dur;if(f.type==='shield')gs.shield=f.dur;if(f.type==='double')gs.double=f.dur;if(f.type==='pill'){gs.fat=Math.max(5,gs.fat-20);gs.effects.push({x:f.x,y:f.y-20,text:(i18n.minus_weight||'-20% fat!'),color:'#ff88ff',vy:-1,a:1,size:12});}if(f.type==='life'&&gs.lives<5){gs.lives++;gs.effects.push({x:f.x,y:f.y-20,text:'+❤️',color:'#ff6666',vy:-1,a:1,size:14});}spawnParticles(f.x,f.y,'#aaddff',10);gs.flashColor='#002244';gs.flashA=0.15;}
        else if(!f.isJunk){const multi=gs.double>0?2:1,cb=gs.combo>2?Math.min(gs.combo,8):1,pts=(f.pts||10)*cb*multi*(f.rare?2:1);gs.score+=pts;gs.combo++;if(gs.combo>gs.maxCombo)gs.maxCombo=gs.combo;gs.fat=Math.max(5,gs.fat-(gs.detoxRound?9:4));if(gs.combo%5===0){gs.fat=Math.max(5,gs.fat-5);gs.effects.push({x:f.x,y:f.y-32,text:i18n.combo_bonus,color:'#88ffaa',vy:-0.8,a:1,size:12});}gs.effects.push({x:f.x,y:f.y-20,text:f.rare?i18n.rare_prefix+pts:'+'+pts+(gs.combo>1?' x'+gs.combo:''),color:f.rare?'#ffee00':'#44ff88',vy:-1.2,a:1,size:f.rare?14:12});spawnParticles(f.x,f.y,f.rare?'#ffee00':'#44ff44',f.rare?12:7);gs.flashColor='#002200';gs.flashA=0.13;}
        else{if(gs.shield>0){gs.shield=0;gs.effects.push({x:f.x,y:f.y-20,text:i18n.shield_block,color:'#aaaaff',vy:-1,a:1,size:12});}else{gs.fat=Math.min(100,gs.fat+f.fat*diff.fatMult);gs.combo=0;gs.effects.push({x:f.x,y:f.y-20,text:(LANG==='ru'?'+вес!':'+fat!'),color:'#ff4444',vy:-1.2,a:1,size:13});spawnParticles(f.x,f.y,'#ff4444',8);gs.flashColor='#440000';gs.flashA=0.27;if(gs.fat>=100){gs.over=true;SCREEN='over';}}}
        return false;
      }
      if(f.y>H+20){if(!f.isJunk&&!f.isPowerup&&gs.frame>GRACE){gs.lives--;gs.combo=0;gs.effects.push({x:f.x,y:H-60,text:i18n.miss,color:'#ff8888',vy:-0.8,a:1,size:13});gs.flashColor='#220000';gs.flashA=0.24;if(gs.lives<=0){gs.over=true;SCREEN='over';}}return false;}
      return true;
    });
    if(gs.score>S.highScore){S.highScore=gs.score;saveS('highScore');}
  }

  gs.foods.forEach(f=>drawFood(ctx,f));
  gs.particles=gs.particles.filter(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=0.12;p.life-=0.04;ctx.fillStyle=p.color+Math.round(p.life*255).toString(16).padStart(2,'0');ctx.fillRect(Math.round(p.x),Math.round(p.y),p.size,p.size);return p.life>0;});
  const{player:pl,magnet:mg,shield:sh,double:db}=gs;
  drawPlayerAt(ctx,pl.x,pl.y,gs.fat,gender,outfit,gs.frame,pl.moveL,pl.moveR,sh,mg,W,db);
  if(SCREEN==='game')drawHUD(ctx,gs);
  gs.effects=gs.effects.filter(e=>{ctx.globalAlpha=e.a;ctx.fillStyle=e.color;ctx.font=`bold ${e.size||12}px monospace`;ctx.textAlign='center';ctx.fillText(e.text,e.x,e.y);ctx.globalAlpha=1;e.y+=e.vy;e.a-=0.02;return e.a>0;});
  if(gs.flashA>0){ctx.fillStyle=gs.flashColor;ctx.globalAlpha=gs.flashA;ctx.fillRect(0,0,W,H);ctx.globalAlpha=1;gs.flashA=Math.max(0,gs.flashA-0.04);}
  if(SCREEN==='over')drawOver(ctx,gs);
}



// ── Вода ─────────────────────────────────────────────────────────
var waterToday = 0;
var waterGoal  = 2000;
var waterLog   = []; // [{time, ml}]

function initWaterPage(){
  // 1) Сначала рендерим из localStorage чтобы что-то показать сразу
  try {
    var saved = localStorage.getItem('nutrio_water_' + _todayKey());
    if(saved){ var d = JSON.parse(saved); waterToday = d.total||0; waterLog = d.log||[]; }
    var gSaved = localStorage.getItem('nutrio_water_goal');
    if(gSaved) waterGoal = parseInt(gSaved)||2000;
  } catch(e){}
  renderWater();
  // 2) Дёргаем сервер чтобы синхронизировать с тем что налили в боте
  _syncWaterFromServer();
  // Переводы вкладки Вода
  var _u = i18n&&i18n.water_unit||'мл';
  var _ul = i18n&&i18n.water_unit_l||'л';
  var _wt = document.getElementById('lbl-water-title');
  if(_wt) _wt.textContent = i18n&&i18n.water_title||'Water';
  document.querySelectorAll('.wunit').forEach(function(el){ el.textContent=' '+_u; });
  document.querySelectorAll('.wunit-l').forEach(function(el){ el.textContent=' '+_ul; });
  var _inp = document.getElementById('water-custom');
  if(_inp) _inp.placeholder = _u;
  var _wgl = document.getElementById('water-goal-lbl');
  if(_wgl) _wgl.textContent = (i18n&&i18n.water_goal_lbl||'цель: ')+waterGoal+' '+_u;
}

// Подтягивает воду с бэка (синхронизация Mini App ↔ чат с ботом)
async function _syncWaterFromServer(){
  try {
    var uid = (typeof getUserId === 'function') ? getUserId() : 0;
    if (!uid) return;
    var base = window.API_BASE || '/api/proxy';
    var r = await fetch(base + '/api/water?user_id=' + uid, {
      headers: (window._authHeaders ? window._authHeaders() : {}),
    });
    var d = await r.json();
    if (!d || !d.ok) return;
    waterToday = d.total_ml || 0;
    waterLog   = (d.entries || []).map(function(e){
      return { ml: e.ml, time: e.time };
    });
    // Сохраняем синхронизированный кеш
    try { localStorage.setItem('nutrio_water_' + _todayKey(),
      JSON.stringify({total: waterToday, log: waterLog})); } catch(e){}
    renderWater();
  } catch(e) { /* offline — оставляем localStorage версию */ }
}

function _todayKey(){
  var d = new Date(); return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
}

function saveWaterLocal(){
  try{ localStorage.setItem('nutrio_water_'+_todayKey(), JSON.stringify({total:waterToday,log:waterLog})); }catch(e){}
}

function renderWater(){
  var pct = Math.min(100, Math.round(waterToday/waterGoal*100));
  var unit = (i18n && i18n.water_unit) ? i18n.water_unit : ((i18n && i18n.weight_label && i18n.weight_label.includes('g')) ? 'ml' : 'мл');
  var el = document.getElementById('water-amount-lbl');
  if(el) el.textContent = waterToday + ' ' + unit;
  var gl = document.getElementById('water-goal-lbl');
  if(gl) gl.textContent = (i18n&&i18n.water_goal_lbl||'цель: ') + waterGoal + ' ' + unit;
  var bar = document.getElementById('water-bar');
  if(bar){ bar.style.width = pct + '%';
    bar.style.background = pct >= 100 ? '#4caf50' : pct >= 60 ? '#2196f3' : '#90caf9'; }

  // История за 3 дня из localStorage
  var logEl = document.getElementById('water-today-log');
  if(!logEl) return;
  var allEntries = [];
  for(var d=0; d<3; d++){
    var dt = new Date(); dt.setDate(dt.getDate()-d);
    var key = 'nutrio_water_' + dt.getFullYear()+'-'+(dt.getMonth()+1)+'-'+dt.getDate();
    try{
      var saved = localStorage.getItem(key);
      if(saved){
        var data = JSON.parse(saved);
        var _todayWord = (i18n&&i18n.today_lbl)||'TODAY';
        var _yestMap = {ru:'Вчера',en:'Yesterday',uk:'Вчора',de:'Gestern',fr:'Hier',es:'Ayer',it:'Ieri',pt:'Ontem',tr:'Dün',pl:'Wczoraj',kk:'Кеше',uz:'Kecha',be:'Учора',ar:'أمس',he:'אתמול',zh:'昨天',ja:'昨日',ko:'어제'};
        var _todayMap = {ru:'Сегодня',en:'Today',uk:'Сьогодні',de:'Heute',fr:"Aujourd'hui",es:'Hoy',it:'Oggi',pt:'Hoje',tr:'Bugün',pl:'Dzisiaj',kk:'Бүгін',uz:'Bugun',be:'Сёння',ar:'اليوم',he:'היום',zh:'今天',ja:'今日',ko:'오늘'};
        var dayLabel = d===0?(_todayMap[LANG]||'Today'):
                       d===1?(_yestMap[LANG]||'Yesterday'):
                       dt.toLocaleDateString(LANG||'en-US',{weekday:'short'});
        if(data.log&&data.log.length){
          allEntries.push('<div style="font-size:11px;color:var(--text2);margin:8px 0 4px;font-weight:600;">'+dayLabel+' — '+data.total+' '+(i18n&&i18n.water_unit||unit)+'</div>');
          data.log.slice().reverse().forEach(function(e){
            allEntries.push('<div style="display:flex;justify-content:space-between;padding:3px 0;border-bottom:1px solid rgba(255,255,255,0.05);font-size:13px;">'+
              '<span>💧 +'+e.ml+' '+unit+'</span>'+
              '<span style="color:var(--text2);">'+e.time+'</span></div>');
          });
        }
      }
    }catch(e){}
  }
  logEl.innerHTML = allEntries.length
    ? '<div style="font-size:12px;color:var(--text2);margin-bottom:4px;">'+(i18n&&i18n['history_3day']||'3-day history:')+'</div>'+allEntries.join('')
    : '';
}

function addWater(ml){
  waterToday += ml;
  var now = new Date();
  waterLog.push({ml:ml, time: now.getHours()+':'+(now.getMinutes()<10?'0':'')+now.getMinutes()});
  saveWaterLocal();
  renderWater();
  var unit = i18n&&i18n.water_unit||'мл';
  showToast('+' + ml + ' ' + unit + ' 💧');
  // Прямой fetch без рекурсии через apiPost
  var uid = typeof getUserId === 'function' ? parseInt(getUserId()) : 0;
  if(!uid && tg && tg.initDataUnsafe && tg.initDataUnsafe.user) uid = tg.initDataUnsafe.user.id;
  if(uid){
    var headers = {'Content-Type':'application/json'};
    if(window._authHeaders) headers = window._authHeaders(headers);
    fetch((window.API_BASE||'')+'/api/water', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ml: ml, user_id: uid})
    }).catch(function(){});
  }
}

function addWaterCustom(){
  var inp = document.getElementById('water-custom');
  var ml = parseInt(inp ? inp.value : 0);
  if(!ml || ml <= 0 || ml > 5000){
    showToast(i18n&&i18n.fill_all?i18n.fill_all:'Enter valid amount', 'var(--accent2)');
    return;
  }
  addWater(ml);
  if(inp) inp.value = '';
}

// ── Прогресс ─────────────────────────────────────────────────────
var progressData = null;

function initProgressPage(){
  // Пробуем загрузить из localStorage
  try{
    var saved = localStorage.getItem('nutrio_progress');
    if(saved){ progressData = JSON.parse(saved); renderProgress(); }
  }catch(e){}

  // Heatmap — автозагрузка раз в день.
  // Запоминаем дату последней загрузки в localStorage.
  // При открытии вкладки: если сегодня ещё не грузили — загружаем автоматом,
  // если уже грузили — юзер жмёт кнопку «Обновить» вручную.
  try {
    var TODAY = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    var lastLoad = '';
    try { lastLoad = localStorage.getItem('nutrio_heatmap_loaded_date') || ''; } catch(e){}

    if (window.NutrioHeatmap && typeof window.NutrioHeatmap.init === 'function') {
      window.NutrioHeatmap.init();
    }
    if (lastLoad !== TODAY) {
      // Первая загрузка за сегодня — грузим автоматически
      if (window.NutrioHeatmap && typeof window.NutrioHeatmap.load === 'function') {
        window.NutrioHeatmap.load();
        try { localStorage.setItem('nutrio_heatmap_loaded_date', TODAY); } catch(e){}
      }
    }
    // Если уже грузили сегодня — ничего не делаем. Юзер жмёт «Обновить» сам.
  } catch(e){}
}

function renderProgress(){
  if(!progressData) return;
  var d = progressData;
  // Стрик
  var sv = document.getElementById('streak-value');
  var sl = document.getElementById('streak-label');
  var se = document.getElementById('streak-emoji');
  if(sv) sv.textContent = (d.streak||0) + ' ' + (i18n&&i18n.streak_days_lbl?i18n.streak_days_lbl:'');
  if(sl) sl.textContent = i18n&&i18n.streak_days_text||i18n&&i18n.days_row||'days in a row';
  if(se) se.textContent = (d.streak||0) >= 7 ? '🔥' : (d.streak||0) >= 3 ? '⚡' : '🌱';

  // КБЖУ
  var set2 = function(id, val){ var el=document.getElementById(id); if(el) el.textContent=val||'0'; };
  var unit2 = i18n&&i18n.water_unit||'мл';
  var kcal_unit = i18n&&i18n.kcal_lbl||'kcal';
  set2('prog-kcal', d.today_kcal||'—');
  var _gu = (i18n&&i18n.water_unit&&i18n.water_unit!=='мл'&&i18n.water_unit!=='мл')?'g':'г';
  if(i18n&&i18n.kcal_lbl&&i18n.kcal_lbl.toLowerCase().indexOf('kcal')!==-1) _gu='g';
  set2('prog-prot', d.today_prot?Math.round(d.today_prot)+_gu:'—');
  set2('prog-fat',  d.today_fat?Math.round(d.today_fat)+_gu:'—');
  set2('prog-carb', d.today_carb?Math.round(d.today_carb)+_gu:'—');

  // Прогресс-бар
  var goal = d.daily_goal || 2000;
  var kcal = d.today_kcal || 0;
  var pct  = Math.min(110, Math.round(kcal/goal*100));
  var bar  = document.getElementById('kcal-bar');
  if(bar){ bar.style.width=pct+'%'; bar.style.background = pct>105?'#ef5350':pct>85?'var(--accent)':'#66bb6a'; }
  var lbl = document.getElementById('kcal-progress-lbl');
  if(lbl) lbl.textContent = kcal + ' / ' + goal + ' ' + (i18n&&i18n.kcal_lbl||'kcal');
  var pctEl = document.getElementById('kcal-progress-pct');
  if(pctEl) pctEl.textContent = pct + '%';

  // Достижения — полная сетка с разблокированными и заблокированными
  if(d.achievements && d.achievements.length){
    var list = document.getElementById('achievements-list');
    var counter = document.getElementById('ach-counter');
    var unlocked = d.achievements.filter(function(a){ return a.unlocked; }).length;
    var total = d.achievements.length;
    if(counter) counter.textContent = unlocked + ' / ' + total;
    if(list){
      var isRu = (typeof LANG !== 'undefined' && LANG === 'ru');
      list.innerHTML = d.achievements.map(function(a){
        var name = isRu ? (a.name_ru || a.name) : (a.name_en || a.name);
        var cls = a.unlocked ? 'ach-card unlocked' : 'ach-card locked';
        return '<button class="' + cls + '" onclick="openAchDetail(\'' + (a.key||'') + '\')" data-key="' + (a.key||'') + '">'
          + '<div class="ach-emoji">' + a.emoji + '</div>'
          + '<div class="ach-name">' + name + '</div>'
          + '</button>';
      }).join('');
    }
    // Сохраняем для детальной модалки
    window._achData = {};
    d.achievements.forEach(function(a){ window._achData[a.key] = a; });
  }
}

function requestProgressData(){
  var btn = document.getElementById('sync-btn');
  var note = document.getElementById('progress-note');
  if(btn){ btn.textContent='⏳...'; btn.disabled=true; }
  var userId = tg&&tg.initDataUnsafe&&tg.initDataUnsafe.user&&tg.initDataUnsafe.user.id;
  if(!userId){ try{ var _up=new URLSearchParams(window.location.search); userId=_up.get('user_id')||localStorage.getItem('nutrio_user_id'); }catch(e){} }
  if(userId){ try{ localStorage.setItem('nutrio_user_id', String(userId)); }catch(e){} }
  if(!userId){
    if(note) note.textContent = i18n&&i18n.sync_note||'Open from Telegram to load data';
    if(btn){ btn.disabled=false; btn.textContent=i18n&&i18n.load_data_btn||'🔄 Load data'; }
    return;
  }
  fetch((window.API_BASE || '/api/proxy')+'/api/progress?user_id='+userId, {headers:(window._authHeaders?window._authHeaders():{})})
    .then(function(r){ return r.json(); })
    .then(function(data){
      if(data.error){ throw new Error(data.error); }
      progressData = data;
      try{ localStorage.setItem('nutrio_progress', JSON.stringify(data)); }catch(e){}
      renderProgress();
      if(btn){ btn.disabled=false; btn.textContent='✅'; }
      setTimeout(function(){ if(btn) btn.textContent=i18n&&i18n.load_data_btn||'🔄 Load data'; },2000);
    })
    .catch(function(err){
      var errMsg = '❌ '+(i18n&&i18n.sync_error||'Connection error. Check that the bot is running.');
      if(note) note.textContent=errMsg;
      if(btn){ btn.disabled=false; btn.textContent=i18n&&i18n.load_data_btn||'🔄 Load data'; }
      console.warn('[NutriO] progress API error:', err.message);
    });
}

// Получаем данные от бота (если он передал их при открытии)
try {
  // Пробуем получить данные из Telegram start_param или URL
  var startParam = (tg && tg.initDataUnsafe && tg.initDataUnsafe.start_param)
    || new URLSearchParams(window.location.search).get('startapp');
  if(startParam){
    try{
      var parsed = JSON.parse(decodeURIComponent(startParam));
      // Сохраняем данные прогресса
      if(parsed.today_kcal !== undefined || parsed.streak !== undefined){
        progressData = parsed;
        try{ localStorage.setItem('nutrio_progress', JSON.stringify(progressData)); }catch(e){}
      }
      if(parsed.progress){
        progressData = parsed.progress;
        try{ localStorage.setItem('nutrio_progress', JSON.stringify(progressData)); }catch(e){}
      }
      if(parsed.water_goal) waterGoal = parsed.water_goal;
      if(parsed.water_today) waterToday = parsed.water_today;
      // Если передан tab — переключаемся на него после загрузки
      if(parsed.tab){
        document.addEventListener('DOMContentLoaded', function(){
          switchTab(parsed.tab);
        });
      }
    }catch(e){}
  }
}catch(e){}

// ── Achievement detail modal ─────────────────────────────────────────────
window.openAchDetail = function(key) {
  var data = (window._achData || {})[key];
  if (!data) return;
  var isRu = (typeof LANG !== 'undefined' && LANG === 'ru');
  var name = isRu ? (data.name_ru || data.name) : (data.name_en || data.name);
  var desc = isRu ? (data.desc_ru || data.desc_en || '') : (data.desc_en || data.desc_ru || '');
  var emoji = document.getElementById('ach-detail-emoji');
  var nameEl = document.getElementById('ach-detail-name');
  var descEl = document.getElementById('ach-detail-desc');
  var statusEl = document.getElementById('ach-detail-status');
  if (emoji) emoji.textContent = data.emoji;
  if (nameEl) nameEl.textContent = name;
  if (descEl) descEl.textContent = desc;
  if (statusEl) {
    if (data.unlocked) {
      statusEl.innerHTML = '<span style="color:var(--green);font-size:15px">✅ Разблокировано</span>';
    } else {
      statusEl.innerHTML = '<span style="color:var(--muted);font-size:15px">🔒 Заблокировано</span>';
    }
  }
  var sheet = document.getElementById('ach-detail-sheet');
  if (sheet) { sheet.classList.add('show'); sheet.setAttribute('aria-hidden','false'); }
  try { if (window.Telegram && Telegram.WebApp && Telegram.WebApp.HapticFeedback) Telegram.WebApp.HapticFeedback.impactOccurred('light'); } catch(e){}
};
window.closeAchDetail = function() {
  var sheet = document.getElementById('ach-detail-sheet');
  if (sheet) { sheet.classList.remove('show'); sheet.setAttribute('aria-hidden','true'); }
};
