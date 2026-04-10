import React from 'react';
import '../styles/RequestDetails.css';

interface RequestDetailsProps {
    onLogout?: () => void;
}

const RequestDetails: React.FC<RequestDetailsProps> = ({ onLogout }) => {
    return (
        <div className="dashboard-container">
            {/* --- SIDEBAR --- */}
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
                    <a href="#" className="menu-item">
                        <span className="icon">⊞</span> Dashboard
                    </a>
                    {/* Active menu như trong thiết kế */}
                    <a href="#" className="menu-item active">
                        <span className="icon">⊕</span> Submit Request
                    </a>
                    <a href="#" className="menu-item">
                        <span className="icon">↺</span> History
                    </a>
                    <a href="#" className="menu-item">
                        <span className="icon">◷</span> Pending Requests
                    </a>
                </nav>

                <div className="sidebar-footer">
                    <div className="user-info-mini">
                        <img src="https://i.pravatar.cc/150?img=11" alt="Alex Sterling" />
                        <div className="user-text">
                            <p className="user-name">Alex Sterling</p>
                            <p className="user-role">Department Manager</p>
                        </div>
                    </div>
                    <button className="settings-btn">Settings</button>
                </div>
            </aside>

            {/* --- MAIN CONTENT --- */}
            <main className="main-content">
                <div className="dashboard-wrapper">
                    
                    {/* Header */}
                    <header className="header">
                        <div className="header-left">
                            <h2>Submit Request</h2>
                        </div>
                        <div className="header-right">
                            <div className="system-online">
                                <span className="online-dot"></span> System Online
                            </div>
                            <button className="notif-btn">🔔</button>
                            <button className="manager-btn" onClick={onLogout}>Manager ⮞</button>
                        </div>
                    </header>

                    {/* 1. KHUNG THÔNG TIN CHÍNH CỦA REQUEST */}
                    <div className="details-main-card">
                        
                        {/* Hàng trên: Profile & Widgets */}
                        <div className="details-grid-top">
                            {/* Cột trái: Profile */}
                            <div className="user-profile-large">
                                <div className="avatar-container">
                                    <img src="https://i.pravatar.cc/150?img=12" alt="Nguyen Van A" />
                                    {/* Icon Tích Xanh Tròn */}
                                    <div className="verified-badge">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                    </div>
                                </div>
                                <div className="user-meta">
                                    <h3>Nguyen Van A</h3>
                                    <p>Senior Product Designer - Engineering</p>
                                    <div className="status-tags">
                                        <span className="tag pending">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                                            PENDING APPROVAL
                                        </span>
                                        <span className="tag fulltime">FULL-TIME</span>
                                    </div>
                                </div>
                            </div>

                            {/* Cột phải: Thống kê bên hông */}
                            <div className="side-stats-widgets">
                                {/* Team Availability */}
                                <div className="stat-box-bordered">
                                    <h4>TEAM AVAILABILITY</h4>
                                    <div className="team-avail-header">
                                        <span>Marketing Team</span>
                                        <span className="avail-percent">85% Available</span>
                                    </div>
                                    <div className="progress-bar">
                                        <div className="progress-fill" style={{ width: '85%' }}></div>
                                    </div>
                                    <p className="team-avail-note">2 other team members are on leave during this period. Overlap is minimal.</p>
                                </div>

                                {/* Balance Impact */}
                                <div className="stat-box-bordered">
                                    <h4>BALANCE IMPACT</h4>
                                    <div className="balance-row">
                                        <div className="balance-item">
                                            <span>CURRENT</span>
                                            <p>18 days</p>
                                        </div>
                                        <div className="balance-arrow">→</div>
                                        <div className="balance-item">
                                            <span>REMAINING</span>
                                            <p className="blue-text">12 days</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Hàng dưới (bên trong khung chính): Boxes thông tin */}
                        <div className="info-blocks-row">
                            <div className="info-block-grey">
                                <label>DURATION</label>
                                <p><span className="blue-text" style={{color: '#0d6efd', fontSize: '28px'}}>5</span> <span className="sub-text">Work Days</span></p>
                            </div>
                            <div className="info-block-grey">
                                <label>DATE RANGE</label>
                                <p className="date-text">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0d6efd" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                    Apr 10 - Apr 15, 2024
                                </p>
                            </div>
                        </div>

                        {/* Reason Text */}
                        <div className="reason-section">
                            <div className="reason-header">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>
                                Reason for Leave
                            </div>
                            <div className="reason-content">
                                "I am planning to take a family trip to celebrate my parent's 40th anniversary. We'll be traveling to the coastal region and I will ensure all my current sprint tasks are handed over to the team lead before my departure."
                            </div>
                        </div>
                    </div>

                    {/* 2. CÁC NÚT ACTION DUYỆT / TỪ CHỐI */}
                    <div className="actions-row">
                        {/* Khung Approve */}
                        <div className="action-card">
                            <div className="action-info">
                                <div className="icon-circle blue">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                </div>
                                <div className="action-text">
                                    <span>CONFIRM REQUEST</span>
                                    <h4>Approve Request</h4>
                                </div>
                            </div>
                            <button className="btn-blue-solid">Confirm Approval</button>
                        </div>

                        {/* Khung Reject */}
                        <div className="action-card">
                            <div className="action-info">
                                <div className="icon-circle red">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                </div>
                                <div className="action-text">
                                    <span>DECLINE REQUEST</span>
                                    <h4>Reject Request</h4>
                                </div>
                            </div>
                            <button className="btn-red-solid">Submit Rejection</button>
                        </div>
                    </div>

                    {/* 3. KHUNG NHẬP LÝ DO TỪ CHỐI (Rejection panel) */}
                    <div className="rejection-panel">
                        <div className="rejection-header">
                            <div className="rejection-title">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                                SPECIFY REJECTION REASON
                            </div>
                            <div className="rejection-note">This will be shared with Nguyen Van A</div>
                        </div>
                        <textarea 
                            className="rejection-textarea" 
                            placeholder="Provide constructive feedback for the rejection. For example: 'Project deadline overlap' or 'Resource constraints'..."
                        ></textarea>
                        
                        <div className="rejection-actions">
                            <button className="btn-cancel">Cancel</button>
                            <button className="btn-red-solid">Confirm Rejection</button>
                        </div>
                    </div>

                </div>
            </main>

            {/* Nút Help chấm hỏi lơ lửng góc phải dưới */}
            <button className="fab-help">?</button>
        </div>
    );
};

export default RequestDetails;