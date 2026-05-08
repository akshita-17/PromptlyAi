import "./Sidebar.css";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "./MyContext.jsx";
import { v1 as uuidv1 } from "uuid";

function Sidebar() {
    const {
        allThreads,
        setAllThreads,
        currThreadId,
        setNewChat,
        setPrompt,
        setReply,
        setCurrThreadId,
        setPrevChats
    } = useContext(MyContext);

    const [loadingThreadId, setLoadingThreadId] = useState(null);   // ← which thread is loading
    const [deletingThreadId, setDeletingThreadId] = useState(null); // ← which thread is being deleted
    const [fetchError, setFetchError] = useState(null);             // ← sidebar-level error

    // ─── Fetch all threads on mount and when currThreadId changes ────────────
    const getAllThreads = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/thread");

            if (!response.ok) throw new Error(`Server error: ${response.status}`);

            const res = await response.json();

            // ← Capital T to match your ThreadSchema field name "ThreadId"
            const filteredData = res.map(thread => ({
                threadId: thread.ThreadId,
                title: thread.title
            }));

            setAllThreads(filteredData);
            setFetchError(null);
        } catch (err) {
            console.error(err);
            setFetchError("Failed to load threads.");
        }
    };

    useEffect(() => {
        getAllThreads();
    }, [currThreadId]);

    // ─── Create a brand new chat ──────────────────────────────────────────────
    const createNewChat = () => {
        if (loadingThreadId) return;        
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChats([]);
    };

    // ─── Switch to an existing thread ────────────────────────────────────────
    const changeThread = async (newThreadId) => {
        if (newThreadId === currThreadId) return;   
        if (loadingThreadId) return;              

        setLoadingThreadId(newThreadId);
        setReply(null);

        try {
            const response = await fetch(`http://localhost:8080/api/thread/${newThreadId}`);

            if (!response.ok) throw new Error(`Server error: ${response.status}`);

            const res = await response.json();

            setPrevChats(res);
            setCurrThreadId(newThreadId);
            setNewChat(false);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingThreadId(null);               
        }
    };

    // ─── Delete a thread ──────────────────────────────────────────────────────
    const deleteThread = async (e, threadId) => {
        e.stopPropagation();                        
        if (deletingThreadId) return;               

        setDeletingThreadId(threadId);

        try {
            const response = await fetch(`http://localhost:8080/api/thread/${threadId}`, {
                method: "DELETE"
            });

            if (!response.ok) throw new Error(`Server error: ${response.status}`);

           
            setAllThreads(prev => prev.filter(t => t.threadId !== threadId));

          
            if (threadId === currThreadId) {
                createNewChat();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setDeletingThreadId(null);              
        }
    };

    return (
        <section className="sidebar">

            {/* ── New chat button ───────────────────────────────────────── */}
            <button className="newChatBtn" onClick={createNewChat}>
                <img src="src/assets/promptlyai-icon-v2.png" alt="gpt logo" className="logo" />
                <span><i className="fa-solid fa-pen-to-square"></i></span>
            </button>

            {/* ── Error banner ──────────────────────────────────────────── */}
            {fetchError && (
                <p className="sidebarError">{fetchError}</p>
            )}

            {/* ── Thread list ───────────────────────────────────────────── */}
            <ul className="history">
                {allThreads?.length === 0 && (
                    <p className="noThreads">No chats yet</p>
                )}
                {allThreads?.map((thread, idx) => (
                    <li
                        key={thread.threadId}                   
                        onClick={() => changeThread(thread.threadId)}
                        className={thread.threadId === currThreadId ? "highlighted" : ""}
                    >
                        {/* ── Thread title with loading indicator ───────── */}
                        <span className="threadTitle">
                            {loadingThreadId === thread.threadId
                                ? <i className="fa-solid fa-spinner fa-spin"></i>
                                : thread.title
                            }
                        </span>

                        {/* ── Delete button ─────────────────────────────── */}
                        <i
                            className={`fa-solid ${deletingThreadId === thread.threadId
                                ? "fa-spinner fa-spin"
                                : "fa-trash"
                            }`}
                            onClick={(e) => deleteThread(e, thread.threadId)}
                        ></i>
                    </li>
                ))}
            </ul>

            {/* ── Footer ────────────────────────────────────────────────── */}
            <div className="sign">
                <p>By PromptlyAI ♥</p>
            </div>

        </section>
    );
}

export default Sidebar;