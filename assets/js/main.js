(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Mobile nav toggle ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var mobileNav = document.getElementById("mobile-nav");
  if (toggle && mobileNav) {
    toggle.addEventListener("click", function () {
      var open = mobileNav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobileNav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Header elevation on scroll ---------- */
  var header = document.querySelector(".site-header");

  /* ---------- Sticky "Request a Quote" + back-to-top ---------- */
  var cta = document.getElementById("htt-sticky-cta");
  var toTop = document.getElementById("htt-back-to-top");
  // .includes rather than a strict prefix match so this still works when
  // the site is served from a subpath (e.g. a GitHub Pages preview at
  // /repo-name/contact/) and not just at the domain root.
  var onContact = window.location.pathname.includes("/contact");
  if (cta && onContact) cta.style.display = "none";

  function onScroll() {
    var y = window.scrollY;
    if (header) header.classList.toggle("is-scrolled", y > 8);

    if (cta && !onContact) {
      var nearBottom = window.innerHeight + y > document.body.offsetHeight - 480;
      cta.classList.toggle("visible", y > 400 && !nearBottom);
    }
    if (toTop) toTop.classList.toggle("visible", y > 700);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("htt-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Scroll-reveal (progressive enhancement only) ----------
     Elements are fully visible by default (see styles.css). Only when we
     know we can animate them do we opt them into the hidden-then-reveal
     treatment, by adding "reveal-init" ourselves right before observing.
     If anything below throws, or IntersectionObserver isn't supported, or
     the user prefers reduced motion, we simply never add that class and
     the content just sits there normally — no broken/blank sections. */
  if (!reduceMotion && "IntersectionObserver" in window) {
    var revealEls = document.querySelectorAll("[data-reveal]");
    if (revealEls.length) {
      // Stagger siblings inside a [data-reveal-group] via a CSS custom property
      document.querySelectorAll("[data-reveal-group]").forEach(function (group) {
        var i = 0;
        group.querySelectorAll("[data-reveal]").forEach(function (el) {
          el.style.setProperty("--reveal-i", i++);
        });
      });

      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
      );
      revealEls.forEach(function (el) {
        el.classList.add("reveal-init"); // opt in, then observe
        io.observe(el);
      });
    }
  }

  /* ---------- Contact form: progressive-enhancement AJAX submit ---------- */
  var form = document.querySelector('form[name="quote-request"]');
  if (form) {
    var statusEl = document.createElement("div");
    statusEl.className = "form-status";
    statusEl.setAttribute("role", "status");
    statusEl.setAttribute("aria-live", "polite");
    form.insertAdjacentElement("afterend", statusEl);

    var submitBtn = form.querySelector('button[type="submit"]');
    var submitLabel = submitBtn ? submitBtn.textContent : "";

    function encode(data) {
      return Object.keys(data)
        .map(function (k) { return encodeURIComponent(k) + "=" + encodeURIComponent(data[k]); })
        .join("&");
    }

    function showStatus(kind, iconId, message) {
      statusEl.className = "form-status is-visible " + kind;
      statusEl.innerHTML =
        '<svg class="icon" aria-hidden="true"><use href="#' + iconId + '"/></svg><span>' + message + "</span>";
      statusEl.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "nearest" });
    }

    form.addEventListener("submit", function (e) {
      // Skip AJAX entirely if the browser can't do fetch/FormData — the
      // native form POST (data-netlify) still works as a full-page fallback.
      if (!window.fetch || !window.FormData) return;

      e.preventDefault();
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "Sending..."; }

      var data = Object.fromEntries(new FormData(form));
      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode(data),
      })
        .then(function (res) {
          if (!res.ok) throw new Error("Network response was not ok");
          form.reset();
          showStatus(
            "success",
            "icon-shield-check",
            "Thanks — we've received your request and will be in touch shortly."
          );
        })
        .catch(function () {
          showStatus(
            "error",
            "icon-alert",
            "Something went wrong sending that. Please try again, or email us directly."
          );
        })
        .finally(function () {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = submitLabel; }
        });
    });
  }
})();
