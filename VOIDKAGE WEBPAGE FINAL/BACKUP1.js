// VOIDKAGE V3 — interaction layer

// VOIDKAGE — cinematic transition layer
(() => {
  const transition = document.querySelector(".page-transition");
  const progress = document.querySelector(".scroll-progress i");
  const navLinks = document.querySelectorAll('a[href^="#"]');

  // Initial reveal
  requestAnimationFrame(() => {
    setTimeout(() => document.body.classList.add("page-ready"), 80);
  });

  // Scroll progress
  const updateScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    const value = max > 0 ? scrollY / max : 0;
    if (progress) progress.style.transform = `scaleX(${value})`;
  };
  addEventListener("scroll", updateScroll, {passive:true});
  updateScroll();

  // Section reveals
  const revealItems = document.querySelectorAll(".reveal-section, .reveal-stagger");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealItems.forEach(el => observer.observe(el));
  } else {
    revealItems.forEach(el => el.classList.add("is-visible"));
  }

  // Cinematic internal navigation
  navLinks.forEach(link => {
    link.addEventListener("click", e => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;
      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      document.body.classList.add("is-transitioning");

      setTimeout(() => {
        target.scrollIntoView({behavior:"smooth", block:"start"});
        setTimeout(() => document.body.classList.remove("is-transitioning"), 420);
      }, 180);
    });
  });

  // Magnetic-ish hover for interactive links/buttons.
  if (matchMedia("(pointer:fine)").matches) {
    document.querySelectorAll(".menu, .menu-close, .hero-bottom a, .coming a, .links a").forEach(el => {
      el.addEventListener("pointermove", e => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.08;
        const y = (e.clientY - r.top - r.height / 2) * 0.08;
        el.style.setProperty("--mx", `${x}px`);
        el.style.setProperty("--my", `${y}px`);
      });
      el.addEventListener("pointerleave", () => {
        el.style.setProperty("--mx", "0px");
        el.style.setProperty("--my", "0px");
      });
    });
  }
})();


// Cursor
const dot = document.querySelector(".cursor-dot");
const ring = document.querySelector(".cursor-ring");
if (window.matchMedia("(pointer:fine)").matches) {
  window.addEventListener("mousemove", e => {
    dot.style.left = e.clientX + "px";
    dot.style.top = e.clientY + "px";
    ring.animate(
      { left: e.clientX + "px", top: e.clientY + "px" },
      { duration: 180, fill: "forwards" }
    );
  });
}

// Cursor hover states
document.querySelectorAll("a, button, .work-card, .tilt-card, .cube").forEach(el => {
  el.addEventListener("mouseenter", () => document.body.classList.add("cursor-active"));
  el.addEventListener("mouseleave", () => document.body.classList.remove("cursor-active"));
});

// Menu
const menu = document.querySelector(".menu");
const panel = document.querySelector(".menu-panel");
const close = document.querySelector(".menu-close");
if (menu && panel && close) {
  menu.addEventListener("click", () => panel.classList.add("open"));
  close.addEventListener("click", () => panel.classList.remove("open"));
  panel.querySelectorAll("a").forEach(a => a.addEventListener("click", () => panel.classList.remove("open")));
}

// Poster 3D tilt (only present on the Archive page)
const tilt = document.querySelector("[data-tilt]");
if (tilt) {
  const tiltImg = tilt.querySelector("img");
  tilt.addEventListener("pointermove", e => {
    const r = tilt.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5;
    const y = (e.clientY - r.top) / r.height - .5;
    tilt.style.transform = `rotateX(${y * -10}deg) rotateY(${x * 12}deg)`;
    if (tiltImg) tiltImg.style.transform = `scale(1.035) translate(${x * 5}px, ${y * 5}px)`;
  });
  tilt.addEventListener("pointerleave", () => {
    tilt.style.transform = "";
    if (tiltImg) tiltImg.style.transform = "";
  });
}

// Draggable CSS cube (only present on the Archive page)
const cube = document.getElementById("cube");
if (cube) {
  let dragging = false, lastX = 0, lastY = 0, rotX = -18, rotY = 28;
  cube.addEventListener("pointerdown", e => {
    dragging = true; lastX = e.clientX; lastY = e.clientY; cube.setPointerCapture(e.pointerId);
  });
  cube.addEventListener("pointermove", e => {
    if (!dragging) return;
    rotY += (e.clientX - lastX) * .7;
    rotX -= (e.clientY - lastY) * .7;
    lastX = e.clientX; lastY = e.clientY;
    cube.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  });
  cube.addEventListener("pointerup", () => dragging = false);
  cube.addEventListener("pointercancel", () => dragging = false);
}

// Three.js hero orb (only present on the Home page)
const voidCanvas = document.getElementById("void-canvas");
if (window.THREE && voidCanvas) {
  const canvas = voidCanvas;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, .1, 100);
  camera.position.z = 4.4;

  const renderer = new THREE.WebGLRenderer({canvas, alpha:true, antialias:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.8));

  const group = new THREE.Group();
  scene.add(group);

  const geometry = new THREE.IcosahedronGeometry(1.25, 4);
  const material = new THREE.MeshStandardMaterial({
    color: 0x141414,
    roughness: .35,
    metalness: .85,
    wireframe: true
  });
  const mesh = new THREE.Mesh(geometry, material);
  group.add(mesh);

  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(.82, 3),
    new THREE.MeshStandardMaterial({
      color: 0x090909, roughness: .2, metalness: .95
    })
  );
  group.add(core);

  const redLight = new THREE.PointLight(0xff1744, 12, 7);
  redLight.position.set(2, 1.5, 2.5);
  scene.add(redLight);

  const whiteLight = new THREE.PointLight(0xffffff, 5, 8);
  whiteLight.position.set(-3, -2, 2);
  scene.add(whiteLight);

  const ambient = new THREE.AmbientLight(0xffffff, .25);
  scene.add(ambient);

  let mx = 0, my = 0;
  window.addEventListener("mousemove", e => {
    mx = (e.clientX / innerWidth - .5) * .35;
    my = (e.clientY / innerHeight - .5) * .25;
  });

  function resize(){
    const r = canvas.parentElement.getBoundingClientRect();
    renderer.setSize(r.width, r.height, false);
    camera.aspect = r.width / r.height;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener("resize", resize);

  function animate(t){
    requestAnimationFrame(animate);
    group.rotation.y += .0028;
    group.rotation.x = Math.sin(t * .00035) * .18 + my;
    group.rotation.y += mx * .003;
    core.rotation.y -= .0015;
    renderer.render(scene,camera);
  }
  animate(0);
}

// Subtle hero depth on scroll — deliberately restrained.
(() => {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const heroCopy = document.querySelector(".hero-copy");
  const orb = document.querySelector(".orb-wrap");
  if (!heroCopy || !orb) return;

  let ticking = false;
  const parallax = () => {
    const y = Math.min(scrollY, innerHeight);
    heroCopy.style.transform = `translate3d(0, ${y * .10}px, 0)`;
    orb.style.transform = `translate3d(0, ${y * -.06}px, 0)`;
    ticking = false;
  };
  addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(parallax);
      ticking = true;
    }
  }, {passive:true});
})();
