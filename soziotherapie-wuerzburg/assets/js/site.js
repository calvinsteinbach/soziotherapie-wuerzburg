/* Site behaviour — minimal, no deps */

(() => {
  /* ---------- Header scroll ---------- */
  const header = document.getElementById("header");
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 12);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Burger menu ---------- */
  const burger = document.getElementById("burger");
  const navLinks = document.getElementById("navLinks");
  if (burger && navLinks) {
    burger.addEventListener("click", () => {
      const open = navLinks.classList.toggle("open");
      burger.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
    });
    navLinks.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        navLinks.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      })
    );
  }

  /* ---------- Active nav link via IntersectionObserver ---------- */
  const sections = document.querySelectorAll("section[id]");
  const links = document.querySelectorAll(".nav-links a[href^='#']");
  if (sections.length && links.length && "IntersectionObserver" in window) {
    const map = new Map();
    links.forEach((l) => {
      const id = l.getAttribute("href").slice(1);
      if (id) map.set(id, l);
    });
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            links.forEach((l) => l.classList.remove("active"));
            const link = map.get(e.target.id);
            if (link) link.classList.add("active");
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );
    sections.forEach((s) => io.observe(s));
  }

  /* ---------- Reveal on view ---------- */
  const revealEls = document.querySelectorAll(".reveal, .hero h1");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
  }

  /* ---------- Floating-label form ---------- */
  document.querySelectorAll(".field input, .field textarea").forEach((el) => {
    const sync = () => el.parentElement.classList.toggle("filled", !!el.value);
    el.addEventListener("input", sync);
    el.addEventListener("blur", sync);
    sync();
  });

  /* ---------- Form submit (demo) ---------- */
  const form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = form.querySelector("button[type=submit]");
      if (!btn) return;
      const original = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = "Wird gesendet …";
      setTimeout(() => {
        btn.innerHTML = "Vielen Dank — wir melden uns ✓";
        setTimeout(() => {
          btn.innerHTML = original;
          btn.disabled = false;
          form.reset();
          form.querySelectorAll(".field").forEach((f) => f.classList.remove("filled"));
        }, 2600);
      }, 700);
    });
  }
})();
