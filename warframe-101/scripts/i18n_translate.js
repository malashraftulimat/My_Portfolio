/* Reads __i18n_src.json, filters noise, translates to ja+ar via curl, writes i18n.js */
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const ROOT = path.resolve(__dirname, "..");

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36";
const sleep = ms => new Promise(r => setTimeout(r, ms));

function isNoise(t){
  if (/^(\)|,|;|:)/.test(t)) return true;
  if (/\.(join|map|filter|forEach|split|replace|push|includes)\(/.test(t)) return true;
  if (/=>|\bcls\b|\br\.\w|\bconst\b|\bfunction\b|\breturn\b|prefers-reduced-motion|\bvar\(|\.style\b|\.classList\b/.test(t)) return true;
  if (/\bpx\b|#[0-9a-f]{6}\b/i.test(t)) return true;
  if (/^[+]\s/.test(t) && !/\s[a-z]{3,}/i.test(t)) return true;
  if (/^\(?\s*[a-z-]+\s*:\s*[a-z-]+\s*\)?$/i.test(t)) return true;
  if (t.split(" ").length === 1 && /[(){}]/.test(t)) return true;
  return false;
}

function curl(url){
  return execFileSync("curl", ["-s", "-m", "45", "-A", UA, url], { maxBuffer: 20 * 1024 * 1024 }).toString();
}

async function translateBatch(texts, tl){
  const url = "https://translate.googleapis.com/translate_a/t?client=gtx&sl=en&tl=" + tl + "&" +
    texts.map(q => "q=" + encodeURIComponent(q)).join("&");
  for (let attempt = 0; attempt < 5; attempt++){
    try{
      const txt = curl(url);
      if (txt.trim().startsWith("<")) throw new Error("blocked");
      const j = JSON.parse(txt);
      const arr = Array.isArray(j) ? j : [j];
      const res = arr.map(x => Array.isArray(x) ? x.join(" ") : String(x));
      if (res.length !== texts.length) throw new Error("length mismatch " + res.length);
      return res;
    } catch (e){
      await sleep(1200 * (attempt + 1));
    }
  }
  return texts.map(() => null);
}

(async () => {
  let all = JSON.parse(fs.readFileSync(path.join(__dirname, "i18n_src.json"), "utf8"));
  all = all.filter(s => !isNoise(s));
  console.log("Translating", all.length, "strings...");
  const out = { ja: {}, ar: {} };
  const size = 20;
  for (const tl of ["ja", "ar"]){
    let ok = 0;
    for (let i = 0; i < all.length; i += size){
      const batch = all.slice(i, i + size);
      const res = await translateBatch(batch, tl);
      batch.forEach((src, k) => {
        const tr = res[k];
        if (tr && tr.trim() && tr.trim() !== src.trim()){ out[tl][src] = tr.trim(); ok++; }
      });
      await sleep(280);
    }
    console.log(`  ${tl} done: ${ok}/${all.length}`);
  }
  const header = "/* Auto-generated translation dictionary (en -> ja/ar). Do not edit by hand. */\n";
  fs.writeFileSync(path.join(ROOT, "i18n.js"), header + "window.I18N = " + JSON.stringify(out) + ";\n");
  console.log("Wrote i18n.js", (fs.statSync(path.join(ROOT, "i18n.js")).size / 1024).toFixed(0) + "KB");
})();
