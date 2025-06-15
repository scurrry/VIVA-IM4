// js/logout.js
document.addEventListener("DOMContentLoaded", () => {
  const logoutButton = document.getElementById("logoutBtn");

  if (logoutButton) {
    logoutButton.addEventListener("click", async (e) => {
      e.preventDefault();

      try {
        const response = await fetch("api/logout.php", {
          method: "GET",
          credentials: "include"
        });

        const result = await response.json();

        if (result.status === "success") {
          window.location.href = "index.html";
        } else {
          alert("Logout fehlgeschlagen.");
        }
      } catch (err) {
        console.error("Logout-Fehler:", err);
        alert("Fehler beim Logout.");
      }
    });
  }
});
