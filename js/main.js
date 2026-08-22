(function () {
  const typographyLink = document.createElement("link");
  typographyLink.rel = "stylesheet";
  typographyLink.href = "css/typography-preview.css";
  document.head.appendChild(typographyLink);

  const legacyFontLink = document.querySelector(
    'link[href*="fonts.googleapis.com"]'
  );
  if (legacyFontLink) legacyFontLink.remove();

  const yearEl = document.querySelector("[data-year]");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav-links");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  function initCarousel(root) {
    const slidesWrap = root.querySelector("[data-slides]");
    const slides = Array.from(root.querySelectorAll("[data-slide]"));
    const dotsWrap = root.querySelector("[data-dots]");
    const prevBtn = root.querySelector("[data-prev]");
    const nextBtn = root.querySelector("[data-next]");
    if (!slidesWrap || slides.length === 0) return;

    let index = 0;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    slides.forEach(function (_, i) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "carousel-dot";
      dot.setAttribute("aria-label", "Go to slide " + (i + 1));
      if (i === 0) dot.setAttribute("aria-current", "true");
      dot.addEventListener("click", function () {
        goTo(i);
      });
      dotsWrap.appendChild(dot);
    });

    const dots = Array.from(dotsWrap.querySelectorAll(".carousel-dot"));

    function goTo(next) {
      index = (next + slides.length) % slides.length;
      slidesWrap.style.transform = "translateX(-" + index * 100 + "%)";
      dots.forEach(function (dot, i) {
        if (i === index) dot.setAttribute("aria-current", "true");
        else dot.removeAttribute("aria-current");
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        goTo(index - 1);
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        goTo(index + 1);
      });
    }

    let startX = null;
    slidesWrap.addEventListener(
      "touchstart",
      function (e) {
        startX = e.changedTouches[0].screenX;
      },
      { passive: true }
    );
    slidesWrap.addEventListener(
      "touchend",
      function (e) {
        if (startX === null) return;
        const dx = e.changedTouches[0].screenX - startX;
        startX = null;
        if (Math.abs(dx) < 40) return;
        if (dx < 0) goTo(index + 1);
        else goTo(index - 1);
      },
      { passive: true }
    );

    if (!reduceMotion) {
      let timer = setInterval(function () {
        goTo(index + 1);
      }, 7000);

      root.addEventListener("mouseenter", function () {
        clearInterval(timer);
      });
      root.addEventListener("mouseleave", function () {
        timer = setInterval(function () {
          goTo(index + 1);
        }, 7000);
      });
    }
  }

  document.querySelectorAll("[data-carousel]").forEach(initCarousel);
})();
