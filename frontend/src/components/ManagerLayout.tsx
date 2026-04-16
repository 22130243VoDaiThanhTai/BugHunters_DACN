import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/ManagerDashboard.css";

type ManagerLayoutProps = {
    children: React.ReactNode;
    managerName: string;
    pendingCount?: number;
    unreadCount?: number;
    onLogout: () => void;
    pageTitle?: string;
    pageSubtitle?: string;
    onNotificationClick?: () => void;
};

const ManagerLayout: React.FC<ManagerLayoutProps> = ({
    children,
    managerName,
    pendingCount = 0,
    unreadCount = 0,
    onLogout,
    pageTitle = "Manager Dashboard",
    pageSubtitle,
    onNotificationClick,
}) => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div className="dashboard-container">
            {/* SIDEBAR */}
            <aside className="sidebar">
                <div className="logo-section">
                    <div className="logo-icon-box">
                        <div className="logo-dot"></div>
                        <div className="logo-dot"></div>
                        <div className="logo-dot"></div>
                        <div className="logo-dot"></div>
                    </div>
                    <div className="logo-text">
                        <h1>Ethereal</h1>
                        <p>WORKPLACE</p>
                    </div>
                </div>

                <nav className="menu">
                    <button
                        type="button"
                        className={`menu-item${location.pathname === "/dashboard" ? " active" : ""}`}
                        onClick={() => navigate("/dashboard")}
                    >
                        <span className="icon">⊞</span> Dashboard
                    </button>
                    <button
                        type="button"
                        className={`menu-item${location.pathname.startsWith("/pending") ? " active" : ""}`}
                        onClick={() => navigate("/pending")}
                    >
                        <span className="icon">◷</span> Pending Requests
                    </button>
                </nav>

                <div className="sidebar-footer">
                    <div className="user-info-mini">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(managerName)}`} alt="Avatar" />
                        <div className="user-text">
                            <p className="user-name">{managerName}</p>
                            <p className="user-role">Department Manager</p>
                        </div>
                    </div>
                    <button className="settings-btn" onClick={onLogout}>Logout</button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="main-content">
                <header className="header">
                    <div className="header-left">
                        <h2>{pageTitle}</h2>
                        <p>{pageSubtitle || `Welcome back, ${managerName}. Here's your overview.`}</p>
                    </div>
                    <div className="header-right">
                        {pendingCount > 0 && (
                            <div className="pending-badge">{pendingCount} pending</div>
                        )}
                        <div className="system-online">
                            <span className="online-dot"></span> System Online
                        </div>
                        {onNotificationClick && (
                            <button className="notif-btn" onClick={onNotificationClick}>
                                🔔
                                {unreadCount > 0 && <span className="notif-count">{unreadCount}</span>}
                            </button>
                        )}
                        <button className="manager-btn" onClick={onLogout}>Manager ⮞</button>
                    </div>
                </header>

                {children}
            </main>
        </div>
    );
};

export default ManagerLayout;
