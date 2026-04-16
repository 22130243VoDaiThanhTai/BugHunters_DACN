import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/EmployeeDashboard.css";

const IconDashboard = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
);
const IconRequest = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
);
const IconHistory = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="1 4 1 10 7 10" />
        <path d="M3.51 15a9 9 0 1 0 .49-4.95" />
    </svg>
);
const IconLogout = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
);

type EmployeeLayoutProps = {
    children: React.ReactNode;
    userEmail: string;
    userName?: string;
    userRole?: string;
    onLogout: () => void;
    pageTitle?: string;
};

const EmployeeLayout: React.FC<EmployeeLayoutProps> = ({
    children,
    userEmail,
    userName,
    userRole,
    onLogout,
    pageTitle = "Dashboard",
}) => {
    const navigate = useNavigate();
    const location = useLocation();

    const initials = (userName || userEmail || "U")
        .split(" ")
        .filter(Boolean)
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    const navItems = [
        { id: "dashboard", label: "Dashboard", icon: <IconDashboard />, path: "/dashboard" },
        { id: "submit", label: "Submit Request", icon: <IconRequest />, path: "/submit" },
        { id: "history", label: "History", icon: <IconHistory />, path: "/history" },
    ];

    return (
        <div className="ed-root">
            <aside className="ed-sidebar">
                <div className="ed-logo">
                    <div className="ed-logo__icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" />
                        </svg>
                    </div>
                    <div>
                        <div className="ed-logo__name">Azure Horizon</div>
                        <div className="ed-logo__sub">Employee Portal</div>
                    </div>
                </div>

                <nav className="ed-nav">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            className={`ed-nav__btn${location.pathname === item.path ? " ed-nav__btn--active" : ""}`}
                            onClick={() => navigate(item.path)}
                        >
                            <span className="ed-nav__icon">{item.icon}</span>
                            {item.label}
                        </button>
                    ))}
                </nav>
            </aside>

            <main className="ed-main">
                <header className="ed-topbar">
                    <h2 className="ed-topbar__title">{pageTitle}</h2>
                    <div className="ed-topbar__user">
                        <div className="ed-topbar__user-info">
                            <span className="ed-topbar__user-name">{userName || userEmail}</span>
                            <span className="ed-topbar__user-role">{userRole || "Employee"}</span>
                        </div>
                        <div className="ed-avatar ed-avatar--header">{initials}</div>
                        <button className="ed-logout-btn" onClick={onLogout}>
                            <IconLogout /> Logout
                        </button>
                    </div>
                </header>

                <div className="ed-layout-content">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default EmployeeLayout;
