// import "./ChatWindow.css";
// import Chat from "./Chat.jsx";
// import { MyContext } from "./MyContext.jsx";
// import { useContext, useState, useEffect } from "react";
// import {ScaleLoader} from "react-spinners";
// import { apiFetch } from "./api.js";
// import {v1 as uuidv1} from "uuid";

// import { useAuth } from "./AuthContext.jsx";


// function ChatWindow() {
//      const { logout } = useAuth();
//     const {prompt, setPrompt, reply, setReply, currThreadId, setPrevChats, setNewChat} = useContext(MyContext);
//     const [loading, setLoading] = useState(false);
//     const [isOpen, setIsOpen] = useState(false);

//     // const getReply = async () => {
//     //     setLoading(true);
//     //     setNewChat(false);

//     //     console.log("message ", prompt, " threadId ", currThreadId);
//     //     const options = {
//     //         method: "POST",
//     //         headers: {
//     //             "Content-Type": "application/json"
//     //         },
//     //         body: JSON.stringify({
//     //             message: prompt,
//     //             threadId: currThreadId
//     //         })
//     //     };
// const getReply = async () => {
//     if(!prompt.trim()) return;  // ← don't send empty messages
    
//     setLoading(true);
//     setNewChat(false);

//     // Use a fallback if currThreadId is somehow null
//     const threadId = currThreadId || uuidv1();  // ← add this
//     console.log("message ", prompt, " threadId ", threadId);

//     const options = {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//             message: prompt,
//             threadId: threadId   // ← use local variable, not context
//         })
//     };
//     // rest stays the same...
//         try {
//            const response = await apiFetch(`/api/chat`, options);

//             const res = await response.json();
//             console.log(res);
//             setReply(res.reply);
//         } catch(err) {
//             console.log(err);
//         }
//         setLoading(false);
//     }

//     //Append new chat to prevChats
//     useEffect(() => {
//         if(prompt && reply) {
//             setPrevChats(prevChats => (
//                 [...prevChats, {
//                     role: "user",
//                     content: prompt
//                 },{
//                     role: "assistant",
//                     content: reply
//                 }]
//             ));
//         }

//         setPrompt("");
//     }, [reply]);


//     const handleProfileClick = () => {
//         setIsOpen(!isOpen);
//     }

//     return (
//         <div className="chatWindow">
//             <div className="navbar">
//                 <span>PromptlyAI <i className="fa-solid fa-chevron-down"></i></span>
//                 <div className="userIconDiv" onClick={handleProfileClick}>
//                     <span className="userIcon"><i className="fa-solid fa-user"></i></span>
//                 </div>
//             </div>
//             {
//                 isOpen && 
//                 <div className="dropDown">
//                     <div className="dropDownItem" ><i class="fa-solid fa-gear"></i> Settings</div>
//                     <div className="dropDownItem"><i class="fa-solid fa-cloud-arrow-up"></i> Upgrade plan</div>
//                     <div className="dropDownItem" onClick={logout}><i class="fa-solid fa-arrow-right-from-bracket"></i> Log out</div>
//                 </div>
//             }
//             {/* <Chat></Chat>

//             <ScaleLoader color="#fff" loading={loading}>
//             </ScaleLoader> */}
//              <div className="chatScrollArea">
//             <Chat />
//             <ScaleLoader color="#fff" loading={loading} />
//         </div>
            
//             <div className="chatInput">
//                 <div className="inputBox">
//                     <input placeholder="Ask anything"
//                         value={prompt}
//                         onChange={(e) => setPrompt(e.target.value)}
//                         onKeyDown={(e) => e.key === 'Enter'? getReply() : ''}
//                     >
                           
//                     </input>
//                     <div id="submit" onClick={getReply}><i className="fa-solid fa-paper-plane"></i></div>
//                 </div>
//                 <p className="info">
//                     PromptlyAI can make mistakes. Check important info. See Cookie Preferences.
//                 </p>
//             </div>
//         </div>
//     )
// }

// export default ChatWindow;
import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect, useRef } from "react";
import {ScaleLoader} from "react-spinners";
import { apiFetch } from "./api.js";
import {v1 as uuidv1} from "uuid";

import { useAuth } from "./AuthContext.jsx";


function ChatWindow() {
     const { logout } = useAuth();
    const {prompt, setPrompt, reply, setReply, currThreadId, setPrevChats, setNewChat} = useContext(MyContext);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [attachedDocs, setAttachedDocs] = useState([]);
    const [sources, setSources] = useState([]);
    const fileInputRef = useRef(null);

    // Reset per-thread RAG state when switching threads / starting a new chat
    useEffect(() => {
        setAttachedDocs([]);
        setSources([]);
    }, [currThreadId]);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        setNewChat(false);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await apiFetch(`/api/thread/${currThreadId}/upload`, {
                method: "POST",
                body: formData
            });
            const res = await response.json();

            if (!response.ok) throw new Error(res.message || "Upload failed");

            setAttachedDocs(prev => [...prev, res.documentName]);
        } catch (err) {
            console.log(err);
            alert(err.message || "Failed to upload document");
        }

        setUploading(false);
        e.target.value = "";
    };

    // const getReply = async () => {
    //     setLoading(true);
    //     setNewChat(false);

    //     console.log("message ", prompt, " threadId ", currThreadId);
    //     const options = {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json"
    //         },
    //         body: JSON.stringify({
    //             message: prompt,
    //             threadId: currThreadId
    //         })
    //     };
const getReply = async () => {
    if(!prompt.trim()) return;  // ← don't send empty messages
    
    setLoading(true);
    setNewChat(false);
    setSources([]);

    // Use a fallback if currThreadId is somehow null
    const threadId = currThreadId || uuidv1();  // ← add this
    console.log("message ", prompt, " threadId ", threadId);

    const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            message: prompt,
            threadId: threadId   // ← use local variable, not context
        })
    };
    // rest stays the same...
        try {
           const response = await apiFetch(`/api/chat`, options);

            const res = await response.json();
            console.log(res);
            setReply(res.reply);
            setSources(res.sources || []);
        } catch(err) {
            console.log(err);
        }
        setLoading(false);
    }

    //Append new chat to prevChats
    useEffect(() => {
        if(prompt && reply) {
            setPrevChats(prevChats => (
                [...prevChats, {
                    role: "user",
                    content: prompt
                },{
                    role: "assistant",
                    content: reply
                }]
            ));
        }

        setPrompt("");
    }, [reply]);


    const handleProfileClick = () => {
        setIsOpen(!isOpen);
    }

    return (
        <div className="chatWindow">
            <div className="navbar">
                <span>PromptlyAI <i className="fa-solid fa-chevron-down"></i></span>
                <div className="userIconDiv" onClick={handleProfileClick}>
                    <span className="userIcon"><i className="fa-solid fa-user"></i></span>
                </div>
            </div>
            {
                isOpen && 
                <div className="dropDown">
                    <div className="dropDownItem" ><i class="fa-solid fa-gear"></i> Settings</div>
                    <div className="dropDownItem"><i class="fa-solid fa-cloud-arrow-up"></i> Upgrade plan</div>
                    <div className="dropDownItem" onClick={logout}><i class="fa-solid fa-arrow-right-from-bracket"></i> Log out</div>
                </div>
            }
            {/* <Chat></Chat>

            <ScaleLoader color="#fff" loading={loading}>
            </ScaleLoader> */}
             <div className="chatScrollArea">
            <Chat />
            <ScaleLoader color="#fff" loading={loading} />
        </div>
            
            <div className="chatInput">
                {
                    attachedDocs.length > 0 &&
                    <div className="attachedDocs">
                        {attachedDocs.map((name, idx) => (
                            <span className="docChip" key={idx}>
                                <i className="fa-solid fa-file-lines"></i> {name}
                            </span>
                        ))}
                    </div>
                }
                {
                    sources.length > 0 &&
                    <p className="sourcesNote">
                        <i className="fa-solid fa-magnifying-glass"></i> Answered using: {sources.join(", ")}
                    </p>
                }
                <div className="inputBox">
                    <input
                        type="file"
                        ref={fileInputRef}
                        accept=".pdf,.txt"
                        style={{ display: "none" }}
                        onChange={handleFileUpload}
                    />
                    <div
                        id="attach"
                        onClick={() => !uploading && fileInputRef.current.click()}
                        title="Attach a PDF or TXT file"
                    >
                        {uploading
                            ? <ScaleLoader color="#b4b4b4" height={12} width={2} />
                            : <i className="fa-solid fa-paperclip"></i>}
                    </div>
                    <input placeholder="Ask anything"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter'? getReply() : ''}
                    >
                           
                    </input>
                    <div id="submit" onClick={getReply}><i className="fa-solid fa-paper-plane"></i></div>
                </div>
                <p className="info">
                    PromptlyAI can make mistakes. Check important info. See Cookie Preferences.
                </p>
            </div>
        </div>
    )
}

export default ChatWindow;