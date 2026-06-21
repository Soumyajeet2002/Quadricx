// Loader
window.addEventListener("load", () => {
    const loader = document.getElementById("loader");

    setTimeout(() => {
        loader.classList.add("hide");

        // Start all other scripts only after loader finishes
        initApp();

    }, 3500);
});
function initApp() {

    // THEME TOGGLE
    const themeToggle = document.querySelector(".theme-toggle");

    if (themeToggle) {
        const savedTheme = localStorage.getItem("theme") || "light";

        document.documentElement.setAttribute(
            "data-theme",
            savedTheme
        );

        themeToggle.addEventListener("click", () => {
            const currentTheme =
                document.documentElement.getAttribute("data-theme");

            const newTheme =
                currentTheme === "dark"
                    ? "light"
                    : "dark";

            document.documentElement.setAttribute(
                "data-theme",
                newTheme
            );

            localStorage.setItem(
                "theme",
                newTheme
            );
        });
    }

    // HAMBURGER MOBILE VIEW
    const hamburger = document.querySelector(".hamburger");
    const mobileMenu = document.querySelector(".mobile-menu");
    const mobileLinks = document.querySelectorAll(".mobile-menu a");

    if (hamburger && mobileMenu) {
        const body = document.body;

        function toggleMenu() {
            hamburger.classList.toggle("active");
            mobileMenu.classList.toggle("active");
            body.classList.toggle("no-scroll");
        }

        hamburger.addEventListener("click", toggleMenu);

        mobileLinks.forEach(link => {
            link.addEventListener("click", () => {
                hamburger.classList.remove("active");
                mobileMenu.classList.remove("active");
                body.classList.remove("no-scroll");
            });
        });

        document.addEventListener("click", (e) => {
            const isClickInside =
                hamburger.contains(e.target) ||
                mobileMenu.contains(e.target);

            if (!isClickInside && mobileMenu.classList.contains("active")) {
                hamburger.classList.remove("active");
                mobileMenu.classList.remove("active");
                body.classList.remove("no-scroll");
            }
        });
    }

    // Back To Top
    const backToTopBtn = document.getElementById("backToTop");

    if (backToTopBtn) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 500) {
                backToTopBtn.classList.add("show");
            } else {
                backToTopBtn.classList.remove("show");
            }
        });

        backToTopBtn.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    // GSAP
// GSAP ANIMATIONS
if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {

    gsap.registerPlugin(ScrollTrigger);

    /* =========================
       HERO LOAD ANIMATION
    ========================= */

    const heroTL = gsap.timeline();

    heroTL
        .from(".hero-badge", {
            y: 30,
            opacity: 0,
            duration: 0.6
        })
        .from(".hero-title", {
            y: 50,
            opacity: 0,
            duration: 0.8
        }, "-=0.3")
        .from(".hero-description", {
            y: 30,
            opacity: 0,
            duration: 0.6
        }, "-=0.4")
        .from(".dashboard-window", {
            scale: 0.9,
            opacity: 0,
            duration: 0.7
        }, "-=0.5")
        .from(".floating-card", {
            scale: 0.8,
            opacity: 0,
            stagger: 0.2,
            duration: 0.8
        }, "-=0.6");

    /* =========================
       HERO PARALLAX
    ========================= */

    gsap.to(".hero-left", {
        y: 100,
        ease: "none",
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: true
        }
    });

    gsap.to(".hero-right", {
        y: -80,
        ease: "none",
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: true
        }
    });

    /* =========================
       FLOATING CARDS
    ========================= */

    gsap.to(".code-card", {
        y: -20,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });

    gsap.to(".growth-card", {
        y: 25,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });

    gsap.to(".design-card", {
        y: -15,
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });
    } 
}

async function loadSiteData() {

    try {

        const response =
            await fetch("./json/data/site.json");

        const data =
            await response.json();

        renderTechStack(data);
        renderServices(data);

    } catch (error) {

        console.error(
            "Failed to load site.json",
            error
        );

    }

}

loadSiteData();

function renderTechStack(data) {

    const title =
        document.getElementById("techTitle");

    const track =
        document.getElementById("techTrack");

    if (!title || !track) return;

    title.textContent =
        data.techStack.title;

    let markup = "";

    data.techStack.items.forEach(item => {

        markup += `
            <span>
                <i class="${item.icon}"></i>
                ${item.name}
            </span>
        `;

    });

    // Duplicate for infinite marquee

    track.innerHTML = markup + markup;
}

function renderServices(data) {

    const { services } = data;

    const tag =
        document.getElementById("servicesTag");

    const title =
        document.getElementById("servicesTitle");

    const description =
        document.getElementById("servicesDescription");

    const grid =
        document.getElementById("servicesGrid");

    if (!grid) return;

    tag.textContent = services.tag;

    title.innerHTML = `
        ${services.title}
        <span>${services.highlight}</span>
    `;

    description.textContent =
        services.description;

    grid.innerHTML = services.items.map(service => `

        <article class="service-card">

            <div class="card-glow"></div>
            <div class="shine"></div>

            <div class="service-top">

                <span class="service-badge">
                    ${service.badge || "Service"}
                </span>

                <span class="service-number">
                    ${service.number}
                </span>

            </div>

            <div class="service-icon">
                <i class="${service.icon}"></i>
            </div>

            <h3 class="service-title">
                ${service.title}
            </h3>

            <p class="service-description">
                ${service.description}
            </p>

            <div class="service-footer">

                <span class="service-cta">
                    ${service.cta || "Learn More"}
                </span>

                <span class="service-arrow">
                    ↗
                </span>

            </div>

        </article>

    `).join("");

    /* =========================
       CURSOR SPOTLIGHT
    ========================= */

    document.querySelectorAll(".service-card")
        .forEach(card => {

            card.addEventListener(
                "mousemove",
                e => {

                    const rect =
                        card.getBoundingClientRect();

                    card.style.setProperty(
                        "--x",
                        `${e.clientX - rect.left}px`
                    );

                    card.style.setProperty(
                        "--y",
                        `${e.clientY - rect.top}px`
                    );

                }
            );

        });

    /* =========================
       GSAP ANIMATION
    ========================= */

    if (
        typeof gsap !== "undefined" &&
        typeof ScrollTrigger !== "undefined"
    ) {

        gsap.registerPlugin(
            ScrollTrigger
        );

        // Clear old triggers
        ScrollTrigger.getAll()
            .forEach(trigger => trigger.kill());

        gsap.from(
            ".service-card",
            {
                y: 100,

                opacity: 0,

                scale: 0.95,

                duration: 1.2,

                stagger: 0.15,

                ease: "power4.out",

                scrollTrigger: {

                    trigger: ".services-grid",

                    start: "top 80%",

                    toggleActions:
                        "play none none none",

                    once: true
                }
            }
        );

    }

}

