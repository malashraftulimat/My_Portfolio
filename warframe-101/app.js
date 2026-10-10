/* ============================================================
   Warframe 101 — interactive behaviour & data
   Facts summarized from the community Warframe Wiki.
   Images are locally stored WebP assets downloaded from the wiki.
   ============================================================ */
"use strict";

const img = s => "img/" + s + ".webp";

/* ---------------- starfield ---------------- */
(function starfield(){
  const c = document.getElementById("stars");
  const ctx = c.getContext("2d");
  let stars = [], w, h, dpr;
  function resize(){
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = c.width = innerWidth * dpr;
    h = c.height = innerHeight * dpr;
    c.style.width = innerWidth + "px";
    c.style.height = innerHeight + "px";
    const count = Math.min(220, Math.floor(innerWidth * innerHeight / 9000));
    stars = Array.from({length: count}, () => ({
      x: Math.random() * w, y: Math.random() * h,
      r: (Math.random() * 1.3 + .2) * dpr,
      a: Math.random(), s: Math.random() * .018 + .004,
      hue: Math.random() < .15 ? "231,197,121" : "200,225,255"
    }));
  }
  function draw(){
    ctx.clearRect(0, 0, w, h);
    for (const st of stars){
      st.a += st.s;
      const alpha = .25 + Math.abs(Math.sin(st.a)) * .7;
      ctx.beginPath();
      ctx.fillStyle = `rgba(${st.hue},${alpha})`;
      ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  resize();
  addEventListener("resize", resize);
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) draw();
})();

/* ---------------- read progress + nav ---------------- */
(function chrome(){
  const bar = document.getElementById("readBar");
  addEventListener("scroll", () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.width = (max > 0 ? (scrollY / max) * 100 : 0) + "%";
  }, {passive:true});

  const nav = document.getElementById("nav");
  const navToggle = document.getElementById("navToggle");
  const setNav = open => {
    nav.classList.toggle("open", open);
    if (navToggle) navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  };
  navToggle.addEventListener("click", e => { e.stopPropagation(); setNav(!nav.classList.contains("open")); });
  nav.addEventListener("click", e => { if (e.target.tagName === "A") setNav(false); });
  document.addEventListener("click", e => { if (!nav.contains(e.target)) setNav(false); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") setNav(false); });
})();

/* ---------------- the core loop ---------------- */
(function loop(){
  const details = [
    "Pick a mission: choose a node on the Star Chart. Each shows its tileset, enemy faction, mission type and enemy level. Endless types (Defense, Survival, Excavation…) scale as you stay.",
    "Fight & loot: kill enemies, complete objectives, and grab drops — mods, resources, Credits, and blueprints. Endless missions pay out in rotations (A-A-B-C).",
    "Get mods & resources: mods drop from enemies and reward tables. Resources are planet-specific. Void Relics (mostly from endless missions) hold Prime parts.",
    "Build in the Foundry: install the Foundry segment, then craft weapons and Warframes from blueprints + resources. Builds run in real time and finish while you're offline.",
    "Level up gear: equipment ranks to 30 via Affinity (XP). Ranking gear grants Mastery and unlocks mod capacity so you can fit stronger mods."
  ];
  const steps = [...document.querySelectorAll(".loop-step")];
  const out = document.getElementById("loopDetail");
  steps.forEach(btn => btn.addEventListener("click", () => {
    steps.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    out.textContent = details[+btn.dataset.step];
  }));
})();

/* ---------------- factions ---------------- */
(function factions(){
  const data = [
    ["grineer","Grineer","A decaying clone army that controls most of the system. Heavily armored — stack <b>Corrosive</b> and <b>Impact</b> to chew through them."],
    ["corpus","Corpus","A greedy merchant cult of robots and crewmen. Their <b>shields</b> melt to <b>Magnetic</b>; their robotics hate <b>Electricity</b> and <b>Radiation</b>."],
    ["infested","Infested","A techno-organic plague that swarms in melee. Squishy but relentless — <b>Heat</b>, <b>Slash</b> and <b>Gas</b> tear through the horde."],
    ["corrupted","Corrupted","Orokin-tower guardians: Grineer, Corpus and Infested units brainwashed with Orokin tech. Versatile and dangerous — <b>Radiation</b> helps."],
    ["sentient","Sentient","Ancient self-adapting machines from Tau. They learn and resist your damage, so bring <b>Radiation</b>, <b>Void</b> and raw burst."]
  ];
  document.getElementById("factions").innerHTML = data.map(([k,n,d])=>`
    <div class="card mini faction-card">
      <img src="${img(k)}" alt="${n} faction icon" loading="lazy" />
      <h4>${n}</h4>
      <p>${d}</p>
    </div>`).join("");
})();

/* ---------------- starter warframes ---------------- */
const STARTERS = [
  {
    name:"Excalibur", img:"excalibur", role:"Offense / Melee", tag:"Balanced starter",
    blurb:"The poster boy and the friendliest first pick. A swordsman who is strong, simple and effective everywhere. Great if you like getting up close.",
    passive:"+10% Attack Speed and +10% Damage with Swords, Dual Swords, Nikanas and Rapiers.",
    stats:{Health:100, Shields:100, Armor:225, Energy:100},
    abilities:[
      ["Slash Dash","Dash forward as a blade of energy, damaging and cutting through enemies in your path."],
      ["Radial Blind","Emit a flash that blinds and stuns nearby enemies, opening them to finishers."],
      ["Radial Javelin","Impale all enemies in range with summoned energy javelins."],
      ["Exalted Blade","Summon an exalted energy sword; attacks launch energy waves that cut at range."]
    ],
    tags:["Damage","CC","Damage","Exalted"]
  },
  {
    name:"Mag", img:"mag", role:"Control / Support", tag:"Crowd-control",
    blurb:"A magnetic trickster who pulls, lifts and crushes enemies. Rewards a bit more thought — she can lock down whole rooms and strip shields, but she's squishy if you stand still.",
    passive:"Bullet jumping generates a magnetic pull that sucks in nearby pickups (and yanks at enemies).",
    stats:{Health:75, Shields:150, Armor:105, Energy:125},
    abilities:[
      ["Pull","Yank enemies and loot toward you with a magnetic burst, knocking them down."],
      ["Magnetize","Trap an enemy in a magnetic bubble that absorbs gunfire and explodes it onto anyone inside."],
      ["Polarize","Detonate a magnetic pulse that strips enemy armor and shields while restoring allies' shields."],
      ["Crush","Levitate and crush all nearby enemies with overwhelming magnetism."]
    ],
    tags:["CC","CC / Damage","Support","Damage / CC"]
  },
  {
    name:"Volt", img:"volt", role:"Speed / Damage", tag:"Fast & versatile",
    blurb:"An electric Warframe who supercharges movement and weaponry. Popular for speedrunning, Eidolon hunts, and zapping crowds. The most 'frame-agnostic' the longer you play.",
    passive:"Continuously generate Static Discharge by moving; it empowers your next attack or ability with Electricity.",
    stats:{Health:100, Shields:150, Armor:15, Energy:100},
    abilities:[
      ["Shock","Release a bolt of electricity that chains to nearby enemies and stuns them."],
      ["Speed","Sprint faster and reload/melee quicker — affects the whole squad that walks through it."],
      ["Electric Shield","Raise a barrier that blocks incoming fire and adds Electricity to shots fired through it."],
      ["Discharge","Unleash a wave of electricity that chains through and paralyzes crowds."]
    ],
    tags:["Damage / CC","Buff","Defense","Damage / CC"]
  }
];
const STAT_MAX = {Health:400, Shields:600, Armor:400, Energy:250};
(function starter(){
  const tabs = document.getElementById("starterTabs");
  const panel = document.getElementById("starterPanel");
  let current = 0;
  function render(){
    tabs.innerHTML = STARTERS.map((s,i)=>
      `<button class="starter-tab${i===current?" active":""}" data-i="${i}">
         <span class="tab-inner"><img src="${img(s.img)}" alt="${s.name}" loading="lazy" /><span>${s.name}<small>${s.role}</small></span></span>
       </button>`
    ).join("");
    const s = STARTERS[current];
    panel.innerHTML = `
      <div class="starter-cols">
        <div class="starter-art">
          <img src="${img(s.img)}" alt="${s.name}" />
        </div>
        <div class="starter-body">
          <div class="sf-head">
            <h3>${s.name}</h3>
            <span class="sf-tag">${s.tag}</span>
          </div>
          <p>${s.blurb}</p>
          <p class="small"><b>Passive:</b> ${s.passive}</p>
          <h4>Base stats</h4>
          ${Object.entries(s.stats).map(([k,v])=>`
            <div class="sf-stat"><span>${k}</span>
              <div class="sf-bar"><i style="width:${Math.min(100,(v/STAT_MAX[k])*100)}%"></i></div>
              <span>${v}</span>
            </div>`).join("")}
        </div>
      </div>
      <h4 style="margin-top:1.2rem">Abilities</h4>
      <div class="abilities">
        ${s.abilities.map((a,i)=>`<div class="ability"><div class="ability-head"><span class="ab-key">${i+1}</span><b>${a[0]}</b>${s.tags&&s.tags[i]?`<span class="ab-tag">${s.tags[i]}</span>`:""}</div><span>${a[1]}</span></div>`).join("")}
      </div>`;
    tabs.querySelectorAll(".starter-tab").forEach(b =>
      b.addEventListener("click", () => { current = +b.dataset.i; render(); }));
  }
  render();
})();

/* ---------------- weapon types ---------------- */
(function weapons(){
  const data = [
    ["primary","Primary","Rifles, shotguns, bows and launchers. Your main ranged damage. Mods like Serration and elemental combos live here."],
    ["secondary","Secondary","Pistols, thrown weapons and dual pistols. Often used for utility or as a backup — some secondaries are top-tier damage."],
    ["weapon_skana","Melee","Swords, staves, claws, whips and glaives. Melee scales hard into late game with combo counters and stances."]
  ];
  document.getElementById("weaponTypes").innerHTML = data.map(([k,n,d])=>`
    <div class="card mini weapon-card">
      <img src="${img(k)}" alt="${n} weapon" loading="lazy" />
      <h4>${n}</h4>
      <p>${d}</p>
    </div>`).join("");
})();

/* ---------------- elemental combo builder ---------------- */
const PRIMARY = {
  heat:{name:"Heat", cls:"heat", color:"#ff7a3d", img:"heat"},
  cold:{name:"Cold", cls:"cold", color:"#7fd3ff", img:"cold"},
  elec:{name:"Electricity", cls:"elec", color:"#5b9bff", img:"electricity"},
  toxin:{name:"Toxin", cls:"toxin", color:"#5fce7a", img:"toxin"}
};
const COMBO = {
  "cold+heat":{name:"Blast", color:"#e0a35a", img:"blast"},
  "elec+heat":{name:"Radiation", color:"#c9e05a", img:"radiation"},
  "heat+toxin":{name:"Gas", color:"#8fd66a", img:"gas"},
  "cold+elec":{name:"Magnetic", color:"#9aa6ff", img:"magnetic"},
  "cold+toxin":{name:"Viral", color:"#79e0a8", img:"viral"},
  "elec+toxin":{name:"Corrosive", color:"#a9d94a", img:"corrosive"}
};
const STATUS = {
  Impact:{effect:"Knockback", text:"Target flinches and is staggered for 1s; raises the health threshold for a Parazon Mercy kill by 8% per proc (max 5). No effect on players."},
  Puncture:{effect:"Weakened", text:"Enemy deals 40% less damage for 10s, stacking to 80% off (5 procs). The victim also takes +5% additive weapon crit chance per proc, up to +25%."},
  Slash:{effect:"Bleed", text:"Deals 35% of base damage per second for 6s, bypassing armor. On players it's a weaker 10%/s bleed that also bypasses armor."},
  Heat:{effect:"Ignite", text:"Burns for 50% base damage per second over 6s, panics the target for 4s, and gradually strips up to 50% of its armor."},
  Cold:{effect:"Freeze", text:"Slows movement, fire rate and attack speed by 50% for 6s. Stacks up to 10; at 10 the enemy freezes solid. Also raises the crit multiplier taken."},
  Electricity:{effect:"Tesla Chain", text:"Deals 50% base damage as Electricity per second for 6s to enemies within 3m and stuns the target for 3s."},
  Toxin:{effect:"Poison", text:"Deals 50% base damage as Toxin per second over 6s. This damage bypasses shields entirely."},
  Blast:{effect:"Detonate", text:"Deals 30% base damage after 1.5s. At 10 stacks or on death it detonates, splashing 300% base damage per proc to enemies within 5m."},
  Corrosive:{effect:"Corrosion", text:"Reduces armor by 26% for 8s, stacking up to 10 times for a total of 80% armor reduction."},
  Gas:{effect:"Gas Cloud", text:"Deals 50% base damage as Gas per second for 6s in a 3m radius, stacking up to 10 for a 6m radius."},
  Magnetic:{effect:"Disrupt", text:"Amplifies damage to shields and Overguard by 100% and stops shield regen for 6s; stacks up to +325%."},
  Radiation:{effect:"Confusion", text:"Makes the enemy attack its own allies and increases the damage it receives. Great against crowds and armored targets."},
  Viral:{effect:"Virus", text:"Amplifies damage dealt to health by 100% for 6s, stacking up to +325%. The go-to damage amp for most weapons."}
};
const STATUS_IMG = {
  Impact:"impact",Puncture:"puncture",Slash:"slash",Heat:"heat",Cold:"cold",Electricity:"electricity",
  Toxin:"toxin",Blast:"blast",Corrosive:"corrosive",Gas:"gas",Magnetic:"magnetic",Radiation:"radiation",Viral:"viral"
};
const COMBO_META = {
  Blast:{best:["Infested hordes"], facts:["Area-of-effect damage","Detonates at 10 stacks or on death"], stack:10, stackLabel:"detonates at 10"},
  Radiation:{best:["Grineer","Robotics"], facts:["Turns enemies on each other","Bonus damage to Alloy armor"], stack:0},
  Gas:{best:["Infested","Crowds"], facts:["Bypasses shields","Area-of-effect damage over time"], stack:10, stackLabel:"6m radius at 10"},
  Magnetic:{best:["Corpus shields","Overguard"], facts:["Amplifies shield damage","Stops shield regeneration"], stack:10, stackLabel:"up to +325%"},
  Viral:{best:["Health","Grineer"], facts:["Amplifies health damage","Stacks up to +325%"], stack:10, stackLabel:"up to +325%"},
  Corrosive:{best:["Ferrite armor","Grineer"], facts:["Strips up to 80% armor","Stacks 10 times"], stack:10, stackLabel:"up to \u221280% armor"}
};
function comboBurst(host, color){
  for (let i = 0; i < 10; i++){
    const s = document.createElement("span");
    s.className = "combo-spark";
    const a = (Math.PI * 2 * i) / 10 + Math.random() * .5;
    const d = 34 + Math.random() * 48;
    s.style.setProperty("--dx", Math.cos(a) * d + "px");
    s.style.setProperty("--dy", Math.sin(a) * d + "px");
    s.style.background = color;
    s.style.animationDelay = (Math.random() * .08) + "s";
    host.appendChild(s);
    setTimeout(() => s.remove(), 780);
  }
}
function comboStackMeter(meta, color){
  if (!meta.stack) return `<div class="stack-meter none"><span class="stack-none">No stacking proc — it simply refreshes on the target.</span></div>`;
  return `<div class="stack-meter" style="--c:${color}">
      <div class="stack-top"><span>Proc stacks</span><b>max ×${meta.stack} · ${meta.stackLabel}</b></div>
      <div class="stack-track"><i></i></div>
    </div>`;
}
(function comboLab(){
  const lab = document.getElementById("comboLab");
  const pool = document.getElementById("elemPool");
  const eq = document.getElementById("comboEq");
  const slotA = document.getElementById("slotA");
  const slotB = document.getElementById("slotB");
  const slotR = document.getElementById("slotR");
  const card = document.getElementById("statusCard");
  let sel = [];
  let lastCombo = null;

  pool.innerHTML = Object.entries(PRIMARY).map(([k,v]) =>
    `<button class="elem ${v.cls}" data-k="${k}">
       <img src="${img(v.img)}" alt="" /><span>${v.name}</span><span class="em">◆</span>
     </button>`).join("");

  function paint(){
    let activeColor = "";
    [slotA, slotB].forEach((el, i) => {
      const k = sel[i];
      el.className = "slot";
      if (k){
        el.classList.add("filled");
        el.style.setProperty("--c", PRIMARY[k].color);
        el.style.background = `linear-gradient(120deg,${PRIMARY[k].color},${PRIMARY[k].color}bb)`;
        el.innerHTML = `<img src="${img(PRIMARY[k].img)}" alt="" /><span>${PRIMARY[k].name}</span>`;
      } else {
        el.style.background = "";
        el.style.removeProperty("--c");
        el.textContent = "—";
      }
    });
    if (sel.length === 2){
      const key = [...sel].sort().join("+");
      const combo = COMBO[key];
      slotR.className = "slot result filled";
      slotR.style.background = combo ? `linear-gradient(120deg,${combo.color},${combo.color}bb)` : "";
      slotR.innerHTML = combo ? `<img src="${img(combo.img)}" alt="" /><span>${combo.name}</span>` : "—";
      if (combo){
        activeColor = combo.color;
        slotR.style.setProperty("--c", combo.color);
        if (combo.name !== lastCombo){
          slotR.classList.remove("pop"); void slotR.offsetWidth; slotR.classList.add("pop");
          comboBurst(eq, combo.color);
        }
        const st = STATUS[combo.name];
        const meta = COMBO_META[combo.name] || {best:[], facts:[]};
        card.classList.add("has");
        card.style.setProperty("--c", combo.color);
        card.innerHTML = `<div class="status-head">
            <img src="${img(combo.img)}" alt="" />
            <div><h4>${combo.name}</h4><span class="proc">Proc · ${st.effect}</span></div>
          </div>
          <p>${st.text}</p>
          ${comboStackMeter(meta, combo.color)}
          <div class="status-tags">${meta.facts.map(f=>`<span class="status-tag">${f}</span>`).join("")}</div>
          <p class="small status-best"><b>Best against:</b> ${meta.best.join(", ")}</p>`;
      } else {
        slotR.style.removeProperty("--c");
        card.classList.remove("has");
        card.style.removeProperty("--c");
        card.innerHTML = `<h4>Status effect</h4><p class="muted">Those primaries do not combine — pick two different elements.</p>`;
      }
      lastCombo = combo ? combo.name : null;
    } else {
      slotR.className = "slot result";
      slotR.style.background = "";
      slotR.style.removeProperty("--c");
      slotR.textContent = "—";
      lastCombo = null;
      card.classList.remove("has");
      card.style.removeProperty("--c");
      card.innerHTML = `<h4>Status effect</h4><p class="muted">Pick two elements to reveal the combined damage type and what its <b>proc</b> does.</p><div class="status-placeholder">◆ + ◆ = ?</div>`;
    }
    pool.querySelectorAll(".elem").forEach(b => b.classList.toggle("sel", sel.includes(b.dataset.k)));
    if (activeColor){ lab.classList.add("active"); lab.style.setProperty("--c", activeColor); }
    else { lab.classList.remove("active"); lab.style.removeProperty("--c"); }
  }
  pool.addEventListener("click", e => {
    const btn = e.target.closest(".elem"); if (!btn) return;
    const k = btn.dataset.k;
    if (sel.includes(k)) sel = sel.filter(x => x !== k);
    else { sel.push(k); if (sel.length > 2) sel = sel.slice(1); }
    paint();
  });
  paint();
})();

/* ---------------- physical cards + status table ---------------- */
(function damageTables(){
  const phys = [
    {n:"Impact", c:"#9aa6b8", d:"Blunt force. Its status causes knockback and staggers enemies. Good against shields and Grineer armor in the current system."},
    {n:"Puncture", c:"#c9b07a", d:"Piercing. Its status Weakens enemies, cutting the damage they deal. Good against armored and Corpus robotic targets."},
    {n:"Slash", c:"#e07a7a", d:"Cutting. Its status causes Bleed, a damage-over-time that ignores armor — the reason Slash builds are so popular on crit weapons."}
  ];
  document.getElementById("physicalCards").innerHTML = phys.map(p=>`
    <div class="card mini media-card">
      <img class="dmg-icon" src="${img(STATUS_IMG[p.n])}" alt="${p.n} icon" loading="lazy" />
      <span class="dmg-pill" style="background:${p.c}">${p.n}</span>
      <p style="margin-top:.7rem">${p.d}</p>
    </div>`).join("");

  const all = ["Impact","Puncture","Slash","Heat","Cold","Electricity","Toxin","Blast","Corrosive","Gas","Magnetic","Radiation","Viral"];
  const colors = {Impact:"#9aa6b8",Puncture:"#c9b07a",Slash:"#e07a7a",Heat:"#ff7a3d",Cold:"#7fd3ff",
    Electricity:"#5b9bff",Toxin:"#5fce7a",Blast:"#e0a35a",Corrosive:"#a9d94a",Gas:"#8fd66a",
    Magnetic:"#9aa6ff",Radiation:"#c9e05a",Viral:"#79e0a8"};
  document.querySelector("#statusTable tbody").innerHTML = all.map(k=>`
    <tr>
      <td><span class="cell-type"><img src="${img(STATUS_IMG[k])}" alt="" loading="lazy" /><span class="dmg-pill" style="background:${colors[k]}">${k}</span></span></td>
      <td><b>${STATUS[k].effect}</b></td>
      <td>${STATUS[k].text}</td>
    </tr>`).join("");
})();

/* ---------------- mod capacity calculator ---------------- */
(function capacity(){
  const rank = document.getElementById("rankRange");
  const out = document.getElementById("rankOut");
  const potato = document.getElementById("potato");
  const aura = document.getElementById("aura");
  const res = document.getElementById("capOut");
  function calc(){
    out.textContent = rank.value;
    let cap = +rank.value;
    if (potato.checked) cap *= 2;
    if (aura.checked) cap += 14;
    const note = potato.checked ? ` (rank ${rank.value} ×2)` : "";
    res.textContent = `Capacity: ${cap}${note}${aura.checked ? "  (+14 aura/stance)" : ""}\nDoubled by Orokin Catalyst/Reactor; Aura & Stance raise capacity.`;
  }
  [rank, potato, aura].forEach(el => el.addEventListener("input", calc));
  calc();
})();

/* ---------------- example mod cards ---------------- */
(function modGrid(){
  const mods = [
    ["mod_serration","Serration","+damage on rifles — the classic 'base damage' mod"],
    ["mod_split_chamber","Split Chamber","+multishot on rifles"],
    ["mod_point_strike","Point Strike","+critical chance on rifles"],
    ["mod_vital_sense","Vital Sense","+critical damage on rifles"],
    ["mod_pressure_point","Pressure Point","+melee weapon damage"],
    ["mod_primed","Primed Fury","+melee attack speed (Legendary/Prime tier)"],
    ["mod_vitality","Vitality","+max Health on Warframes"],
    ["mod_redirection","Redirection","+max Shields on Warframes"],
    ["mod_flow","Flow","+max Energy on Warframes"],
    ["mod_intensify","Intensify","+Ability Strength"],
    ["mod_streamline","Streamline","+Ability Efficiency (cheaper abilities)"],
    ["mod_riven","Riven Mod","Randomised, weapon-specific endgame stats"]
  ];
  document.getElementById("modGrid").innerHTML = mods.map(([k,n,d])=>`
    <figure class="mod-card">
      <img src="${img(k)}" alt="${n} mod card" loading="lazy" />
      <figcaption><b>${n}</b><span>${d}</span></figcaption>
    </figure>`).join("");
})();

/* ---------------- star chart ---------------- */
const PLANETS = [
  {n:"Earth", img:"earth", role:"Tutorial home", tags:["Open World","New player"], text:"Where you start. Grineer and the Vor's Prize questline live here. The Plains of Eidolon open-world and the town of Cetus are also on Earth — visit them for bounties and the Ostron syndicate."},
  {n:"Venus", img:"venus", role:"First real step", tags:["Open World","Corpus"], text:"Your first Junction leads here. Learn Corpus enemies (shields!). The Orb Vallis open world and Fortuna are here, plus the Jackal assassination. Building an Archwing is part of this stretch."},
  {n:"Mercury", img:"mercury", role:"Quick detour", tags:["Grineer","Boss"], text:"A small Grineer planet off Venus. The Vor & Lech Kril assassination mission drops parts for Warframes like Loki and gives good early mods."},
  {n:"Mars", img:"mars", role:"Solo-friendly", tags:["Grineer","Boss"], text:"A straightforward Grineer stretch. The Sergeant assassination rewards parts and introduces you to more mission variety. Good place to settle in and level weapons."},
  {n:"Phobos", img:"phobos", role:"Grind stop", tags:["Grineer"], text:"A rocky Corpus/Grineer mix. Useful for specific resources and for pushing your Star Chart completion. Junctions here often want Mastery or quest progress."},
  {n:"Deimos", img:"deimos", role:"Infested + open world", tags:["Open World","Infested"], text:"The Infested moon. Home to the Necralisk and the Cambion Drift open world, plus the Heart of Deimos quest. A hub for the Entrati family and Necramech content later on."},
  {n:"Ceres", img:"ceres", role:"Resource hub", tags:["Grineer"], text:"A Grineer shipyard packed with resources like Alloy Plate and Orokin Cells — two things you will need constantly. Endless nodes here are great for early farming."},
  {n:"Jupiter", img:"jupiter", role:"Gas city", tags:["Corpus","Boss"], text:"A Corpus gas giant with great visuals and the Ropalolyst boss. Solid for leveling and mid-game mods."},
  {n:"Europa", img:"europa", role:"Corpus outpost", tags:["Corpus"], text:"An icy Corpus world. Useful resources and a few notable nodes; many players push through here for Star Chart completion."},
  {n:"Saturn", img:"saturn", role:"Bigger Grineer", tags:["Grineer","Boss"], text:"Higher-level Grineer and the Sargas Ruk assassination. Good mid-game farming for resources and credits."},
  {n:"Uranus", img:"uranus", role:"Underwater labs", tags:["Grineer","Boss"], text:"Grineer sealab tilesets and the Tyl Regor boss (drops Equinox parts). Introduces underwater Archwing segments."},
  {n:"Neptune", img:"neptune", role:"Corpus money", tags:["Corpus","Index"], text:"Home of The Index — an arena where you can earn large amounts of Credits. Also a Corpus stronghold with the Hyena Pack."},
  {n:"Pluto", img:"pluto", role:"Late chart", tags:["Corpus"], text:"High-level Corpus territory. A stepping stone before Sedna and Eris, with valuable resource nodes."},
  {n:"Sedna", img:"sedna", role:"Arena & late Grineer", tags:["Grineer","Arena"], text:"Late-game Grineer space, plus the Rathuum arenas. The Kela De Thaym boss and high-level nodes test your build."},
  {n:"Eris", img:"eris", role:"Infested endgame", tags:["Infested"], text:"High-level Infested territory with the Jordas Golem. Infested missions are a classic spot for leveling and for farming Mutagen Samples."},
  {n:"Void", img:"void", role:"Prime relics", tags:["Corrupted","Relics"], text:"Not a normal planet: the Orokin Void is where you crack relics (Fissure missions) and find Corrupted enemies. Tower missions also drop special mods and resources."},
  {n:"Lua", img:"lua", role:"Orokin moon", tags:["Corrupted"], text:"The Orokin moon with unique puzzles and the Octavia's Anthem-area content. Home to some of the game's best story missions."},
  {n:"Kuva Fortress", img:"kuva", role:"Kuva siphons", tags:["Grineer","Kuva"], text:"A mobile Grineer fortress. Farm Kuva here for Riven rerolls and take on high-difficulty missions once you're established."},
  {n:"Zariman", img:"zariman", role:"Newer content", tags:["Angels of the Zariman"], text:"The legendary colony ship. Unlocked later in the story, with powerful Incarnon weapon upgrades and endgame bounties."}
];
const PLANET_ENEMIES = {
  "Earth":{factions:["grineer"], boss:["Councilor Vay Hek"], specials:[
    {label:"Plains of Eidolon", names:["Ghoul","Tusk Bombard","Eidolon Teralyst"]}
  ]},
  "Venus":{factions:["corpus"], boss:["Jackal"]},
  "Mercury":{factions:["grineer"], boss:["Captain Vor"]},
  "Mars":{factions:["grineer"], boss:["The Sergeant"]},
  "Phobos":{factions:["grineer","corpus"]},
  "Deimos":{factions:["infested"], boss:["Lephantis"], specials:[{label:"Cambion Drift", names:["Necramech"]}]},
  "Ceres":{factions:["grineer"], boss:["Lech Kril"]},
  "Jupiter":{factions:["corpus"], boss:["Ropalolyst"]},
  "Europa":{factions:["corpus"], boss:["The Raptors"]},
  "Saturn":{factions:["grineer"], boss:["Sargas Ruk"]},
  "Uranus":{factions:["grineer"], boss:["Tyl Regor"]},
  "Neptune":{factions:["corpus"], boss:["Hyena Pack"]},
  "Pluto":{factions:["corpus"], boss:["Ambulas"]},
  "Sedna":{factions:["grineer"], boss:["Kela De Thaym"]},
  "Eris":{factions:["infested"], boss:["Jordas Golem"]},
  "Void":{factions:["corrupted"], boss:["Corrupted Vor"]},
  "Lua":{factions:["corrupted","sentient"]},
  "Kuva Fortress":{factions:["grineer"]},
  "Zariman":{factions:["grineer","corpus"], specials:[{label:"Zariman specials", names:["Thrax Centurion","Void Angel"]}]}
};

/* enemy rosters per faction — every thumbnail is a locally stored wiki render */
const ENEMY_FACTIONS = {
  grineer:{n:"Grineer", c:"#c9a15a"},
  corpus:{n:"Corpus", c:"#4f9bff"},
  infested:{n:"Infested", c:"#8fd66a"},
  corrupted:{n:"Corrupted", c:"#c9e0ff"},
  sentient:{n:"Sentient", c:"#b98cff"}
};
const ENEMY_ROSTERS = {
  grineer:["Lancer","Elite Lancer","Trooper","Butcher","Flameblade","Scorpion","Shield Lancer","Ballista","Seeker","Bombard","Napalm","Heavy Gunner","Roller","Hellion"],
  corpus:["Crewman","Detron Crewman","Sniper Crewman","Corpus Tech","Elite Crewman","Prod Crewman","MOA","Shield Osprey","Mine Osprey","Oxium Osprey","Leech Osprey","Sapping Osprey","Nullifier Crewman","Bursa"],
  infested:["Charger","Runner","Leaper","Volatile Runner","Crawler","Nauseous Crawler","Electric Crawler","Toxic Crawler","Lobber Crawler","Ancient Healer","Ancient Disruptor","Toxic Ancient","Boiler","Brood Mother","Mutalist Osprey","Juggernaut"],
  corrupted:["Corrupted Lancer","Corrupted Crewman","Corrupted Butcher","Corrupted Bombard","Corrupted Heavy Gunner","Corrupted Nullifier","Corrupted Ancient","Corrupted MOA","Corrupted Drone"],
  sentient:["Battalyst","Conculyst","Mimic"]
};
const enemySlug = n => "enemy_" + n.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
const enemyCard = (n, cls) => `<figure class="enemy-chip${cls ? " " + cls : ""}"><img src="${img(enemySlug(n))}" alt="${n}" loading="lazy" /><figcaption>${n}</figcaption></figure>`;
(function starchart(){
  const list = document.getElementById("planetList");
  const info = document.getElementById("planetInfo");
  function show(i){
    const p = PLANETS[i];
    const e = PLANET_ENEMIES[p.n] || {};
    const groups = [];
    (e.factions || []).forEach(fk => {
      const f = ENEMY_FACTIONS[fk];
      const roster = ENEMY_ROSTERS[fk] || [];
      if (!f || !roster.length) return;
      groups.push(`
        <div class="enemy-group" style="--fc:${f.c}">
          <div class="enemy-group-head"><span class="enemy-faction">${f.n}</span><span class="enemy-count">${roster.length} units</span></div>
          <div class="enemy-grid">${roster.map(n=>enemyCard(n)).join("")}</div>
        </div>`);
    });
    (e.specials || []).forEach(g => {
      if (!g.names || !g.names.length) return;
      groups.push(`
        <div class="enemy-group" style="--fc:var(--violet)">
          <div class="enemy-group-head"><span class="enemy-faction">${g.label || "Special units"}</span><span class="enemy-count">${g.names.length} units</span></div>
          <div class="enemy-grid">${g.names.map(n=>enemyCard(n)).join("")}</div>
        </div>`);
    });
    if (e.special && e.special.length){
      groups.push(`
        <div class="enemy-group" style="--fc:var(--violet)">
          <div class="enemy-group-head"><span class="enemy-faction">${e.specialLabel || "Special units"}</span><span class="enemy-count">${e.special.length} units</span></div>
          <div class="enemy-grid">${e.special.map(n=>enemyCard(n)).join("")}</div>
        </div>`);
    }
    if (e.boss && e.boss.length){
      groups.push(`
        <div class="enemy-group" style="--fc:var(--gold)">
          <div class="enemy-group-head"><span class="enemy-faction">Boss</span><span class="enemy-count">${e.boss.length > 1 ? "2 targets" : "assassination target"}</span></div>
          <div class="enemy-grid boss-grid">${e.boss.map(n=>enemyCard(n,"boss")).join("")}</div>
        </div>`);
    }
    const enemySummary = (e.factions || []).map(fk => ENEMY_FACTIONS[fk] ? ENEMY_FACTIONS[fk].n : "").filter(Boolean).join(", ");
    info.innerHTML = `
      <img class="planet-art" src="${img("planet_"+p.img)}" alt="${p.n}" loading="lazy" />
      <div class="planet-intro">
        <h3>${p.n}</h3>
        <div class="tagrow">${p.tags.map(t=>`<span class="tag">${t}</span>`).join("")}</div>
        <p><b>${p.role}.</b> ${p.text}</p>
        <div class="planet-meta">
          <span><b>Enemy kind</b>${enemySummary || "\u2014"}</span>
        </div>
      </div>
      <div class="enemy-roster">${groups.join("")}</div>`;
    list.querySelectorAll(".planet-btn").forEach((b,bi)=>b.classList.toggle("active", bi===i));
  }
  list.innerHTML = PLANETS.map((p,i)=>
    `<button class="planet-btn" data-i="${i}">
       <img src="${img("planet_"+p.img)}" alt="" loading="lazy" />
       <span class="planet-name">${p.n}</span>
       <span class="idx">${String(i+1).padStart(2,"0")}</span>
     </button>`).join("");
  list.addEventListener("click", e => {
    const b = e.target.closest(".planet-btn"); if (!b) return; show(+b.dataset.i);
  });
  show(0);

  const missions = [
    ["exterminate","Exterminate","Kill a set number of enemies, then extract. Simple and great for testing builds."],
    ["capture","Capture","Chase down and capture a fleeing VIP target."],
    ["sabotage","Sabotage","Infiltrate and sabotage a ship/system objective, often with a puzzle or damage-type choice."],
    ["spy","Spy","Sneak into vaults and hack consoles without tripping alarms. Rewards great mods."],
    ["rescue","Rescue","Free a captive and escort them to extraction."],
    ["mobiledefense","Mobile Defense","Defend a console through a short hacking sequence at several points."],
    ["defense","Defense","Protect an objective through waves of enemies — endless, pays out in rotations."],
    ["survival","Survival","Stay alive while life support drains; kill enemies to keep it up. Endless loot farm."],
    ["interception","Interception","Hold and defend multiple capture points from enemy waves."],
    ["excavation","Excavation","Escort and protect drills while collecting Cryotic. Endless."],
    ["disruption","Disruption","Defend conduits by killing special enemies at each; a demanding endless mode."],
    ["assassination","Assassination","Fight a boss for a guaranteed Warframe part or special reward."],
    ["hijack","Hijack","Escort a payload using your shields/health as fuel to move it."],
    ["defection","Defection","Escort groups of defectors to safety across a map."],
    ["bounty","Bounty","Open-world missions with rotating objectives and rewards (Cetus, Fortuna, Necralisk)."],
    ["junction","Junction","Duel a spectre to unlock the next planet — also gives Mastery."]
  ];
  document.getElementById("missionTypes").innerHTML = missions.map(([k,n,d])=>`
    <div class="card mini mission-card">
      <img src="${img("mission_"+k)}" alt="${n} mission splash" loading="lazy" />
      <h4>${n}</h4>
      <p>${d}</p>
    </div>`).join("");
})();

/* ---------------- relic odds ---------------- */
const RELIC_ODDS = {
  Intact:{common:25.33, uncommon:11.00, rare:2.00},
  Exceptional:{common:23.33, uncommon:13.00, rare:4.00},
  Flawless:{common:20.00, uncommon:17.00, rare:6.00},
  Radiant:{common:16.67, uncommon:20.00, rare:10.00}
};
const RELIC_ERA_IMG = {Lith:"relic_lith", Meso:"relic_meso", Neo:"relic_neo", Axi:"relic_axi"};
const RELIC_REFINE_IMG = {Intact:"relic_intact", Exceptional:"relic_exceptional", Flawless:"relic_flawless", Radiant:"relic_radiant"};
/* glow strength of the single relic per refinement, and a tint per era */
const RELIC_REFINE_GLOW = {Intact:.2, Exceptional:.45, Flawless:.72, Radiant:1};
(function relics(){
  const btns = document.getElementById("refineBtns");
  const odds = document.getElementById("odds");
  const eraBox = document.getElementById("relicEras");
  const refineImgs = document.getElementById("refineImgs");
  let refine = "Intact";
  let currentEra = "Neo";

  eraBox.innerHTML = Object.entries(RELIC_ERA_IMG).map(([name,key])=>
    `<button class="relic-era" type="button" data-era="${name}"><img src="${img(key)}" alt="${name} relic" loading="lazy" /><figcaption>${name}</figcaption></button>`).join("");

  btns.innerHTML = Object.keys(RELIC_ODDS).map(r=>
    `<button class="refine-btn${r===refine?" active":""}" data-r="${r}">${r}</button>`).join("");
  refineImgs.innerHTML = `
    <div class="relic-display" id="relicDisplay" data-era="${currentEra}" style="--glow:${RELIC_REFINE_GLOW[refine]}">
      <span class="relic-aura" aria-hidden="true"></span>
      <img class="relic-img" id="relicImg" src="${img(RELIC_REFINE_IMG[refine])}" alt="${currentEra} ${refine} relic" />
    </div>
    <p class="relic-caption" id="relicCaption"><b>${currentEra}</b> · ${refine}</p>`;

  let lastKey = "";
  function render(){
    const o = RELIC_ODDS[refine];
    const display = document.getElementById("relicDisplay");
    const im = document.getElementById("relicImg");
    const cap = document.getElementById("relicCaption");
    if (display){ display.dataset.era = currentEra; display.style.setProperty("--glow", RELIC_REFINE_GLOW[refine]); }
    if (im){ im.src = img(RELIC_REFINE_IMG[refine]); im.alt = currentEra + " " + refine + " relic"; }
    if (cap) cap.innerHTML = `<b>${currentEra}</b> · ${refine}`;
    const key = currentEra + refine;
    if (display && key !== lastKey){
      display.classList.remove("pop"); void display.offsetWidth; display.classList.add("pop");
    }
    lastKey = key;
    eraBox.querySelectorAll(".relic-era").forEach(b=>
      b.classList.toggle("active", b.dataset.era === currentEra));
    odds.innerHTML = `
      <div class="odd-row"><div class="lbl"><span>Common ×3</span><b>${o.common}% each</b></div>
        <div class="odd-bar"><i class="odd-common" style="width:${o.common}%"></i></div></div>
      <div class="odd-row"><div class="lbl"><span>Uncommon ×2</span><b>${o.uncommon}% each</b></div>
        <div class="odd-bar"><i class="odd-uncommon" style="width:${o.uncommon}%"></i></div></div>
      <div class="odd-row"><div class="lbl"><span>Rare ×1</span><b>${o.rare}% each</b></div>
        <div class="odd-bar"><i class="odd-rare" style="width:${o.rare}%"></i></div></div>
      <p class="muted small" style="margin:.4rem 0 0">${currentEra} · ${refine} relic — odds are per reward slot.</p>`;
  }
  btns.addEventListener("click", e => {
    const b = e.target.closest(".refine-btn"); if (!b) return;
    refine = b.dataset.r;
    btns.querySelectorAll(".refine-btn").forEach(x=>x.classList.toggle("active", x===b));
    render();
  });
  eraBox.addEventListener("click", e => {
    const b = e.target.closest(".relic-era"); if (!b) return;
    currentEra = b.dataset.era;
    render();
  });
  render();
})();

/* ---------------- later systems ---------------- */
(function systems(){
  const data = [
    ["focus","Focus / Operator","Chosen in The Second Dream; gives your Operator powerful abilities and passives."],
    ["helminth","Helminth","Feed a Warframe to your ship to transplant one ability onto another frame."],
    ["incarnon","Incarnon","Transform certain weapons with powerful evolution upgrades from the Zariman and beyond."],
    ["nightwave","Nightwave","A free seasonal track rewarding Nitain, Catalysts/Reactors, slots and mods."],
    ["companion","Companions","Sentinels, Kubrows, Kavats, MOAs and Hounds — your loyal, moddable allies."],
    ["railjack","Railjack","Command a capital ship for space-and-boarding Empyrean missions."],
    ["necramech","Necramech","Pilot a heavy mech in open worlds and certain missions."],
    ["archwing","Archwing","A flight rig for underwater and space combat sections — and open-world travel."]
  ];
  document.getElementById("systems").innerHTML = data.map(([k,n,d])=>`
    <div class="card mini media-card">
      <img class="card-media" src="${img(k)}" alt="${n}" loading="lazy" />
      <h4>${n}</h4>
      <p>${d}</p>
    </div>`).join("");
})();

/* ---------------- checklist ---------------- */
const CHECK_ITEMS = [
  "Finish the Vor's Prize quest",
  "Install the Mods, Foundry and Arsenal segments",
  "Pick a starter Warframe you actually enjoy",
  "Level your starter Warframe and weapons to Rank 30",
  "Beat your first Junction (Venus)",
  "Build a Forma or find an Orokin Catalyst/Reactor",
  "Unlock and try a Void Fissure mission",
  "Join or create a Clan for research blueprints",
  "Start The Second Dream quest",
  "Reach Mastery Rank 5"
];
(function checklist(){
  const ul = document.getElementById("checklist");
  const bar = document.getElementById("checkBar");
  const count = document.getElementById("checkCount");
  const KEY = "wf101-checklist";
  let state = {};
  try { state = JSON.parse(localStorage.getItem(KEY)) || {}; } catch(e){ state = {}; }
  function render(){
    ul.innerHTML = CHECK_ITEMS.map((t,i)=>`
      <li><label><input type="checkbox" data-i="${i}" ${state[i]?"checked":""}/><span>${t}</span></label></li>`).join("");
    const done = CHECK_ITEMS.filter((_,i)=>state[i]).length;
    bar.style.width = (done / CHECK_ITEMS.length * 100) + "%";
    count.textContent = `${done} / ${CHECK_ITEMS.length} complete`;
  }
  ul.addEventListener("change", e => {
    const i = e.target.dataset.i;
    state[i] = e.target.checked;
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch(err){}
    render();
  });
  document.getElementById("resetCheck").addEventListener("click", () => {
    state = {};
    try { localStorage.removeItem(KEY); } catch(err){}
    render();
  });
  render();
})();

/* ---------------- glossary ---------------- */
const GLOSSARY = [
  ["Affinity","The game's XP. Earned by killing enemies, completing objectives and reviving allies; ranks up gear to 30.","focus"],
  ["Arsenal","The Orbiter screen where you equip Warframes, weapons, Companions and install mods.","foundry"],
  ["Aura / Stance","Special mods that add mod capacity instead of using it. Auras go on Warframes, Stances on melee weapons.","mod_intensify"],
  ["Catalyst / Reactor","\"Potatoes\". Installed on a weapon/Catalyst or Warframe/Reactor to double mod capacity.","catalyst"],
  ["Clan Dojo","A player-built hub with research labs. Clan research unlocks many Warframes and weapons for Credits.","trading"],
  ["Companion","Your pet ally — Sentinels (robots), Kubrows/Kavats (beasts), MOAs and more. They have their own mods.","companion"],
  ["Credits","The free in-game currency, used for crafting, fusion and trading taxes.","credits"],
  ["Endo","The resource used with Credits to rank up (fuse) mods via Fusion.","endo"],
  ["Forma","An item used to add or change a mod slot's polarity, then re-level the gear. Central to endgame builds.","forma"],
  ["Foundry","The Orbiter station where blueprints + resources become Warframes, weapons and more.","foundry"],
  ["Fissure","A Void mission variant where you crack a Void Relic to get a Prime part or Forma.","fissure"],
  ["Focus","A later-game progression tree unlocked by The Second Dream; gives Operators special abilities.","focus"],
  ["Helminth","A system that lets you feed a Warframe to your ship to transplant one of its abilities onto another frame.","helminth"],
  ["Incarnon","Powerful weapon upgrades (from the Zariman and later) that transform a weapon's potential.","incarnon"],
  ["Junction","A duel against a spectre that unlocks the next planet and grants Mastery.","mission_junction"],
  ["Mastery Rank (MR)","A profile-wide level based on how much gear you've ranked and how much of the map you've cleared.","mastery"],
  ["Mod","A card installed into gear to improve stats or add effects. The core of Warframe's power progression.","mod_serration"],
  ["Nightwave","The free seasonal battle-pass-style system that rewards Nitain, Catalysts/Reactors, slots and mods.","nightwave"],
  ["Operator","You — the Tenno child who controls the Warframe. Unlocked and expanded through story quests.","focus"],
  ["Orokin","The ancient fallen empire that built the Warframes, the Void tech and the Relics.","corrupted"],
  ["Platinum","The premium currency. Can be bought with real money or earned by trading with players.","platinum"],
  ["Polarity","The symbol on a mod and a slot. Matching them halves a mod's capacity drain.","forma"],
  ["Prime","The Orokin-era, upgraded version of a Warframe or weapon, with better stats and extra polarity slots.","relic_axi"],
  ["Proc","A triggered status effect (e.g. Bleed, Viral). Based on the damage types on a weapon.","viral"],
  ["Relic","A Void Relic. Crack it in a Fissure to get a Prime part or Forma; refine with Void Traces for better odds.","relic_lith"],
  ["Riven","A randomised, weapon-specific mod with generated stats. Endgame min-maxing.","mod_riven"],
  ["Sentinel","A floating robotic Companion that fights alongside you and can use utility mods like Vacuum.","companion"],
  ["Syndicate","Factions you earn Standing with to buy exclusive weapons, mods and cosmetics. Some oppose each other.","nightwave"],
  ["Tenno","You and the other players — the Operators who pilot Warframes.","excalibur"],
  ["Void Traces","The resource used to refine Void Relics; earned by cracking relics.","relic_radiant"],
  ["Zaw / Kitgun / Amp","Modular weapons you assemble from parts (melee / secondary / Operator amp).","primary"]
];
(function glossary(){
  const wrap = document.getElementById("glossary");
  wrap.innerHTML = GLOSSARY.map(([t,d,ic])=>
    `<div class="gloss">
       ${ic?`<img src="${img(ic)}" alt="" loading="lazy" />`:""}
       <div><b>${t}</b><p>${d}</p></div>
     </div>`).join("");
})();

/* ---------------- quiz ---------------- */
const QUIZ = [
  {q:"What is the main use of a Void Relic?", a:[
    "It permanently boosts your Warframe's stats",
    "You crack it in a Void Fissure to get a Prime part or Forma",
    "It is the game's premium currency",
    "It opens the Clan Dojo"], correct:1,
    why:"Relics are opened in Fissure missions. Refining them with Void Traces raises the odds of the rare reward."},
  {q:"Which currency is the free-to-play one used for crafting?", a:["Platinum","Ducats","Credits","Void Traces"], correct:2,
    why:"Credits are earned in-game and used for crafting, fusion and trade taxes. Platinum is the premium currency."},
  {q:"Two primary elements combine into a secondary element. What does Cold + Toxin make?", a:["Blast","Viral","Corrosive","Magnetic"], correct:1,
    why:"Cold + Toxin = Viral, which amplifies damage dealt to health — one of the most used elements in the game."},
  {q:"What does an Orokin Catalyst or Reactor do?", a:[
    "Doubles your mod capacity",
    "Instantly builds an item in the Foundry",
    "Rerolls a Riven mod's stats",
    "Gives you free Platinum"], correct:0,
    why:"Catalysts (weapons) and Reactors (Warframes) double mod capacity — players call them \"potatoes\"."},
  {q:"How do you mainly raise your Mastery Rank?", a:[
    "By spending Platinum",
    "By ranking up new Warframes, weapons and companions to 30",
    "Only by trading with other players",
    "By playing for a set number of hours"], correct:1,
    why:"Mastery comes from ranking gear to 30 (once per item), clearing nodes and beating Junctions — then passing the MR test."}
];
(function quiz(){
  const card = document.getElementById("quizCard");
  card.innerHTML = QUIZ.map((item,qi)=>`
    <div class="q" data-q="${qi}">
      <h4>${qi+1}. ${item.q}</h4>
      <div class="opts">
        ${item.a.map((a,ai)=>`<button class="opt" data-a="${ai}">${a}</button>`).join("")}
      </div>
      <p class="q-explain">${item.why}</p>
    </div>`).join("") + `<div class="quiz-score" id="quizScore"></div>`;
  let answered = 0, score = 0;
  card.addEventListener("click", e => {
    const btn = e.target.closest(".opt"); if (!btn || btn.disabled) return;
    const q = btn.closest(".q");
    const qi = +q.dataset.q;
    const opts = q.querySelectorAll(".opt");
    opts.forEach(o => o.disabled = true);
    const correct = QUIZ[qi].correct;
    opts[correct].classList.add("correct");
    if (+btn.dataset.a !== correct) btn.classList.add("wrong"); else score++;
    q.querySelector(".q-explain").classList.add("show");
    answered++;
    if (answered === QUIZ.length){
      const msg = score === QUIZ.length ? "Flawless — you're ready, Tenno. ⭐"
        : score >= 3 ? `Solid! ${score}/${QUIZ.length} correct.`
        : `Keep going! ${score}/${QUIZ.length} — reread the guide and you'll get there.`;
      document.getElementById("quizScore").textContent = msg;
    }
  });
})();

/* ============================================================
   EXTRA VISUALS
   ============================================================ */
function hexA(hex, a){
  const h = hex.replace("#","");
  const full = h.length === 3 ? h.split("").map(c => c + c).join("") : h;
  const n = parseInt(full, 16);
  return `rgba(${(n>>16)&255},${(n>>8)&255},${n&255},${a})`;
}

/* ---------------- loadout builder ---------------- */
(function loadout(){
  const wrap = document.getElementById("loadout");
  const out = document.getElementById("loadoutDetail");
  if (!wrap) return;
  const slots = [
    {img:"excalibur", label:"Warframe", name:"Excalibur",
     text:"Your suit — it carries four abilities plus a Passive. It has its own mod loadout (Vitality, Redirection, Intensify, Streamline…) and can start with an Aura that adds capacity."},
    {img:"primary", label:"Primary", name:"Rifle / shotgun",
     text:"Your main gun, and where most of your damage comes from. Mods matter most here: a base-damage mod (Serration), multishot, then an elemental combo."},
    {img:"secondary", label:"Secondary", name:"Pistol",
     text:"Your backup ranged weapon. A second damage element or a utility mod (ammo, healing) often lives here — some secondaries are top-tier damage in their own right."},
    {img:"weapon_skana", label:"Melee", name:"Sword",
     text:"Close-quarters weapon with a Stance mod and a combo counter. Melee scales hard with crit and 'condition overload' style builds into the late game."},
    {img:"companion", label:"Companion", name:"Sentinel / beast",
     text:"A moddable ally that fights alongside you and carries utility like Vacuum to pull in loot. Sentinels float, Kubrows and Kavats run, MOAs and Hounds come later."}
  ];
  wrap.innerHTML = slots.map((s,i)=>`
    <button class="loadout-slot${i===0?" active":""}" data-i="${i}">
      <img src="${img(s.img)}" alt="${s.name}" loading="lazy" />
      <b>${s.label}</b><span>${s.name}</span>
    </button>`).join("");
  function show(i){
    const s = slots[i];
    out.innerHTML = `<b>${s.label} — ${s.name}.</b> ${s.text}`;
    wrap.querySelectorAll(".loadout-slot").forEach((b,bi)=>b.classList.toggle("active", bi===i));
  }
  wrap.addEventListener("click", e=>{
    const b = e.target.closest(".loadout-slot"); if (!b) return;
    show(+b.dataset.i);
  });
  show(0);
})();

/* ---------------- faction damage cheat-sheet ---------------- */
(function factionDamage(){
  const wrap = document.getElementById("factionDamage");
  if (!wrap) return;
  const E = {
    impact:["Impact","#9aa6b8"], puncture:["Puncture","#c9b07a"], slash:["Slash","#e07a7a"],
    heat:["Heat","#ff7a3d"], cold:["Cold","#7fd3ff"], electricity:["Electricity","#5b9bff"],
    toxin:["Toxin","#5fce7a"], blast:["Blast","#e0a35a"], corrosive:["Corrosive","#a9d94a"],
    gas:["Gas","#8fd66a"], magnetic:["Magnetic","#9aa6ff"], radiation:["Radiation","#c9e05a"], viral:["Viral","#79e0a8"]
  };
  const data = [
    {k:"grineer", n:"Grineer", note:"Cloned flesh under heavy Ferrite armor.", els:["corrosive","impact","slash"]},
    {k:"corpus", n:"Corpus", note:"Shields on crewmen, robotics everywhere.", els:["magnetic","toxin","electricity"]},
    {k:"infested", n:"Infested", note:"Squishy but an endless melee swarm.", els:["heat","gas","slash"]},
    {k:"corrupted", n:"Corrupted", note:"Orokin-brainwashed mix of every faction.", els:["radiation","corrosive","viral"]},
    {k:"sentient", n:"Sentient", note:"Adapts to and resists repeated damage.", els:["radiation","cold","viral"]}
  ];
  wrap.innerHTML = data.map(f=>`
    <div class="card mini faction-dmg">
      <img class="f-head" src="${img(f.k)}" alt="${f.n} faction icon" loading="lazy" />
      <h4>${f.n}</h4>
      <p>${f.note}</p>
      <div class="el-chips">
        ${f.els.map(e=>{
          const [n,c] = E[e];
          return `<span class="el-chip" style="border-color:${c};background:${hexA(c,.16)}"><img src="${img(e)}" alt="" loading="lazy" />${n}</span>`;
        }).join("")}
      </div>
    </div>`).join("");
})();

/* ---------------- polarity lab ---------------- */
(function polarity(){
  const wrap = document.getElementById("polarityLab");
  if (!wrap) return;
  const POL = [
    ["V","Madurai","Offense — damage, crit, multishot.","#ff8a5c"],
    ["D","Vazarin","Defense — health, shields, armor.","#6fb6ff"],
    ["–","Naramon","Utility — range, duration, speed.","#e7c579"],
    ["=","Zenurik","Energy and efficiency.","#9d7bff"],
    ["O","Penjaga","Companion mods.","#5fd18a"],
    ["Ω","Aura / Stance","Adds capacity instead of using it.","#4fd6e6"]
  ];
  wrap.innerHTML = `
    <div class="pol-legend">
      ${POL.map(([s,n,d,c])=>`
        <div class="pol-item">
          <span class="pol-sym" style="background:linear-gradient(120deg,${c},${hexA(c,.55)})">${s}</span>
          <span><b>${n}</b><small>${d}</small></span>
        </div>`).join("")}
    </div>
    <div class="pol-demo">
      <div class="pol-mod">
        <img src="${img("mod_serration")}" alt="Serration mod card" loading="lazy" />
        <span><b>Serration</b><small>Madurai polarity · base drain 14</small></span>
      </div>
      <div class="pol-slots">
        <button class="pol-slot" data-match="1"><span class="sym">V</span><span>Matching slot</span></button>
        <button class="pol-slot active" data-match="0"><span class="sym">D</span><span>Wrong slot</span></button>
      </div>
      <div class="pol-result" id="polResult"></div>
    </div>
    <p class="muted small" style="margin:.9rem 0 0">Polarity symbols are approximated for clarity. Matching a mod's polarity to its slot <b>halves the drain</b> (rounded up) — that is how endgame builds fit so many mods at once.</p>`;

  const res = document.getElementById("polResult");
  function paint(match){
    res.innerHTML = match
      ? `Drain <s style="color:var(--muted)">14</s> → <b style="color:var(--green)">7</b> · capacity 30 → <b>23 left</b>`
      : `Drain <b style="color:var(--gold)">14</b> · capacity 30 → <b>16 left</b>`;
    wrap.querySelectorAll(".pol-slot").forEach(b =>
      b.classList.toggle("active", (b.dataset.match === "1") === !!match));
  }
  wrap.addEventListener("click", e=>{
    const b = e.target.closest(".pol-slot"); if (!b) return;
    paint(b.dataset.match === "1");
  });
  paint(false);
})();

/* ---------------- endless rotation tracker ---------------- */
(function rotation(){
  const wrap = document.getElementById("rotation");
  const out = document.getElementById("rotationDetail");
  if (!wrap || !out) return;
  const seq = ["A","A","B","C","A","A","B","C"];
  const info = {
    A:"Tier A — common rewards: resources, common mods, Endo and common Relics. Paid at the end of rounds 1 and 2.",
    B:"Tier B — a step up: rarer mods, more Endo and better Relics. Paid at the end of round 3.",
    C:"Tier C — the best table: rare mods, Prime parts and larger resource bundles. Paid at round 4, then the cycle restarts at A."
  };
  wrap.innerHTML = seq.map(t=>`<button class="rot-chip ${t.toLowerCase()}" data-t="${t}">${t}</button>`).join("");
  function show(t, el){
    out.textContent = info[t];
    wrap.querySelectorAll(".rot-chip").forEach(c=>c.classList.toggle("active", c === el));
  }
  wrap.addEventListener("click", e=>{
    const b = e.target.closest(".rot-chip"); if (!b) return;
    show(b.dataset.t, b);
  });
  show("A", wrap.querySelector(".rot-chip"));
})();

/* ---------------- relic reward slots ---------------- */
(function relicSlots(){
  const wrap = document.getElementById("relicSlots");
  const btns = document.getElementById("refineBtns");
  if (!wrap) return;
  function render(){
    const active = btns ? btns.querySelector(".refine-btn.active") : null;
    const refine = active ? active.dataset.r : "Intact";
    const o = RELIC_ODDS[refine];
    const slots = [
      ["Common", o.common], ["Common", o.common], ["Common", o.common],
      ["Uncommon", o.uncommon], ["Uncommon", o.uncommon],
      ["Rare", o.rare]
    ];
    wrap.innerHTML = slots.map(([tier,val])=>`
      <div class="relic-slot ${tier.toLowerCase()}">
        <span class="tier">${tier}</span>
        <b>${val.toFixed(2)}%</b>
        <small>per slot</small>
      </div>`).join("");
  }
  if (btns) btns.addEventListener("click", render);
  render();
})();

/* ---------------- beginner roadmap ---------------- */
(function roadmap(){
  const wrap = document.getElementById("roadmap");
  if (!wrap) return;
  const steps = [
    {img:"hero", t:"Awaken on the Zariman", d:"Finish the Vor's Prize quest and learn the absolute basics: move, shoot, extract."},
    {img:"mission_junction", t:"Open the Star Chart", d:"Clear nodes, beat Junctions and unlock planet after planet across the Origin System."},
    {img:"foundry", t:"Build new gear", d:"Install the Foundry segment and craft weapons and Warframes from blueprints plus resources."},
    {img:"forma", t:"Learn mods & Forma", d:"Rank core mods with Endo, install a Catalyst/Reactor, then Forma a slot to fit even more."},
    {img:"fissure", t:"Crack your first Relic", d:"Run a Void Fissure, pick a squad reward and start building Prime gear."},
    {img:"focus", t:"Play The Second Dream", d:"Meet your Operator, unlock Focus, and see why Warframe's story is worth the climb."},
    {img:"railjack", t:"Explore later systems", d:"Railjack, Necramechs, Kuva Liches and Incarnon weapons — the endgame opens up."}
  ];
  wrap.innerHTML = steps.map((s,i)=>`
    <li class="road-step">
      <span class="road-dot" aria-hidden="true"></span>
      <div class="road-card">
        <img src="${img(s.img)}" alt="" loading="lazy" />
        <div>
          <span class="road-num">Step ${String(i+1).padStart(2,"0")}</span>
          <b>${s.t}</b>
          <p>${s.d}</p>
        </div>
      </div>
    </li>`).join("");
})();

/* ============================================================
   MORE VISUALS
   ============================================================ */

/* ---------------- enemy defense layers ---------------- */
const DEF_LAYERS = [
  {id:"overguard", n:"Overguard", c:"#9fb4d8", icon:"▣", counters:["magnetic"], text:"A separate barrier on Eximus units. While it holds, the unit ignores crowd control, so break it before your abilities land. Magnetic damage is amplified against Overguard (up to +325%)."},
  {id:"shields", n:"Shields", c:"#4f9bff", icon:"◉", counters:["toxin","magnetic"], text:"Found on Corpus, some Corrupted and bosses. Shields regenerate after a few seconds without damage. Toxin bypasses them completely; Magnetic amplifies damage to shields and stops regeneration."},
  {id:"armor", n:"Armor", c:"#e0a35a", icon:"▦", counters:["corrosive","heat","slash"], text:"Ferrite/Alloy armor (mostly Grineer) cuts incoming damage, and it scales hard at high levels. Corrosive reduces armor and Heat strips up to 50% of it; Slash's Bleed proc bypasses armor entirely."},
  {id:"health", n:"Health", c:"#ff6b6b", icon:"♥", counters:["viral","slash"], text:"The final layer. Viral amplifies damage dealt to health (stacking up to +325%) — which is why Viral plus Slash or Heat is the classic pairing. Toxin still reaches health directly through shields."}
];
/* how a tested damage type behaves against each layer: [kind, label]
   kind: bypass | amplify | strip | confuse | dot | neutral */
const DEF_HITS = {
  toxin:{n:"Toxin", img:"toxin", c:"#5fce7a",
    e:{shields:["bypass","Bypassed"], health:["dot","Direct poison"]},
    note:"Toxin skips Shields entirely and poisons health directly — the classic anti-Corpus bypass."},
  magnetic:{n:"Magnetic", img:"magnetic", c:"#9aa6ff",
    e:{overguard:["amplify","+325%"], shields:["amplify","+325% · no regen"]},
    note:"Magnetic is amplified against Shields and Overguard (up to +325%) and halts shield regeneration for 6s."},
  corrosive:{n:"Corrosive", img:"corrosive", c:"#a9d94a",
    e:{armor:["strip","−80% armor"]},
    note:"Corrosive melts Ferrite armor, stacking up to −80%. Strip the armor and every other damage type hits harder."},
  heat:{n:"Heat", img:"heat", c:"#ff7a3d",
    e:{armor:["strip","−50% armor"], health:["dot","Burn DoT"]},
    note:"Heat panics the target, burns it over time and gradually strips up to 50% of its armor."},
  slash:{n:"Slash", img:"slash", c:"#ff6b6b",
    e:{armor:["bypass","Bleed ignores armor"], health:["dot","Bleed DoT"]},
    note:"Slash's Bleed damage-over-time ignores armor completely — the reason Slash crit builds dominate."},
  viral:{n:"Viral", img:"viral", c:"#79e0a8",
    e:{health:["amplify","+325% health dmg"]},
    note:"Viral amplifies all damage dealt to health, stacking up to +325%. Pair it with Slash or Heat to finish the job."},
  radiation:{n:"Radiation", img:"radiation", c:"#c9e05a",
    e:{armor:["amplify","+75% vs Alloy"], health:["confuse","Attacks allies"]},
    note:"Radiation turns enemies against each other and gets bonus damage against Alloy armor (Bombards, Heavy Gunners)."},
  impact:{n:"Impact", img:"impact", c:"#c9d4e0",
    e:{shields:["neutral","Knockback"], health:["neutral","Stagger"]},
    note:"Impact staggers enemies and raises the Parazon Mercy-kill threshold — crowd control rather than raw damage."}
};
(function defenseLayers(){
  const bar = document.getElementById("defBar");
  const detail = document.getElementById("defDetail");
  const hitsEl = document.getElementById("defHits");
  const play = document.getElementById("defPlay");
  if (!bar || !detail) return;
  const E = {magnetic:"Magnetic", toxin:"Toxin", corrosive:"Corrosive", heat:"Heat", slash:"Slash", viral:"Viral"};
  const chip = e => `<span class="def-chip"><img src="${img(e)}" alt="" loading="lazy" />${E[e]}</span>`;
  const layerTag = i => i === 0 ? "outermost" : i === DEF_LAYERS.length - 1 ? "innermost" : "inner";
  const kindLabel = {bypass:"Bypassed", amplify:"Amplified", strip:"Stripped", confuse:"Confused", dot:"Damage over time", neutral:"Neutral"};
  let currentHit = null;

  bar.innerHTML = DEF_LAYERS.map((l,i)=>
    `<button class="def-seg${i===0?" active":""}" data-i="${i}" style="--c:${l.c};--ca:${hexA(l.c,.32)}">
      <span class="def-ic">${l.icon}</span>
      <span class="def-name"><b>${l.n}<em class="def-fx"></em></b><small>Layer ${i+1} · ${layerTag(i)}</small></span>
      <span class="def-counters">${l.counters.map(chip).join("")}</span>
      <span class="def-track" aria-hidden="true"><i></i></span>
    </button>`).join("");

  if (hitsEl){
    hitsEl.innerHTML = Object.entries(DEF_HITS).map(([k,h])=>
      `<button class="def-hit" data-k="${k}" style="--c:${h.c}">
        <img src="${img(h.img)}" alt="" loading="lazy" /><span>${h.n}</span>
      </button>`).join("");
    hitsEl.addEventListener("click", e=>{
      const b = e.target.closest(".def-hit"); if (!b) return;
      testHit(b.dataset.k);
    });
  }
  if (play) play.addEventListener("click", ()=> testHit(currentHit || "viral"));

  function integrityFor(kind){
    if (kind === "bypass") return 0;
    if (kind === "strip") return 22;
    return 100;
  }

  function renderLayer(i, hitKey){
    const l = DEF_LAYERS[i];
    detail.style.setProperty("--c", l.c);
    let interaction = "";
    if (hitKey){
      const h = DEF_HITS[hitKey];
      const fx = h.e[l.id];
      interaction = fx
        ? `<div class="def-interact" style="--hc:${h.c}">
             <span class="def-interact-dot"></span>
             <b>${h.n}</b> <span class="def-fx-badge fx-${fx[0]}">${fx[1]}</span>
             <span class="muted small">against this layer</span>
           </div>`
        : `<div class="def-interact neutral" style="--hc:${h.c}">
             <span class="def-interact-dot"></span>
             <b>${h.n}</b> <span class="def-fx-badge fx-neutral">No special effect</span>
             <span class="muted small">against this layer</span>
           </div>`;
    }
    detail.innerHTML = `
      <div class="def-head">
        <span class="def-dot" style="background:${l.c}"></span>
        <h4>${l.n}</h4>
        <span class="def-layer-tag">Layer ${i+1} · ${layerTag(i)}</span>
      </div>
      <p style="margin:.2rem 0 .8rem">${l.text}</p>
      ${interaction}
      <div class="def-counters-row"><span class="def-lbl">Best stripped by</span>${l.counters.map(chip).join("")}</div>`;
    bar.querySelectorAll(".def-seg").forEach((b,bi)=>b.classList.toggle("active", bi===i));
  }

  function testHit(key){
    const h = DEF_HITS[key];
    if (!h) return;
    currentHit = key;
    if (hitsEl) hitsEl.querySelectorAll(".def-hit").forEach(b=>b.classList.toggle("active", b.dataset.k === key));
    const segs = bar.querySelectorAll(".def-seg");
    segs.forEach(s=>{ s.classList.remove("hit","hit-bypass","hit-amplify","hit-strip","hit-confuse","hit-neutral","hit-dot"); s.style.removeProperty("--integrity"); });
    bar.classList.remove("tracing"); void bar.offsetWidth; bar.classList.add("tracing");
    let last = 0;
    DEF_LAYERS.forEach((l,i)=>{
      const fx = h.e[l.id];
      const kind = fx ? fx[0] : "neutral";
      const delay = 150 + i*230;
      if (kind !== "neutral") last = i;
      setTimeout(()=>{
        const s = segs[i];
        s.classList.add("hit", "hit-"+kind);
        s.style.setProperty("--integrity", integrityFor(kind)+"%");
        const em = s.querySelector(".def-fx");
        if (em) em.textContent = fx ? fx[1] : "";
      }, delay);
    });
    setTimeout(()=> bar.classList.remove("tracing"), 150 + DEF_LAYERS.length*230 + 200);
    renderHitDetail(h);
  }

  function renderHitDetail(h){
    detail.style.setProperty("--c", h.c);
    detail.innerHTML = `
      <div class="def-head">
        <img class="def-hit-icon" src="${img(h.img)}" alt="" />
        <h4>${h.n} vs the stack</h4>
      </div>
      <p style="margin:.2rem 0 .8rem">${h.note}</p>
      <div class="def-legend">
        ${DEF_LAYERS.map(l=>{
          const fx = h.e[l.id];
          const kind = fx ? fx[0] : "neutral";
          const label = fx ? fx[1] : kindLabel.neutral;
          const arrow = kind === "bypass" ? "↳ skips" : kind === "amplify" ? "↑" : kind === "strip" ? "↓" : "";
          return `<div class="def-legend-row kind-${kind}">
              <span class="def-dot" style="background:${l.c}"></span>
              <b>${l.n}</b>
              <span class="muted small">${arrow}</span>
              <span class="def-fx-badge fx-${kind}">${label}</span>
            </div>`;
        }).join("")}
      </div>
      <p class="small muted" style="margin:.2rem 0 0">Click a layer above to read what it does.</p>`;
    bar.querySelectorAll(".def-seg").forEach(b=>b.classList.remove("active"));
  }

  bar.addEventListener("click", e=>{
    const b = e.target.closest(".def-seg"); if (!b) return;
    renderLayer(+b.dataset.i, currentHit);
  });
  renderLayer(0, null);
})();

/* ---------------- crit / status / hybrid build lab ---------------- */
const BUILDS = {
  crit:{
    name:"Crit build",
    tagline:"Multiply every hit.",
    stats:["Crit Chance","Crit Damage","Multishot"],
    text:"Stack Crit Chance and Crit Damage so most of your shots crit, then add Multishot to fire more projectiles per trigger pull. Best on weapons whose base crit chance is already high.",
    mods:[["Point Strike","+Rifle Crit Chance"],["Vital Sense","+Rifle Crit Damage"],["Split Chamber","+Multishot"],["Organ Shatter","+Melee Crit Damage"]],
    good:"weapons with a high base crit chance — rifles, bows, snipers and many melee."
  },
  status:{
    name:"Status build",
    tagline:"Stack procs that do the work.",
    stats:["Status Chance","Multishot","Fire Rate"],
    text:"Raise Status Chance so hits reliably proc your elements. The dual-stat elemental mods add both elemental damage and status chance at once — Viral, Corrosive and Heat are the usual targets.",
    mods:[["Malignant Force","+Toxin & Status"],["Thermite Rounds","+Heat & Status"],["Rime Rounds","+Cold & Status"],["Split Chamber","+Multishot"]],
    good:"high base status weapons; strong against armor, shields and high-health targets."
  },
  hybrid:{
    name:"Hybrid build",
    tagline:"Crit and status together.",
    stats:["Crit Chance","Crit Damage","Status Chance","Multishot"],
    text:"Many top weapons do both — crit for raw damage and status for Viral/Corrosive procs. Later, Galvanized mods and Condition Overload specifically reward mixing the two.",
    mods:[["Split Chamber","+Multishot"],["Vital Sense","+Crit Damage"],["Malignant Force","+Toxin & Status"],["Primed Cryo Rounds","+Cold"]],
    good:"weapons with solid crit AND status — the usual endgame direction."
  }
};
(function buildLab(){
  const tabs = document.getElementById("buildTabs");
  const panel = document.getElementById("buildPanel");
  if (!tabs || !panel) return;
  const keys = Object.keys(BUILDS);
  let current = "crit";
  function renderTabs(){
    tabs.innerHTML = keys.map(k=>
      `<button class="build-tab${k===current?" active":""}" data-k="${k}">${BUILDS[k].name}</button>`).join("");
  }
  function render(){
    const b = BUILDS[current];
    panel.innerHTML = `
      <div>
        <p class="build-tagline">${b.tagline}</p>
        <p>${b.text}</p>
        <div class="stat-chips">${b.stats.map(s=>`<span class="stat-chip">${s}</span>`).join("")}</div>
        <p class="muted small"><b>Good for:</b> ${b.good}</p>
      </div>
      <div>
        <h4>Mods that feed it</h4>
        <div class="build-mods">
          ${b.mods.map(([n,d])=>`<div class="build-mod"><b>${n}</b><span>${d}</span></div>`).join("")}
        </div>
        <p class="muted small" style="margin-top:.7rem">Example mods — the exact names differ per weapon type (rifle / pistol / melee / shotgun).</p>
      </div>`;
  }
  renderTabs(); render();
  tabs.addEventListener("click", e=>{
    const btn = e.target.closest(".build-tab"); if (!btn) return;
    current = btn.dataset.k; renderTabs(); render();
  });
})();

/* ---------------- slots & platinum board ---------------- */
(function slotBoard(){
  const wrap = document.getElementById("slotBoard");
  if (!wrap) return;
  const items = [
    ["excalibur","Warframe slots","New accounts start with only a couple of Warframe slots. Each extra one costs about <b>20 Platinum</b> — plan before you build a frame you won't actually use."],
    ["primary","Weapon slots","Weapons share a limited inventory too. Roughly <b>12 Platinum</b> buys two more. Level a weapon to 30, then selling it frees the slot — you keep the Mastery."],
    ["trading","Earning Platinum","Trade Prime parts, rare mods and Rivens to other players for Platinum at <b>Maroo's Bazaar</b> or in a clan dojo. That is how free players fund slots and cosmetics."]
  ];
  wrap.innerHTML = items.map(([k,t,d])=>
    `<div class="card mini media-card">
      <img class="card-media" src="${img(k)}" alt="" loading="lazy" />
      <h4>${t}</h4>
      <p style="font-size:.88rem">${d}</p>
    </div>`).join("");
})();

/* ---------------- scroll-spy nav ---------------- */
(function scrollSpy(){
  const links = [...document.querySelectorAll("#nav a")];
  const map = new Map();
  links.forEach(a=>{
    const id = (a.getAttribute("href")||"").slice(1);
    const sec = id ? document.getElementById(id) : null;
    if (sec) map.set(sec, a);
  });
  if (!map.size || !("IntersectionObserver" in window)) return;
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if (e.isIntersecting){
        links.forEach(a=>a.classList.remove("active"));
        map.get(e.target).classList.add("active");
      }
    });
  }, {rootMargin:"-45% 0px -50% 0px"});
  map.forEach((a,sec)=>obs.observe(sec));
})();

/* ============================================================
   BATCH 2 VISUALS
   ============================================================ */

/* ---------------- eximus primer ---------------- */
(function eximus(){
  const wrap = document.getElementById("eximusGrid");
  if (!wrap) return;
  const data = [
    ["arctic","Arctic","Generates a Snow Globe–style barrier (10,000 object health, 20 s) that follows it, blocks ranged attacks and AoE, and inflicts Cold on anyone inside. Crits barely dent the barrier — raw damage works better. Called Frozen on Infested."],
    ["arson","Arson","Releases a 30 m ring of fire that deals Heat damage and knocks you down. Roll through the wave to avoid both the damage and the burn."],
    ["volatile","Blitz","Punches the ground to send a Blast shockwave in a straight line, dealing level-scaled damage plus a knockdown and Blast proc. Jump or roll over it — it only hits once. Called Volatile on Infested."],
    ["shock","Shock","Releases three slow-moving Electricity orbs that drift toward you for 8 seconds. Shoot them down or kill the Eximus to end them. Called Bioelectric on Infested."],
    ["energyleech","Energy Leech","Marks nearby players with a purple Energy Leech zone that collapses after 3 seconds, dealing Magnetic damage and a proc that wrecks your Energy and Shields. Step out of the zone."],
    ["guardian","Guardian","Surrounded by three rotating shields that give it 90% damage reduction to AoE attacks and give all nearby allies 90% damage reduction to everything. Kill it first, or thread shots through the gaps."],
    ["jadelight","Jade Light","Calls down tracking Jade Light beams on up to two players, dealing Heat damage that doubles every 0.5 s. Shoot the top of the beam or break line of sight."],
    ["leech","Leech","Drops a 3 m Health Leech zone that drains 5% of your max Health per hit and heals the Eximus and its allies. Move out of the zone to stop the drain. Called Sanguine on Infested."],
    ["venomous","Venomous","Emits a 3.5 m Toxin aura that deals level-scaled damage with a guaranteed Toxin proc. Engage from outside the cloud. Called Septic on some units."],
    ["surge","Surge","Moves at high speed and dashes to dodge or close in. It marks the ground beneath you, then calls down lightning bolts after a short delay — watch the marker and move."],
    ["entropic","Entropic","Wrapped in a red orb that blocks all projectiles and Warframe abilities. Melee attacks (or a Tauron Strike) are the reliable way to break it. Found aboard the Zariman."]
  ];
  wrap.innerHTML = data.map(([k,n,d])=>`
    <div class="card mini eximus-card">
      <img class="ex-img" src="${img("eximus_"+k)}" alt="${n} Eximus unit" loading="lazy" />
      <h4>${n}</h4>
      <p>${d}</p>
    </div>`).join("");
})();

/* ---------------- damage calculator ---------------- */
(function damageCalc(){
  const ids = ["dmgBase","dmgMod","dmgElem","dmgMulti","dmgCritC","dmgCritD"];
  const outs = {dmgBase:"dmgBaseOut", dmgMod:"dmgModOut", dmgElem:"dmgElemOut", dmgMulti:"dmgMultiOut", dmgCritC:"dmgCritCOut", dmgCritD:"dmgCritDOut"};
  const els = {};
  ids.forEach(id => els[id] = document.getElementById(id));
  if (!els.dmgBase) return;
  const out = document.getElementById("dmgResult");
  function label(id){
    const v = +els[id].value;
    if (id === "dmgBase") return String(v);
    if (id === "dmgCritD") return "x" + v.toFixed(1);
    return "+" + v + "%";
  }
  function update(){
    ids.forEach(id => { document.getElementById(outs[id]).textContent = label(id); });
    const base = +els.dmgBase.value;
    const dmg = +els.dmgMod.value / 100;
    const elem = +els.dmgElem.value / 100;
    const multi = +els.dmgMulti.value / 100;
    const cc = +els.dmgCritC.value / 100;
    const cd = +els.dmgCritD.value;
    const perShot = base * (1 + dmg) * (1 + elem);
    const critMult = 1 + cc * (cd - 1);
    const perPull = perShot * critMult * (1 + multi);
    out.innerHTML = `
      <div class="dmg-big">${perPull.toFixed(1)}<span>average damage per trigger pull</span></div>
      <div class="dmg-break">
        <div><span>Damage per projectile</span><b>${perShot.toFixed(1)}</b></div>
        <div><span>Average crit multiplier</span><b>x${critMult.toFixed(2)}</b></div>
        <div><span>Projectiles (multishot)</span><b>x${(1 + multi).toFixed(2)}</b></div>
        <div><span>Combined mod multiplier</span><b>x${((1 + dmg) * (1 + elem)).toFixed(2)}</b></div>
      </div>
      <p class="dmg-note">Simplified: real damage also depends on which damage types are present, enemy armor/shields/level, status procs and headshots. Faction weaknesses multiply it further.</p>`;
  }
  ids.forEach(id => els[id].addEventListener("input", update));
  update();
})();

/* ---------------- mod ranking / fusion ---------------- */
(function fusion(){
  const range = document.getElementById("fusionRange");
  if (!range) return;
  const bar = document.getElementById("fusionBar");
  const rankEl = document.getElementById("fusionRank");
  const stats = document.getElementById("fusionStats");
  function update(){
    const r = +range.value;
    const effect = 15 + 15 * r;   // Serration: +15% at rank 0 → +165% at rank 10
    const drain = 4 + r;          // base drain 4 → 14
    rankEl.textContent = "Rank " + r;
    bar.style.width = (r / 10 * 100) + "%";
    stats.innerHTML = `
      <span class="pill-gold">+${effect}% damage</span>
      <span class="pill-cyan">${drain} drain</span>
      <span class="muted small">damage multiplier x${(1 + effect / 100).toFixed(2)}</span>`;
  }
  range.addEventListener("input", update);
  update();
})();

/* ---------------- resource map ---------------- */
const RESOURCES = [
  {n:"Ferrite", use:"Early crafting & weapons", where:["Mercury","Earth","Lua","Neptune","Void","Zariman"], best:"Tikal (Earth) or Apollodorus (Mercury), or any Void Survival/Defense"},
  {n:"Alloy Plate", use:"Weapons & gear", where:["Venus","Phobos","Ceres","Jupiter","Pluto","Sedna","Zariman"], best:"Gabii or Draco (Ceres), or Malva (Venus)"},
  {n:"Salvage", use:"Weapons & gear", where:["Mars","Jupiter","Sedna","Kuva Fortress"], best:"Cameria (Jupiter) or Wahiba (Mars)"},
  {n:"Plastids", use:"Weapons & Warframes", where:["Phobos","Saturn","Uranus","Pluto","Eris"], best:"Zeugma (Phobos), Ophelia (Uranus) or Zabala (Eris)"},
  {n:"Polymer Bundle", use:"Weapons & gear", where:["Mercury","Venus","Uranus"], best:"Assur or Ophelia (Uranus), or Apollodorus (Mercury)"},
  {n:"Rubedo", use:"Warframes & weapons", where:["Earth","Lua","Phobos","Europa","Pluto","Sedna","Void"], best:"Any Void Survival/Defense, or Zeugma (Phobos)"},
  {n:"Circuits", use:"Electronics & gear", where:["Venus","Ceres","Kuva Fortress"], best:"Draco (Ceres) or Malva (Venus)"},
  {n:"Nano Spores", use:"Infested gear & crafting", where:["Deimos","Saturn","Neptune","Eris"], best:"Hyf or Terrorem (Deimos), Akkad (Eris) or Piscinas (Saturn)"},
  {n:"Neurodes", use:"Warframes & weapons", where:["Earth","Lua","Deimos","Eris"], best:"Tycho (Lua), the Deimos bosses, Tikal (Earth) or Zabala (Eris)"},
  {n:"Neural Sensors", use:"Warframes & helmets", where:["Jupiter","Kuva Fortress"], best:"Cameria (Jupiter), Alad V (Themisto, Jupiter) or Raptors (Naamah, Europa)"},
  {n:"Orokin Cells", use:"Prime gear & Warframes", where:["Deimos","Ceres","Saturn"], best:"Terrorem (Deimos), Draco (Ceres) or Piscinas (Saturn)"},
  {n:"Argon Crystal", use:"Prime gear (decays over time!)", where:["Void","Lua","Deimos","Zariman"], best:"Any Void Survival or Exterminate — spend it before it decays!"},
  {n:"Oxium", use:"Corpus weapons & crafting", where:["Jupiter","Neptune","Lua"], best:"Elara or Io (Jupiter), Galatea or Despina (Neptune) or Apollo (Lua)"},
  {n:"Cryotic", use:"Warframe parts & gear", where:["Excavation missions","Venus","Earth","Mars","Europa","Neptune","Pluto"], best:"Any Excavation mission (Hieracon on Pluto is a favourite)"},
  {n:"Tellurium", use:"Archwing & Railjack gear", where:["Uranus","Kuva Fortress","Archwing missions"], best:"Ophelia or Caelus (Uranus) or Salacia (Neptune) — any Archwing mission can drop it"},
  {n:"Gallium", use:"Weapons & gear", where:["Mars","Uranus"], best:"Assur (Uranus) or Lieutenant Lech Kril (War, Mars)"},
  {n:"Morphics", use:"Weapons & gear", where:["Mercury","Mars","Phobos","Europa","Pluto"], best:"Wahiba (Mars), Captain Vor (Tolstoj, Mercury) or Apollodorus (Mercury)"},
  {n:"Control Module", use:"Sentinels & gear", where:["Europa","Neptune","Void"], best:"Any Void Survival/Defense, Hyena Pack (Psamathe, Neptune) or Raptors (Naamah, Europa)"},
  {n:"Mutagen Sample", use:"Infested weapons", where:["Deimos","Eris"], best:"Hyf or Terrorem (Deimos) or Akkad (Eris)"},
  {n:"Hexenon", use:"Wisp & clan research", where:["Jupiter"], best:"Ganymede or Cameria (Jupiter)"},
  {n:"Entrati Lanthorn", use:"Zariman gear & Incarnon", where:["Zariman"], best:"Zariman bounties, Void Cascade or Void Armageddon"},
  {n:"Voidgel Orb", use:"Zariman crafting", where:["Zariman"], best:"Zariman missions and Void Flood"},
  {n:"Detonite Ampule", use:"Grineer clan research", where:["Mercury","Earth","Lua","Ceres","Saturn","Uranus","Sedna","Kuva Fortress"], best:"Any Grineer mission"},
  {n:"Fieldron Sample", use:"Corpus clan research", where:["Venus","Mars","Europa","Neptune","Pluto"], best:"Any Corpus mission"},
  {n:"Kuva", use:"Riven rerolls & Liches", where:["Kuva Fortress","Kuva Siphons / Floods"], best:"Kuva Siphon and Kuva Flood missions on the Kuva Fortress"},
  {n:"Void Traces", use:"Refining Void Relics", where:["Cracking relics in Void Fissures"], best:"Any Void Fissure mission with a full squad"}
];
(function resourceMap(){
  const grid = document.getElementById("resourceGrid");
  const search = document.getElementById("resourceSearch");
  if (!grid) return;
  grid.innerHTML = RESOURCES.map(r=>{
    const slug = r.n.toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"");
    return `
    <div class="res-card" data-t="${(r.n + " " + r.use + " " + r.where.join(" ") + " " + (r.best||"")).toLowerCase()}">
      <div class="res-head">
        <img class="res-icon" src="${img("res_"+slug)}" alt="" loading="lazy" />
        <div class="res-txt"><b>${r.n}</b><span class="res-use">${r.use}</span></div>
      </div>
      <div class="res-where">${r.where.map(p=>`<span class="res-planet">${p}</span>`).join("")}</div>
      ${r.best ? `<div class="res-best">${r.best}</div>` : ""}
    </div>`;
  }).join("");
  if (search) search.addEventListener("input", ()=>{
    const q = search.value.trim().toLowerCase();
    grid.querySelectorAll(".res-card").forEach(el => {
      // match both the English source and the currently displayed (translated) text
      const hay = el.dataset.t + " " + el.textContent.toLowerCase();
      el.classList.toggle("hide", !!q && !hay.includes(q));
    });
  });
})();

/* ---------------- affinity sharing ---------------- */
const AFFINITY = [
  {t:"Your weapon kill", d:"Split between the weapon that fired and your Warframe.", frame:50, weapon:50},
  {t:"Your Warframe ability kill", d:"All of it goes to your Warframe.", frame:100, weapon:0},
  {t:"Ally or objective kill", d:"Shared only if allies are within Affinity Range (~50 m).", frame:25, weapon:75}
];
(function affinity(){
  const wrap = document.getElementById("affinityLab");
  if (!wrap) return;
  wrap.innerHTML = AFFINITY.map(a=>`
    <div class="aff-row">
      <div class="aff-label"><b>${a.t}</b><span>${a.d}</span></div>
      <div class="aff-bar">
        ${a.frame ? `<span class="aff-seg aff-frame" style="width:${a.frame}%">Frame ${a.frame}%</span>` : ""}
        ${a.weapon ? `<span class="aff-seg aff-weapon" style="width:${a.weapon}%">Weapon${a.weapon===75?"s":""} ${a.weapon}%</span>` : ""}
      </div>
    </div>`).join("");
})();

/* ---------------- build or buy table ---------------- */
const BUY_BUILD = [
  ["Weapons","Blueprint from the Market for Credits, then craft with resources in the Foundry.","Buy instantly with Platinum — optional, and often poor value."],
  ["Warframes","Farm parts from boss assassinations / quests, then craft the main blueprint.","Buy with Platinum to skip the farm."],
  ["Inventory slots","Not craftable.","Platinum only — or earn Platinum by trading. Watch for Nightwave rewards."],
  ["Orokin Catalyst / Reactor","Not craftable. Earn from Nightwave, Invasions, Sorties and alerts.","Buy with Platinum when you need one right now."],
  ["Forma","Craft from a blueprint (needs resources + a rare drop) via Void relics.","Buy a bundle with Platinum if you're in a hurry."],
  ["Prime gear","Crack Void Relics for parts, or trade parts with other players.","Buy the full set or parts from other players with Platinum."],
  ["Cosmetics (skins, colours, syandanas)","Mostly not craftable.","Platinum or events — the main 'just for looks' spending."]
];
(function buyBuild(){
  const tb = document.querySelector("#buyBuildTable tbody");
  if (!tb) return;
  tb.innerHTML = BUY_BUILD.map(r=>`<tr><td><b>${r[0]}</b></td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join("");
})();

/* ---------------- syndicates ---------------- */
const SYNDICATES = [
  {n:"Steel Meridian", c:"#e0a35a", motto:"Grineer defectors protecting the colonies.", ally:"Red Veil", foes:["New Loka","Perrin Sequence"]},
  {n:"Red Veil", c:"#ff6b6b", motto:"Fanatics who purge corruption with fire.", ally:"Steel Meridian", foes:["Arbiters of Hexis","Cephalon Suda"]},
  {n:"Arbiters of Hexis", c:"#c9e05a", motto:"Seekers of truth and mastery of the self.", ally:"Cephalon Suda", foes:["Red Veil","New Loka"]},
  {n:"Cephalon Suda", c:"#4fd6e6", motto:"A digital intelligence hungry for knowledge.", ally:"Arbiters of Hexis", foes:["Red Veil","New Loka"]},
  {n:"The Perrin Sequence", c:"#9aa6ff", motto:"Corpus merchants who fund prosperity.", ally:"New Loka", foes:["Steel Meridian","Arbiters of Hexis"]},
  {n:"New Loka", c:"#5fd18a", motto:"Environmentalists who want a pure, green Earth.", ally:"Perrin Sequence", foes:["Steel Meridian","Cephalon Suda"]}
];
(function syndicates(){
  const wrap = document.getElementById("syndicateGrid");
  if (!wrap) return;
  wrap.innerHTML = SYNDICATES.map(s=>`
    <div class="card syn-card" style="--syn:${s.c}">
      <h4>${s.n}</h4>
      <p>${s.motto}</p>
      <div class="syn-rel">
        <div class="row"><span class="lbl">Ally</span><span class="syn-tag syn-ally">${s.ally}</span></div>
        <div class="row"><span class="lbl">Enemies</span>${s.foes.map(f=>`<span class="syn-tag syn-foe">${f}</span>`).join("")}</div>
      </div>
    </div>`).join("");
})();

/* ---------------- focus schools ---------------- */
const FOCUS = [
  {n:"Madurai", c:"#ff7a3d", cat:"Damage", d:"Boost weapon and ability damage — the go-to school for raw power."},
  {n:"Vazarin", c:"#6fb6ff", cat:"Support", d:"Healing, revives and protective barriers for you and your squad."},
  {n:"Naramon", c:"#e7c579", cat:"Melee", d:"Melee upgrades: combo duration, finishers and movement."},
  {n:"Unairu", c:"#9d7bff", cat:"Defense", d:"Armor, survivability and crowd control; can petrify enemies."},
  {n:"Zenurik", c:"#4fd6e6", cat:"Energy", d:"Energy regeneration and efficiency — a near-universal comfort pick."}
];
(function focus(){
  const wrap = document.getElementById("focusGrid");
  if (!wrap) return;
  wrap.innerHTML = FOCUS.map(f=>`
    <div class="card mini focus-card" style="--foc:${f.c}">
      <span class="focus-sym" style="background:linear-gradient(120deg,${f.c},${hexA(f.c,.5)})">${f.n[0]}</span>
      <h4>${f.n}</h4>
      <span class="focus-cat">${f.cat}</span>
      <p>${f.d}</p>
    </div>`).join("");
})();

/* ---------------- kuva lich / sister pipeline ---------------- */
const LICH_STEPS = [
  "Trigger and kill a <b>Kuva Larvaling</b> (Grineer) or a <b>Sister candidate</b> (Corpus) to create your rival — you'll see the weapon they'll carry before you commit.",
  "Farm <b>Requiem Relics</b> and open them in Fissures to collect <b>Requiem mods</b> (Fass, Vome, Ris and the rest).",
  "Clear their influence nodes on the Star Chart to reveal which <b>three Requiem mods</b> are needed and in what order.",
  "Stab your Lich or Sister with the correct Requiem sequence to break the code.",
  "Confront them at the showdown. Choose <b>Convert</b> to recruit them as an ally, or <b>Vanquish</b> to take their Kuva/Tenet weapon."
];
(function lich(){
  const wrap = document.getElementById("lichSteps");
  if (!wrap) return;
  wrap.innerHTML = LICH_STEPS.map(s=>`<li>${s}</li>`).join("");
})();

/* ---------------- companion photo table ---------------- */
(function companions(){
  const tb = document.querySelector("#companionTable tbody");
  if (!tb) return;
  const data = [
    ["comp_sentinel","Sentinel","Robotic · floating","A floating robot buddy that fights with its own weapon and can carry utility mods like <b>Vacuum</b>. The easiest companion to get early — many new players start with one."],
    ["comp_kubrow","Kubrow","Beast · canine","A bred dog companion that charges into melee. Tanky and loyal, but it needs <b>DNA Stabilizers</b> over time or its health decays."],
    ["comp_kavat","Kavat","Beast · feline","An agile cat companion that buffs you and the squad. The famous <b>Smeeta</b> boosts resource and rare-item drops, making it a farm favourite."],
    ["comp_moa","MOA","Robotic · bipedal","A modular robot built from parts in Fortuna. Swap its head, core and weapon to change how it fights — from crowd control to raw damage."],
    ["comp_hound","Hound","Robotic · canine","A robot dog assembled from parts taken from enemy Hounds. Its special modules bring crowd control and debuffs to the fight."],
    ["comp_helminth","Helminth Charger","Infested · beast","A Kubrow twisted by the Helminth virus — an aggressive Infested bruiser for players who want a melee-focused pet."]
  ];
  tb.innerHTML = data.map(([k,n,t,d])=>`
    <tr>
      <td><img class="comp-thumb" src="${img(k)}" alt="${n} companion" loading="lazy" /></td>
      <td><b>${n}</b></td>
      <td><span class="comp-type">${t}</span></td>
      <td>${d}</td>
    </tr>`).join("");
})();

/* ---------------- scroll reveal (progressive enhancement) ---------------- */
(function scrollReveal(){
  const roots = document.querySelectorAll(".section");
  if (!roots.length) return;
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)){
    roots.forEach(s=>s.classList.add("reveal","in"));
    return;
  }
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{
      if (en.isIntersecting){ en.target.classList.add("in"); io.unobserve(en.target); }
    });
  }, { rootMargin:"0px 0px -8% 0px", threshold:0.04 });
  roots.forEach(s=>{ s.classList.add("reveal"); io.observe(s); });
})();
