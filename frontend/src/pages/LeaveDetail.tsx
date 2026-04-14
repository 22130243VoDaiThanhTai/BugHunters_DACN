import React, { useEffect, useState } from 'react';
import '../styles/LeaveDetail.css';
import axios from 'axios';

type LeaveDetailProps = {
    requestId: number;
    userEmail: string;
    onBack: () => void;
};

type LeaveDetailApiResponse = {
    employeeName?: string;
    position?: string;
    department?: string;
    role?: string;
    status?: string;
    reason?: string;
    rejectionReason?: string;
    startDate?: string;
    endDate?: string;
    totalDays?: number;
    teamAvailability?: {
        team?: string;
        availabilityPercentage?: number;
        message?: string;
    };
    balanceImpact?: {
        currentDays?: number;
        remainingDays?: number;
    };
};

// --- CÁC ICON SVG ---
const IconDashboard = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>
);
const IconRequest = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>
);
const IconHistory = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-4.95" /></svg>
);
const IconPlus = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
);
const IconChat = ({ color }: { color: string }) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
);

const deriveNameFromEmail = (email: string) => {
    const local = email.split('@')[0] || 'User';
    return local
        .replace(/[._-]+/g, ' ')
        .split(' ')
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
};

const LeaveDetail: React.FC<LeaveDetailProps> = ({ requestId, userEmail, onBack }) => {
    const [data, setData] = useState<LeaveDetailApiResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [cancelling, setCancelling] = useState(false);
    const displayName = data?.employeeName || deriveNameFromEmail(userEmail);
    const displayRole = data?.position || data?.role || 'Employee';
    const displayDepartment = data?.department || 'Employee Portal';

    // LOGIC BACKEND - GIỮ NGUYÊN KHÔNG ĐỔI
    useEffect(() => {
        const fetchDetail = async () => {
            try {
                console.log("🔥 Fetching requestId:", requestId);
                const res = await axios.get(
                    `http://localhost:8080/api/leave/${requestId}`,
                    { params: { email: userEmail } }
                );
                setData(res.data);
            } catch (error) {
                console.error("❌ Error fetching leave detail:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [requestId, userEmail]);

    const handleCancelRequest = async () => {
        if (!window.confirm('Are you sure you want to cancel this leave request?')) {
            return;
        }

        try {
            setCancelling(true);

            const response = await axios.patch(
                `http://localhost:8080/api/leave/requests/${requestId}/cancel`,
                null,
                { params: { email: userEmail } }
            );

            if (response.data?.success) {
                alert('Leave request cancelled successfully');
                onBack();
                return;
            }

            alert(response.data?.message || 'Failed to cancel request');
        } catch (error: any) {
            const message = error?.response?.data?.message || 'Cannot cancel request';
            alert(message);
            console.error('❌ Error cancelling leave request:', error);
        } finally {
            setCancelling(false);
        }
    };

    if (loading) return <div className="ld-loading">Loading request details...</div>;
    if (!data) return <div className="ld-loading">No data found</div>;

    // Helper format ngày
    const formatDate = (dateString?: string) => {
        if (!dateString) return '';
        const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    return (
        <div className="ld-layout">
            {/* SIDEBAR DỰA VÀO DASHBOARD */}
            <aside className="ld-sidebar">
                <div className="ld-logo-section">
                    <div className="ld-logo-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
                    </div>
                        <div className="ld-logo-text">
                            <div className="ld-logo-title">{displayName}</div>
                            <div className="ld-logo-subtitle">{displayDepartment}</div>
                        </div>
                </div>

                <nav className="ld-nav">
                    <button className="ld-nav-item" onClick={onBack}>
                        <IconDashboard /> Dashboard
                    </button>
                    <button className="ld-nav-item" onClick={onBack}>
                        <IconRequest /> Submit Request
                    </button>
                    <button className="ld-nav-item" onClick={onBack}>
                        <IconHistory /> History
                    </button>
                </nav>

                <button className="ld-btn-new-request">
                    <IconPlus /> New Request
                </button>
            </aside>

            {/* MAIN CONTENT */}
            <main className="ld-main">
                {/* TOP HEADER */}
                <header className="ld-header">
                    <div className="ld-header-left">
                        <button onClick={onBack} className="ld-back-btn">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                            Back to Dashboard
                        </button>
                        <h3 className="ld-page-title">Detail Requests</h3>
                    </div>

                    {/* Mock Profile Top Right */}
                    <div className="ld-header-right">
                        <div className="ld-user-mini">
                            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=F3F4F6&color=374151`} alt="Avatar" className="ld-mini-avatar" />
                            <div className="ld-mini-info">
                                <span className="ld-mini-name">{displayName}</span>
                                <span className="ld-mini-role">{displayRole}</span>
                            </div>
                        </div>
                        <button className="ld-icon-btn"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg></button>
                        <button className="ld-icon-btn"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg></button>
                        <button className="ld-logout-text" onClick={onBack}>Logout</button>
                    </div>
                </header>

                <div className="ld-content-scroll">
                    <div className="ld-card">

                        <div className="ld-card-grid">
                            {/* CỘT TRÁI (LEFT COLUMN) */}
                            <section className="ld-col-left">

                                {/* PROFILE INFO */}
                                <div className="ld-profile-info">
                                    <div className="ld-avatar-wrapper">
                                        <img src={`https://ui-avatars.com/api/?name=${data.employeeName || 'A'}&background=EBF4FF&color=1D4ED8&size=80`} alt="Avatar" className="ld-avatar" />
                                        <div className="ld-check-badge">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                        </div>
                                    </div>
                                    <div>
                                        <h2 className="ld-emp-name">{data.employeeName}</h2>
                                        <p className="ld-emp-role">{data.position} • {data.department}</p>
                                        <div className="ld-badges">
                                            <span className="ld-badge ld-badge-reject-outline">
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                                                {data.role || displayRole}
                                            </span>
                                            <span className="ld-badge ld-badge-gray">
                                                {data.status === 'REJECTED' ? 'REJECTED' : 'FULL-TIME'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* DURATION & DATE RANGE */}
                                <div className="ld-stats-row">
                                    <div className="ld-stat-box">
                                        <span className="ld-stat-label">DURATION</span>
                                        <div className="ld-stat-value">
                                            <span className="ld-num-blue">{data.totalDays}</span>
                                            <span className="ld-text-dark">Work Days</span>
                                        </div>
                                    </div>
                                    <div className="ld-stat-box">
                                        <span className="ld-stat-label">DATE RANGE</span>
                                        <div className="ld-stat-value">
                                            <svg className="ld-icon-blue" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                            <span className="ld-text-dark">{formatDate(data.startDate)} - {formatDate(data.endDate)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* REASON FOR LEAVE */}
                                <div className="ld-reason-wrapper">
                                    <div className="ld-reason-title">
                                        <IconChat color="#6B7280" /> Reason for Leave
                                    </div>
                                    <div className="ld-reason-box">
                                        "{data.reason || "No reason provided"}"
                                    </div>
                                </div>

                                {/* REASON FOR REJECT (Nếu có) */}
                                {data.status === "REJECTED" && (
                                    <div className="ld-reason-wrapper">
                                        <div className="ld-reason-title ld-text-red">
                                            <IconChat color="#EF4444" /> Reason for Reject
                                        </div>
                                        <div className="ld-reason-box ld-reason-box-red">
                                            "{data.rejectionReason || "No rejection reason provided"}"
                                        </div>
                                    </div>
                                )}

                            </section>

                            {/* CỘT PHẢI (RIGHT COLUMN) */}
                            <section className="ld-col-right">

                                {/* TEAM AVAILABILITY */}
                                <div className="ld-side-card">
                                    <h4 className="ld-side-title">TEAM AVAILABILITY</h4>
                                    <div className="ld-team-header">
                                        <span className="ld-team-name">{data.teamAvailability?.team || "Team"}</span>
                                        <span className="ld-team-percent">{data.teamAvailability?.availabilityPercentage || 0}% Available</span>
                                    </div>
                                    <div className="ld-progress-bar">
                                        <div className="ld-progress-fill" style={{ width: `${data.teamAvailability?.availabilityPercentage || 0}%` }}></div>
                                    </div>
                                    <p className="ld-team-msg">
                                        {data.teamAvailability?.message || "Overlap data is minimal during this period."}
                                    </p>
                                </div>

                                {/* BALANCE IMPACT */}
                                <div className="ld-side-card">
                                    <h4 className="ld-side-title">BALANCE IMPACT</h4>
                                    <div className="ld-impact-row">
                                        <div className="ld-impact-col">
                                            <span className="ld-impact-label">CURRENT</span>
                                            <div className="ld-impact-val">
                                                <span className="ld-val-num">{data.balanceImpact?.currentDays || 0}</span>
                                                <span className="ld-val-text">days</span>
                                            </div>
                                        </div>
                                        <div className="ld-impact-arrow">→</div>
                                        <div className="ld-impact-col">
                                            <span className="ld-impact-label">REMAINING</span>
                                            <div className="ld-impact-val ld-val-blue">
                                                <span className="ld-val-num">{data.balanceImpact?.remainingDays || 0}</span>
                                                <span className="ld-val-text">days</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </section>
                        </div>

                        {/* NÚT HÀNH ĐỘNG FULL WIDTH TRONG CARD */}
                        {data.status === 'PENDING' ? (
                            <button
                                onClick={handleCancelRequest}
                                className="ld-cancel-btn-full"
                                disabled={cancelling}
                            >
                                {cancelling ? 'Cancelling...' : 'Cancel Request'}
                            </button>
                        ) : (
                            <button onClick={onBack} className="ld-cancel-btn-full">
                                Back
                            </button>
                        )}

                    </div>
                </div>
            </main>
        </div>
    );
};

export default LeaveDetail;