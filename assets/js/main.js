
document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const navLinks = document.querySelectorAll(".nav a[href^='#']");

  const headerHeight = () => header ? header.offsetHeight : 0;

  navLinks.forEach(link => {
    link.addEventListener("click", evt => {
      const targetId = link.getAttribute("href");
      if (!targetId || !targetId.startsWith("#")) return;
      const target = document.querySelector(targetId);
      if (!target) return;
      evt.preventDefault();
      const rect = target.getBoundingClientRect();
      const offset = window.pageYOffset + rect.top - headerHeight() - 8;
      window.scrollTo({ top: offset, behavior: "smooth" });
    });
  });
});
