/* ===========================================
   VOIDKAGE Premium Website Script
=========================================== */

// ================= LOADER =================

window.addEventListener("load", () => {
    const loader = document.getElementById("loader");

    setTimeout(() => {
        loader.style.opacity = "0";
        loader.style.visibility = "hidden";
    }, 1500);
});

// ================= SCROLL PROGRESS =================

const progressBar = document.getElementById("progress-bar");

window.addEventListener("scroll", () => {

    const scrollTop = document.documentElement.scrollTop;

    const scrollHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

    const progress = (scrollTop / scrollHeight) * 100;

    progressBar.style.width = progress + "%";
});

// ================= BACK TO TOP =================

const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {

    if (window.scrollY > 500) {

        backToTop.style.display = "block";

    } else {

        backToTop.style.display = "none";

    }

});

backToTop.addEventListener("click", () => {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

});

// ================= ACTIVE NAVIGATION =================

const sections = document.querySelectorAll("section");

const navLinks = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {

    let current = "";

    sections.forEach(section => {

        const sectionTop = section.offsetTop - 120;

        if (window.scrollY >= sectionTop) {

            current = section.getAttribute("id");

        }

    });

    navLinks.forEach(link => {

        link.classList.remove("active");

        if (link.getAttribute("href") === "#" + current) {

            link.classList.add("active");

        }

    });

});

// ================= SCROLL REVEAL =================

const revealSections = document.querySelectorAll("section");

const revealObserver = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.classList.add("show");

        }

    });

}, {

    threshold: 0.2

});

revealSections.forEach(section => {

    revealObserver.observe(section);

});

// ================= COUNTER ANIMATION =================

const counters = document.querySelectorAll(".counter");

const speed = 80;

const counterObserver = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if (!entry.isIntersecting) return;

        const counter = entry.target;

        const target = +counter.dataset.target;

        let count = 0;

        const update = () => {

            const increment = Math.ceil(target / speed);

            count += increment;

            if (count < target) {

                counter.innerText = count;

                requestAnimationFrame(update);

            } else {

                counter.innerText = target + "+";

            }

        };

        update();

        counterObserver.unobserve(counter);

    });

});

counters.forEach(counter => {

    counterObserver.observe(counter);

});

// ================= MOBILE MENU =================

const menuBtn = document.querySelector(".menu-btn");

const navMenu = document.querySelector(".nav-links");

menuBtn.addEventListener("click", () => {

    navMenu.classList.toggle("show-menu");

});

// Close menu when clicking a link

document.querySelectorAll(".nav-links a").forEach(link => {

    link.addEventListener("click", () => {

        navMenu.classList.remove("show-menu");

    });

});

// ================= PORTFOLIO FILTER =================

const filterButtons = document.querySelectorAll(".portfolio-filter button");

const portfolioCards = document.querySelectorAll(".portfolio-card");

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn => btn.classList.remove("active"));

        button.classList.add("active");

        const filter = button.textContent.trim().toLowerCase();

        portfolioCards.forEach(card => {

            const category = card.dataset.category;

            if (filter === "all" || category === filter) {

                card.style.display = "block";

            } else {

                card.style.display = "none";

            }

        });

    });

});

// ================= HERO IMAGE FLOAT =================

const heroImage = document.querySelector(".hero-image img");

if (heroImage) {

    window.addEventListener("mousemove", (e) => {

        const x = (window.innerWidth / 2 - e.pageX) / 40;

        const y = (window.innerHeight / 2 - e.pageY) / 40;

        heroImage.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;

    });

}

// ================= BUTTON RIPPLE =================

document.querySelectorAll(".btn").forEach(button => {

    button.addEventListener("click", function (e) {

        const circle = document.createElement("span");

        const diameter = Math.max(this.clientWidth, this.clientHeight);

        circle.style.width = circle.style.height = diameter + "px";

        circle.style.left = e.offsetX - diameter / 2 + "px";

        circle.style.top = e.offsetY - diameter / 2 + "px";

        circle.classList.add("ripple");

        const ripple = this.querySelector(".ripple");

        if (ripple) {

            ripple.remove();

        }

        this.appendChild(circle);

    });

});

console.log("🔥 VOIDKAGE Premium Website Loaded Successfully");
