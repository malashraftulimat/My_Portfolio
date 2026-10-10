/* Import the merged translation file back into i18n.js.
   strings.tsv columns:  en <tab> ja <tab> ar <tab> tr <tab> ko   (the en column is the key)
   Usage: node scripts/strings_import.js [path-to-strings.tsv]              */
const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "..");

const inFile = process.argv[2] || path.join(ROOT, "strings.tsv");
const lines = fs.readFileSync(inFile, "utf8").replace(/\r/g, "").split("\n");

global.window = {};
require(path.join(ROOT, "i18n.js"));
const I = window.I18N;
I.tr = I.tr || {};
I.ko = I.ko || {};

const ch = { ja:0, ar:0, tr:0, ko:0 };
let missing = 0, rows = 0;
for (const line of lines){
  if (!line || line.charAt(0) === "#") continue;
  const cols = line.split("\t");
  const k = cols[0];
  if (!k) continue;
  rows++;
  const vals = { ja: cols[1] || "", ar: cols[2] || "", tr: cols[3] || "", ko: cols[4] || "" };
  for (const lang of ["ja", "ar", "tr", "ko"]){
    const v = vals[lang];
    if (!(k in I[lang]) && v) missing++;
    if (v && I[lang][k] !== v) { I[lang][k] = v; ch[lang]++; }
  }
}

if (missing) console.warn("WARN: " + missing + " non-empty values had no dictionary key");

const header = "/* Auto-generated translation dictionary (en -> ja/ar/tr/ko). Arabic game name normalised to \u0648\u0648\u0631\u0641\u0631\u064a\u0645. */\n";
fs.writeFileSync(path.join(ROOT, "i18n.js"), header + "window.I18N = " + JSON.stringify(I) + ";\n");

console.log("rows:", rows, " ja:", ch.ja, " ar:", ch.ar, " tr:", ch.tr, " ko:", ch.ko);
console.log("entries: ja", Object.keys(I.ja).length, "ar", Object.keys(I.ar).length, "tr", Object.keys(I.tr).length, "ko", Object.keys(I.ko).length);
console.log("i18n.js size:", (fs.statSync(path.join(ROOT, "i18n.js")).size / 1024).toFixed(0) + "KB");
