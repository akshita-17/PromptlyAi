// import express from "express";
// import Thread from "../models/Thread.js";
// import { v4 as uuidv4 } from "uuid";
// import getGrokAPIResponse from "../utils/groqai.js";
// import auth from "../middleware/auth.js";

// const router = express.Router();

// // ─── Apply auth to ALL routes in this file ───────────────────────────────────
// router.use(auth);

// //test
// router.post("/test", async(req, res) => {
//     try {
//         const thread = new Thread({
//             threadId: "abc",
//             title: "Testing New Thread2"
//         });

//         const response = await thread.save();
//         res.send(response);
//     } catch(err) {
//         console.log(err);
//         res.status(500).json({error: "Failed to save in DB"});
//     }
// });

// //Get all threads
// // router.get("/thread", async(req, res) => {
// //     try {
// //         const threads = await Thread.find({}).sort({updatedAt: -1});
// //         //descending order of updatedAt...most recent data on top
// //         res.json(threads);
// //     } catch(err) {
// //         console.log(err);
// //         res.status(500).json({error: "Failed to fetch threads"});
// //     }
// // });
// router.get("/thread", async (req, res) => {
//     try {
//         const threads = await Thread.find({ userId: req.user.id })  // ← scoped to user
//             .sort({ updatedAt: -1 })
//             .select("threadId title updatedAt"); // ← only send what sidebar needs
//         res.json(threads);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: "Failed to fetch threads" });
//     }
// });
// //________get single thread message____________________

// // router.get("/thread/:threadId", async(req, res) => {
// //     const {threadId} = req.params;

// //     try {
// //         const thread = await Thread.findOne({threadId});

// //         if(!thread) {
// //             return res.status(404).json({error: "Thread not found"});
// //         }

// //         res.json(thread.messages);
// //     } catch(err) {
// //         console.log(err);
// //         res.status(500).json({error: "Failed to fetch chat"});
// //     }
// // });
// router.get("/thread/:threadId", async (req, res) => {
//     const { threadId } = req.params;
//     try {
//         const thread = await Thread.findOne({
//             threadId,
//             userId: req.user.id             // ← user can only access their own thread
//         });
//         if (!thread) return res.status(404).json({ message: "Thread not found" });
//         res.json(thread.messages);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: "Could not find thread" });
//     }
// });
// //____________delete single thread_______________________

// // router.delete("/thread/:threadId", async (req, res) => {
// //     const {threadId} = req.params;

// //     try {
// //         const deletedThread = await Thread.findOneAndDelete({threadId});

// //         if(!deletedThread) {
// //             return res.status(404).json({error: "Thread not found"});
// //         }

// //         res.status(200).json({success : "Thread deleted successfully"});

// //     } catch(err) {
// //         console.log(err);
// //         res.status(500).json({error: "Failed to delete thread"});
// //     }
// // });
// router.delete("/thread/:threadId", async (req, res) => {
//     const { threadId } = req.params;
//     try {
//         const deleted = await Thread.findOneAndDelete({
//             threadId,
//             userId: req.user.id             // ← can only delete own thread
//         });
//         if (!deleted) return res.status(404).json({ message: "Thread not found" });
//         res.status(200).json({ message: "Deleted successfully" });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: "Could not delete thread" });
//     }
// });

// //_______________________chat_________________________
// // router.post("/chat", async(req, res) => {
// //     const {threadId, message} = req.body;

// //     if(!threadId || !message) {
// //         return res.status(400).json({error: "missing required fields"});
// //     }

// //     try {
// //         let thread = await Thread.findOne({threadId});

// //         if(!thread) {
// //             //create a new thread in Db
// //             thread = new Thread({
// //                  threadId: uuidv4(),
// //                 title: message,
// //                 messages: [{role: "user", content: message}]
                
// //             });
// //             console.log(threadId);
// //         } else {
// //             thread.messages.push({role: "user", content: message});
// //         }

// //         // Prepare messages for Grok API (full conversation context)
// //         const messagesForGrok = thread.messages.map(msg => ({
// //             role: msg.role,
// //             content: msg.content
// //         }));

// //         console.log("Sending to Grok:", messagesForGrok);

// //         // Get response from Grok
// //         const assistantReply = await getGrokAPIResponse(messagesForGrok);

// //         console.log("Grok Response:", assistantReply);

// //         if (!assistantReply) {
// //             throw new Error("No response received from Grok API");
// //         }

// //         // Add assistant message to thread
// //         thread.messages.push({role: "assistant", content: assistantReply});
// //         thread.updatedAt = new Date();

// //         // Save to database
// //         await thread.save();
        
// //         res.json({reply: assistantReply, threadId: thread.threadId});

// //     } catch(err) {
// //         console.error("Chat error:", err);
// //         res.status(500).json({error: err.message || "something went wrong"});
// //     }
// // });

// // export default router;

// router.post("/chat", async (req, res) => {
//     const { threadId, message } = req.body;
// console.log(req.body);
//     if (!threadId || !message) {
//         return res.status(400).json({ message: "ThreadId and message are required" });
//     }

//     try {
//         let thread = await Thread.findOne({ threadId, userId: req.user.id });

//         if (!thread) {
//             thread = new Thread({
//                 threadId,
//                 userId: req.user.id,        // ← attach owner on creation
//                 title: message.slice(0, 40), // ← use first 40 chars as title
//                 messages: [{ role: "user", content: message }]
//             });
//         } else {
//             thread.messages.push({ role: "user", content: message });
//         }
//         // Prepare messages for Grok API (full conversation context)
//         const messagesForGrok = thread.messages.map(msg => ({
//             role: msg.role,
//             content: msg.content
//         }));
//         console.log("Sending to Grok:", messagesForGrok);

//         const assistantReply = await getGrokAPIResponse(messagesForGrok);
//         console.log("Grok Response:", assistantReply);

//         if (!assistantReply) {
//             throw new Error("No response received from Grok API");
//         }

//         // Add assistant message to thread
//         thread.messages.push({role: "assistant", content: assistantReply});
//         thread.updatedAt = new Date();

//         // Save to database
//         await thread.save();
        
//          res.json({reply: assistantReply, threadId: thread.threadId});

//     } catch(err) {
//         console.error("Chat error:", err);
//         res.status(500).json({error: err.message || "something went wrong"});
//     }
// });
// export default router;
import express from "express";
import Thread from "../models/Thread.js";
import Chunk from "../models/Chunk.js";
import { v4 as uuidv4 } from "uuid";
import getGrokAPIResponse from "../utils/groqai.js";
import { retrieveContext } from "../utils/retrieval.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// ─── Apply auth to ALL routes in this file ───────────────────────────────────
router.use(auth);

//test
router.post("/test", async(req, res) => {
    try {
        const thread = new Thread({
            threadId: "abc",
            title: "Testing New Thread2"
        });

        const response = await thread.save();
        res.send(response);
    } catch(err) {
        console.log(err);
        res.status(500).json({error: "Failed to save in DB"});
    }
});

//Get all threads
// router.get("/thread", async(req, res) => {
//     try {
//         const threads = await Thread.find({}).sort({updatedAt: -1});
//         //descending order of updatedAt...most recent data on top
//         res.json(threads);
//     } catch(err) {
//         console.log(err);
//         res.status(500).json({error: "Failed to fetch threads"});
//     }
// });
router.get("/thread", async (req, res) => {
    try {
        const threads = await Thread.find({ userId: req.user.id })  // ← scoped to user
            .sort({ updatedAt: -1 })
            .select("threadId title updatedAt"); // ← only send what sidebar needs
        res.json(threads);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch threads" });
    }
});
//________get single thread message____________________

// router.get("/thread/:threadId", async(req, res) => {
//     const {threadId} = req.params;

//     try {
//         const thread = await Thread.findOne({threadId});

//         if(!thread) {
//             return res.status(404).json({error: "Thread not found"});
//         }

//         res.json(thread.messages);
//     } catch(err) {
//         console.log(err);
//         res.status(500).json({error: "Failed to fetch chat"});
//     }
// });
router.get("/thread/:threadId", async (req, res) => {
    const { threadId } = req.params;
    try {
        const thread = await Thread.findOne({
            threadId,
            userId: req.user.id             // ← user can only access their own thread
        });
        if (!thread) return res.status(404).json({ message: "Thread not found" });
        res.json(thread.messages);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Could not find thread" });
    }
});
//____________delete single thread_______________________

// router.delete("/thread/:threadId", async (req, res) => {
//     const {threadId} = req.params;

//     try {
//         const deletedThread = await Thread.findOneAndDelete({threadId});

//         if(!deletedThread) {
//             return res.status(404).json({error: "Thread not found"});
//         }

//         res.status(200).json({success : "Thread deleted successfully"});

//     } catch(err) {
//         console.log(err);
//         res.status(500).json({error: "Failed to delete thread"});
//     }
// });
router.delete("/thread/:threadId", async (req, res) => {
    const { threadId } = req.params;
    try {
        const deleted = await Thread.findOneAndDelete({
            threadId,
            userId: req.user.id             // ← can only delete own thread
        });
        if (!deleted) return res.status(404).json({ message: "Thread not found" });
        await Chunk.deleteMany({ threadId, userId: req.user.id }); // ← drop indexed chunks too
        res.status(200).json({ message: "Deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Could not delete thread" });
    }
});

//_______________________chat_________________________
// router.post("/chat", async(req, res) => {
//     const {threadId, message} = req.body;

//     if(!threadId || !message) {
//         return res.status(400).json({error: "missing required fields"});
//     }

//     try {
//         let thread = await Thread.findOne({threadId});

//         if(!thread) {
//             //create a new thread in Db
//             thread = new Thread({
//                  threadId: uuidv4(),
//                 title: message,
//                 messages: [{role: "user", content: message}]
                
//             });
//             console.log(threadId);
//         } else {
//             thread.messages.push({role: "user", content: message});
//         }

//         // Prepare messages for Grok API (full conversation context)
//         const messagesForGrok = thread.messages.map(msg => ({
//             role: msg.role,
//             content: msg.content
//         }));

//         console.log("Sending to Grok:", messagesForGrok);

//         // Get response from Grok
//         const assistantReply = await getGrokAPIResponse(messagesForGrok);

//         console.log("Grok Response:", assistantReply);

//         if (!assistantReply) {
//             throw new Error("No response received from Grok API");
//         }

//         // Add assistant message to thread
//         thread.messages.push({role: "assistant", content: assistantReply});
//         thread.updatedAt = new Date();

//         // Save to database
//         await thread.save();
        
//         res.json({reply: assistantReply, threadId: thread.threadId});

//     } catch(err) {
//         console.error("Chat error:", err);
//         res.status(500).json({error: err.message || "something went wrong"});
//     }
// });

// export default router;

router.post("/chat", async (req, res) => {
    const { threadId, message } = req.body;
console.log(req.body);
    if (!threadId || !message) {
        return res.status(400).json({ message: "ThreadId and message are required" });
    }

    try {
        let thread = await Thread.findOne({ threadId, userId: req.user.id });

        if (!thread) {
            thread = new Thread({
                threadId,
                userId: req.user.id,        // ← attach owner on creation
                title: message.slice(0, 40), // ← use first 40 chars as title
                messages: [{ role: "user", content: message }]
            });
        } else {
            thread.messages.push({ role: "user", content: message });
        }

        // RAG: only bother retrieving if this thread has indexed documents
        let retrievedChunks = [];
        if (thread.documents?.length) {
            retrievedChunks = await retrieveContext(threadId, message);
        }

        // Prepare messages for Grok API (full conversation context)
        const messagesForGrok = thread.messages.map(msg => ({
            role: msg.role,
            content: msg.content
        }));

        if (retrievedChunks.length) {
            const context = retrievedChunks
                .map((c, i) => `[${i + 1}] (${c.documentName}) ${c.text}`)
                .join("\n\n");

            messagesForGrok.unshift({
                role: "system",
                content: `Answer using the following context from the user's uploaded documents when it's relevant. Cite sources inline as [1], [2] etc. If the context doesn't contain the answer, say so and answer from general knowledge instead.\n\nContext:\n${context}`
            });
        }

        console.log("Sending to Grok:", messagesForGrok);

        const assistantReply = await getGrokAPIResponse(messagesForGrok);
        console.log("Grok Response:", assistantReply);

        if (!assistantReply) {
            throw new Error("No response received from Grok API");
        }

        // Add assistant message to thread
        thread.messages.push({role: "assistant", content: assistantReply});
        thread.updatedAt = new Date();

        // Save to database
        await thread.save();

        res.json({
            reply: assistantReply,
            threadId: thread.threadId,
            sources: [...new Set(retrievedChunks.map(c => c.documentName))]
        });

    } catch(err) {
        console.error("Chat error:", err);
        res.status(500).json({error: err.message || "something went wrong"});
    }
});
export default router;