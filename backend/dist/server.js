"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/server.ts
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app")); // Assuming 'app.ts' is in the same directory
// Load environment variables
dotenv_1.default.config({ path: "./config.env" });
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    // 1. Set up MongoDB connection
    const port = process.env.PORT || 3000;
    // For local development, you can connect to a local MongoDB instance.
    // Make sure your MongoDB server is running.
    // The default connection URI is mongodb://localhost:27017/<your-db-name>
    const DB = process.env.DATABASE_LOCAL || "mongodb://localhost:27017/natours-ts";
    try {
        // 2. Connect to the database using async/await
        yield mongoose_1.default.connect(DB); // Mongoose 6+ no longer needs the old options
        console.log("✅ DB connection successful!");
        // 3. Start the Express server
        app_1.default.listen(port, () => {
            console.log(`🚀 App running on port ${port}...`);
        });
    }
    catch (error) {
        console.error("❌ DB connection failed:", error);
        process.exit(1);
    }
});
startServer();
