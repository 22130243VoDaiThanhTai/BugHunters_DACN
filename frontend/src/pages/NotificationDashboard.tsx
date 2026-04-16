import React, { useState } from "react";
import "../styles/NotificationDashboard.css";

type LeaveType = "Annual Leave" | "Sick Leave" | "Personal";

interface Notification {
  id: number;
  name: string;
  action: string;
  dateRange: string;
  leaveType: LeaveType;
  timeAgo: string;
  isUrgent?: boolean;
  initials: string;
  avatarColor: string;
  avatarText: string;
}


const notifications: Notification[] = [
  {
    id: 1,
    name: "Jane Cooper",
    action: "submitted a new leave request",
    dateRange: "Oct 24 – Oct 27",
    leaveType: "Annual Leave",
    timeAgo: "5 mins ago",
    initials: "JC",
    avatarColor: "#DBEAFE",
    avatarText: "#1D4ED8",
  },
  {
    id: 2,
    name: "Sarah Jenkins",
    action: "request is still pending",
    dateRange: "Oct 20 – Oct 25",
    leaveType: "Sick Leave",
    timeAgo: "24h ago",
    isUrgent: true,
    initials: "SJ",
    avatarColor: "#FEE2E2",
    avatarText: "#B91C1C",
  },
  {
    id: 3,
    name: "Robert Fox",
    action: "submitted a new leave request",
    dateRange: "Nov 01 – Nov 05",
    leaveType: "Personal",
    timeAgo: "2h ago",
    initials: "RF",
    avatarColor: "#D1FAE5",
    avatarText: "#065F46",
  },
];


const navItems = [
  {
    label: "Dashboard",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="1" y="1" width="6" height="6" rx="1" />
        <rect x="9" y="1" width="6" height="6" rx="1" />
        <rect x="1" y="9" width="6" height="6" rx="1" />
        <rect x="9" y="9" width="6" height="6" rx="1" />
      </svg>
    ),
  },
  {
    label: "History",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="8" cy="8" r="7" />
        <polyline points="8,4 8,8 11,10" />
      </svg>
    ),
  },
  {
    label: "Pending Requests",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="2" width="12" height="12" rx="1" />
        <line x1="5" y1="6" x2="11" y2="6" />
        <line x1="5" y1="9" x2="9" y2="9" />
      </svg>
    ),
  },
];


function UrgentAvatar() {
  return (
    <div className="nd-urgent-avatar">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#B91C1C" strokeWidth="1.5">
        <circle cx="10" cy="10" r="8" />
        <line x1="10" y1="6" x2="10" y2="11" />
        <circle cx="10" cy="14" r="0.6" fill="#B91C1C" />
      </svg>
    </div>
  );
}

export default function NotificationDashboard({ onClose }: { onClose?: () => void }) {
  const [dismissed, setDismissed] = useState<number[]>([]);

  const visible = notifications.filter((n) => !dismissed.includes(n.id));

  return (
    <div className="nd-container">
      {/* Sidebar */}
      <aside className="nd-sidebar">
        {/* Logo */}
        <div className="nd-logo-section">
          <div className="nd-logo-icon">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="white">
              <rect x="2" y="2" width="7" height="7" rx="1" />
              <rect x="11" y="2" width="7" height="7" rx="1" />
              <rect x="2" y="11" width="7" height="7" rx="1" />
              <rect x="11" y="11" width="7" height="7" rx="1" />
            </svg>
          </div>
          <div>
            <div className="nd-logo-title">Ethereal</div>
            <div className="nd-logo-subtitle">WORKPLACE</div>
          </div>
        </div>

        {/* Nav */}
        {navItems.map((item) => (
          <div
            key={item.label}
            className="nd-nav-item"
            onClick={() => {
              if (item.label === "Dashboard" && onClose) {
                onClose();
              }
            }}
          >
            {item.icon}
            {item.label}
          </div>
        ))}

        {/* Footer */}
        <div className="nd-sidebar-footer">
          <div className="nd-footer-user-info">
            <div className="nd-footer-avatar">AS</div>
            <div>
              <div className="nd-footer-author">Alex Sterling</div>
              <div className="nd-footer-role">Department Manager</div>
            </div>
          </div>
          <button className="nd-footer-settings-btn">Settings</button>
        </div>
      </aside>

      {/* Main */}
      <main className="nd-main-container">
        {/* Topbar */}
        <div className="nd-topbar">
          <h1 className="nd-topbar-title">Notification</h1>
          <div className="nd-topbar-right">
            <div className="nd-system-online">
              <div className="nd-online-dot" />
              System Online
            </div>
            <div className="nd-badge-container">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#6B7280" strokeWidth="1.5">
                <path d="M10 2a6 6 0 00-6 6v3l-1.5 2.5h15L16 11V8a6 6 0 00-6-6z" />
                <path d="M8.5 17a1.5 1.5 0 003 0" />
              </svg>
              <div className="nd-badge-count">3</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span className="nd-topbar-role">Manager</span>
              <svg 
                width="18" 
                height="18" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="#64748B" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                style={{ cursor: "pointer" }}
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="nd-content-wrapper">
          {/* Center */}
          <div className="nd-center-panel">
            <div className="nd-section-header">
              <span className="nd-section-title">Urgent Actions</span>
              <span className="nd-mark-read">Mark all as read</span>
            </div>

            {visible.length === 0 && (
              <div className="nd-empty-state">No pending notifications</div>
            )}

            {visible.map((notif) => (
              <div
                key={notif.id}
                className={`nd-notif-card`}
                style={{
                  borderLeft: `3px solid ${notif.isUrgent ? "#EF4444" : "#2563EB"}`,
                }}
              >
                {notif.isUrgent ? (
                  <UrgentAvatar />
                ) : (
                  <div
                    className="nd-notif-avatar"
                    style={{ background: notif.avatarColor, color: notif.avatarText }}
                  >
                    {notif.initials}
                  </div>
                )}

                <div className="nd-notif-info">
                  <p className="nd-notif-action-text">
                    <strong>{notif.name}</strong> {notif.action}
                  </p>
                  <div className="nd-notif-date">
                    {notif.dateRange} ({notif.leaveType})
                  </div>
                </div>

                <div className="nd-notif-right">
                  <div className={`nd-notif-time ${notif.isUrgent ? "urgent" : ""}`}>
                    {notif.timeAgo}
                  </div>
                  <button className="nd-notif-btn-review">View Details</button>
                </div>
              </div>
            ))}
          </div>


        </div>
      </main>
    </div>
  );
}