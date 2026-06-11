import { useState } from "react";
import { useAuth } from "./AuthContext";
import "./Auth.css";
import logo from "./assets/blacklogo.png";


function Register({ onSwitch }) {
    const { login } = useAuth();
    const [username, setUsername] = useState("");
    const [email, setEmail]       = useState("");
    const [password, setPassword] = useState("");
    const [error, setError]       = useState(null);
    const [loading, setLoading]   = useState(false);

    const handleSubmit = async () => {
        if (!username || !email || !password) return setError("All fields are required");
        setLoading(true);
        setError(null);

        try {
            const res = await fetch("http://localhost:8080/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password })
            });

            const data = await res.json();
            if (!res.ok) return setError(data.message);

            login(data.token, data.user);
        } catch (err) {
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="authPage">
            <div className="authBox">
                <h2>Create account</h2>
                {error && <p className="authError">{error}</p>}
                <input
                    placeholder="Username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
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
                    {loading ? "Creating account..." : "Register"}
                </button>
                <p className="authSwitch">
                    Have an account? <span onClick={onSwitch}>Log in</span>
                </p>
            </div>
        </div>
    );
}

export default Register;