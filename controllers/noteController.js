import Note from "../models/note.model.js";

// Add Note
export const addNote = async (req, res) => {
    const { title, content, tags } = req.body;

    if (!title || !content) {
        return res.status(400).json({
            error: true,
            message: "Title and content required",
        });
    }

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
};

// Edit Note
export const editNote = async (req, res) => {
    const { noteId } = req.params;
    const updates = req.body;

    const note = await Note.findOne({ _id: noteId, userId: req.user._id });

    if (!note) {
        return res.status(404).json({
            error: true,
            message: "Note not found",
        });
    }

    Object.assign(note, updates);
    await note.save();

    res.json({
        error: false,
        note,
        message: "Note updated",
    });
};

// Get All Notes
export const getAllNotes = async (req, res) => {
    console.log("User ID in getAllNotes:", req.user._id);

    const notes = await Note.find({ userId: req.user._id }).sort({ isPinned: -1 });

    console.log("Notes found:", notes.length);
    
    res.json({
        error: false,
        notes,
        message: "All notes retrieved successfully",
    });
};

// Get Note by ID
export const getNoteById = async (req, res) => {
    const note = await Note.findOne({ _id: req.params.noteId, userId: req.user._id });

    if (!note) {
        return res.status(404).json({
            error: true,
            message: "Note not found",
        });
    }

    res.json({
        error: false,
        note,
        message: "Note retrieved",
    });
};

// Delete Note
export const deleteNote = async (req, res) => {
    const note = await Note.findOneAndDelete({ _id: req.params.noteId, userId: req.user._id });

    if (!note) {
        return res.status(404).json({
            error: true,
            message: "Note not found",
        });
    }

    res.json({
        error: false,
        message: "Note deleted",
    });
};

// Update isPinned
export const updatePinned = async (req, res) => {
    const note = await Note.findOne({ _id: req.params.noteId, userId: req.user._id });

    if (!note) {
        return res.status(404).json({
            error: true,
            message: "Note not found",
        });
    }

    note.isPinned = req.body.isPinned;
    await note.save();

    res.json({
        error: false,
        note,
        message: "Pinned updated",
    });
};
