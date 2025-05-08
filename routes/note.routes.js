import express from "express";
import {
    addNote,
    editNote,
    getAllNotes,
    getNoteById,
    deleteNote,
    updatePinned,
    searchNotes,
} from "../controllers/note.controller.js";
import { authenticateToken } from "../middleware/authenticateToken.js";

const router = express.Router();

router.post("/add-note", authenticateToken, addNote);
router.put("/edit-note/:noteId", authenticateToken, editNote);
router.get("/get-all-notes", authenticateToken, getAllNotes);
router.get("/get-notes/:noteId", authenticateToken, getNoteById);
router.delete("/delete-note/:noteId", authenticateToken, deleteNote);
router.put("/update-note-pinned/:noteId", authenticateToken, updatePinned);
router.get("/search-notes/", authenticateToken, searchNotes);

export default router;
