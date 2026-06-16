/* Unique Auto Vision — minimal vanilla replacements for the original
 * GoHighLevel/Nuxt runtime. Covers the only three behaviours the static
 * pages need: scroll-reveal animations, the mobile nav drawer, and the FAQ
 * accordion. Everything else is plain HTML/CSS. No dependencies. */
(function () {
  "use strict";

  /* Scroll-reveal — elements ship as style="opacity:0" with
   * data-animation-class="animate__animated animate__<effect>".
   * The Animate.css keyframes already live in entry.css; we just add the
   * classes (and clear the inline opacity) once the element scrolls in. */
  function initReveal() {
    var els = [].slice.call(document.querySelectorAll("[data-animation-class]"))
      .filter(function (el) { return (el.getAttribute("data-animation-class") || "").trim(); });
    if (!els.length) return;

    function reveal(el) {
      var cls = (el.getAttribute("data-animation-class") || "").trim();
      el.style.opacity = "";
      if (cls) el.className += " " + cls;
    }
    if (!("IntersectionObserver" in window)) { els.forEach(reveal); return; }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { reveal(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    els.forEach(function (el) { io.observe(el); });
  }

  /* Mobile nav drawer — the popup ships empty; the original cloned the menu
   * into it and tagged it with the hashed nav class (which the CSS targets). */
  function initMobileMenu() {
    var popup = document.getElementById("nav-menu-popup");
    var trigger = document.querySelector(".nav-menu-mobile .menu-icon");
    if (!popup || !trigger) return;

    var navMenu = document.querySelector(".c-nav-menu");
    if (navMenu) {
      var hash = [].slice.call(navMenu.classList).filter(function (c) {
        return /^nav-menu-[\w-]+$/.test(c);
      })[0];
      if (hash) popup.classList.add(hash);
    }
    var source = document.querySelector(".nav-menu-wrapper ul.nav-menu");
    var target = popup.querySelector("ul.nav-menu");
    if (source && target && !target.children.length) target.innerHTML = source.innerHTML;

    function open() {
      popup.classList.remove("hide"); popup.classList.add("is-open");
      document.body.style.overflow = "hidden";
    }
    function close() {
      popup.classList.add("hide"); popup.classList.remove("is-open");
      popup.style.display = ""; document.body.style.overflow = "";
    }
    trigger.addEventListener("click", open);
    trigger.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
    });
    var x = popup.querySelector(".close-menu");
    if (x) x.addEventListener("click", close);
    popup.addEventListener("click", function (e) { if (e.target.closest("a")) close(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
  }

  /* FAQ accordion — panels ship as height:0;padding:0;opacity:0 and the
   * heading toggles an .active class (CSS handles the icon + colours). */
  function initFaq() {
    [].slice.call(document.querySelectorAll(".hl-faq-child-heading")).forEach(function (head) {
      head.addEventListener("click", function () {
        var child = head.closest(".hl-faq-child, .faq-separated-child");
        if (!child) return;
        var panel = child.querySelector(".hl-faq-child-panel");
        var open = !head.classList.contains("active");
        head.classList.toggle("active", open);
        child.classList.toggle("active", open);
        if (!panel) return;
        panel.style.height = open ? panel.scrollHeight + "px" : "0";
        panel.style.padding = open ? "15px" : "0";
        panel.style.opacity = open ? "1" : "0";
      });
    });
  }

  /* Reviews widget auto-height — the LeadConnector reviews iframe can't size
   * itself, so it posts its content height via postMessage and the parent
   * resizes it. Replaces the original apisystem.tech/js/reviews_widget.js. */
  function initReviewsAutoHeight() {
    window.addEventListener("message", function (e) {
      if (!Array.isArray(e.data)) return;
      var name = e.data[0], data = e.data[1];
      if (name !== "lc.setHeight" || !data || data.id !== "lc_reviews_widget") return;
      var frames = document.querySelectorAll(".lc_reviews_widget, #msgsndr_reviews, #highlevel_reviews");
      Array.prototype.forEach.call(frames, function (f) {
        try { if (e.source === f.contentWindow) f.height = data.height; } catch (_) {}
      });
    }, false);
  }

  function init() { initReveal(); initMobileMenu(); initFaq(); initReviewsAutoHeight(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
