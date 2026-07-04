// import { useState } from "react";
// import { useAuth } from "./AuthContext";
// import "./Auth.css";
// import logo from "./assets/blacklogo.png";


// function Login({ onSwitch }) {
//     const { login } = useAuth();
//     const [email, setEmail]       = useState("");
//     const [password, setPassword] = useState("");
//     const [error, setError]       = useState(null);
//     const [loading, setLoading]   = useState(false);

//     const handleSubmit = async () => {
//         if (!email || !password) return setError("All fields are required");
//         setLoading(true);
//         setError(null);

//         try {
//             const res = await fetch("http://localhost:8080/api/auth/login", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ email, password })
//             });

//             const data = await res.json();
//             if (!res.ok) return setError(data.message);

//             login(data.token, data.user);   // ← store token, redirect happens in App
//         } catch (err) {
//             setError("Something went wrong");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="authPage">
//             <div className="authBox">
//                 <h2>Welcome back</h2>
//                 {error && <p className="authError">{error}</p>}
//                 <input
//                     type="email"
//                     placeholder="Email"
//                     value={email}
//                     onChange={e => setEmail(e.target.value)}
//                 />
//                 <input
//                     type="password"
//                     placeholder="Password"
//                     value={password}
//                     onChange={e => setPassword(e.target.value)}
//                     onKeyDown={e => e.key === "Enter" && handleSubmit()}
//                 />
//                 <button onClick={handleSubmit} disabled={loading}>
//                     {loading ? "Logging in..." : "Log in"}
//                 </button>
//                 <p className="authSwitch">
//                     No account? <span onClick={onSwitch}>Register</span>
//                 </p>
//             </div>
//         </div>
//     );
// }

// export default Login;
import { useState } from "react";
import { useAuth } from "./AuthContext";
import { apiFetch } from "./api.js";
import "./Auth.css";
import logo from "./assets/blacklogo.png";


function Login({ onSwitch }) {
    const { login } = useAuth();
    const [email, setEmail]       = useState("");
    const [password, setPassword] = useState("");
    const [error, setError]       = useState(null);
    const [loading, setLoading]   = useState(false);

    const handleSubmit = async () => {
        if (!email || !password) return setError("All fields are required");
        setLoading(true);
        setError(null);

        try {
            const res = await apiFetch("/api/auth/login", {
                method: "POST",
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();
            if (!res.ok) return setError(data.message);

            login(data.token, data.user);   // ← store token, redirect happens in App
        } catch (err) {
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="authPage">
            <div className="authBox">
                <h2>Welcome back</h2>
                {error && <p className="authError">{error}</p>}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleSubmit()}
                />
                <button onClick={handleSubmit} disabled={loading}>
                    {loading ? "Logging in..." : "Log in"}
                </button>
                <p className="authSwitch">
                    No account? <span onClick={onSwitch}>Register</span>
                </p>
            </div>
        </div>
    );
}

export default Login;