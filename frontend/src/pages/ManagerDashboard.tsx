import React from 'react';
import "../styles/ManagerDashboard.css"; 

interface ManagerProps {
    onLogout: () => void;
}

const ManagerDashboard: React.FC<ManagerProps> = ({ onLogout }) => {
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
                    <a href="#" className="menu-item active">
                        <span className="icon">⊞</span> Dashboard
                    </a>
                    <a href="#" className="menu-item">
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
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="Avatar" />
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
                <header className="header">
                    <div className="header-left">
                        <h2>Manager Dashboard</h2>
                        <p>Welcome back, Alex. Here's your overview.</p>
                    </div>
                    <div className="header-right">
                        <div className="system-online">
                            <span className="online-dot"></span> System Online
                        </div>
                        <button className="notif-btn">🔔</button>
                        <button className="manager-btn" onClick={onLogout}>Manager ⮞</button>
                    </div>
                </header>

                <div className="dashboard-body">
                    {/* Cột Trái */}
                    <div className="body-left">
                        {/* Banner Blue */}
                        <div className="urgent-banner">
                            <span className="banner-tag">URGENT REVIEW</span>
                            <h1>12 Pending Requests</h1>
                            <p>Requires your immediate approval for next week's roster.</p>
                            <div className="banner-actions">
                                <button className="btn-white">Go to Pending Requests</button>
                                <button className="btn-outline">View Analytics</button>
                            </div>
                        </div>

                        {/* Danh sách List */}
                        <div className="list-section-container">
                            <div className="list-header">
                                <h3>Pending Approval List</h3>
                                <button className="view-all-link">View All Requests</button>
                            </div>
                            <div className="approval-list">
                                <ApprovalItem name="Jordan Davis" type="Annual Leave • 5 Days" period="Oct 12 - Oct 17" />
                                <ApprovalItem name="Sarah Chen" type="Sick Leave • 2 Days" period="Oct 15 - Oct 16" />
                                <ApprovalItem name="Marcus Reed" type="Paternity Leave • 10 Days" period="Nov 01 - Nov 10" />
                            </div>
                        </div>

                        {/* Report Box */}
                        <div className="report-box-card">
                            <div className="report-header">
                                <div className="report-icon">📊</div>
                                <div>
                                    <h4>Monthly Leave Report</h4>
                                    <p>Export employee leave data by month</p>
                                </div>
                            </div>
                            <div className="report-selectors">
                                <div className="select-group">
                                    <label>MONTH</label>
                                    <select><option>October</option></select>
                                </div>
                                <div className="select-group">
                                    <label>YEAR</label>
                                    <select><option>2024</option></select>
                                </div>
                            </div>
                            <button className="btn-export">📥 Export Monthly Report</button>
                        </div>
                    </div>

                    {/* Cột Phải */}
                    <div className="body-right">
                        <StatCard label="TOTAL EMPLOYEES" value="148" icon="👥" />
                        <StatCard label="APPROVED THIS MONTH" value="64" icon="✅" active />
                        <StatCard label="REJECTED" value="08" icon="❌" />

                        <div className="activity-card">
                            <h3>Recent Activity</h3>
                            <div className="timeline">
                                <ActivityItem title="Approved Request" time="2 hours ago" color="green" />
                                <ActivityItem title="Rejected Request" time="5 hours ago" color="red" />
                                <ActivityItem title="New Submission" time="Yesterday" color="blue" />
                            </div>
                        </div>

                        <div className="availability-card-mini">
                            <p>Manage Team Availability</p>
                            <div className="progress-bar-multi">
                                <div className="p-green" style={{width: '70%'}}></div>
                                <div className="p-yellow" style={{width: '15%'}}></div>
                                <div className="p-red" style={{width: '15%'}}></div>
                            </div>
                            <small>Team presence is currently at 85%</small>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

// Sub-components
const ApprovalItem = ({ name, type, period }: any) => (
    <div className="approval-row">
        <div className="row-user">
            <div className="user-avatar-small"></div>
            <div>
                <p className="u-name">{name}</p>
                <p className="u-type">{type}</p>
            </div>
        </div>
        <div className="row-period">
            <span>PERIOD</span>
            <p>{period}</p>
        </div>
        <span className="status-pending-tag">PENDING</span>
    </div>
);

const StatCard = ({ label, value, icon, active }: any) => (
    <div className={`stat-card-v2 ${active ? 'active' : ''}`}>
        <div className="stat-info">
            <label>{label}</label>
            <p>{value}</p>
        </div>
        <div className="stat-icon-v2">{icon}</div>
    </div>
);

const ActivityItem = ({ title, time, color }: any) => (
    <div className="activity-row">
        <div className={`activity-dot ${color}`}></div>
        <div className="activity-text">
            <p>{title}</p>
            <span>{time}</span>
        </div>
    </div>
);

export default ManagerDashboard;