const express = require("express");
const multer = require("multer");
const Note = require("../models/Note");

const router = express.Router();

// file upload storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// upload note
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { title, subject, description } = req.body;

    const note = await Note.create({
      title,
      subject,
      description,
      fileName: req.file.filename,
      filePath: req.file.path,
    });

    res.status(201).json({
      message: "Note uploaded successfully",
      note,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// get all notes
router.get("/", async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });

    res.json(notes);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});
// delete note
router.delete("/:id", async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    res.json({
      message: "Note deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});
// delete note
router.delete("/:id", async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    res.json({
      message: "Note deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});// delete note
router.delete("/:id", async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    res.json({
      message: "Note deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});
module.exports = router;
