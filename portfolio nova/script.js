/* =========================================
   NOVA — Portfolio Template
   script.js
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* ================================
       Mobile Navigation
    ================================= */

    const menuToggle = document.querySelector(".menu-toggle");
    const navMenu = document.querySelector(".nav-menu");
    const navLinks = document.querySelectorAll(".nav-menu a");

    if (menuToggle && navMenu) {

        menuToggle.addEventListener("click", () => {
            navMenu.classList.toggle("active");
            menuToggle.classList.toggle("active");
        });

        // Close menu after clicking a navigation link
        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                navMenu.classList.remove("active");
                menuToggle.classList.remove("active");
            });
        });
    }


    /* ================================
       Navbar Scroll Effect
    ================================= */

    const navbar = document.querySelector(".navbar");

    const handleNavbarScroll = () => {
        if (!navbar) return;

        if (window.scrollY > 40) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    };

    window.addEventListener("scroll", handleNavbarScroll);

    handleNavbarScroll();


    /* ================================
       Smooth Anchor Scrolling
    ================================= */

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {

        anchor.addEventListener("click", function (event) {

            const targetId = this.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const target = document.querySelector(targetId);

            if (!target) return;

            event.preventDefault();

            const navbarHeight = navbar
                ? navbar.offsetHeight
                : 0;

            const targetPosition =
                target.getBoundingClientRect().top +
                window.pageYOffset -
                navbarHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: "smooth"
            });
        });

    });


    /* ================================
       Reveal Animations
    ================================= */

    const revealElements = document.querySelectorAll(
        ".section, .skill-card, .project-card, .experience-item, .stat"
    );

    revealElements.forEach(element => {
        element.classList.add("reveal");
    });

    const revealObserver = new IntersectionObserver(
        (entries, observer) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("visible");

                    observer.unobserve(entry.target);
                }

            });

        },
        {
            threshold: 0.12
        }
    );

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });


    /* ================================
       Project Hover Interaction
    ================================= */

    const projectCards = document.querySelectorAll(".project-card");

    projectCards.forEach(card => {

        card.addEventListener("mouseenter", () => {
            card.classList.add("hovered");
        });

        card.addEventListener("mouseleave", () => {
            card.classList.remove("hovered");
        });

    });


    /* ================================
       Dynamic Footer Year
    ================================= */

    const footerYear = document.querySelector(".footer-bottom span");

    if (footerYear) {
        const currentYear = new Date().getFullYear();

        footerYear.textContent =
            `© ${currentYear} NOVA. All rights reserved.`;
    }


    /* ================================
       Prevent Empty Project Links
    ================================= */

    document.querySelectorAll('.project-link[href="#"]').forEach(link => {

        link.addEventListener("click", event => {
            event.preventDefault();
        });

    });

});