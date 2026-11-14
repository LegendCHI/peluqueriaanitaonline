/* =========================
   MENÚ MÓVIL
========================= */

const menuButton = document.getElementById("menuButton");
const navLinks = document.getElementById("navLinks");

menuButton.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", open ? "true" : "false");
});

navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
    });
});


/* =========================
   AÑO DEL FOOTER
========================= */

document.getElementById("year").textContent = new Date().getFullYear();


/* =========================
   ABIERTO / CERRADO (hora de Chile)
   Horario: Lun-Vie 10-20, Sáb 10-17, Dom cerrado
========================= */

const HOURS = {
    0: null,
    1: [10, 20],
    2: [10, 20],
    3: [10, 20],
    4: [10, 20],
    5: [10, 20],
    6: [10, 17]
};

const DAY_NAMES = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

function chileNow() {
    try {
        const parts = new Intl.DateTimeFormat("en-US", {
            timeZone: "America/Santiago",
            weekday: "short",
            hour: "numeric",
            minute: "numeric",
            hour12: false
        }).formatToParts(new Date());

        const get = type => parts.find(p => p.type === type).value;
        const days = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

        return {
            day: days[get("weekday")],
            hour: (parseInt(get("hour"), 10) % 24) + parseInt(get("minute"), 10) / 60
        };
    } catch (e) {
        const d = new Date();
        return { day: d.getDay(), hour: d.getHours() + d.getMinutes() / 60 };
    }
}

function nextOpening(day) {
    for (let i = 1; i <= 7; i++) {
        const d = (day + i) % 7;
        if (HOURS[d]) {
            const when = i === 1 ? "mañana" : `el ${DAY_NAMES[d]}`;
            return `Abre ${when} a las ${HOURS[d][0]}:00`;
        }
    }
    return "";
}

function updateOpenStatus() {
    const { day, hour } = chileNow();
    const today = HOURS[day];

    let isOpen = false;
    let detail = "";

    if (today && hour >= today[0] && hour < today[1]) {
        isOpen = true;
        detail = `Cierra a las ${today[1]}:00`;
    } else if (today && hour < today[0]) {
        detail = `Abre hoy a las ${today[0]}:00`;
    } else {
        detail = nextOpening(day);
    }

    document.querySelectorAll("[data-open-status]").forEach(el => {
        el.textContent = isOpen ? "Abierto ahora" : "Cerrado ahora";
        el.classList.toggle("is-open", isOpen);
        el.classList.toggle("is-closed", !isOpen);
    });

    document.querySelectorAll("[data-open-detail]").forEach(el => {
        el.textContent = detail;
    });

    document.querySelector(".hours-status")?.classList.toggle("is-open", isOpen);

    document.querySelectorAll(".hours-row").forEach(row => {
        const days = row.dataset.days.split(",").map(Number);
        row.classList.toggle("today", days.includes(day));
    });
}

updateOpenStatus();
setInterval(updateOpenStatus, 60 * 1000);


/* =========================
   VISOR DE FOTOS
========================= */

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxCaption = document.getElementById("lightboxCaption");

function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = "";
}

document.querySelectorAll(".gallery-item").forEach(item => {
    item.addEventListener("click", () => {
        const img = item.querySelector("img");
        const caption = item.querySelector("figcaption");
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxCaption.textContent = caption ? caption.textContent : "";
        lightbox.hidden = false;
        document.body.style.overflow = "hidden";
    });
});

document.getElementById("lightboxClose").addEventListener("click", closeLightbox);

lightbox.addEventListener("click", e => {
    if (e.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", e => {
    if (e.key === "Escape" && !lightbox.hidden) closeLightbox();
});


/* =========================
   MOTION GRAPHICS
========================= */

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;


/* ---- Barra de progreso ---- */

const progressBar = document.getElementById("scrollProgress");

function updateProgress() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? window.scrollY / max : 0;
    progressBar.style.transform = `scaleX(${p})`;
}

window.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();


/* ---- Aparecer al hacer scroll (con escalonado) ---- */

const revealGroups = [
    { selector: ".section-header > *, .reviews-header > *", type: "" , stagger: .12 },
    { selector: ".service", type: "", stagger: .08 },
    { selector: ".gallery-item", type: "reveal-zoom", stagger: .09 },
    { selector: ".about-card", type: "reveal-left", stagger: 0 },
    { selector: ".about-text", type: "reveal-right", stagger: 0 },
    { selector: ".review-card", type: "", stagger: .08 },
    { selector: ".location-text > *", type: "reveal-left", stagger: .08 },
    { selector: ".map", type: "reveal-right", stagger: 0 },
    { selector: ".faq-list details", type: "", stagger: .07 },
    { selector: ".contact-container > div:first-child, .contact-info > *", type: "", stagger: .1 },
    { selector: ".reviews-buttons", type: "", stagger: 0 }
];

const revealEls = [];

revealGroups.forEach(group => {
    const els = document.querySelectorAll(group.selector);

    // El escalonado se reinicia por cada contenedor padre
    const counters = new Map();

    els.forEach(el => {
        const parent = el.parentElement;
        const i = counters.get(parent) || 0;
        counters.set(parent, i + 1);

        el.classList.add("reveal");
        if (group.type) el.classList.add(group.type);
        el.style.setProperty("--d", `${Math.min(i * group.stagger, .6)}s`);
        revealEls.push(el);
    });
});

if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(el => el.classList.add("in"));
} else {
    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                el.classList.add("in");
                revealObserver.unobserve(el);
                // Al terminar, se quita la clase para que los hover respondan al instante
                setTimeout(() => {
                    el.classList.remove("reveal", "reveal-left", "reveal-right", "reveal-zoom");
                    el.style.removeProperty("--d");
                }, 1600);
            }
        });
    }, { threshold: .15, rootMargin: "0px 0px -40px 0px" });

    revealEls.forEach(el => revealObserver.observe(el));
}


/* ---- Contadores (4,7 y 34) ---- */

function animateNumber(el, to, decimals, suffix = "") {
    if (reduceMotion) return;

    const duration = 1600;
    const start = performance.now();
    const original = el.textContent;

    function frame(now) {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        const value = (to * eased).toFixed(decimals).replace(".", ",");
        el.textContent = value + suffix;

        if (t < 1) requestAnimationFrame(frame);
        else el.textContent = original;
    }

    requestAnimationFrame(frame);
}

const countTargets = [
    ...document.querySelectorAll(".rating-number, .about-stat strong")
];

/* Estrellas que se rellenan hasta 4,7 / 5 = 94% */
document.querySelectorAll(".rating-box .stars, .about-stat span").forEach(el => {
    if (el.matches(".about-stat span")) {
        el.innerHTML = el.innerHTML.replace("★★★★★", '<span class="stars-anim">★★★★★</span>');
    } else {
        el.classList.add("stars-anim");
    }
});

const starEls = [...document.querySelectorAll(".stars-anim")];

if ("IntersectionObserver" in window) {
    const countObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const el = entry.target;

            if (el.classList.contains("stars-anim")) {
                el.style.setProperty("--fill", "94%");
            } else {
                animateNumber(el, 4.7, 1);
            }

            countObserver.unobserve(el);
        });
    }, { threshold: .6 });

    [...countTargets, ...starEls].forEach(el => countObserver.observe(el));
} else {
    starEls.forEach(el => el.style.setProperty("--fill", "94%"));
}


/* ---- Parallax suave en la foto del hero ---- */

const heroImage = document.querySelector(".hero-image");
const floatingCard = document.querySelector(".floating-card");

if (!reduceMotion && heroImage && window.matchMedia("(hover: hover)").matches) {
    document.querySelector(".hero").addEventListener("mousemove", e => {
        const x = (e.clientX / window.innerWidth - .5);
        const y = (e.clientY / window.innerHeight - .5);
        heroImage.style.translate = `${x * -14}px ${y * -14}px`;
        floatingCard.style.translate = `${x * 22}px ${y * 22}px`;
    });

    window.addEventListener("scroll", () => {
        if (window.scrollY < window.innerHeight) {
            document.querySelectorAll(".hero-blob").forEach((b, i) => {
                b.style.translate = `0 ${window.scrollY * (i ? .25 : .4)}px`;
            });
        }
    }, { passive: true });
}


/* ---- Tarjetas que se inclinan siguiendo el mouse ---- */

if (!reduceMotion && window.matchMedia("(hover: hover)").matches) {
    document.querySelectorAll(".service, .review-card").forEach(card => {
        card.addEventListener("mousemove", e => {
            const r = card.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width - .5;
            const y = (e.clientY - r.top) / r.height - .5;
            card.style.transform = `perspective(700px) rotateX(${y * -6}deg) rotateY(${x * 6}deg) translateY(-6px)`;
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "";
        });
    });
}
