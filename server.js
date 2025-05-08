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

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use((req, res, next) => {
    res.set("Cache-Control", "no-store");
    next();
});

app.use("/api/users", userRoutes);
app.use("/api/notes", noteRoutes);
app.use(errorHandler);

// app.get("/", (req, res) => res.json({ data: "Hello" }));

connectDB(process.env.MONGODB_CONNECTION_STRING).then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT} ✅`);
    });
});
