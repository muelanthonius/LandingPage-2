document.addEventListener("DOMContentLoaded", function () {
  const cards = document.querySelectorAll(".link-card");

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
});
