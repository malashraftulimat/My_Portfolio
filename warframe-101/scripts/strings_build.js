/* Dump the on-site translation strings into one merged, aligned TSV:
     strings.tsv   columns:  en <tab> ja <tab> ar
   Run from the project root:  node scripts/strings_build.js                    */
const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "..");
global.window = {};
require(path.join(ROOT, "i18n.js"));
const I = window.I18N;

function isHuman(t){
  if (!t || t.length < 2) return false;
  if (!/[A-Za-z]{2}/.test(t)) return false;
  if (/[_\/\\]/.test(t)) return false;
  if (/[{}<>#$]/.test(t)) return false;
  if (/\b\w+\.(webp|png|jpg|js|css|html)\b/i.test(t)) return false;
  if (/(https?:|www\.|@)/.test(t)) return false;
  if (!/\s/.test(t) && /^[a-z0-9+\-.:]+$/.test(t)) return false;
  if (/^(true|false|null|undefined|function|return|const|let|var)$/i.test(t)) return false;
  return true;
}

// reject code identifiers, CSS values, DOM ids/classes, JS API names
function looksLikeCode(t){
  if (/[%{}<>#$;=()\[\]]/.test(t)) return true;                 // css/js punctuation
  if (/\b\d+(px|rem|em|vh|vw|s|ms|deg)\b/.test(t)) return true; // css units
  if (/\bpx\b/.test(t)) return true;
  if (/(Observer|querySelector|addEventListener|classList|dataset|prefers-reduced-motion)/.test(t)) return true;
  if (!/\s/.test(t) && /^[a-z][A-Za-z0-9]*$/.test(t)) return true;            // camelCase single token
  if (!/\s/.test(t) && /^[a-z0-9]+([-_.][a-z0-9]+)+$/.test(t)) return true;   // kebab/dot single token
  // every whitespace token is a kebab-case id  (e.g. "aff-seg aff-frame")
  if (/^[a-z0-9-]+(\s+[a-z0-9-]+)+$/.test(t) && t.includes("-")) return true;
  return false;
}

const keys = [...new Set([...Object.keys(I.ja), ...Object.keys(I.ar), ...Object.keys(I.tr || {}), ...Object.keys(I.ko || {})])]
  .filter(isHuman)
  .filter(t => !looksLikeCode(t))
  .sort((a, b) => a.localeCompare(b, "en"));

const cell = s => String(s == null ? "" : s).replace(/\t/g, " ").replace(/\r?\n/g, " ");
const tr = I.tr || {}, ko = I.ko || {};
const rows = keys.map(k => [k, I.ja[k], I.ar[k], tr[k], ko[k]].map(cell).join("\t"));
fs.writeFileSync(path.join(ROOT, "strings.tsv"), "# en\tja\tar\ttr\tko\n" + rows.join("\n") + "\n");

console.log("lines:", keys.length);
console.log("missing ja:", keys.filter(k => !I.ja[k]).length);
console.log("missing ar:", keys.filter(k => !I.ar[k]).length);
console.log("missing tr:", keys.filter(k => !tr[k]).length);
console.log("missing ko:", keys.filter(k => !ko[k]).length);
console.log("--- remaining single-token entries (eyeball for code) ---");
console.log(keys.filter(k => !/\s/.test(k)).join(" | "));
