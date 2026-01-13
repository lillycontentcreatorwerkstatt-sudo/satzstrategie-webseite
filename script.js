document.addEventListener("DOMContentLoaded", () => {
  console.log("Script: Right-Align & Single-Click Ready");

  /* --- 1. BURGER MENÜ --- */
  const burgerBtn = document.querySelector(".burger-btn");
  const smartNav = document.querySelector("#smartNav");
  const navItems = document.querySelectorAll(".nav-item");

  // Active State (Welche Seite ist aktiv?)
  const filename = window.location.pathname.split("/").pop() || "index.html";
  navItems.forEach((link) => {
    if (
      link.getAttribute("href") &&
      link.getAttribute("href").includes(filename)
    ) {
      link.classList.add("active-page");
    }
  });

  // Menü öffnen/schließen
  if (burgerBtn && smartNav) {
    burgerBtn.addEventListener("click", () => {
      burgerBtn.classList.toggle("is-active");
      smartNav.classList.toggle("is-open");
    });

    // Menü schließen bei Klick daneben
    document.addEventListener("click", (e) => {
      if (!smartNav.contains(e.target) && !burgerBtn.contains(e.target)) {
        burgerBtn.classList.remove("is-active");
        smartNav.classList.remove("is-open");
      }
    });

    // Menü schließen bei Klick auf einen Link (SOFORT)
    navItems.forEach((item) => {
      item.addEventListener("click", () => {
        // Wir machen das Menü einfach zu.
        // Der Browser folgt dem Link automatisch, wir verhindern nichts mehr.
        burgerBtn.classList.remove("is-active");
        smartNav.classList.remove("is-open");
      });
    });
  }

  /* --- 2. SPEED DIAL BUTTON (Footer Logic) --- */
  const speedDialContainer = document.getElementById("speedDial");
  const btnMain = document.getElementById("btnMain");
  const mainIcon = document.getElementById("mainIcon");
  const btnScrollTop = document.getElementById("btnScrollTop");
  const btnHome = document.getElementById("btnHome");
  const footer = document.querySelector("footer");

  if (speedDialContainer && btnMain && mainIcon && footer) {
    // Intersection Observer: Zeigt Button nur, wenn Footer sichtbar ist
    const footerObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          speedDialContainer.classList.add("is-visible");
        } else {
          speedDialContainer.classList.remove("is-visible");
          speedDialContainer.classList.remove("menu-open");
        }
      },
      { threshold: 0.1 }
    );

    footerObserver.observe(footer);

    // Unterscheidung Startseite vs. Unterseite
    const isHomePage =
      filename === "index.html" || window.location.pathname === "/";

    if (isHomePage) {
      speedDialContainer.classList.add("is-home");
      mainIcon.className = "fas fa-arrow-up";
      btnMain.addEventListener("click", () =>
        window.scrollTo({ top: 0, behavior: "smooth" })
      );
    } else {
      mainIcon.className = "fas fa-plus";
      btnMain.addEventListener("click", () =>
        speedDialContainer.classList.toggle("menu-open")
      );
      if (btnScrollTop)
        btnScrollTop.addEventListener("click", () => {
          window.scrollTo({ top: 0, behavior: "smooth" });
          speedDialContainer.classList.remove("menu-open");
        });
      if (btnHome)
        btnHome.addEventListener("click", () =>
          speedDialContainer.classList.remove("menu-open")
        );
    }
  }
});
