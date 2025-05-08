import Note from "../models/note.model.js";

// Add Note
export const addNote = async (req, res, next) => {
    const { title, content, tags } = req.body;

    if (!title || !content) {
        res.status(400);
        return next(new Error("Title and content required"));
    }

    try {
        const note = new Note({
            title,
            content,
            tags: tags || [],
            userId: req.user._id,
        });

        await note.save();

        res.json({
            error: false,
            note,
            message: "Note added successfully",
        });
    } catch (error) {
        next(error);
    }
};

// Edit Note
export const editNote = async (req, res, next) => {
    const { noteId } = req.params;
    const updates = req.body;

    try {
        const note = await Note.findOne({ _id: noteId, userId: req.user._id });

        if (!note) {
            res.status(404);
            return next(new Error("Note not found"));
        }

        Object.assign(note, updates);
        await note.save();

        res.json({
            error: false,
            note,
            message: "Note updated successfully",
        });
    } catch (error) {
        next(error);
    }
};

// Get All Notes
export const getAllNotes = async (req, res, next) => {
    try {
        const notes = await Note.find({ userId: req.user._id }).sort({ isPinned: -1 });

        res.json({
            error: false,
            notes,
            message: "All notes retrieved successfully",
        });
    } catch (error) {
        next(error);
    }
};

// Get Note by ID
export const getNoteById = async (req, res, next) => {
    const { noteId } = req.params;

    try {
        const note = await Note.findOne({ _id: noteId, userId: req.user._id });

        if (!note) {
            res.status(404);
            return next(new Error("Note not found"));
        }

        res.json({
            error: false,
            note,
            message: "Note retrieved successfully",
        });
    } catch (error) {
        next(error);
    }
};

// Delete Note
export const deleteNote = async (req, res, next) => {
    const { noteId } = req.params;

    try {
        const note = await Note.findOneAndDelete({ _id: noteId, userId: req.user._id });

        if (!note) {
            res.status(404);
            return next(new Error("Note not found"));
        }

        res.json({
            error: false,
            message: "Note deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};

// Update isPinned
export const updatePinned = async (req, res, next) => {
    const { noteId } = req.params;

    try {
        const note = await Note.findOne({ _id: noteId, userId: req.user._id });

        if (!note) {
            res.status(404);
            return next(new Error("Note not found"));
        }

        note.isPinned = req.body.isPinned;
        await note.save();

        res.json({
            error: false,
            note,
            message: "Pinned updated successfully",
        });
    } catch (error) {
        next(error);
    }
};

// Update Search
export const searchNotes = async (req, res, next) => {
    const user = req.user;
    const { query } = req.query;

    if (!query) {
        res.status(400);
        return next(new Error("Search query is required"));
    }

    try {
        const matchingNotes = await Note.find({
            userId: user._id,
            $or: [
                { title: { $regex: new RegExp(query, "i") } },
                { content: { $regex: new RegExp(query, "i") } }
            ],
        });

        res.json({
            error: false,
            notes: matchingNotes,
            message: "Notes matching the search query retrieved successfully",
        });
    } catch (error) {
        next(error);
    }
};
