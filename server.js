import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/user.routes.js";
import noteRoutes from "./routes/note.routes.js";
import errorHandler from "./middleware/errorHandler.js"
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Allowed origins
const allowedOrigins = [
  process.env.CLIENT_URL_DEV,
  process.env.CLIENT_URL_PROD,
].map(origin => origin?.replace(/\/$/, ""));

// CORS middleware
app.use(cors({
  origin: (origin, callback) => {
    const cleanOrigin = origin?.replace(/\/$/, "");

    if (!origin || allowedOrigins.includes(cleanOrigin)) {
      callback(null, true);
    } else {
      console.error(`Blocked by CORS: ${origin}`);
      callback(new Error(`CORS not allowed: ${origin}`));
    }
  },
  credentials: true,
}));

app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/notes", noteRoutes);

// Test route (optional)
app.get("/", (req, res) => {
  res.json({ message: "API is running ✅" });
});

// ErrorHandler
app.use(errorHandler);

// Connect DB & Start server
connectDB(process.env.MONGODB_CONNECTION_STRING).then(() => {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT} ✅`);
  });
});
