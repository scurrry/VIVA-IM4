// js/footer.js
document.addEventListener("DOMContentLoaded", function () {
  const saveIcon = document.getElementById("footer-save-icon");

  if (window.location.pathname.includes("gespeichert.html") && saveIcon) {
    saveIcon.src = "bilder/icons/gespeichert-aktiv.png";
  }
});
