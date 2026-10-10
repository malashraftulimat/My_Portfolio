const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "..");
let h = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
h = h.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ");
function decodeEntities(s){
  return s.replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&mdash;/g,"\u2014").replace(/&ndash;/g,"\u2013").replace(/&nbsp;/g," ").replace(/&hellip;/g,"\u2026").replace(/&rarr;/g,"\u2192").replace(/&larr;/g,"\u2190").replace(/&times;/g,"\u00d7").replace(/&middot;/g,"\u00b7").replace(/&#x([0-9a-f]+);/gi,(m,h)=>String.fromCodePoint(parseInt(h,16))).replace(/&#(\d+);/g,(m,d)=>String.fromCodePoint(+d));
}
const set = new Set();
const add = s => {
  s = decodeEntities(s).replace(/\s+/g, " ").trim();
  if (s && /[A-Za-z]{2}/.test(s) && s.indexOf("/") === -1 && s.indexOf("\\") === -1) set.add(s);
};
const attrRe = /\b(placeholder|alt|title|aria-label|value)="([^"]*)"/gi;
let m;
while ((m = attrRe.exec(h))) add(m[2]);
h.replace(/<[^>]*>/g, "\u0000").split("\u0000").forEach(s => add(s));
const list = [...set].sort();
fs.writeFileSync(path.join(__dirname, "idx_keys.json"), JSON.stringify(list, null, 0));
console.log("keys", list.length);
