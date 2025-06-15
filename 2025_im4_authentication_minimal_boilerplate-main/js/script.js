// ✅ APP-START ÜBER LOGIN
function startApp(userId) {
  console.log("App gestartet mit userId:", userId);

  const mainContent = document.querySelector(".main-content");
  const body = document.querySelector("body");
  const categoryButtons = document.querySelectorAll(".category-button");

  // Falls Modal noch da ist: entfernen
  const modal = document.getElementById("login-modal");
  if (modal) modal.remove();

  categoryButtons.forEach(button => {
    button.addEventListener("click", async () => {
      categoryButtons.forEach(btn => {
        btn.classList.remove("active");
        const img = btn.querySelector("img");
        const iconName = img.getAttribute("src").split("/").pop();
        img.setAttribute("src", `bilder/icons/${iconName.replace("-weiss", "-blau")}`);
      });

      button.classList.add("active");
      const activeIcon = button.querySelector("img");
      const iconName = activeIcon.getAttribute("src").split("/").pop();
      activeIcon.setAttribute("src", `bilder/icons/${iconName.replace("-blau", "-weiss")}`);

      const category = button.textContent.trim();
      await fetchAndRender(category, userId);
    });
  });

  fetchAndRender("Restaurant", userId);
}

async function fetchAndRender(category, userId) {
  const mainContent = document.querySelector(".main-content");
  const body = document.querySelector("body");

  mainContent.innerHTML = "";
  document.querySelectorAll(".overlay").forEach(el => el.remove());

  try {
    const [favoritesRes, response] = await Promise.all([
      fetch(`api/get_favorites.php?user_id=${userId}`, {
        credentials: 'include'
      }),
      fetch(`api/get_locations.php?category=${encodeURIComponent(category)}`, {
        credentials: 'include'
      })
    ]);

    const favorites = await favoritesRes.json();
    const favoriteIds = favorites.map(loc => loc.id);
    const locations = await response.json();

    locations.forEach((location) => {
      const isFavorited = favoriteIds.includes(location.id);

      const card = document.createElement("section");
      card.classList.add("card");

      card.innerHTML = `
        <img src="${location.image1}" alt="${location.name}" class="card-image" />
        <div class="card-content">
          <h2 class="card-title">${location.name}</h2>
          <p class="card-address">${location.address}</p>
          <button class="mehr-dazu-button" onclick="toggleOverlay('overlay-${location.id}')">Mehr dazu</button>
          <button class="save-button" data-id="${location.id}">
            <img src="bilder/icons/${isFavorited ? "gespeichert-weiss-aktiv.png" : "gespeichert-weiss.png"}" alt="Merken Icon" />
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

          <a class="zum-angebot-button" href="${location.link}" target="_blank" rel="noopener noreferrer">Zum Angebot</a>
          <button class="save-button" data-id="${location.id}">
            <img src="bilder/icons/${isFavorited ? "gespeichert-weiss-aktiv.png" : "gespeichert-weiss.png"}" alt="Merken Icon" />
          </button>
        </div>
      `;

      body.appendChild(overlay);
    });

    initSaveButtons(userId);
    initSlideshows();
  } catch (err) {
    console.error("Fehler beim Laden der Locations:", err);
  }
}

function toggleOverlay(id) {
  const overlay = document.getElementById(id);
  if (overlay) {
    overlay.classList.toggle("visible");
  }
}

function initSaveButtons(userId) {
  document.querySelectorAll(".save-button").forEach(button => {
    const locationId = button.getAttribute("data-id");

    button.addEventListener("click", async function (e) {
      e.stopPropagation();

      try {
        const res = await fetch("api/add_favorites.php", {
          method: "POST",
          credentials: 'include',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: userId,
            location_id: locationId
          })
        });

        const result = await res.json();
        const newIcon = result.status === "added"
          ? "bilder/icons/gespeichert-weiss-aktiv.png"
          : "bilder/icons/gespeichert-weiss.png";

        document.querySelectorAll(`.save-button[data-id='${locationId}'] img`).forEach(img => {
          img.src = newIcon;
        });

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
