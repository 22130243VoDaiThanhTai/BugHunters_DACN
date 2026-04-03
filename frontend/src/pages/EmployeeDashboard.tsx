import React, { useState } from "react";
import "../styles/EmployeeDashboard.css";

// ── Types (map từ SQL schema) ───────────────────────────────────────────────
type NavItem = { id: string; label: string; icon: React.ReactNode };

// users table
type User = {
    id: number;
    full_name: string;
    department: string;
    position: string;
    role: "EMPLOYEE" | "MANAGER";
};

// leave_balance table
type LeaveBalance = {
    total_days: number;
    used_days: number;
    remaining_days: number;
};

// leave_requests table
type LeaveRequest = {
    id: number;
    start_date: string;
    end_date: string;
    total_days: number;
    reason: string;
    status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
};

// ── Fake Data (giả lập query từ DB) ────────────────────────────────────────

// SELECT id, full_name, department, position, role FROM users WHERE id = 1
const currentUser: User = {
    id: 1,
    full_name: "Alex Rivers",
    department: "Operations",
    position: "HR Specialist",
    role: "MANAGER",
};

// SELECT total_days, used_days, remaining_days FROM leave_balance WHERE user_id = 1
const leaveBalance: LeaveBalance = {
    total_days: 20,
    used_days: 10,
    remaining_days: 10,
};

// SELECT id, start_date, end_date, total_days, reason, status
// FROM leave_requests WHERE user_id = 1 ORDER BY created_at DESC LIMIT 3
const leaveRequests: LeaveRequest[] = [
    {
        id: 101,
        start_date: "2023-10-12",
        end_date: "2023-10-15",
        total_days: 3,
        reason: "Annual Leave",
        status: "APPROVED",
    },
    {
        id: 98,
        start_date: "2023-09-01",
        end_date: "2023-09-05",
        total_days: 5,
        reason: "Vacation",
        status: "APPROVED",
    },
    {
        id: 95,
        start_date: "2023-08-15",
        end_date: "2023-08-16",
        total_days: 2,
        reason: "Sick Leave",
        status: "REJECTED",
    },
];

// SELECT COUNT(*) FROM leave_requests WHERE status = 'PENDING' (manager view)
const pendingCount = 12;

// Fake team members (SELECT id FROM users WHERE department = currentUser.department LIMIT 5)
const TEAM_AVATARS = ["#4F8EF7", "#F7A24F", "#4FCF8E", "#CF4F8E", "#8E4FCF"];
const teamAvailablePercent = 82;
const teamTotalCount = 13; // tổng team

// ── Helpers ────────────────────────────────────────────────────────────────
const formatDateRange = (start: string, end: string): string => {
    const s = new Date(start);
    const e = new Date(end);
    const fmt = (d: Date) =>
        d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
    return `${fmt(s)} – ${fmt(e)}`;
};

const capitalize = (s: string) =>
    s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

// ── Icons ──────────────────────────────────────────────────────────────────
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
const IconPending = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="9" y1="13" x2="15" y2="13" />
    </svg>
);
const IconCalendar = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);
const IconLogout = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
);
const IconPlus = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

// ── Nav ────────────────────────────────────────────────────────────────────
const NAV_ITEMS: NavItem[] = [
    { id: "dashboard", label: "Dashboard", icon: <IconDashboard /> },
    { id: "submit", label: "Submit Request", icon: <IconRequest /> },
    { id: "history", label: "History", icon: <IconHistory /> },
    { id: "pending", label: "Pending Requests", icon: <IconPending /> },
];

// ── StatusBadge ────────────────────────────────────────────────────────────
const StatusBadge = ({ status }: { status: LeaveRequest["status"] }) => (
    <span className={`status-badge status-badge--${status.toLowerCase()}`}>
        {capitalize(status)}
    </span>
);

// ── Main Component ─────────────────────────────────────────────────────────
type EmployeeDashboardProps = {
    onLogout?: () => void;
};

const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({ onLogout }) => {
    const [activeNav, setActiveNav] = useState("dashboard");

    // Initials từ full_name
    const initials = currentUser.full_name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("");

    return (
        <div className="ed-root">
            {/* Sidebar */}
            <aside className="ed-sidebar">
                <div className="ed-logo">
                    <div className="ed-logo__icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                                stroke="white"
                                strokeWidth="2"
                            />
                        </svg>
                    </div>
                    <div>
                        <div className="ed-logo__name">Azure Horizon</div>
                        <div className="ed-logo__sub">Employee Portal</div>
                    </div>
                </div>

                <nav className="ed-nav">
                    {NAV_ITEMS.map((item) => (
                        <button
                            key={item.id}
                            className={`ed-nav__btn${activeNav === item.id ? " ed-nav__btn--active" : ""}`}
                            onClick={() => setActiveNav(item.id)}
                        >
                            <span className="ed-nav__icon">{item.icon}</span>
                            {item.label}
                        </button>
                    ))}
                </nav>

                {/* Chỉ hiện nếu role = MANAGER */}
                {currentUser.role === "MANAGER" && (
                    <div className="ed-manager-badge">
                        <div className="ed-manager-badge__title">Manager Access</div>
                        <p className="ed-manager-badge__desc">
                            You have administrative privileges for the {currentUser.department} team.
                        </p>
                    </div>
                )}
            </aside>

            {/* Main */}
            <main className="ed-main">
                <header className="ed-topbar">
                    <h2 className="ed-topbar__title">Dashboard</h2>
                    <div className="ed-topbar__user">
                        <div className="ed-topbar__user-info">
                            <span className="ed-topbar__user-name">{currentUser.full_name}</span>
                            <span className="ed-topbar__user-role">{capitalize(currentUser.role)}</span>
                        </div>
                        <div className="ed-avatar ed-avatar--header">{initials}</div>
                        <button className="ed-logout-btn" onClick={onLogout}>
                            <IconLogout /> Logout
                        </button>
                    </div>
                </header>

                <div className="ed-content">
                    {/* Left column */}
                    <div className="ed-left">
                        {/* Hero */}
                        <div className="ed-hero">
                            <div className="ed-hero__left">
                                <div className="ed-emp-avatar">{initials}</div>
                                <div>
                                    <div className="ed-hero__name">{currentUser.full_name}</div>
                                    <div className="ed-hero__role">{currentUser.position}</div>
                                    <div className="ed-hero__dept">
                                        {currentUser.department.toUpperCase()} DEPT
                                    </div>
                                    {currentUser.role === "MANAGER" && (
                                        <span className="ed-manager-tag">MANAGER</span>
                                    )}
                                </div>
                            </div>

                            {/* Chỉ hiện với MANAGER */}
                            {currentUser.role === "MANAGER" && (
                                <div className="ed-pending-banner">
                                    <div className="ed-pending-banner__label">Pending Actions</div>
                                    <div className="ed-pending-banner__title">
                                        You have {pendingCount} pending requests
                                    </div>
                                    <div className="ed-pending-banner__desc">
                                        Review your team's upcoming leave schedule.
                                    </div>
                                    <button className="ed-review-btn">Review All</button>
                                </div>
                            )}
                        </div>

                        {/* Stats — từ leave_balance */}
                        <div className="ed-stats">
                            {[
                                { label: "TOTAL ENTITLEMENT", value: leaveBalance.total_days, sub: "Total Days" },
                                { label: "CONSUMED", value: leaveBalance.used_days, sub: "Used Days" },
                                { label: "AVAILABLE", value: leaveBalance.remaining_days, sub: "Remaining Days" },
                            ].map((s) => (
                                <div key={s.label} className="ed-stat-card">
                                    <span className="ed-stat-card__icon">
                                        <IconCalendar />
                                    </span>
                                    <div className="ed-stat-card__label">{s.label}</div>
                                    <div className="ed-stat-card__value">{s.value}</div>
                                    <div className="ed-stat-card__sub">{s.sub}</div>
                                </div>
                            ))}
                        </div>

                        {/* Table — từ leave_requests */}
                        <div className="ed-table-card">
                            <div className="ed-table-card__header">
                                <span className="ed-table-card__title">Recent Leave Requests</span>
                                <button className="ed-link-btn">View Full History</button>
                            </div>
                            <table className="ed-table">
                                <thead>
                                <tr>
                                    {["DATES", "REASON", "DURATION", "STATUS"].map((h) => (
                                        <th key={h} className="ed-table__th">{h}</th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody>
                                {leaveRequests.map((req) => (
                                    <tr key={req.id} className="ed-table__row">
                                        <td className="ed-table__td">
                                            {formatDateRange(req.start_date, req.end_date)}
                                        </td>
                                        <td className="ed-table__td">{req.reason}</td>
                                        <td className="ed-table__td">{req.total_days} Days</td>
                                        <td className="ed-table__td">
                                            <StatusBadge status={req.status} />
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Right column */}
                    <div className="ed-right">
                        <div className="ed-new-request">
                            <div className="ed-new-request__circle">
                                <IconPlus />
                            </div>
                            <div className="ed-new-request__title">Need a break?</div>
                            <p className="ed-new-request__desc">
                                Submit your next leave request in seconds.
                            </p>
                            <button className="ed-new-request__btn">New Request</button>
                        </div>

                        <div className="ed-pulse">
                            <div className="ed-pulse__title">TEAM AVAILABILITY PULSE</div>
                            <div className="ed-pulse__bar">
                                <div
                                    className="ed-pulse__fill"
                                    style={{ width: `${teamAvailablePercent}%` }}
                                />
                            </div>
                            <div className="ed-pulse__row">
                                <div className="ed-pulse__avatars">
                                    {TEAM_AVATARS.map((color, i) => (
                                        <div
                                            key={i}
                                            className="ed-team-avatar"
                                            style={{
                                                background: color,
                                                marginLeft: i === 0 ? 0 : -8,
                                                zIndex: TEAM_AVATARS.length - i,
                                            }}
                                        />
                                    ))}
                                    <div
                                        className="ed-team-avatar ed-team-avatar--count"
                                        style={{ marginLeft: -8 }}
                                    >
                                        +{teamTotalCount - TEAM_AVATARS.length}
                                    </div>
                                </div>
                                <span className="ed-pulse__label">
                                    Team: {teamAvailablePercent}% Available
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default EmployeeDashboard;