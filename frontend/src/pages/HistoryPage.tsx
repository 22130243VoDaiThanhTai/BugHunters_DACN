import React, { useState } from "react";
import "../styles/History.css";

type HistoryPageProps = {
    userEmail: string;
    onBackToDashboard: () => void;
    onNavigateToSubmit: () => void;
};

// Mock data to match screenshot perfectly
const mockRequests = [
    {
        id: 1,
        type: "Annual Leave",
        icon: "annual",
        duration: "Oct 12 - Oct 15\n2023",
        days: 4,
        submitted: "Oct 01, 2023",
        status: "APPROVED",
        reason: null
    },
    {
        id: 2,
        type: "Personal Leave",
        icon: "personal",
        duration: "Nov 02 - Nov 02\n2023",
        days: 1,
        submitted: "Oct 28, 2023",
        status: "REJECTED",
        reason: "Unable to approve for this date due to end-of-quarter financial audit requirements. All staff in the finance department must be present."
    },
    {
        id: 3,
        type: "Sick Leave",
        icon: "sick",
        duration: "Dec 01 - Dec 03\n2023",
        days: 3,
        submitted: "Nov 15, 2023",
        status: "PENDING",
        reason: null
    }
];

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
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);
const IconHistory = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="1 4 1 10 7 10" />
        <path d="M3.51 15a9 9 0 1 0 .49-4.95" />
    </svg>
);

const AnnualIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
        <line x1="4" y1="22" x2="4" y2="15" />
    </svg>
);
const PersonalIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);
const SickIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
);

const AlertIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
);

const HistoryPage: React.FC<HistoryPageProps> = ({ onBackToDashboard, onNavigateToSubmit }) => {
    return (
        <div className="hp-root">
            {/* Sidebar */}
            <aside className="hp-sidebar">
                <div className="hp-logo">
                    <div className="hp-logo__name">Ethereal HR</div>
                    <div className="hp-logo__sub">Employee Portal</div>
                </div>

                <nav className="hp-nav">
                    <button className="hp-nav__btn" onClick={onBackToDashboard}>
                        <span className="hp-nav__icon"><IconDashboard /></span> Dashboard
                    </button>
                    <button className="hp-nav__btn" onClick={onNavigateToSubmit}>
                        <span className="hp-nav__icon"><IconRequest /></span> Submit Request
                    </button>
                    <div className="hp-nav__active-wrapper">
                        <button className="hp-nav__btn hp-nav__btn--active">
                            <span className="hp-nav__icon"><IconHistory /></span> History
                        </button>
                    </div>
                </nav>

                <div className="hp-new-btn-wrapper">
                    <button className="hp-new-btn" onClick={onNavigateToSubmit}>
                        <span>+</span> New Request
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="hp-main">
                <header className="hp-topbar">
                    <h1 className="hp-topbar__title">My Leave Requests</h1>
                    
                    <div className="hp-topbar__right">
                        <div className="hp-topbar__user">
                            <img src={`https://ui-avatars.com/api/?name=Alex+Rivers&background=3b82f6&color=fff&rounded=true`} alt="Alex" className="hp-avatar" />
                            <div className="hp-user-info">
                                <span className="hp-user-name">Alex Rivers</span>
                                <span className="hp-user-role">EMPLOYEE</span>
                            </div>
                        </div>
                        <div className="hp-topbar__icons">
                            <button className="hp-icon-btn"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg></button>
                            <button className="hp-icon-btn"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></button>
                        </div>
                        <button className="hp-logout-btn">Logout</button>
                    </div>
                </header>

                <div className="hp-content">
                    {/* Summary Cards */}
                    <div className="hp-metrics">
                        <div className="hp-metric-card hp-card-blue">
                            <div className="hp-metric-label">ANNUAL BALANCE</div>
                            <div className="hp-metric-value">
                                <span className="hp-metric-number">18</span> <span className="hp-metric-unit">Days</span>
                            </div>
                        </div>
                        <div className="hp-metric-card hp-card-green">
                            <div className="hp-metric-label">SICK LEAVE USED</div>
                            <div className="hp-metric-value">
                                <span className="hp-metric-number">2</span> <span className="hp-metric-unit">Days</span>
                            </div>
                        </div>
                        <div className="hp-metric-card hp-card-pink">
                            <div className="hp-metric-label">PENDING REVIEW</div>
                            <div className="hp-metric-value">
                                <span className="hp-metric-number">1</span> <span className="hp-metric-unit">Request</span>
                            </div>
                        </div>
                    </div>

                    {/* Recent Requests */}
                    <div className="hp-table-container">
                        <div className="hp-table-header">
                            <h2 className="hp-table-title">Recent Requests</h2>
                            <button className="hp-filter-btn">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
                                Filter
                            </button>
                        </div>

                        <table className="hp-table">
                            <thead>
                                <tr>
                                    <th>LEAVE TYPE</th>
                                    <th>DURATION</th>
                                    <th>DAYS</th>
                                    <th>SUBMITTED</th>
                                    <th>STATUS</th>
                                    <th>ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mockRequests.map((req, index) => (
                                    <React.Fragment key={req.id}>
                                        <tr className={`hp-tr ${req.status === 'REJECTED' ? 'hp-tr-rejected' : ''}`}>
                                            <td>
                                                <div className="hp-type">
                                                    <div className={`hp-type-icon hp-type-icon--${req.icon}`}>
                                                        {req.icon === 'annual' && <AnnualIcon />}
                                                        {req.icon === 'personal' && <PersonalIcon />}
                                                        {req.icon === 'sick' && <SickIcon />}
                                                    </div>
                                                    <span className="hp-type-text">{req.type}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="hp-duration">
                                                    {req.duration.split('\n').map((line, i) => (
                                                        <React.Fragment key={i}>
                                                            {line}{i === 0 && <br/>}
                                                        </React.Fragment>
                                                    ))}
                                                </div>
                                            </td>
                                            <td>
                                                <span className="hp-days">{req.days}</span>
                                            </td>
                                            <td>
                                                <span className="hp-submitted">{req.submitted}</span>
                                            </td>
                                            <td>
                                                <span className={`hp-badge hp-badge--${req.status.toLowerCase()}`}>
                                                    {req.status}
                                                </span>
                                            </td>
                                            <td className="hp-actions-td">
                                                <button className="hp-more-btn">⋮</button>
                                            </td>
                                        </tr>
                                        {req.reason && (
                                            <tr className="hp-reason-row">
                                                <td colSpan={6} style={{ padding: 0, borderBottom: 'none' }}>
                                                    <div className="hp-reason-box">
                                                        <div className="hp-reason-header">
                                                            <span className="hp-reason-icon"><AlertIcon /></span>
                                                            <span className="hp-reason-label">REJECTION REASON</span>
                                                        </div>
                                                        <p className="hp-reason-text">"{req.reason}"</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                        {req.reason && <tr><td colSpan={6} className="hp-spacer-td"></td></tr>}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                        
                        <div className="hp-table-footer">
                            <span className="hp-showing">Showing 3 of 12 requests</span>
                            <div className="hp-pagination">
                                <button className="hp-page-btn">‹</button>
                                <button className="hp-page-btn hp-page-btn--active">›</button>
                            </div>
                        </div>
                    </div>

                    {/* Team Pulse */}
                    <div className="hp-pulse-container">
                        <div className="hp-pulse-header">
                            <h3 className="hp-pulse-title">Team Availability Pulse</h3>
                            <span className="hp-pulse-badge">CURRENT MONTH</span>
                        </div>
                        <div className="hp-pulse-timeline">
                            <div className="hp-pulse-tracks">
                                <div className="hp-pulse-track hr-track-1"></div>
                                <div className="hp-pulse-track hr-track-2"></div>
                                <div className="hp-pulse-track hr-track-3"></div>
                                <div className="hp-pulse-track hr-track-4"></div>
                            </div>
                            <div className="hp-pulse-labels">
                                <span>WEEK 1</span>
                                <span>WEEK 2</span>
                                <span>WEEK 3</span>
                                <span>WEEK 4</span>
                            </div>
                        </div>
                        <div className="hp-pulse-note">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
                            </svg>
                            You are viewing overlapping leave dates for the <strong>Product Design Team</strong>.
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default HistoryPage;
