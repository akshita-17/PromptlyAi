import express from "express";
import multer from "multer";
import Thread from "../models/Thread.js";
import Chunk from "../models/Chunk.js";
import auth from "../middleware/auth.js";
import { extractText } from "../utils/documentParser.js";
import { chunkText } from "../utils/chunking.js";
import { embedBatch } from "../utils/embeddings.js";

const router = express.Router();
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

router.use(auth);

router.post("/thread/:threadId/upload", upload.single("file"), async (req, res) => {
    const { threadId } = req.params;

    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }

    try {
        let thread = await Thread.findOne({ threadId, userId: req.user.id });

        if (!thread) {
            thread = new Thread({
                threadId,
                userId: req.user.id,
                title: req.file.originalname,
                messages: []
            });
        }

        const rawText = await extractText(req.file);
        const chunks = chunkText(rawText);

        if (!chunks.length) {
            return res.status(400).json({ message: "No extractable text found in file" });
        }

        const embeddings = await embedBatch(chunks);

        const chunkDocs = chunks.map((text, i) => ({
            threadId,
            userId: req.user.id,
            documentName: req.file.originalname,
            text,
            embedding: embeddings[i],
            chunkIndex: i
        }));

        await Chunk.insertMany(chunkDocs);

        thread.documents.push({ name: req.file.originalname });
        await thread.save();

        res.json({
            message: "Document indexed",
            documentName: req.file.originalname,
            chunks: chunkDocs.length
        });
    } catch (err) {
        console.error("Upload error:", err);
        res.status(500).json({ message: err.message || "Failed to process document" });
    }
});

export default router;
