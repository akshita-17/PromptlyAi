import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ["user", "assistant"],
        required: true,
    },
    content: {
        type: String,
        required: true
    }
}, { 
    timestamps: { createdAt: "timeStamp", updatedAt: false }  // ← let Mongoose manage the timestamp
});

const ThreadSchema = new mongoose.Schema({
    ThreadId: {
        type: String,
        required: true,
        unique: true,
        index: true       // ← index for faster lookups since you query by ThreadId often
    },
    title: {
        type: String,
        default: "New Chat",
    },
    messages: [MessageSchema],

}, { 
    timestamps: true      // ← replaces manual createdAt/updatedAt, auto-updates on save
});

export default mongoose.model("Thread", ThreadSchema);