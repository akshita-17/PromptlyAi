import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect, useRef } from "react";
import { ScaleLoader } from "react-spinners";

function ChatWindow() {
    const {
        prompt,
        setPrompt,
        reply,
        setReply,
        currThreadId,
        setCurrThreadId,
        setPrevChats,
        setNewChat
    } = useContext(MyContext);

    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const inputRef = useRef(null);         
    const dropdownRef = useRef(null);      

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    const getReply = async () => {
        const trimmed = prompt.trim();
        if (!trimmed || loading) return;   

        setLoading(true);
        setNewChat(false);

        const options = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                message: trimmed,
                ThreadId: currThreadId     
            })
        };

        try {
            const response = await fetch("http://localhost:8080/api/chat", options);

            if (!response.ok) {            
                throw new Error(`Server error: ${response.status}`);
            }

            const res = await response.json();
            setReply(res.reply);
            setCurrThreadId(res.threadId); 
        } catch (err) {
            console.error(err);
            setReply("Something went wrong. Please try again."); 
        } finally {
            setLoading(false);             
        }
    };

    
    useEffect(() => {
        if (!prompt || !reply) return;     

        setPrevChats(prevChats => [
            ...prevChats,
            { role: "user",      content: prompt },
            { role: "assistant", content: reply  }
        ]);

        setPrompt("");                   
    }, [reply]);

   
    useEffect(() => {
        if (!loading) inputRef.current?.focus();
    }, [loading]);

    const handleProfileClick = () => setIsOpen(prev => !prev);

    return (
        <div className="chatWindow">

            {/* ── Navbar ────────────────────────────────────────────────── */}
            <div className="navbar">
                <span>
                    PromptlyAI<i className="fa-solid fa-chevron-down"></i>
                </span>

                {/* Wrap icon + dropdown together so ref covers both */}
                <div className="userIconWrapper" ref={dropdownRef}>
                    <div className="userIconDiv" onClick={handleProfileClick}>
                        <span className="userIcon">
                            <i className="fa-solid fa-user"></i>
                        </span>
                    </div>

                    {/* ── Dropdown (conditionally rendered) ───────────── */}
                    {isOpen && (
                        <div className="dropDown">
                            <div className="dropDownItem">
                                <i className="fa-solid fa-gear"></i> Settings
                            </div>
                            <div className="dropDownItem">
                                <i className="fa-solid fa-cloud-arrow-up"></i> Upgrade plan
                            </div>
                            <div className="dropDownItem">
                                <i className="fa-solid fa-arrow-right-from-bracket"></i> Log out
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Chat messages ─────────────────────────────────────────── */}
            <Chat />

            {/* ── Loading spinner ───────────────────────────────────────── */}
            <ScaleLoader color="#fff" loading={loading} />

            {/* ── Input area ────────────────────────────────────────────── */}
            <div className="chatInput">
                <div className="inputBox">
                    <input
                        ref={inputRef}
                        placeholder="Ask anything"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault(); // ← prevent accidental form submit
                                getReply();
                            }
                        }}
                        disabled={loading}          // ← prevent typing while waiting
                    />
                    <div
                        id="submit"
                        onClick={getReply}
                        style={{ opacity: loading ? 0.5 : 1, cursor: loading ? "not-allowed" : "pointer" }}
                    >
                        <i className="fa-solid fa-paper-plane"></i>
                    </div>
                </div>
                <p className="info">
                    PromptlyAI can make mistakes. Check important info.
                </p>
            </div>

        </div>
    );
}

export default ChatWindow;