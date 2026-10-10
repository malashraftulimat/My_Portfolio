/* Fill missing dictionary entries using the single-translate endpoint. */
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const ROOT = path.resolve(__dirname, "..");
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36";
const sleep = ms => new Promise(r => setTimeout(r, ms));

function isNoise(t){
  if (/^(\)|;)/.test(t)) return true;
  if (/\.(join|map|filter|forEach|split|replace|push|includes)\(/.test(t)) return true;
  if (/=>|\bcls\b|\br\.\w|\bconst\b|\bfunction\b|\breturn\b|prefers-reduced-motion|\bvar\(|\.style\b|\.classList\b/.test(t)) return true;
  if (/\bpx\b|#[0-9a-f]{6}\b/i.test(t)) return true;
  if (/^[+]\s/.test(t) && !/\s[a-z]{3,}/i.test(t)) return true;
  if (/^\(?\s*[a-z-]+\s*:\s*[a-z-]+\s*\)?$/i.test(t)) return true;
  if (t.split(" ").length === 1 && /[(){}]/.test(t)) return true;
  return false;
}
function curl(url){ return execFileSync("curl", ["-s", "-m", "45", "-A", UA, url], { maxBuffer: 20*1024*1024 }).toString(); }

function single(text, tl){
  const url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=" + tl + "&dt=t&q=" + encodeURIComponent(text);
  try{
    const txt = curl(url);
    if (txt.trim().startsWith("<")) return null;
    const j = JSON.parse(txt);
    if (!Array.isArray(j) || !Array.isArray(j[0])) return null;
    return j[0].map(seg => seg[0]).join("").trim();
  } catch(e){ return null; }
}

(async () => {
  let all = JSON.parse(fs.readFileSync(path.join(__dirname, "i18n_src.json"), "utf8")).filter(s => !isNoise(s));
  global.window = {};
  require(path.join(ROOT, "i18n.js"));
  const I = window.I18N;
  I.tr = I.tr || {};
  I.ko = I.ko || {};
  let filled = 0;
  for (const tl of ["ja", "ar", "tr", "ko"]){
    for (const src of all){
      if (I[tl][src]) continue;
      const tr = single(src, tl);
      if (tr && tr !== src){ I[tl][src] = tr; filled++; }
      await sleep(160);
    }
    console.log(tl, "now", Object.keys(I[tl]).length, "entries");
  }
  fs.writeFileSync(path.join(ROOT, "i18n.js"), "/* Auto-generated translation dictionary (en -> ja/ar/tr/ko). Do not edit by hand. */\nwindow.I18N = " + JSON.stringify(I) + ";\n");
  console.log("filled", filled, "->", (fs.statSync(path.join(ROOT, "i18n.js")).size/1024).toFixed(0) + "KB");
})();
