/*document.addEventListener("DOMContentLoaded", function () {
  const cards = document.querySelectorAll(".link-card");
  const header = document.querySelector(".main-header");
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelectorAll(".section-link");

  cards.forEach(function (card) {
    card.addEventListener("click", function () {
      const url = card.getAttribute("data-link");

      if (!url) {
        return;
      }

      const newWindow = window.open(url, "_blank", "noopener");
      if (newWindow) {
        newWindow.opener = null;
      }
    });
  });

  if (navToggle && header) {
    navToggle.addEventListener("click", function () {
      const isOpen = header.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }

  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      if (!header || !navToggle) {
        return;
      }

      header.classList.remove("nav-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
});
*/
document.addEventListener("DOMContentLoaded", function () {
  const cards = document.querySelectorAll(".link-card");
  const header = document.querySelector(".main-header");
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelectorAll(".section-link");
  const mostViewedContainer = document.querySelector("#most-viewed .link-grid");

  // =========================
  // HIT STORAGE
  // =========================
  function getHits() {
    return JSON.parse(localStorage.getItem("linkHits")) || {};
  }

  function saveHits(data) {
    localStorage.setItem("linkHits", JSON.stringify(data));
  }

  function increaseHit(id) {
    const hits = getHits();
    hits[id] = (hits[id] || 0) + 1;
    saveHits(hits);
  }

  // =========================
  // CARD CLICK BEHAVIOR
  // =========================
  cards.forEach(function (card) {
    card.addEventListener("click", function () {
      const url = card.getAttribute("data-link");
      const id = card.getAttribute("data-id");

      if (!url) return;

      if (id) {
        increaseHit(id);
      }

      const newWindow = window.open(url, "_blank", "noopener");
      if (newWindow) {
        newWindow.opener = null;
      }

      generateMostViewed(); // update ranking after click
    });
  });

  // =========================
  // MOST VIEWED GENERATOR
  // =========================
  function generateMostViewed() {
    if (!mostViewedContainer) return;

    const hits = getHits();

    // Ambil semua card dari SELURUH halaman
    const allCards = Array.from(document.querySelectorAll(".link-card"));

    const mapped = allCards.map(function (card) {
      return {
        id: card.getAttribute("data-id"),
        link: card.getAttribute("data-link"),
        icon: card.querySelector(".icon")?.innerHTML || "",
        label: card.querySelector(".label")?.innerText || "",
        hits: hits[card.getAttribute("data-id")] || 0
      };
    });

    // Sort descending
    mapped.sort(function (a, b) {
      return b.hits - a.hits;
    });

    // Ambil top 4
    const top = mapped.slice(0, 4);

    // Render ulang
    mostViewedContainer.innerHTML = "";

    top.forEach(function (item) {
      const div = document.createElement("div");
      div.className = "link-card";
      div.innerHTML = `
        <span class="icon">${item.icon}</span>
        <span class="label">${item.label}</span>
        
      `;

      div.addEventListener("click", function () {
        if (item.id) increaseHit(item.id);

        const newWindow = window.open(item.link, "_blank", "noopener");
        if (newWindow) {
          newWindow.opener = null;
        }

        generateMostViewed();
      });

      mostViewedContainer.appendChild(div);
    });
  }

  generateMostViewed();

  // =========================
  // NAV TOGGLE
  // =========================
  if (navToggle && header) {
    navToggle.addEventListener("click", function () {
      const isOpen = header.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }

  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      if (!header || !navToggle) return;

      header.classList.remove("nav-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
});
