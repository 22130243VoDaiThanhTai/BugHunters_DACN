import React, { useEffect, useMemo, useState } from "react";
import "../styles/EmployeeDashboard.css";

type NavItem = { id: string; label: string; icon: React.ReactNode };

type User = {
    id: number;
    fullName: string;
    department: string;
    position: string;
    role: "EMPLOYEE" | "MANAGER";
};

type LeaveBalance = {
    totalDays: number;
    usedDays: number;
    remainingDays: number;
};

type LeaveRequest = {
    id: number;
    startDate: string;
    endDate: string;
    totalDays: number;
    reason: string;
    status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
};

type DashboardApiResponse = {
    success: boolean;
    message: string;
    user: User;
    leaveBalance: LeaveBalance;
    pendingCount: number;
    recentRequests: LeaveRequest[];
};

type EmployeeDashboardProps = {
    userEmail: string;
    onLogout?: () => void;
    onNavigateToSubmit?: () => void;
    onNavigateToPending?: () => void;
    onNavigateToHistory?: () => void;
};

const API_URL = "http://localhost:8080/api/leave/dashboard";
const TEAM_AVATARS = ["#4F8EF7", "#F7A24F", "#4FCF8E", "#CF4F8E", "#8E4FCF"];
const teamAvailablePercent = 82;
const teamTotalCount = 13;

const formatDateRange = (start: string, end: string): string => {
    const s = new Date(start);
    const e = new Date(end);

    if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) {
        return "Invalid date";
    }

    const fmt = (d: Date) =>
        d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
    return `${fmt(s)} – ${fmt(e)}`;
};

const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

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

const NAV_ITEMS: NavItem[] = [
    { id: "dashboard", label: "Dashboard", icon: <IconDashboard /> },
    { id: "submit", label: "Submit Request", icon: <IconRequest /> },
    { id: "history", label: "History", icon: <IconHistory /> },
    { id: "pending", label: "Pending Requests", icon: <IconPending /> },
];

const StatusBadge = ({ status }: { status: LeaveRequest["status"] }) => (
    <span className={`status-badge status-badge--${status.toLowerCase()}`}>
        {capitalize(status)}
    </span>
);

const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({ userEmail, onLogout, onNavigateToSubmit, onNavigateToPending, onNavigateToHistory }) => {
    const [activeNav, setActiveNav] = useState("dashboard");
    const [dashboardData, setDashboardData] = useState<DashboardApiResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");

    const loadDashboard = async () => {
        if (!userEmail) {
            setError("Missing logged in user.");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await fetch(`${API_URL}?email=${encodeURIComponent(userEmail)}`);
            const data = await response.json();

            if (!response.ok || !data.success) {
                setError(data.message || "Cannot load dashboard data");
                setDashboardData(null);
                return;
            }

            setDashboardData(data as DashboardApiResponse);
        } catch (fetchError) {
            setError("Cannot connect to backend server");
            setDashboardData(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboard();
    }, [userEmail]);

    const user = dashboardData?.user;
    const leaveBalance = dashboardData?.leaveBalance;
    const leaveRequests = dashboardData?.recentRequests ?? [];
    const pendingCount = dashboardData?.pendingCount ?? 0;

    const initials = useMemo(() => {
        const fullName = user?.fullName || "User";
        return fullName
            .split(" ")
            .filter(Boolean)
            .map((word) => word[0])
            .slice(0, 2)
            .join("")
            .toUpperCase();
    }, [user?.fullName]);

    const handleNavClick = (itemId: string) => {
        if (itemId === "pending" && user?.role !== "MANAGER") {
            alert("Vui lòng đăng nhập tài khoản MANAGER để truy cập");
            return;
        }

        setActiveNav(itemId);

        if (itemId === "submit") {
            onNavigateToSubmit?.();
        } else if (itemId === "pending") {
            onNavigateToPending?.();
        } else if (itemId === "history") {
            onNavigateToHistory?.();
        }
    };

    // Filter nav items based on user role
    const filteredNavItems = useMemo(() => {
        return NAV_ITEMS.filter((item) => {
            if (item.id === "pending") {
                return user?.role === "MANAGER";
            }
            return true;
        });
    }, [user?.role]);

    if (loading) {
        return <div className="ed-root">Loading dashboard...</div>;
    }

    return (
        <div className="ed-root">
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
                    {filteredNavItems.map((item) => (
                        <button
                            key={item.id}
                            className={`ed-nav__btn${activeNav === item.id ? " ed-nav__btn--active" : ""}`}
                            onClick={() => handleNavClick(item.id)}
                        >
                            <span className="ed-nav__icon">{item.icon}</span>
                            {item.label}
                        </button>
                    ))}
                </nav>

                {user?.role === "MANAGER" && (
                    <div className="ed-manager-badge">
                        <div className="ed-manager-badge__title">Manager Access</div>
                        <p className="ed-manager-badge__desc">
                            You have administrative privileges for the {user.department || "your"} team.
                        </p>
                    </div>
                )}
            </aside>

            <main className="ed-main">
                <header className="ed-topbar">
                    <h2 className="ed-topbar__title">Dashboard</h2>
                    <div className="ed-topbar__user">
                        <div className="ed-topbar__user-info">
                            <span className="ed-topbar__user-name">{user?.fullName || "Employee"}</span>
                            <span className="ed-topbar__user-role">{capitalize(user?.role || "employee")}</span>
                        </div>
                        <div className="ed-avatar ed-avatar--header">{initials}</div>
                        <button className="ed-logout-btn" onClick={onLogout}>
                            <IconLogout /> Logout
                        </button>
                    </div>
                </header>

                <div className="ed-content">
                    <div className="ed-left">
                        {error && (
                            <div className="ed-table-card" style={{ marginBottom: 16 }}>
                                <span>{error}</span>
                                <button className="ed-link-btn" onClick={loadDashboard}>Retry</button>
                            </div>
                        )}

                        <div className="ed-hero">
                            <div className="ed-hero__left">
                                <div className="ed-emp-avatar">{initials}</div>
                                <div>
                                    <div className="ed-hero__name">{user?.fullName || "Employee"}</div>
                                    <div className="ed-hero__role">{user?.position || "Staff"}</div>
                                    <div className="ed-hero__dept">{(user?.department || "Operations").toUpperCase()} DEPT</div>
                                    {user?.role === "MANAGER" && <span className="ed-manager-tag">MANAGER</span>}
                                </div>
                            </div>

                            {user?.role === "MANAGER" && (
                                <div className="ed-pending-banner">
                                    <div className="ed-pending-banner__label">Pending Actions</div>
                                    <div className="ed-pending-banner__title">You have {pendingCount} pending requests</div>
                                    <div className="ed-pending-banner__desc">Review your team's upcoming leave schedule.</div>
                                    <button className="ed-review-btn">Review All</button>
                                </div>
                            )}
                        </div>

                        <div className="ed-stats">
                            {[
                                { label: "TOTAL ENTITLEMENT", value: leaveBalance?.totalDays ?? 0, sub: "Total Days" },
                                { label: "CONSUMED", value: leaveBalance?.usedDays ?? 0, sub: "Used Days" },
                                { label: "AVAILABLE", value: leaveBalance?.remainingDays ?? 0, sub: "Remaining Days" },
                            ].map((stat) => (
                                <div key={stat.label} className="ed-stat-card">
                                    <span className="ed-stat-card__icon">
                                        <IconCalendar />
                                    </span>
                                    <div className="ed-stat-card__label">{stat.label}</div>
                                    <div className="ed-stat-card__value">{stat.value}</div>
                                    <div className="ed-stat-card__sub">{stat.sub}</div>
                                </div>
                            ))}
                        </div>

                        <div className="ed-table-card">
                            <div className="ed-table-card__header">
                                <span className="ed-table-card__title">Recent Leave Requests</span>
                                <button className="ed-link-btn">View Full History</button>
                            </div>
                            <table className="ed-table">
                                <thead>
                                <tr>
                                    {["DATES", "REASON", "DURATION", "STATUS"].map((header) => (
                                        <th key={header} className="ed-table__th">{header}</th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody>
                                {leaveRequests.length === 0 ? (
                                    <tr className="ed-table__row">
                                        <td className="ed-table__td" colSpan={4}>No leave requests yet.</td>
                                    </tr>
                                ) : (
                                    leaveRequests.map((request) => (
                                        <tr key={request.id} className="ed-table__row">
                                            <td className="ed-table__td">{formatDateRange(request.startDate, request.endDate)}</td>
                                            <td className="ed-table__td">{request.reason || "No reason"}</td>
                                            <td className="ed-table__td">{request.totalDays} Days</td>
                                            <td className="ed-table__td">
                                                <StatusBadge status={request.status} />
                                            </td>
                                        </tr>
                                    ))
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="ed-right">
                        <div className="ed-new-request">
                            <div className="ed-new-request__circle">
                                <IconPlus />
                            </div>
                            <div className="ed-new-request__title">Need a break?</div>
                            <p className="ed-new-request__desc">Submit your next leave request in seconds.</p>
                            <button className="ed-new-request__btn" onClick={onNavigateToSubmit}>New Request</button>
                        </div>

                        <div className="ed-pulse">
                            <div className="ed-pulse__title">TEAM AVAILABILITY PULSE</div>
                            <div className="ed-pulse__bar">
                                <div className="ed-pulse__fill" style={{ width: `${teamAvailablePercent}%` }} />
                            </div>
                            <div className="ed-pulse__row">
                                <div className="ed-pulse__avatars">
                                    {TEAM_AVATARS.map((color, index) => (
                                        <div
                                            key={color}
                                            className="ed-team-avatar"
                                            style={{
                                                background: color,
                                                marginLeft: index === 0 ? 0 : -8,
                                                zIndex: TEAM_AVATARS.length - index,
                                            }}
                                        />
                                    ))}
                                    <div className="ed-team-avatar ed-team-avatar--count" style={{ marginLeft: -8 }}>
                                        +{teamTotalCount - TEAM_AVATARS.length}
                                    </div>
                                </div>
                                <span className="ed-pulse__label">Team: {teamAvailablePercent}% Available</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default EmployeeDashboard;
