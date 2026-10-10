/* Runtime language switcher: translates the live DOM from the offline dictionary.
   English is the source language; original text is cached so switching back is lossless. */
(function(){
  "use strict";
  var SUPPORTED = { en: "EN", ja: "\u65e5\u672c\u8a9e", ar: "\u0627\u0644\u0639\u0631\u0628\u064a\u0629", tr: "T\u00fcrk\u00e7e", ko: "\ud55c\uad6d\uc5b4" };
  var TITLES = {
    en: "Warframe: The Ultimate Beginner's Guide",
    ja: "\u30a6\u30a9\u30fc\u30d5\u30ec\u30fc\u30e0\u306f\u521d\u3081\u3066\u3067\u3059\u304b\uff1f\u307e\u305a\u306f\u3053\u3053\u304b\u3089\u3002",
    ar: "\u0627\u0644\u062f\u0644\u064a\u0644 \u0627\u0644\u0634\u0627\u0645\u0644 \u0644\u0644\u0645\u0628\u062a\u062f\u0626\u064a\u0646 \u0641\u064a \u0648\u0648\u0631\u0641\u0631\u064a\u0645",
    tr: "Warframe: Nihai Ba\u015flang\u0131\u00e7 Rehberi",
    ko: "Warframe: \ucd5c\uace0\uc758 \ucd08\ubcf4\uc790 \uac00\uc774\ub4dc"
  };
  var RTL = { ar: true };
  var ATTRS = ["placeholder", "alt", "title", "aria-label"];
  var originals = new WeakMap();
  var observer = null;
  var lang = "en";
  try {
    var qp = new URLSearchParams(location.search).get("lang");
    var parentLang = null;
    try {
      if (window.parent && window.parent !== window && window.parent.document)
        parentLang = window.parent.document.documentElement.getAttribute("lang");
    } catch (e2){}
    lang = qp || parentLang || window.__forceLang || localStorage.getItem("wf101-lang") || "en";
  } catch (e){
    lang = window.__forceLang || "en";
  }
  if (!SUPPORTED[lang]) lang = "en";

  function dict(){ return (window.I18N && window.I18N[lang]) || {}; }

  function skipped(node){
    var el = node.nodeType === 1 ? node : node.parentElement;
    while (el){
      if (el.dataset && el.dataset.i18nSkip !== undefined) return true;
      var tag = el.tagName;
      if (tag === "SCRIPT" || tag === "STYLE" || tag === "NOSCRIPT" || tag === "CANVAS" || tag === "svg" || tag === "SVG") return true;
      el = el.parentElement;
    }
    return false;
  }

  function doText(node){
    var raw = node.nodeValue;
    if (raw == null || !/\S/.test(raw)) return;
    if (!originals.has(node)) originals.set(node, raw);
    var orig = originals.get(node);
    if (lang === "en"){ if (node.nodeValue !== orig) node.nodeValue = orig; return; }
    var key = orig.replace(/\s+/g, " ").trim();
    var tr = dict()[key];
    if (tr){
      var lead = orig.match(/^\s*/)[0], trail = orig.match(/\s*$/)[0];
      var next = lead + tr + trail;
      if (node.nodeValue !== next) node.nodeValue = next;
    } else if (node.nodeValue !== orig){
      node.nodeValue = orig;
    }
  }

  function doAttrs(el){
    if (!el.getAttribute) return;
    if (!el.__i18nAttrs){
      var store = {};
      ATTRS.forEach(function(a){ if (el.hasAttribute(a)) store[a] = el.getAttribute(a); });
      el.__i18nAttrs = store;
    }
    var saved = el.__i18nAttrs;
    ATTRS.forEach(function(a){
      var orig = saved[a];
      if (orig == null) return;
      if (lang === "en"){ if (el.getAttribute(a) !== orig) el.setAttribute(a, orig); return; }
      var key = orig.replace(/\s+/g, " ").trim();
      var tr = dict()[key];
      if (tr) el.setAttribute(a, tr);
      else if (el.getAttribute(a) !== orig) el.setAttribute(a, orig);
    });
  }

  function walk(root){
    if (root.nodeType === 3){ if (!skipped(root)) doText(root); return; }
    if (root.nodeType !== 1) return;
    if (skipped(root)) return;
    doAttrs(root);
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    var n;
    while ((n = walker.nextNode())) if (!skipped(n)) doText(n);
  }

  function paintButtons(){
    var btns = document.querySelectorAll(".lang-btn");
    for (var i = 0; i < btns.length; i++) btns[i].classList.toggle("active", btns[i].dataset.lang === lang);
    var cur = document.getElementById("langCurrent");
    if (cur) cur.textContent = SUPPORTED[lang] || lang;
  }

  function setOpen(sw, open){
    if (!sw) return;
    sw.classList.toggle("open", open);
    var t = document.getElementById("langToggle");
    if (t) t.setAttribute("aria-expanded", open ? "true" : "false");
  }

  function apply(l){
    lang = SUPPORTED[l] ? l : "en";
    try { localStorage.setItem("wf101-lang", lang); } catch (e){}
    document.documentElement.lang = lang;
    document.title = TITLES[lang] || document.title;
    document.documentElement.setAttribute("dir", RTL[lang] ? "rtl" : "ltr");
    if (observer) observer.disconnect();
    if (document.body) walk(document.body);
    if (observer && document.body) observer.observe(document.body, { childList: true, subtree: true });
    paintButtons();
  }

  // Public API: the portfolio shell (same origin) and other callers can drive
  // the guide language directly, e.g. window.updateWarframeGuideLanguage('ja').
  window.updateWarframeGuideLanguage = apply;
  window.changeLanguage = apply;

  // When embedded in the portfolio, follow its master language controller:
  // the shell posts { type:'wf101-lang', lang } whenever the header switcher changes.
  window.addEventListener("message", function(e){
    var d = e.data;
    if (d == null) return;
    if (typeof d === "string"){ if (SUPPORTED[d]) apply(d); return; }
    if (!d || (d.type !== "wf101-lang" && d.type !== "setLang")) return;
    if (SUPPORTED[d.lang]) apply(d.lang);
  });
  // Fallback: the shared localStorage key (storage events fire across documents).
  window.addEventListener("storage", function(e){
    if (e.key === "wf101-lang" && SUPPORTED[e.newValue]) apply(e.newValue);
  });

  function boot(){
    observer = new MutationObserver(function(muts){
      observer.disconnect();
      muts.forEach(function(m){
        for (var i = 0; i < m.addedNodes.length; i++) walk(m.addedNodes[i]);
      });
      observer.observe(document.body, { childList: true, subtree: true });
    });
    var sw = document.getElementById("langSwitch");
    if (sw) sw.addEventListener("click", function(e){
      if (e.target.closest(".lang-toggle")){ setOpen(sw, !sw.classList.contains("open")); return; }
      var b = e.target.closest(".lang-btn"); if (!b) return;
      apply(b.dataset.lang);
      setOpen(sw, false);
    });
    document.addEventListener("click", function(e){ if (sw && !sw.contains(e.target)) setOpen(sw, false); });
    document.addEventListener("keydown", function(e){ if (e.key === "Escape") setOpen(sw, false); });
    apply(lang);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
