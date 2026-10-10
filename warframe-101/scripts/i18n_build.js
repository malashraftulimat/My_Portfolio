/* Builds i18n.js: extracts human strings from index.html + app.js and translates them (ja, ar). */
const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "..");

const SEP = "\u0000";

function decodeEntities(s){
  return s
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&apos;/g, "'")
    .replace(/&mdash;/g, "\u2014").replace(/&ndash;/g, "\u2013").replace(/&nbsp;/g, " ")
    .replace(/&hellip;/g, "\u2026").replace(/&rarr;/g, "\u2192").replace(/&larr;/g, "\u2190")
    .replace(/&times;/g, "\u00d7").replace(/&middot;/g, "\u00b7")
    .replace(/&#x([0-9a-f]+);/gi, (m, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (m, d) => String.fromCodePoint(+d));
}
function fragments(raw){
  const cleaned = raw
    .replace(/\$\{[^}]*\}/g, SEP)
    .replace(/<[^>]*>/g, SEP);
  return cleaned.split(SEP).map(s => decodeEntities(s).replace(/\s+/g, " ").trim());
}
function isHuman(t){
  if (!t || t.length < 2) return false;
  if (!/[A-Za-z]{2}/.test(t)) return false;
  if (/[_\/\\]/.test(t)) return false;
  if (/[{}<>#$]/.test(t)) return false;
  if (/\b\w+\.(webp|png|jpg|js|css|html)\b/i.test(t)) return false;
  if (/(https?:|www\.|@)/.test(t)) return false;
  if (!/\s/.test(t) && /^[a-z0-9+\-.:]+$/.test(t)) return false; // single code-ish token
  if (/^(true|false|null|undefined|function|return|const|let|var)$/i.test(t)) return false;
  return true;
}

const strings = new Set();
const add = s => { if (isHuman(s)) strings.add(s.replace(/\s+/g, " ").trim()); };

// ---- index.html: text nodes + a few attributes ----
{
  let h = fs.readFileSync(path.join(ROOT, "index.html"), "utf8")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ");
  const attrRe = /\b(placeholder|alt|title|aria-label|value)="([^"]*)"/gi;
  let m;
  while ((m = attrRe.exec(h))) add(m[2].replace(/\s+/g, " ").trim());
  const textOnly = h.replace(/<[^>]*>/g, SEP);
  textOnly.split(SEP).forEach(s => add(decodeEntities(s).replace(/\s+/g, " ").trim()));
}

// ---- app.js: quoted + template literals ----
{
  const js = fs.readFileSync(path.join(ROOT, "app.js"), "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, " ")   // block comments
    .replace(/\/\/[^\n]*/g, " ");        // line comments
  let m;
  const dq = /"([^"\\]*(?:\\.[^"\\]*)*)"/g;
  while ((m = dq.exec(js))) fragments(m[1]).forEach(add);
  const sq = /'([^'\\]*(?:\\.[^'\\]*)*)'/g;
  while ((m = sq.exec(js))) fragments(m[1]).forEach(add);
  const bt = /`([^`\\]*(?:\\.[^`\\]*)*)`/g;
  while ((m = bt.exec(js))) fragments(m[1]).forEach(add);
}

const list = [...strings].sort();
console.log("Extracted", list.length, "unique strings");
fs.writeFileSync(path.join(__dirname, "i18n_src.json"), JSON.stringify(list, null, 1));
