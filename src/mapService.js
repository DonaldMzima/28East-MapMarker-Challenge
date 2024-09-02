export function loadGoogleMapsScript(apiKey) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("Failed to load Google Maps script"));
    document.head.appendChild(script);
  });
}

export function initMap() {
  const mapElement = document.getElementById("map");
  return new google.maps.Map(mapElement, {
    center: { lat: 0, lng: 0 },
    zoom: 2,
  });
}

export function searchLocation(map, query, callback) {
  const geocoder = new google.maps.Geocoder();
  geocoder.geocode({ address: query }, (results, status) => {
    if (status === "OK" && results && results[0]) {
      const location = results[0].geometry.location;
      map.setCenter(location);
      map.setZoom(10);
      callback(location);
    } else {
      alert("Location not found");
    }
  });
}

export function addMarker(map, position) {
  new google.maps.Marker({ position, map });
}
