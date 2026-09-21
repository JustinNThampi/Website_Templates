/* =========================================================
   MONO — MODERN PERSONAL PORTFOLIO
   ========================================================= */


/* =========================================================
   01. MOBILE NAVIGATION
   ========================================================= */

const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");

if (menuToggle && mainNav) {

    menuToggle.addEventListener("click", () => {

        mainNav.classList.toggle("mobile-active");
        menuToggle.classList.toggle("active");

    });

}


/* =========================================================
   02. CLOSE MOBILE MENU AFTER CLICKING A LINK
   ========================================================= */

const navLinks = document.querySelectorAll(".main-nav a");

navLinks.forEach(link => {

    link.addEventListener("click", () => {

        if (mainNav) {
            mainNav.classList.remove("mobile-active");
        }

        if (menuToggle) {
            menuToggle.classList.remove("active");
        }

    });

});


/* =========================================================
   03. HEADER SCROLL EFFECT
   ========================================================= */

const header = document.querySelector(".site-header");

window.addEventListener("scroll", () => {

    if (!header) return;

    if (window.scrollY > 40) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }

});


/* =========================================================
   04. REVEAL ELEMENTS ON SCROLL
   ========================================================= */

const revealElements = document.querySelectorAll(
    ".section-heading, " +
    ".about-grid, " +
    ".project-card, " +
    ".skill-group, " +
    ".timeline-item, " +
    ".service-item, " +
    ".testimonial, " +
    ".contact-inner"
);

const revealObserver = new IntersectionObserver(
    (entries, observer) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("revealed");

                observer.unobserve(entry.target);

            }

        });

    },
    {
        threshold: 0.12
    }
);

revealElements.forEach(element => {

    element.classList.add("reveal");

    revealObserver.observe(element);

});


/* =========================================================
   05. PROJECT CARD HOVER
   ========================================================= */

const projectCards = document.querySelectorAll(".project-card");

projectCards.forEach(card => {

    card.addEventListener("mouseenter", () => {
        card.classList.add("project-hover");
    });

    card.addEventListener("mouseleave", () => {
        card.classList.remove("project-hover");
    });

});


/* =========================================================
   06. CURRENT YEAR
   ========================================================= */

const footerYear = document.querySelector(
    ".site-footer .footer-inner > span"
);

if (footerYear) {

    footerYear.textContent =
        `© ${new Date().getFullYear()} Your Name`;

}


/* =========================================================
   07. SMOOTH INTERNAL LINKS
   ========================================================= */

document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", event => {

        const targetId = link.getAttribute("href");

        if (!targetId || targetId === "#") {
            return;
        }

        const target = document.querySelector(targetId);

        if (!target) {
            return;
        }

        event.preventDefault();

        target.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    });

});


/* =========================================================
   08. CURSOR POSITION EFFECT
   ========================================================= */

document.addEventListener("mousemove", event => {

    document.documentElement.style.setProperty(
        "--mouse-x",
        `${event.clientX}px`
    );

    document.documentElement.style.setProperty(
        "--mouse-y",
        `${event.clientY}px`
    );

});


/* =========================================================
   09. PAGE LOADED
   ========================================================= */

document.body.classList.add("js-loaded");