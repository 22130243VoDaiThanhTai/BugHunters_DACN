import React from "react";
import "../styles/Login.css";

const Login = () => {
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
                <div className="login-box">
                    <h2>Welcome Back</h2>
                    <p>Please enter your credentials to access the portal.</p>

                    <label>WORK EMAIL</label>
                    <input type="email" placeholder="name@company.com" />

                    <div className="password-row">
                        <label>PASSWORD</label>
                        <a href="#">Forgot password?</a>
                    </div>
                    <input type="password" placeholder="••••••••" />

                    <div className="remember">
                        <input type="checkbox" />
                        <span>Keep me signed in</span>
                    </div>

                    <button className="btn">Sign In →</button>

                    <hr />

                    <p className="footer-text">
                        Don't have an account? <a href="#">Contact HR</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;