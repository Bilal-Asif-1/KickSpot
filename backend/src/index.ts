import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import { sequelize } from "./lib/sequelize.js";
import router from "./routes/index.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// ✅ Serve uploaded files
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// ✅ Simple health check (no DB)
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    status: "healthy",
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// ✅ DB health check (for Railway/Render)
app.get("/api/health/db", async (_req: Request, res: Response) => {
  try {
    await sequelize.authenticate();
    res.json({
      status: "healthy",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({
      status: "unhealthy",
      database: "disconnected",
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// ✅ API Routes
app.use("/api", router);

// ✅ Global error handler
app.use(
  (err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || 500;
    res.status(status).json({
      message: err.message || "Internal Server Error",
    });
  }
);

const server = http.createServer(app);
export const io = new Server(server, {
  cors: { origin: "*" },
});

// ✅ Socket.io setup
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("join_admin_room", (adminId: number) => {
    socket.join(`admin_${adminId}`);
    console.log(`Admin ${adminId} joined room admin_${adminId}`);
  });

  socket.on("join_user_room", (userId: number) => {
    socket.join(`user_${userId}`);
    console.log(`User ${userId} joined room user_${userId}`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// ✅ Port fix (always number)
const PORT: number = process.env.PORT ? Number(process.env.PORT) : 5000;

// ✅ Start server after DB connection
async function start() {
  try {
    console.log("🔄 Starting server...");
    console.log("🔄 Connecting to MySQL database...");

    await sequelize.authenticate();
    console.log("✅ MySQL database connected successfully!");

    console.log("🔄 Syncing database tables...");
    await sequelize.sync({ alter: true });
    console.log("✅ Database tables synced!");

    // Start server
    server.listen(PORT, "0.0.0.0", () => {
      console.log("🚀 KickSpot API Server Started!");
      console.log(`📡 Server running on: http://localhost:${PORT}`);
      console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
      console.log(`🔗 DB Health Check: http://localhost:${PORT}/api/health/db`);
      console.log(`📚 API Base: http://localhost:${PORT}/api/v1`);
    });
  } catch (e: any) {
    console.error("❌ Failed to start server!");
    console.error("💥 Error:", e.message);

    console.error("\n🔧 Troubleshooting:");
    console.error("1. Check if MySQL server is running");
    console.error("2. Verify .env file has correct database credentials");
    console.error("3. Create database if it does not exist");
    console.error("4. Check MySQL user permissions\n");

    console.error("📝 Current .env settings:");
    console.error(`   MYSQL_HOST=${process.env.MYSQL_HOST || "localhost"}`);
    console.error(`   MYSQL_DB=${process.env.MYSQL_DB || "kickspot"}`);
    console.error(`   MYSQL_USER=${process.env.MYSQL_USER || "root"}`);
    console.error(
      `   MYSQL_PASSWORD=${
        process.env.MYSQL_PASSWORD ? "***set***" : "***not set***"
      }`
    );

    process.exit(1); // ❌ exit if DB not connected
  }
}

start();
