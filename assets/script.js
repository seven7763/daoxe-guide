/* DaoXE guide — tiny progressive enhancement. Site works fully without JS. */
(function () {
  "use strict";
  var d = document;

  /* ---- theme toggle (persisted) ---- */
  try {
    var saved = localStorage.getItem("daoxe-theme");
    if (saved) d.documentElement.setAttribute("data-theme", saved);
  } catch (e) {}

  function bindTheme() {
    var btn = d.querySelector("[data-theme-toggle]");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var root = d.documentElement;
      var cur = root.getAttribute("data-theme");
      if (!cur) {
        cur = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      }
      var next = cur === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("daoxe-theme", next); } catch (e) {}
    });
  }

  /* ---- mobile nav ---- */
  function bindNav() {
    var btn = d.querySelector("[data-nav-toggle]");
    var links = d.getElementById("nav-links");
    if (!btn || !links) return;
    btn.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.addEventListener("click", function (e) {
      if (e.target.closest("a")) { links.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); }
    });
  }

  /* ---- language menu: close on outside click (details fallback works w/o JS) ---- */
  function bindLang() {
    var menu = d.querySelector("details.lang-menu");
    if (!menu) return;
    d.addEventListener("click", function (e) {
      if (menu.open && !menu.contains(e.target)) menu.open = false;
    });
  }

  /* ---- copy buttons on code blocks ---- */
  function bindCopy() {
    d.querySelectorAll(".code .copy").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var pre = btn.parentElement.querySelector("pre");
        if (!pre) return;
        var text = pre.innerText;
        var done = function () {
          var label = btn.getAttribute("data-copied") || "Copied";
          var old = btn.textContent;
          btn.textContent = label;
          setTimeout(function () { btn.textContent = old; }, 1400);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done, function () {});
        } else {
          var ta = d.createElement("textarea");
          ta.value = text; d.body.appendChild(ta); ta.select();
          try { d.execCommand("copy"); done(); } catch (e) {}
          d.body.removeChild(ta);
        }
      });
    });
  }

  /* ---- TOC scroll-spy ---- */
  function bindToc() {
    var toc = d.querySelector(".toc");
    if (!toc || !("IntersectionObserver" in window)) return;
    var links = {};
    toc.querySelectorAll("a[href^='#']").forEach(function (a) {
      links[a.getAttribute("href").slice(1)] = a;
    });
    var heads = Object.keys(links).map(function (id) { return d.getElementById(id); }).filter(Boolean);
    if (!heads.length) return;
    var current = null;
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          if (current) current.classList.remove("active");
          current = links[en.target.id];
          if (current) current.classList.add("active");
        }
      });
    }, { rootMargin: "-72px 0px -70% 0px", threshold: 0 });
    heads.forEach(function (h) { obs.observe(h); });
  }

  function init() { bindTheme(); bindNav(); bindLang(); bindCopy(); bindToc(); }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", init);
  else init();
})();
