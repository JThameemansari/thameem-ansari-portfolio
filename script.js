const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".site-nav");

if (menuButton && navigation) {
  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
    navigation.classList.toggle("is-open", !isOpen);
  });

  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open navigation");
      navigation.classList.remove("is-open");
    });
  });
}

const year = document.querySelector("#year");
if (year) year.textContent = String(new Date().getFullYear());

const themeButton = document.querySelector(".theme-toggle");
const themeIcon = document.querySelector(".theme-icon");
const themeLabel = document.querySelector(".theme-label");
const themeColor = document.querySelector('meta[name="theme-color"]');

function setTheme(theme, persist = false) {
  document.documentElement.dataset.theme = theme;
  const nextTheme = theme === "dark" ? "light" : "dark";
  const action = `Switch to ${nextTheme} theme`;

  if (themeButton) {
    themeButton.setAttribute("aria-label", action);
    themeButton.setAttribute("title", action);
  }
  if (themeIcon) themeIcon.textContent = theme === "dark" ? "☼" : "☾";
  if (themeLabel) themeLabel.textContent = `${nextTheme.toUpperCase()} THEME`;
  if (themeColor) themeColor.content = theme === "dark" ? "#10110f" : "#f5f8f4";

  if (persist) {
    try {
      localStorage.setItem("portfolio-theme", theme);
    } catch {
      // The current theme remains usable when browser storage is unavailable.
    }
  }
}

setTheme(document.documentElement.dataset.theme || "dark");

if (themeButton) {
  themeButton.addEventListener("click", () => {
    const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    setTheme(nextTheme, true);
    menuButton?.setAttribute("aria-expanded", "false");
    menuButton?.setAttribute("aria-label", "Open navigation");
    navigation?.classList.remove("is-open");
  });
}

const skillsCarousel = document.querySelector(".skills-carousel");
const skillsArrows = document.querySelectorAll(".skills-arrow");

if (skillsCarousel && skillsArrows.length) {
  const updateSkillsArrows = () => {
    const maxScroll = skillsCarousel.scrollWidth - skillsCarousel.clientWidth;
    const edgeTolerance = 4;
    skillsArrows.forEach((arrow) => {
      const direction = Number(arrow.dataset.scroll);
      arrow.disabled = direction < 0
        ? skillsCarousel.scrollLeft <= edgeTolerance
        : skillsCarousel.scrollLeft >= maxScroll - edgeTolerance;
    });
  };

  skillsArrows.forEach((arrow) => {
    arrow.addEventListener("click", () => {
      const direction = Number(arrow.dataset.scroll);
      skillsCarousel.scrollBy({
        left: direction * skillsCarousel.clientWidth * 0.8,
        behavior: "auto",
      });
      updateSkillsArrows();
    });
  });

  skillsCarousel.addEventListener("scroll", updateSkillsArrows, { passive: true });
  window.addEventListener("resize", updateSkillsArrows);
  updateSkillsArrows();
}

const revealTargets = document.querySelectorAll(
  ".project-card, .more-projects, .capability-card, .timeline-item, .contact-content, .contact-links",
);

if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  revealTargets.forEach((target) => target.setAttribute("data-reveal", ""));
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );
  revealTargets.forEach((target) => revealObserver.observe(target));
}
