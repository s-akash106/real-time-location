const express = require("express");
const http = require("http");
const path = require("path");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Set the view engine to EJS
app.set("view engine", "ejs");

// Handle client connections
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Listen for location data
  socket.on("send-location", (data) => {
    console.log("Location received from", socket.id, data);
    io.emit("recive-location", { id: socket.id, ...data });
  });

  // Handle client disconnect
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
    io.emit("user-disconnected", socket.id);
  });
});

// Route for the homepage
app.get("/", (req, res) => {
  res.render("index");
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
