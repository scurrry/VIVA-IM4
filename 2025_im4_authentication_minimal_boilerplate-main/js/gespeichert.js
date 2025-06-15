// js/gespeichert.js

document.addEventListener("DOMContentLoaded", async function () {
  const mainContent = document.querySelector(".main-content");
  const body = document.querySelector("body");

  // 👇 Session prüfen
  let userId = null;
  try {
    const sessionCheck = await fetch("api/protected.php", {
      credentials: "include"
    });

    const sessionData = await sessionCheck.json();
    if (sessionCheck.status !== 200 || !sessionData.user_id) {
      // ❌ Falls nicht eingeloggt → Weiterleitung oder Meldung
      alert("Bitte zuerst einloggen");
      window.location.href = "index.html";
      return;
    }

    userId = sessionData.user_id;
  } catch (err) {
    console.error("Fehler beim Session-Check:", err);
    window.location.href = "index.html";
    return;
  }

  // ✅ Daten vom Server holen
  try {
    const response = await fetch(`api/get_favorites.php?user_id=${userId}`, {
      credentials: 'include'
    });
    const favorites = await response.json();

    favorites.forEach((location) => {
      const card = document.createElement("section");
      card.classList.add("card");

      card.innerHTML = `
        <img src="${location.image1}" alt="${location.name}" class="card-image" />
        <div class="card-content">
          <h2 class="card-title">${location.name}</h2>
          <p class="card-address">${location.address}</p>
          <button class="mehr-dazu-button" onclick="toggleOverlay('overlay-${location.id}')">Mehr dazu</button>
          <button class="save-button" data-id="${location.id}">
            <img src="bilder/icons/gespeichert-weiss-aktiv.png" alt="Merken Icon" />
          </button>
        </div>
      `;

      mainContent.appendChild(card);

      const overlay = document.createElement("div");
      overlay.classList.add("overlay");
      overlay.id = `overlay-${location.id}`;

      overlay.innerHTML = `
        <div class="overlay-content">
          <button class="close-button" onclick="toggleOverlay('overlay-${location.id}')">
            <img src="bilder/icons/schliessen.png" alt="Schliessen Icon" />
          </button>

          <div class="slideshow">
            <button class="slide-prev">
              <img src="bilder/icons/pfeil-links.png" alt="Zurück" />
            </button>
            <div class="slide"><img src="${location.image1}" class="overlay-image" /></div>
            <div class="slide"><img src="${location.image2}" class="overlay-image" /></div>
            <div class="slide"><img src="${location.image3}" class="overlay-image" /></div>
            <button class="slide-next">
              <img src="bilder/icons/pfeil-rechts.png" alt="Weiter" />
            </button>
          </div>

          <h2>${location.name}</h2>
          <p>${location.description}</p>

          <button class="zum-angebot-button">Zum Angebot</button>
          <button class="save-button" data-id="${location.id}">
            <img src="bilder/icons/gespeichert-weiss-aktiv.png" alt="Merken Icon" />
          </button>
        </div>
      `;

      body.appendChild(overlay);
    });

    initSaveButtons(userId);
    initSlideshows();
  } catch (err) {
    console.error("Fehler beim Laden der Favoriten:", err);
  }
});

function toggleOverlay(id) {
  const overlay = document.getElementById(id);
  if (overlay) {
    overlay.classList.toggle("visible");
  }
}

function initSaveButtons(userId) {
  document.querySelectorAll(".save-button").forEach(button => {
    const locationId = button.getAttribute("data-id");
    const img = button.querySelector("img");

    button.addEventListener("click", async function (e) {
      e.stopPropagation();

      try {
        const response = await fetch("api/add_favorites.php", {
          method: "POST",
          credentials: 'include',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: userId,
            location_id: locationId
          })
        });

        const result = await response.json();

        if (result.status === "removed") {
          const card = button.closest(".card");
          const overlay = document.getElementById(`overlay-${locationId}`);
          card?.remove();
          overlay?.remove();
        } else {
          img.src = "bilder/icons/gespeichert-weiss-aktiv.png";
        }
      } catch (err) {
        console.error("Fehler beim Speichern:", err);
      }
    });
  });
}

function initSlideshows() {
  const overlays = document.querySelectorAll(".overlay");

  overlays.forEach(overlay => {
    const slides = overlay.querySelectorAll(".slide");
    const prevBtn = overlay.querySelector(".slide-prev");
    const nextBtn = overlay.querySelector(".slide-next");

    if (slides.length > 0 && prevBtn && nextBtn) {
      let currentIndex = 0;

      function updateSlide() {
        slides.forEach((slide, index) => {
          slide.style.display = index === currentIndex ? "block" : "none";
        });
      }

      updateSlide();

      prevBtn.addEventListener("click", (e) => {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateSlide();
        e.stopPropagation();
      });

      nextBtn.addEventListener("click", (e) => {
        currentIndex = (currentIndex + 1) % slides.length;
        updateSlide();
        e.stopPropagation();
      });
    }
  });
}
