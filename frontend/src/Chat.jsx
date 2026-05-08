import "./Chat.css";
import React, { useContext, useState, useEffect, useRef } from "react";
import { MyContext } from "./MyContext";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

function Chat() {
    const { newChat, prevChats, reply } = useContext(MyContext);
    const [latestReply, setLatestReply] = useState(null);
    const bottomRef = useRef(null);         // ← auto-scroll anchor

    // ─── Typing animation ────────────────────────────────────────────────────
    useEffect(() => {
        // reply is null means we loaded a previous thread, show it as-is
        if (reply === null) {
            setLatestReply(null);
            return;
        }

        // No chats yet, nothing to animate
        if (!prevChats?.length) return;

        // Split on spaces to animate word by word
        const words = reply.split(" ");
        let idx = 0;

        const interval = setInterval(() => {
            setLatestReply(words.slice(0, idx + 1).join(" "));
            idx++;
            if (idx >= words.length) clearInterval(interval);
        }, 40);

        return () => clearInterval(interval);   // ← cleanup on re-render
    }, [reply]);                                // ← only re-run when reply changes, NOT prevChats

    // ─── Auto-scroll to bottom on new message or typing ──────────────────────
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [latestReply, prevChats]);

    // ─── Separate user prompt from assistant messages ─────────────────────────
    // prevChats structure: [...history, { role:"user", content: prompt }]
    // The last item is the latest user message currently being "answered"
    // We show it separately alongside the typing animation
    const lastUserMessage = prevChats?.length > 0
        ? prevChats[prevChats.length - 1]
        : null;

    // All chats except the last user message (already answered history)
    const historyChats = prevChats?.length > 1
        ? prevChats.slice(0, -1)
        : [];

    return (
        <>
            {/* ── New chat splash ───────────────────────────────────────── */}
            {newChat && (
                <div className="newChatSplash">
                    <h1>Start a New Chat!</h1>
                </div>
            )}

            <div className="chats">

                {/* ── Rendered history (all but last user message) ─────── */}
                {historyChats.map((chat, idx) => (
                    <div
                        className={chat.role === "user" ? "userDiv" : "gptDiv"}
                        key={idx}
                    >
                        {chat.role === "user" ? (
                            <p className="userMessage">{chat.content}</p>
                        ) : (
                            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                                {chat.content}
                            </ReactMarkdown>
                        )}
                    </div>
                ))}

                {/* ── Latest user message ───────────────────────────────── */}
                {lastUserMessage?.role === "user" && (
                    <div className="userDiv">
                        <p className="userMessage">{lastUserMessage.content}</p>
                    </div>
                )}

                {/* ── Assistant reply (typing or static) ───────────────── */}
                {prevChats?.length > 0 && (
                    <div className="gptDiv">
                        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                            {latestReply !== null
                                ? latestReply                               // ← actively typing
                                : prevChats[prevChats.length - 1].content  // ← loaded from history
                            }
                        </ReactMarkdown>
                    </div>
                )}

                {/* ── Scroll anchor ─────────────────────────────────────── */}
                <div ref={bottomRef} />
            </div>
        </>
    );
}

export default Chat;