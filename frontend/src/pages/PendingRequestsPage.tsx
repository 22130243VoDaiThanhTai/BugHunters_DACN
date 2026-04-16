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
    onViewDetails?: (id: number, action?: 'view' | 'reject') => void;
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

const PendingRequestsPage: React.FC<PendingRequestsPageProps> = ({
    userEmail,
    onBackToDashboard,
    onNavigateToHistory,
    onNavigateToSubmit,
    onViewDetails,
}) => {
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

    const getInitials = (name: string) =>
        name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();

    const getAvatarColor = (id: number) =>
        DEFAULT_AVATARS[id % DEFAULT_AVATARS.length];

    const handleAction = async (id: number, action: 'approve' | 'reject') => {
        try {
            const res = await fetch(`http://localhost:8080/api/leave/requests/${id}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: action === "approve" ? "APPROVED" : "REJECTED" }),
            });
            const data = await res.json();
            if (data.success) {
                alert("Cập nhật thành công");
                setRequests((prev) => prev.filter((r) => r.id !== id));
            } else {
                alert(data.message);
            }
        } catch (err) {
            alert("Lỗi server");
        }
    };

    const handleRowClick = (id: number, e: React.MouseEvent) => {
        if ((e.target as HTMLElement).closest('button')) return;
        if (onViewDetails) onViewDetails(id);
    };

    return (
        <div className="pr-content-only">
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
                            <tr key={req.id} onClick={(e) => handleRowClick(req.id, e)} style={{ cursor: 'pointer' }}>
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
                                        <button className="pr-btn-reject" onClick={() => onViewDetails && onViewDetails(req.id)}>
                                            Reject
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
    );
};

export default PendingRequestsPage;
