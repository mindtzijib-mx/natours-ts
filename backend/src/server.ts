// src/server.ts
import dotenv from "dotenv";
import mongoose from "mongoose";

import app from "./app"; // Assuming 'app.ts' is in the same directory

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

// Load environment variables
dotenv.config({ path: "./config.env" });

const startServer = async () => {
  // 1. Set up MongoDB connection
  const port = process.env.PORT || 3000;
  // For local development, you can connect to a local MongoDB instance.
  // Make sure your MongoDB server is running.
  // The default connection URI is mongodb://localhost:27017/<your-db-name>
  const DB =
    process.env.DATABASE_LOCAL || "mongodb://localhost:27017/natours-ts";

  try {
    // 2. Connect to the database using async/await
    await mongoose.connect(DB); // Mongoose 6+ no longer needs the old options
    console.log("✅ DB connection successful!");

    // 3. Start the Express server
    const server = app.listen(port, () => {
      console.log(`🚀 App running on port ${port}...`);
    });

    return server;
  } catch (error) {
    console.error("❌ DB connection failed:", error);
    process.exit(1);
  }
};

let server: any;

startServer().then((serverInstance) => {
  server = serverInstance;
});

process.on("unhandledRejection", (err: any) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});
