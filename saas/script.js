document.addEventListener("DOMContentLoaded", () => {
  /* =========================
     Header Scroll Effect
  ========================= */

  const header = document.querySelector(".site-header");

  function handleHeaderScroll() {
    if (!header) return;

    if (window.scrollY > 20) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }

  handleHeaderScroll();

  window.addEventListener("scroll", handleHeaderScroll, {
    passive: true,
  });


  /* =========================
     Mobile Menu
  ========================= */

  const menuToggle = document.querySelector(".menu-toggle");
  const mainNav = document.querySelector(".main-nav");

  function closeMenu() {
    if (!mainNav || !menuToggle) return;

    mainNav.classList.remove("mobile-active");
    menuToggle.setAttribute("aria-expanded", "false");
  }

  if (menuToggle && mainNav) {
    menuToggle.setAttribute("aria-expanded", "false");

    menuToggle.addEventListener("click", (event) => {
      event.stopPropagation();

      const isOpen = mainNav.classList.toggle("mobile-active");

      menuToggle.setAttribute(
        "aria-expanded",
        String(isOpen)
      );
    });

    // Close menu after clicking a navigation link
    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        closeMenu();
      });
    });

    // Close menu when clicking outside
    document.addEventListener("click", (event) => {
      if (
        !mainNav.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        closeMenu();
      }
    });

    // Close menu with Escape key
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });
  }


  /* =========================
     Scroll Reveal Animation
  ========================= */

  const revealElements = document.querySelectorAll(
    [
      ".section-header",
      ".feature-card",
      ".showcase-content",
      ".showcase-visual",
      ".process-step",
      ".stats-grid-large > div",
      ".pricing-card",
      ".testimonial-card",
      ".faq-list details",
      ".cta-inner",
    ].join(", ")
  );

  revealElements.forEach((element, index) => {
    element.classList.add("reveal");

    // Small staggered animation
    const delay = (index % 5) * 80;
    element.style.transitionDelay = `${delay}ms`;
  });

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("revealed");

        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });


  /* =========================
     Prevent Placeholder Links
  ========================= */

  document.querySelectorAll('a[href="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
    });
  });


  /* =========================
     Smooth Anchor Navigation
  ========================= */

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  });
});