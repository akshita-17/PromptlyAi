// import './App.css';
// import Sidebar from "./Sidebar.jsx";
// import ChatWindow from "./ChatWindow.jsx";
// import {MyContext} from "./MyContext.jsx";
// import { useState } from 'react';
// import {v1 as uuidv1} from "uuid";

// function App() {
//   const [prompt, setPrompt] = useState("");
//   const [reply, setReply] = useState(null);
//   const [currThreadId, setCurrThreadId] = useState(uuidv1());
//   const [prevChats, setPrevChats] = useState([]); //stores all chats of curr threads
//   const [newChat, setNewChat] = useState(true);
//   const [allThreads, setAllThreads] = useState([]);

//   const providerValues = {
//     prompt, setPrompt,
//     reply, setReply,
//     currThreadId, setCurrThreadId,
//     newChat, setNewChat,
//     prevChats, setPrevChats,
//     allThreads, setAllThreads
//   }; 

//   return (
//     <div className='app'>
//       <MyContext.Provider value={providerValues}>
//           <Sidebar></Sidebar>
//           <ChatWindow></ChatWindow>
//         </MyContext.Provider>
//     </div>
//   )
// }

// export default App
import './App.css';
import Sidebar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import Login from "./Login.jsx";
import Register from "./Register.jsx";
import { MyContext } from "./MyContext.jsx";
import { AuthProvider, useAuth } from "./AuthContext.jsx";
import { useState, useCallback } from 'react';
import { v1 as uuidv1 } from "uuid";

// ─── Inner app — only renders when authenticated ──────────────────────────────
function AuthenticatedApp() {
    const [prompt, setPrompt]               = useState("");
    const [reply, setReply]                 = useState(null);
    const [currThreadId, setCurrThreadId]   = useState(() => uuidv1());
    const [prevChats, setPrevChats]         = useState([]);
    const [newChat, setNewChat]             = useState(true);
    const [allThreads, setAllThreads]       = useState([]);

    const resetToNewChat = useCallback(() => {
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChats([]);
        setNewChat(true);
    }, []);

    const providerValues = {
        prompt,         setPrompt,
        reply,          setReply,
        currThreadId,   setCurrThreadId,
        prevChats,      setPrevChats,
        newChat,        setNewChat,
        allThreads,     setAllThreads,
        resetToNewChat,
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

// ─── Gate — shows login/register if not authed ────────────────────────────────
function AppGate() {
    const { token } = useAuth();
    const [showLogin, setShowLogin] = useState(true);

    if (token) return <AuthenticatedApp />;

    return showLogin
        ? <Login    onSwitch={() => setShowLogin(false)} />
        : <Register onSwitch={() => setShowLogin(true)}  />;
}

export default function App() {
    return (
        <AuthProvider>
            <AppGate />
        </AuthProvider>
    );
}