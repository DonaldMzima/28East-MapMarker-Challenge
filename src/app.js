import {
  initMap,
  searchLocation,
  addMarker,
  loadGoogleMapsScript,
} from "./mapService";
import { GOOGLE_MAPS_API_KEY } from "./config";

let map;
let markerCount = 1000;
const markerCounter = document.getElementById("marker-counter");
const welcomeModal = document.getElementById("welcome-modal");
const modalCloseButton = document.getElementById("modal-close");

function updateMarkerCount() {
  markerCount--;
  markerCounter.textContent = `Markers: ${markerCount}`;
}

function showWelcomeModal() {
  if (!localStorage.getItem("welcomeModalShown")) {
    welcomeModal.classList.remove("hidden");
  }
}

function closeWelcomeModal() {
  welcomeModal.clasLsist.add("hidden");
  localStorage.setItem("welcomeModalShown", "true");
}

async function initializeApp() {
  try {
    await loadGoogleMapsScript(GOOGLE_MAPS_API_KEY);
    map = initMap();

    const searchInput = document.getElementById("search-input");
    const autocomplete = new google.maps.places.Autocomplete(searchInput);

    autocomplete.bindTo("bounds", map);

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();

      if (!place.geometry || !place.geometry.location) {
        console.error(
          "No details available for the input: '" + place.name + "'"
        );
        return;
      }

      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);
      }

      addMarkerAndUpdateCount(place.geometry.location);
    });

    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        searchLocation(map, searchInput.value, addMarkerAndUpdateCount);
      }
    });

    map.addListener("click", (e) => {
      if (e.latLng) {
        addMarkerAndUpdateCount(e.latLng);
      }
    });

    showWelcomeModal();
    modalCloseButton.addEventListener("click", closeWelcomeModal);
  } catch (error) {
    console.error("Failed to initialize app:", error);
  }
}

function addMarkerAndUpdateCount(position) {
  addMarker(map, position);
  updateMarkerCount();
}

document.addEventListener("DOMContentLoaded", initializeApp);
