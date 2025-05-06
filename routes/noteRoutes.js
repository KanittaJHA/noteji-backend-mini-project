import express from "express";
import {
    addNote,
    editNote,
    getAllNotes,
    getNoteById,
    deleteNote,
    updatePinned,
} from "../controllers/noteController.js";
import { authenticateToken } from "../middleware/authenticateToken.js";

const router = express.Router();

router.post("/add-note", authenticateToken, addNote);
router.put("/edit-note/:noteId", authenticateToken, editNote);
router.get("/get-all-notes", authenticateToken, getAllNotes);
router.get("/get-notes/:noteId", authenticateToken, getNoteById);
router.delete("/delete-note/:noteId", authenticateToken, deleteNote);
router.put("/update-note-pinned/:noteId", authenticateToken, updatePinned);

export default router;