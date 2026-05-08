import './App.css';
import Sidebar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import { MyContext } from "./MyContext.jsx";
import { useState, useCallback } from 'react';
import { v1 as uuidv1 } from "uuid";

function App() {
    const [prompt, setPrompt]           = useState("");
    const [reply, setReply]             = useState(null);
    const [currThreadId, setCurrThreadId] = useState(() => uuidv1()); // ← lazy init
    const [prevChats, setPrevChats]     = useState([]);
    const [newChat, setNewChat]         = useState(true);
    const [allThreads, setAllThreads]   = useState([]);

    // ─── Stable reset helper — used by both Sidebar and ChatWindow ───────────
    // useCallback ensures this function reference never changes between renders,
    // so any child that receives it won't re-render unnecessarily
    const resetToNewChat = useCallback(() => {
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChats([]);
        setNewChat(true);
    }, []);                             // ← no deps, setters are always stable

    const providerValues = {
        // ── State ──────────────────────────────────────────────────────────
        prompt,         setPrompt,
        reply,          setReply,
        currThreadId,   setCurrThreadId,
        prevChats,      setPrevChats,
        newChat,        setNewChat,
        allThreads,     setAllThreads,

        // ── Helpers ────────────────────────────────────────────────────────
        resetToNewChat,                 // ← shared across Sidebar + ChatWindow
    };

    return (
        <div className="app">
            <MyContext.Provider value={providerValues}>
                <Sidebar />
                <ChatWindow />
            </MyContext.Provider>
        </div>
    );
}

export default App;