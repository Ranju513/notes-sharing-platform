const express = require("express");
const multer = require("multer");
const Note = require("../models/Note");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    files: 50,
    fileSize: 200 * 1024 * 1024,
  },
});

router.post("/upload", protect, upload.array("files", 50), async (req, res) => {
  try {
    const { title, subject, description, content } = req.body;

    const totalSize = req.files.reduce((sum, file) => sum + file.size, 0);

    if (totalSize > 200 * 1024 * 1024) {
      return res.status(400).json({
        message: "Total file size must be under 200 MB",
      });
    }

    if ((!content || content.trim() === "") && req.files.length === 0) {
      return res.status(400).json({
        message: "Please add text notes or upload at least one file",
      });
    }

    const uploadedFiles = req.files.map((file) => ({
      fileName: file.filename,
      filePath: file.path,
    }));

    const note = await Note.create({
      title,
      subject,
      description,
      content,
      files: uploadedFiles,
      uploadedBy: req.user.id,
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

router.get("/", async (req, res) => {
  try {
    const notes = await Note.find()
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 });

    res.json(notes);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    if (!note.uploadedBy || note.uploadedBy.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You can delete only your own notes",
      });
    }

    await note.deleteOne();

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
