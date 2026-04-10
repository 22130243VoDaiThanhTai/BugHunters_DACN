import React, { FormEvent, useState, useEffect } from "react";
import "../styles/Login.css";

type LoginApiResponse = {
    success: boolean;
    message: string;
    email?: string;
    fullName?: string;
};

type LoginProps = {
    onLoginSuccess: (email: string) => void;
};

const Login = ({ onLoginSuccess }: LoginProps) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);

    // Load saved credentials on mount
    useEffect(() => {
        const savedEmail = localStorage.getItem("savedEmail");
        const savedPassword = localStorage.getItem("savedPassword");
        
        if (savedEmail) {
            setEmail(savedEmail);
            setRememberMe(true);
        }
        if (savedPassword) {
            setPassword(savedPassword);
        }
    }, []);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setMessage("");
        setIsError(false);

        try {
            const response = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data: LoginApiResponse = await response.json();

            if (!response.ok || !data.success) {
                setIsError(true);
                setMessage(data.message || "Login failed");
                return;
            }

            setMessage(`${data.message}. Welcome ${data.fullName || data.email}`);
            onLoginSuccess(data.email || email);
            
            // Save credentials only if "Keep me signed in" is checked
            if (rememberMe) {
                localStorage.setItem("savedEmail", data.email || email);
                localStorage.setItem("savedPassword", password);
            } else {
                // Clear saved credentials if unchecked
                localStorage.removeItem("savedEmail");
                localStorage.removeItem("savedPassword");
            }
            
            // Always save logged in user for session
            localStorage.setItem("loggedInUser", data.email || email);
        } catch (error) {
            setIsError(true);
            setMessage("Cannot connect to backend server");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            {/* LEFT SIDE */}
            <div className="left">
                {/* Thêm div bọc nội dung bên trái */}
                <div className="left-content">
                    <h1 className="title">Azure Horizon</h1>
                    <p className="desc">
                        The Weightless Workspace. Manage time, rest, and team energy in a
                        digital sanctuary designed for clarity.
                    </p>
                </div>
            </div>

            {/* RIGHT SIDE (Giữ nguyên code của bạn) */}
            <div className="right">
                <form className="login-box" onSubmit={handleSubmit} autoComplete="off">
                    <h2>Welcome Back</h2>
                    <p>Please enter your credentials to access the portal.</p>

                    <label>WORK EMAIL</label>
                    <input
                        type="email"
                        placeholder="name@company.com"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                    />

                    <div className="password-row">
                        <label>PASSWORD</label>
                        <a href="#">Forgot password?</a>
                    </div>
                    <input
                        type="password"
                        placeholder="••••••••"
                        autoComplete="new-password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                    />

                    <div className="remember">
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(event) => setRememberMe(event.target.checked)}
                        />
                        <span>Keep me signed in</span>
                    </div>

                    <button className="btn" type="submit" disabled={loading}>
                        {loading ? "Signing in..." : "Sign In"}
                    </button>

                    {message && (
                        <p className={isError ? "status-message error" : "status-message success"}>{message}</p>
                    )}

                    <hr />

                    <p className="footer-text">
                        Don't have an account? <a href="#">Contact HR</a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;