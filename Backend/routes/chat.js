import express from 'express';
import Thread from '../models/Thread.js';
import getOpenAiResponse from '../utils/openai.js';

const router = express.Router();
console.log("chat.js");

// Read all threads
router.get("/thread", async (req, res) => {
    try {
        const threads = await Thread.find({}).sort({ updatedAt: -1 });
        res.json(threads);
    } catch (err) {
        console.log(err);
        res.status(500).json("some error occurred: failed to fetch threads!");
    }
});

// Show individual thread
router.get("/thread/:ThreadId", async (req, res) => {
    const { ThreadId } = req.params;
    try {
        const thread = await Thread.findOne({ ThreadId });
        if (!thread) {
            return res.status(404).json("no chat found");  // ← added return
        }
        res.json(thread.messages);
    } catch (err) {
        console.log(err);
        res.status(500).json("Could not find chat");
    }
});

// Delete a thread
router.delete("/thread/:ThreadId", async (req, res) => {
    const { ThreadId } = req.params;
    try {
        const deleted = await Thread.findOneAndDelete({ ThreadId });
        if (!deleted) {
            return res.status(404).json("couldn't delete thread");  // ← added return
        }
        res.status(200).json("Deleted successfully!");
    } catch (err) {
        console.log(err);
        res.status(500).json("could not delete");
    }
});

// Chat route
router.post("/chat", async (req, res) => {
    const { ThreadId, message } = req.body;
    if (!ThreadId || !message) {
        return res.status(400).json("required credentials not found!");  // ← added return
    }
    try {
        let thread = await Thread.findOne({ ThreadId });  // ← let instead of const

        if (!thread) {
            // ← was creating new Thread but never saving, and was redeclaring with const
            thread = new Thread({
                ThreadId,
                title: message,
                messages: [{ role: "user", content: message }]
            });
        } else {
            thread.messages.push({ role: "user", content: message });
        }

        // Get response from OpenAI
        const { reply: assistantReply, responseId } = await getOpenAiResponse(message, ThreadId);  // ← destructure both values

        thread.messages.push({ role: "assistant", content: assistantReply });  // ← fixed typo "assisstant"
        thread.updatedAt = new Date();
        await thread.save();  // ← now saves both new and existing threads correctly

        res.json({ reply: assistantReply, threadId: responseId });  // ← send responseId back to frontend

    } catch (err) {
        console.log(err);
        res.status(500).json(err.message);
    }
});

export default router;