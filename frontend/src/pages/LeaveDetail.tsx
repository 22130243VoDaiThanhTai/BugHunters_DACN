import React from 'react';
import './LeaveDetail.css';

const LeaveDetail: React.FC = () => {
    return (
        <div className="leave-layout flex">
            {/* Sidebar - Giữ nguyên từ các trang trước */}

            <main className="flex-1">
                {/* Header Detail */}
                <header className="detail-header">
                    <a href="/dashboard" className="back-link">
                        <span>←</span> Back to Dashboard
                    </a>
                    <h3 className="detail-title">Detail Requests</h3>
                </header>

                <div className="detail-container">
                    {/* CỘT TRÁI: Thông tin chính */}
                    <section className="left-column">
                        <div className="user-info-card">
                            <img
                                src="https://via.placeholder.com/80"
                                alt="Avatar"
                                className="user-avatar"
                            />
                            <div>
                                <h2 className="user-name">Nguyen Van A</h2>
                                <p className="user-role">Senior Product Designer • Engineering</p>
                                <div className="flex gap-2">
                                    <span className="status-badge">● Reject Approval</span>
                                    <span className="status-badge">Full-time</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6 mt-8">
                            <div className="info-box">
                                <span className="info-label">Duration</span>
                                <span className="info-value text-blue-600">5 <small className="text-slate-400 text-sm">Work Days</small></span>
                            </div>
                            <div className="info-box">
                                <span className="info-label">Date Range</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-blue-500">📅</span>
                                    <span className="info-value">Apr 10 - Apr 15, 2024</span>
                                </div>
                            </div>
                        </div>

                        <div className="reason-card">
              <span className="info-label flex items-center gap-2 mb-4">
                <span className="text-red-500">💬</span> Reason Reject
              </span>
                            <p className="reason-text">
                                "I am planning to take a family trip to celebrate my parent's 40th anniversary.
                                We'll be traveling to the coastal region and I will ensure all my current sprint
                                tasks are handed over to the team lead before my departure."
                            </p>
                        </div>
                    </section>

                    {/* CỘT PHẢI: Team & Impact */}
                    <section className="right-column">
                        <div className="side-card">
                            <h4 className="side-card-title">Team Availability</h4>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-bold text-slate-600">Marketing Team</span>
                                <span className="text-xs font-bold text-blue-600">85% Available</span>
                            </div>
                            <div className="availability-bar">
                                <div className="bar-fill" style={{ width: '85%' }}></div>
                            </div>
                            <p className="text-[11px] text-slate-400 leading-relaxed mt-4">
                                2 other team members are on leave during this period. Overlap is minimal.
                            </p>
                        </div>

                        <div className="side-card">
                            <h4 className="side-card-title">Balance Impact</h4>
                            <div className="impact-container">
                                <div className="impact-item">
                                    <span className="info-label">Current</span>
                                    <div className="count">18 days</div>
                                </div>
                                <div className="impact-arrow">→</div>
                                <div className="impact-item">
                                    <span className="info-label">Remaining</span>
                                    <div className="count count-remaining">12 days</div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Nút Cancel cố định dưới cùng */}
                <footer className="bottom-actions">
                    <button className="full-btn">Cancel</button>
                </footer>
            </main>
        </div>
    );
};

export default LeaveDetail;