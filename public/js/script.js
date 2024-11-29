// Initialize the socket.io client
const socket = io();

// Test the connection
socket.on("connect", () => {
  console.log("Connected to the server!");
});

// Check if the browser supports geolocation
if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      console.log("Sending location:", latitude, longitude); // Debug log
      socket.emit("send-location", { latitude, longitude });
    },
    (error) => {
      console.error("Geolocation error:", error);
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    }
  );
}

// Initialize the map with Leaflet.js
const map = L.map("map").setView([0, 0], 2); // Start with a global view

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "Map data © OpenStreetMap contributors",
}).addTo(map);

// Object to store markers for connected users
const markers = {};

// Update the map with received location data
socket.on("recive-location", (data) => {
  const { id, latitude, longitude } = data;
  map.setView([latitude, longitude], 16); // Focus the map on the latest location
  if (markers[id]) {
    markers[id].setLatLng([latitude, longitude]); // Update the existing marker
  } else {
    markers[id] = L.marker([latitude, longitude]).addTo(map); // Add a new marker
  }
});

// Remove the marker when a user disconnects
socket.on("user-disconnected", (id) => {
  if (markers[id]) {
    map.removeLayer(markers[id]); // Remove the marker
    delete markers[id]; // Delete from the markers object
  }
});
