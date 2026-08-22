(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const loader = $("#loader");
  const navbar = $("#navbar");
  const hamburger = $("#hamburger");
  const mobMenu = $("#mob-menu");
  const year = $("#year");
  const marquee = $("#marquee");
  const canvas = $("#hero-canvas");
  const form = $("#wa-form");
  const flyerModal = $("#flyer-modal");
  const flyerModalImg = $("#flyer-modal-img");
  const flyerModalTitle = $("#flyer-modal-title");
  const flyerModalDesc = $("#flyer-modal-desc");
  const flyerModalClose = $(".flyer-modal-close");
  const flyerModalBackdrop = $(".flyer-modal-backdrop");

  const whatsappNumber = "528119210979";
  let lastFlyerTrigger = null;

  const hideLoader = () => {
    if (!loader) return;
    loader.classList.add("is-hidden");
    window.setTimeout(() => loader.remove(), 650);
  };

  window.addEventListener("load", () => {
    window.setTimeout(hideLoader, 520);
  });

  window.setTimeout(hideLoader, 1600);

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  const syncNav = () => {
    if (!navbar) return;
    navbar.classList.toggle("scrolled", window.scrollY > 18);
  };

  syncNav();
  window.addEventListener("scroll", syncNav, { passive: true });

  if (hamburger && mobMenu) {
    hamburger.addEventListener("click", () => {
      const isOpen = hamburger.classList.toggle("is-active");
      mobMenu.classList.toggle("is-open", isOpen);
      document.body.classList.toggle("menu-open", isOpen);
      hamburger.setAttribute("aria-expanded", String(isOpen));
    });

    $$("a", mobMenu).forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("is-active");
        mobMenu.classList.remove("is-open");
        document.body.classList.remove("menu-open");
        hamburger.setAttribute("aria-expanded", "false");
      });
    });
  }

  if (marquee) {
    const items = [
      "Método Yuen",
      "Apometría Cuántica",
      "Matrix Energética",
      "Descodificación Biológica Evolutiva",
      "Cursos presenciales",
      "México",
      "Costa Rica",
      "Colombia",
      "Ecuador",
      "Perú",
      "Bolivia",
      "Chile"
    ];

    const strip = items.map((item) => `<span>${item}</span>`).join("");
    marquee.innerHTML = `${strip}${strip}`;
  }

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });

  $$(".reveal").forEach((el) => revealObserver.observe(el));

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const el = entry.target;
      const target = Number(el.dataset.count || 0);
      const suffix = el.dataset.suffix || "";
      const duration = 1250;
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = `${Math.round(target * eased)}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(tick);
        }
      };

      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.45 });

  $$(".stat-num").forEach((el) => counterObserver.observe(el));

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const name = $("#f-name")?.value.trim();
      const interest = $("#f-interest")?.value.trim();
      const message = $("#f-msg")?.value.trim();

      if (!name || !message) {
        form.reportValidity();
        return;
      }

      const text = [
        "Hola, visité la página de Método Yuen.",
        `Mi nombre es ${name}.`,
        `Me interesa: ${interest}.`,
        `Mensaje: ${message}`
      ].join("\n");

      const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
      window.open(url, "_blank", "noopener,noreferrer");
    });
  }

  const closeFlyerModal = () => {
    if (!flyerModal) return;

    flyerModal.classList.remove("is-open");
    flyerModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("flyer-open");

    if (lastFlyerTrigger) {
      lastFlyerTrigger.focus();
    }
  };

  const openFlyerModal = (trigger) => {
    if (!flyerModal || !flyerModalImg || !flyerModalTitle || !flyerModalDesc) return;

    const image = trigger.dataset.full;
    const title = trigger.dataset.title || "Folleto";
    const desc = trigger.dataset.desc || "";
    const thumb = $("img", trigger);

    lastFlyerTrigger = trigger;
    flyerModalImg.src = image;
    flyerModalImg.alt = thumb?.alt || title;
    flyerModalTitle.textContent = title;
    flyerModalDesc.textContent = desc;
    flyerModal.classList.add("is-open");
    flyerModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("flyer-open");
    flyerModalClose?.focus();
  };

  $$(".flyer-card").forEach((card) => {
    card.addEventListener("click", () => openFlyerModal(card));
  });

  flyerModalClose?.addEventListener("click", closeFlyerModal);
  flyerModalBackdrop?.addEventListener("click", closeFlyerModal);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && flyerModal?.classList.contains("is-open")) {
      closeFlyerModal();
    }
  });

  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let particles = [];
  let raf = 0;

  const resize = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    const count = Math.max(26, Math.min(72, Math.floor(width / 22)));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.24,
      vy: (Math.random() - 0.5) * 0.24,
      r: Math.random() * 1.8 + 0.7,
      hue: Math.random() > 0.72 ? "216, 180, 102" : "112, 215, 255"
    }));
  };

  const draw = () => {
    ctx.clearRect(0, 0, width, height);

    particles.forEach((p, index) => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < -20) p.x = width + 20;
      if (p.x > width + 20) p.x = -20;
      if (p.y < -20) p.y = height + 20;
      if (p.y > height + 20) p.y = -20;

      for (let j = index + 1; j < particles.length; j += 1) {
        const other = particles[j];
        const dx = p.x - other.x;
        const dy = p.y - other.y;
        const distance = Math.hypot(dx, dy);

        if (distance < 120) {
          ctx.strokeStyle = `rgba(112, 215, 255, ${0.11 * (1 - distance / 120)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(other.x, other.y);
          ctx.stroke();
        }
      }

      ctx.fillStyle = `rgba(${p.hue}, 0.68)`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });

    raf = requestAnimationFrame(draw);
  };

  const startCanvas = () => {
    cancelAnimationFrame(raf);
    resize();
    draw();
  };

  startCanvas();
  window.addEventListener("resize", startCanvas);
})();
