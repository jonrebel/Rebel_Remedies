import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../auth/auth";

export default function LoginPage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await login(username, password);
            navigate("/tickets");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{ maxWidth: 360 }}>
            <h2>Login</h2>

            {error && <p style={{ color: "crimson" }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: ".5rem" }}>
                    <label>
                        Username<br />
                        <input value={username} onChange={(e) => setUsername(e.target.value)} />
                    </label>
                </div>

                <div style={{ marginBottom: ".5rem" }}>
                    <label>
                        Password<br />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </label>
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    );
}
