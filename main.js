/* ═══════════════════════════════════════════════════════
   QUANTUM SECURE FRAMEWORK — Main JavaScript
   ═══════════════════════════════════════════════════════ */

(function () {
  "use strict";

  /* ── Mobile Menu ──────────────────────────────────── */
  const mobileBtn = document.getElementById("mobile-menu-btn");
  const mobileDrawer = document.getElementById("mobile-drawer");
  const menuIconPath = document.getElementById("menu-icon-path");
  let menuOpen = false;

  function toggleMenu() {
    menuOpen = !menuOpen;
    mobileDrawer.classList.toggle("open", menuOpen);
    mobileBtn.setAttribute("aria-expanded", menuOpen);
    mobileBtn.setAttribute("aria-label", menuOpen ? "Close menu" : "Open menu");
    if (menuOpen) {
      menuIconPath.setAttribute("d", "M6 6l12 12M18 6L6 18");
    } else {
      menuIconPath.setAttribute("d", "M4 7h16M4 12h16M4 17h16");
    }
  }

  if (mobileBtn) {
    mobileBtn.addEventListener("click", toggleMenu);
  }

  window.closeMobileMenu = function () {
    if (menuOpen) toggleMenu();
  };

  /* ── Header Scroll Effect ─────────────────────────── */
  const header = document.getElementById("site-header");
  function onScroll() {
    if (window.scrollY > 24) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ── Smooth Scroll for Anchor Links ────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var target = document.querySelector(a.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  /* ── Scroll Reveal (Intersection Observer) ─────────── */
  var revealEls = document.querySelectorAll(".fade-in-up, .fade-in, .fade-in-scale, .stagger-container");
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var delay = parseFloat(entry.target.getAttribute("data-delay")) || 0;
          setTimeout(function () {
            entry.target.classList.add("visible");
          }, delay * 1000);
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "50px 0px", threshold: 0 }
  );
  revealEls.forEach(function (el) {
    observer.observe(el);
  });

  /* ── Timeline Line Animation ───────────────────────── */
  var timelineLine = document.querySelector(".timeline-line");
  if (timelineLine) {
    var tlObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setTimeout(function () {
              timelineLine.classList.add("animated");
            }, 400);
            tlObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    tlObserver.observe(timelineLine);
  }

  /* ── Contact Form ──────────────────────────────────── */
  var form = document.getElementById("lead-form");
  var formCard = document.getElementById("form-card");
  var formSuccess = document.getElementById("form-success");
  var submitBtn = document.getElementById("submit-btn");
  var submitText = document.getElementById("submit-text");
  var submitSpinner = document.getElementById("submit-spinner");
  var formErrorBanner = document.getElementById("form-error-banner");

  var INITIAL_FORM = {
    fullName: "",
    corporateEmail: "",
    corporateDomain: "",
    architecturePriorities: "",
    website: ""
  };

  function clearErrors() {
    ["fullName", "corporateEmail", "corporateDomain", "architecturePriorities"].forEach(function (f) {
      var errEl = document.getElementById("error-" + f);
      if (errEl) errEl.textContent = "";
      var fieldEl = document.getElementById(f);
      if (fieldEl) fieldEl.classList.remove("field-error");
    });
    if (formErrorBanner) formErrorBanner.style.display = "none";
  }

  function setFieldError(field, message) {
    var errEl = document.getElementById("error-" + field);
    if (errEl) errEl.textContent = message;
    var fieldEl = document.getElementById(field);
    if (fieldEl) fieldEl.classList.add("field-error");
  }

  function getFormData() {
    return {
      fullName: (document.getElementById("fullName").value || "").trim(),
      corporateEmail: (document.getElementById("corporateEmail").value || "").trim(),
      corporateDomain: (document.getElementById("corporateDomain").value || "").trim(),
      architecturePriorities: (document.getElementById("architecturePriorities").value || "").trim(),
      website: (document.getElementById("website").value || "").trim()
    };
  }

  function resetFormFields() {
    document.getElementById("fullName").value = "";
    document.getElementById("corporateEmail").value = "";
    document.getElementById("corporateDomain").value = "";
    document.getElementById("architecturePriorities").value = "";
    document.getElementById("website").value = "";
  }

  window.resetForm = function () {
    formSuccess.style.display = "none";
    form.style.display = "";
    clearErrors();
    resetFormFields();
  };

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      clearErrors();

      var data = getFormData();
      var errors = {};

      if (data.fullName.length < 2) {
        errors.fullName = "Please provide your full name.";
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.corporateEmail)) {
        errors.corporateEmail = "Please provide a valid company email address.";
      }

      var domain = data.corporateDomain
        .toLowerCase()
        .replace(/^https?:\/\//, "")
        .replace(/^www\./, "")
        .split(/[/?#]/)[0]
        .split(":")[0];
      if (!/^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/.test(domain)) {
        errors.corporateDomain = "Please provide a valid corporate domain (e.g. quadrafort.com).";
      }

      if (data.architecturePriorities.length < 2) {
        errors.architecturePriorities = "Please describe your current architecture priorities.";
      }

      if (Object.keys(errors).length > 0) {
        Object.keys(errors).forEach(function (f) {
          setFieldError(f, errors[f]);
        });
        return;
      }

      // Show loading state
      submitText.textContent = "Transmitting securely…";
      submitSpinner.style.display = "inline-block";
      submitBtn.disabled = true;

      fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
        .then(function (res) {
          return res.json().then(function (body) {
            return { ok: res.ok, status: res.status, body: body };
          });
        })
        .then(function (result) {
          submitText.textContent = "Request a Quantum Readiness Assessment →";
          submitSpinner.style.display = "none";
          submitBtn.disabled = false;

          if (!result.ok || !result.body.ok) {
            formErrorBanner.textContent = result.body.message || "Something went wrong. Please try again.";
            formErrorBanner.style.display = "block";
            if (result.body.errors) {
              Object.keys(result.body.errors).forEach(function (f) {
                if (result.body.errors[f] && result.body.errors[f][0]) {
                  setFieldError(f, result.body.errors[f][0]);
                }
              });
            }
            return;
          }

          // Success
          form.style.display = "none";
          formSuccess.style.display = "";
          resetFormFields();
        })
        .catch(function () {
          submitText.textContent = "Request a Quantum Readiness Assessment →";
          submitSpinner.style.display = "none";
          submitBtn.disabled = false;
          formErrorBanner.textContent = "Network error — please check your connection and try again.";
          formErrorBanner.style.display = "block";
        });
    });
  }

  /* ── Live field error clearing ─────────────────────── */
  ["fullName", "corporateEmail", "corporateDomain", "architecturePriorities"].forEach(function (f) {
    var el = document.getElementById(f);
    if (el) {
      el.addEventListener("input", function () {
        var errEl = document.getElementById("error-" + f);
        if (errEl) errEl.textContent = "";
        el.classList.remove("field-error");
      });
    }
  });

  /* ── Why Quadrafort — Staggered Card Reveal ──────── */
  (function initWhyCards() {
    var whyCards = document.querySelectorAll(".why-card--reveal");
    if (!whyCards.length) return;

    var STAGGER_DELAY_MS = 140; // ms between each card

    // Progressive enhancement: add animate-entrance class after a short delay
    // so cards are visible even if JS fails, then animate them in on scroll
    setTimeout(function () {
      whyCards.forEach(function (card) {
        card.classList.add("animate-entrance");
      });

      var cardObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              var card = entry.target;
              var stagger = parseInt(card.getAttribute("data-stagger")) || 0;
              setTimeout(function () {
                card.classList.add("revealed");
              }, stagger * STAGGER_DELAY_MS);
              cardObserver.unobserve(card);
            }
          });
        },
        { rootMargin: "0px 0px -60px 0px", threshold: 0.15 }
      );

      whyCards.forEach(function (card) {
        cardObserver.observe(card);
      });
    }, 100); // 100ms delay ensures DOM is painted before hiding
  })();

  /* ── Why Quadrafort — Scroll-Driven Card Scaling ── */
  (function initWhyCardScale() {
    var whySection = document.getElementById("why");
    var cards = document.querySelectorAll(".why-card");
    if (!whySection || cards.length < 2) return;

    var TOTAL = cards.length;
    var scaleTargets = [];

    // Compute the target scale for each card (progressively smaller)
    cards.forEach(function (card, i) {
      var targetScale = 1 - (TOTAL - 1 - i) * 0.03;
      card.classList.add("scale-target");
      scaleTargets.push(targetScale);
    });

    var raf = 0;
    function update() {
      var rect = whySection.getBoundingClientRect();
      var vh = window.innerHeight;
      var total = rect.height + vh;
      var progress = Math.min(1, Math.max(0, (vh - rect.top) / total));

      cards.forEach(function (card, i) {
        var start = i * (1 / TOTAL);
        var localProgress = Math.min(1, Math.max(0, (progress - start) / (1 - start)));
        var targetScale = scaleTargets[i];
        var scale = 1 - (1 - targetScale) * localProgress;

        // Only apply scale when card is revealed
        if (card.classList.contains("revealed")) {
          if (scale >= 0.9999) {
            card.style.transform = "";
          } else {
            card.style.transform = "scale(" + scale.toFixed(4) + ")";
          }
        }
      });
    }

    function onScroll() {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
  })();

  /* ── Hero Canvas Scroll Progress ───────────────────── */
  // Exposed for canvas-animations.js
  window._heroProgress = 0;
  window._heroScrollProgress = { get: function () { return window._heroProgress; } };

  function updateHeroProgress() {
    var hero = document.getElementById("hero");
    if (!hero) return;
    var rect = hero.getBoundingClientRect();
    var vh = window.innerHeight;
    var total = rect.height + vh;
    window._heroProgress = Math.min(1, Math.max(0, (vh - rect.top) / total));
  }
  window.addEventListener("scroll", updateHeroProgress, { passive: true });
  updateHeroProgress();

  /* ── Film restart on hover ─────────────────────────── */
  var filmFrame = document.getElementById("film-frame");
  var filmRestartKey = 0;
  if (filmFrame) {
    filmFrame.addEventListener("mouseenter", function () {
      filmRestartKey++;
      window._filmRestartKey = filmRestartKey;
    });
  }
  window._filmRestartKey = 0;

})();
