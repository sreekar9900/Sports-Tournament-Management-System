const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");
const connectDatabase = require("./config/db");

dotenv.config();

const port = process.env.PORT || 5000;

// Create HTTP server and wrap express app
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: "*", // allow React dev server origins
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// Make io accessible in controllers via req.app.get('io')
app.set("io", io);

io.on("connection", (socket) => {
  console.log("Client connected via WebSocket:", socket.id);
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const startServer = async () => {
  try {
    await connectDatabase();
    server.listen(port, () => {
      console.log(`Server running on port ${port} with WebSockets enabled`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
