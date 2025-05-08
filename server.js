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

app.use(cors({
  origin: "http://localhost:5173",
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
  res.json({ message: "API is running 🚀" });
});

// ErrorHandler
app.use(errorHandler);

// Connect DB & Start server
connectDB(process.env.MONGODB_CONNECTION_STRING).then(() => {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT} ✅`);
  });
});
