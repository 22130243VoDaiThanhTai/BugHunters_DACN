import React, { useEffect, useState } from "react";
import "../styles/RequestDetailsPage.css";

type BalanceImpactDto = {
    currentDays: number;
    requestedDays: number;
    remainingDays: number;
};

type TeamAvailabilityDto = {
    team: string;
    availabilityPercentage: number;
    message: string;
};

type LeaveRequestDetailDto = {
    id: number;
    userId: number;
    employeeName: string;
    role: string;
    department: string;
    position: string;
    startDate: string;
    endDate: string;
    totalDays: number;
    reason: string;
    status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
    createdAt: string;
    rejectionReason?: string;
    balanceImpact: BalanceImpactDto;
    teamAvailability: TeamAvailabilityDto;
};

type RequestDetailsPageProps = {
    userEmail: string;
    requestId: number;
    onBack: () => void;
    onBackToDashboard: () => void;
    initialAction?: 'view' | 'reject';
};

const API_URL = "http://localhost:8080/api/admin/requests";
const UPDATE_URL = "http://localhost:8080/api/leave/requests";

const formatDateRange = (start: string, end: string): string => {
    const s = new Date(start);
    const e = new Date(end);
    if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return "Invalid date";
    const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const eYear = e.getFullYear();
    return `${fmt(s)} - ${fmt(e)}, ${eYear}`;
};

const IconCheckCircle = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
);
const IconXCircle = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="15" y1="9" x2="9" y2="15"></line>
        <line x1="9" y1="9" x2="15" y2="15"></line>
    </svg>
);

const RequestDetailsPage: React.FC<RequestDetailsPageProps> = ({
    userEmail,
    requestId,
    onBack,
    onBackToDashboard,
    initialAction,
}) => {
    const [detail, setDetail] = useState<LeaveRequestDetailDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionState, setActionState] = useState<'none' | 'declining'>(
        initialAction === 'reject' ? 'declining' : 'none'
    );
    const [rejectionReason, setRejectionReason] = useState('');

    useEffect(() => {
        const loadDetail = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${API_URL}/${requestId}?email=${encodeURIComponent(userEmail)}`);
                const data = await res.json();
                if (res.ok && data.success) {
                    setDetail(data.data);
                } else {
                    setError(data.message || "Failed to load details");
                }
            } catch (e) {
                setError("Cannot connect to server");
            } finally {
                setLoading(false);
            }
        };
        loadDetail();
    }, [requestId, userEmail]);

    const handleApprove = async () => {
        try {
            const res = await fetch(`${UPDATE_URL}/${requestId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'APPROVED' }),
            });
            const data = await res.json();
            if (res.ok && data.success) {
                alert('Request approved successfully');
                onBack();
            } else {
                alert(data.message || 'Error approving request');
            }
        } catch (e) {
            alert('Cannot connect to server');
        }
    };

    const handleReject = async () => {
        if (!rejectionReason.trim()) {
            alert('Please provide a rejection reason');
            return;
        }
        try {
            const res = await fetch(`${UPDATE_URL}/${requestId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'REJECTED', reason: rejectionReason }),
            });
            const data = await res.json();
            if (res.ok && data.success) {
                alert('Request rejected successfully');
                onBack();
            } else {
                alert(data.message || 'Error rejecting request');
            }
        } catch (e) {
            alert('Cannot connect to server');
        }
    };

    return (
        <div className="rd-content-only">
            {loading && <div>Loading details...</div>}
            {error && <div>{error}</div>}
            {detail && (
                <div className="rd-cards-layout">
                    <div className="rd-card rd-main-card">
                        <div className="rd-profile-section">
                            <div className="rd-avatar-wrap">
                                <div className="rd-avatar-large">
                                    {detail.employeeName.substring(0, 2).toUpperCase()}
                                </div>
                                <div className="rd-verify-badge">✓</div>
                            </div>
                            <div className="rd-profile-info">
                                <h2 className="rd-emp-name">{detail.employeeName}</h2>
                                <p className="rd-emp-role">{detail.position} • {detail.department}</p>
                                <div className="rd-badges">
                                    <span className="rd-badge rd-badge--pending">PENDING APPROVAL</span>
                                    <span className="rd-badge rd-badge--type">FULL-TIME</span>
                                </div>
                            </div>
                        </div>

                        <div className="rd-details-grid">
                            <div className="rd-detail-box">
                                <div className="rd-detail-label">DURATION</div>
                                <div className="rd-detail-value">
                                    <span className="rd-val-large">{detail.totalDays}</span> Work Days
                                </div>
                            </div>
                            <div className="rd-detail-box">
                                <div className="rd-detail-label">DATE RANGE</div>
                                <div className="rd-detail-value">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" style={{ marginRight: '8px' }}>
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                        <line x1="16" y1="2" x2="16" y2="6" />
                                        <line x1="8" y1="2" x2="8" y2="6" />
                                        <line x1="3" y1="10" x2="21" y2="10" />
                                    </svg>
                                    {formatDateRange(detail.startDate, detail.endDate)}
                                </div>
                            </div>
                        </div>

                        <div className="rd-reason-section">
                            <div className="rd-reason-label">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                </svg>
                                Reason for Leave
                            </div>
                            <div className="rd-reason-box">
                                <p>"{detail.reason}"</p>
                            </div>
                        </div>
                    </div>

                    <div className="rd-side-cards">
                        <div className="rd-card rd-side-card">
                            <div className="rd-card-title">TEAM AVAILABILITY</div>
                            <div className="rd-team-progress">
                                <div className="rd-team-name">{detail.teamAvailability.team}</div>
                                <div className="rd-team-pct">{detail.teamAvailability.availabilityPercentage}% Available</div>
                            </div>
                            <div className="rd-progress-bar">
                                <div className="rd-progress-fill" style={{ width: `${detail.teamAvailability.availabilityPercentage}%` }}></div>
                            </div>
                            <p className="rd-team-msg">{detail.teamAvailability.message}</p>
                        </div>

                        <div className="rd-card rd-side-card rd-balance-card">
                            <div className="rd-card-title">BALANCE IMPACT</div>
                            <div className="rd-balance-flow">
                                <div className="rd-balance-col">
                                    <div className="rd-balance-lbl">CURRENT</div>
                                    <div className="rd-balance-val">{detail.balanceImpact.currentDays} days</div>
                                </div>
                                <div className="rd-balance-arrow">→</div>
                                <div className="rd-balance-col">
                                    <div className="rd-balance-lbl">REMAINING</div>
                                    <div className="rd-balance-val rd-val-blue">{detail.balanceImpact.remainingDays} days</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {detail && detail.status === 'PENDING' && (
                <>
                    {actionState === 'none' && (
                        <div className="rd-actions-card">
                            <div className="rd-action-group">
                                <div className="rd-action-info">
                                    <div className="rd-icon-circle rd-icon-circle--blue"><IconCheckCircle /></div>
                                    <div>
                                        <div className="rd-action-title">CONFIRM REQUEST</div>
                                        <div className="rd-action-sub">Approve Request</div>
                                    </div>
                                </div>
                                <button className="rd-btn rd-btn--primary" onClick={handleApprove}>Confirm Approval</button>
                            </div>
                            <div className="rd-desc-divider"></div>
                            <div className="rd-action-group">
                                <div className="rd-action-info">
                                    <div className="rd-icon-circle rd-icon-circle--red"><IconXCircle /></div>
                                    <div>
                                        <div className="rd-action-title">DECLINE REQUEST</div>
                                        <div className="rd-action-sub">Reject Request</div>
                                    </div>
                                </div>
                                <button className="rd-btn rd-btn--danger" onClick={() => setActionState('declining')}>Submit Rejection</button>
                            </div>
                        </div>
                    )}

                    {actionState === 'declining' && (
                        <div className="rd-reject-card">
                            <div className="rd-reject-header">
                                <div className="rd-reject-title"><IconXCircle /> SPECIFY REJECTION REASON</div>
                                <div className="rd-reject-sub">This will be shared with {detail.employeeName}</div>
                            </div>
                            <textarea
                                className="rd-reject-input"
                                placeholder="Provide constructive feedback for the rejection..."
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                            ></textarea>
                            <div className="rd-reject-footer">
                                <button className="rd-btn rd-btn--outline" onClick={() => setActionState('none')}>Cancel</button>
                                <button className="rd-btn rd-btn--danger" onClick={handleReject}>Confirm Rejection</button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default RequestDetailsPage;
