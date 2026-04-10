import React, { useEffect, useState } from "react";
import "../styles/PendingRequests.css";

type PendingLeaveRequestDto = {
    id: number;
    userId: number;
    userFullName: string;
    userRole: string;
    userPosition: string;
    startDate: string;
    endDate: string;
    totalDays: number;
    reason: string;
    status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
    createdAt: string;
};

type ApiResponse = {
    success: boolean;
    message: string;
    data: PendingLeaveRequestDto[];
};

type PendingRequestsPageProps = {
    userEmail: string;
    onBackToDashboard: () => void;
    onNavigateToHistory?: () => void;
    onNavigateToSubmit?: () => void;
};

const API_URL = "http://localhost:8080/api/admin/pending-requests";
const DEFAULT_AVATARS = ["#ffc107", "#03a9f4", "#4caf50", "#e91e63", "#9c27b0"];

const formatDateRange = (start: string, end: string): string => {
    const s = new Date(start);
    const e = new Date(end);
    if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return "Invalid date";
    const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const eYear = e.getFullYear() !== new Date().getFullYear() ? `, ${e.getFullYear()}` : '';
    return `${fmt(s)} - ${fmt(e)}${eYear}`;
};

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
const IconX = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);
const IconLogout = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
);

const PendingRequestsPage: React.FC<PendingRequestsPageProps> = ({ userEmail, onBackToDashboard, onNavigateToHistory, onNavigateToSubmit }) => {
    const [requests, setRequests] = useState<PendingLeaveRequestDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadRequests = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await fetch(`${API_URL}?email=${encodeURIComponent(userEmail)}`);
            const data: ApiResponse = await res.json();
            if (res.ok && data.success) {
                setRequests(data.data || []);
            } else {
                setError(data.message || "Failed to load requests");
            }
        } catch (e) {
            setError("Cannot connect to server");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userEmail) {
            loadRequests();
        }
    }, [userEmail]);

    const getInitials = (name: string) => {
        return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
    };

    const getAvatarColor = (id: number) => {
        return DEFAULT_AVATARS[id % DEFAULT_AVATARS.length];
    };

    const handleAction = async (id: number, action: 'approve' | 'reject') => {
        try {
            const res = await fetch(
                `http://localhost:8080/api/admin/requests/${id}/status?email=${userEmail}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        status: action === "approve" ? "APPROVED" : "REJECTED"
                    })
                }
            );

            const data = await res.json();

            if (data.success) {
                alert("Cập nhật thành công ");
                loadRequests(); // reload lại list
            } else {
                alert(data.message);
            }

        } catch (err) {
            alert("Lỗi server ");
        }
    };


    return (
        <div className="pr-root">
            {/* Sidebar matching ED */}
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
                    <button className="ed-nav__btn" onClick={onBackToDashboard}>
                        <span className="ed-nav__icon"><IconDashboard /></span> Dashboard
                    </button>
                    <button className="ed-nav__btn" onClick={onNavigateToSubmit}>
                        <span className="ed-nav__icon"><IconRequest /></span> Submit Request
                    </button>
                    <button className="ed-nav__btn" onClick={onNavigateToHistory}>
                        <span className="ed-nav__icon"><IconHistory /></span> History
                    </button>
                    <button className="ed-nav__btn ed-nav__btn--active">
                        <span className="ed-nav__icon"><IconPending /></span> Pending Requests
                    </button>
                </nav>

                <div className="ed-manager-badge">
                    <div className="ed-manager-badge__title">Manager Access</div>
                    <p className="ed-manager-badge__desc">You have administrative privileges for your team.</p>
                </div>
            </aside>

            {/* Main Content */}
            <main className="pr-main">
                <header className="pr-topbar">
                    <div className="pr-topbar__nav">
                        <button className="pr-topbar__nav-btn">Home</button>
                        <button className="pr-topbar__nav-btn pr-topbar__nav-btn--active">Requests</button>
                        <button className="pr-topbar__nav-btn">Reports</button>
                    </div>
                    
                    <div className="pr-topbar__right">
                        <div className="pr-search">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                            <input type="text" placeholder="Search workflow..." />
                        </div>
                        <button className="pr-icon-btn">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                            </svg>
                        </button>
                        <button className="pr-icon-btn">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="3" />
                                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                            </svg>
                        </button>
                        <div className="pr-topbar__avatar">M</div>
                    </div>
                </header>

                <div className="pr-content">
                    <div className="pr-header">
                        <h1 className="pr-title">Pending Leave Requests</h1>
                        <p className="pr-subtitle">Review and manage your team's upcoming absences.</p>
                        
                        <div className="pr-filter">
                            <span className="pr-filter__icon">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                                </svg>
                            </span>
                            <span>All Types</span>
                            <span className="pr-filter__down">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="6 9 12 15 18 9" />
                                </svg>
                            </span>
                        </div>
                    </div>

                    <div className="pr-metrics">
                        <div className="pr-metric-card">
                            <div className="pr-metric-label">TOTAL PENDING</div>
                            <div className="pr-metric-val pr-metric-val--blue">{requests.length}</div>
                            <div className="pr-metric-bar">
                                <div className="pr-metric-bar__fill pr-metric-bar__fill--blue" style={{ width: "30%" }}></div>
                            </div>
                        </div>
                        <div className="pr-metric-card">
                            <div className="pr-metric-label">TEAM CAPACITY</div>
                            <div className="pr-metric-val pr-metric-val--grey">84%</div>
                            <div className="pr-metric-bar">
                                <div className="pr-metric-bar__fill pr-metric-bar__fill--grey" style={{ width: "84%" }}></div>
                            </div>
                        </div>
                        <div className="pr-metric-card">
                            <div className="pr-metric-label">NEXT ABSENCE</div>
                            <div className="pr-metric-text">Tomorrow</div>
                            <div className="pr-metric-subtext">Sarah Jenkins (Vacation)</div>
                        </div>
                    </div>

                    <div className="pr-table-card">
                        <table className="pr-table">
                            <thead>
                                <tr>
                                    <th>EMPLOYEE</th>
                                    <th>DATES & DURATION</th>
                                    <th>REASON</th>
                                    <th>ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading && (
                                    <tr><td colSpan={4} style={{ textAlign: 'center', padding: '20px' }}>Loading...</td></tr>
                                )}
                                {error && (
                                    <tr><td colSpan={4} style={{ textAlign: 'center', padding: '20px', color: 'red' }}>{error}</td></tr>
                                )}
                                {!loading && !error && requests.length === 0 && (
                                    <tr><td colSpan={4} style={{ textAlign: 'center', padding: '40px' }}>No pending requests</td></tr>
                                )}
                                {requests.map(req => (
                                    <tr key={req.id}>
                                        <td>
                                            <div className="pr-emp">
                                                <div className="pr-emp__avatar" style={{ background: getAvatarColor(req.userId) }}>
                                                    {getInitials(req.userFullName)}
                                                </div>
                                                <div className="pr-emp__info">
                                                    <div className="pr-emp__name">{req.userFullName}</div>
                                                    <div className="pr-emp__role">{req.userPosition || req.userRole}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="pr-duration">
                                                <div className="pr-duration__dates">{formatDateRange(req.startDate, req.endDate)}</div>
                                                <div className="pr-duration__days">{req.totalDays} Days</div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="pr-reason">
                                                <div className="pr-reason__text">{req.reason || "No reason provided"}</div>
                                                <span className="pr-reason__badge">PENDING</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="pr-actions">
                                                <button className="pr-btn-reject" onClick={() => handleAction(req.id, 'reject')}>
                                                    <IconX />
                                                </button>
                                                <button className="pr-btn-approve" onClick={() => handleAction(req.id, 'approve')}>
                                                    Approve
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        
                        {!loading && requests.length > 0 && (
                            <div className="pr-loadmore">
                                <button className="pr-loadmore-btn">Load more requests</button>
                            </div>
                        )}
                    </div>

                    <div className="pr-pulse">
                        <div className="pr-pulse-header">
                            <span className="pr-pulse-title">TEAM PULSE</span>
                            <span className="pr-pulse-dot">•</span>
                            <span className="pr-pulse-subtitle">NEXT 7 DAYS</span>
                        </div>
                        <div className="pr-timeline">
                            {/* Visual representation of timeline blocks */}
                            <div className="pr-timeline-blocks">
                                <div className="pr-timeline-block pr-timeline-block--grey"></div>
                                <div className="pr-timeline-block pr-timeline-block--grey"></div>
                                <div className="pr-timeline-block pr-timeline-block--blue">
                                    <span className="pr-timeline-label">WED • 2 AWAY</span>
                                </div>
                                <div className="pr-timeline-block pr-timeline-block--grey"></div>
                                <div className="pr-timeline-block pr-timeline-block--grey"></div>
                                <div className="pr-timeline-block pr-timeline-block--grey"></div>
                                <div className="pr-timeline-block pr-timeline-block--grey"></div>
                            </div>
                            <div className="pr-timeline-dates">
                                <span>OCT 11</span>
                                <span>OCT 13</span>
                                <span>OCT 15</span>
                                <span>OCT 17</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PendingRequestsPage;
