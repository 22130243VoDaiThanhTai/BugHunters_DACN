import React, { useEffect, useMemo, useRef, useState } from 'react';
import "../styles/ManagerDashboard.css"; 

interface ManagerProps {
    userEmail: string;
    onLogout: () => void;
    onNavigateToPending: () => void;
}

type ManagerDashboardApiResponse = {
    success: boolean;
    message: string;
    user?: {
        fullName: string;
        department: string;
        role: string;
    };
    pendingCount?: number;
};

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

type PendingApiResponse = {
    success: boolean;
    message: string;
    data: PendingLeaveRequestDto[];
};

type ManagerStatsResponse = {
    success: boolean;
    message: string;
    pendingCount: number;
    employeesWithPending: number;
    approvedThisMonth: number;
    rejectedThisMonth: number;
};

const ManagerDashboard: React.FC<ManagerProps> = ({ userEmail, onLogout, onNavigateToPending }) => {
    const now = new Date();
    const [managerName, setManagerName] = useState("Manager");
    const [pendingCount, setPendingCount] = useState(0);
    const [dashboardPendingCount, setDashboardPendingCount] = useState(0);
    const [pendingListLoadFailed, setPendingListLoadFailed] = useState(false);
    const [approvedThisMonth, setApprovedThisMonth] = useState(0);
    const [rejectedThisMonth, setRejectedThisMonth] = useState(0);
    const [employeesWithPending, setEmployeesWithPending] = useState(0);
    const [pendingRequests, setPendingRequests] = useState<PendingLeaveRequestDto[]>([]);
    const [managerNotice, setManagerNotice] = useState("");
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [dataError, setDataError] = useState("");
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [lastReadAt, setLastReadAt] = useState<string>("");
    const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(now.getFullYear());
    const [isExporting, setIsExporting] = useState(false);
    const previousPendingCountRef = useRef<number | null>(null);
    const noticeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const notificationStorageKey = `manager:lastReadNotificationAt:${userEmail}`;

    const monthOptions = useMemo(() => {
        return [
            { value: 1, label: "January" },
            { value: 2, label: "February" },
            { value: 3, label: "March" },
            { value: 4, label: "April" },
            { value: 5, label: "May" },
            { value: 6, label: "June" },
            { value: 7, label: "July" },
            { value: 8, label: "August" },
            { value: 9, label: "September" },
            { value: 10, label: "October" },
            { value: 11, label: "November" },
            { value: 12, label: "December" },
        ];
    }, []);

    const yearOptions = useMemo(() => {
        const currentYear = new Date().getFullYear();
        return Array.from({ length: 5 }, (_, index) => currentYear - 2 + index);
    }, []);

    const deriveNameFromEmail = (email: string) => {
        const local = email.split('@')[0] || 'Manager';
        return local
            .replace(/[._-]+/g, ' ')
            .split(' ')
            .filter(Boolean)
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
            .join(' ');
    };

    const showNotice = (message: string) => {
        setManagerNotice(message);

        if (noticeTimerRef.current) {
            clearTimeout(noticeTimerRef.current);
        }

        noticeTimerRef.current = setTimeout(() => {
            setManagerNotice("");
        }, 7000);
    };

    const formatPeriod = (startDate: string, endDate: string) => {
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
            return "Invalid date";
        }

        const formatDate = (date: Date) => date.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
        return `${formatDate(start)} - ${formatDate(end)}`;
    };

    const formatRelativeTime = (dateString: string) => {
        const date = new Date(dateString);
        if (Number.isNaN(date.getTime())) return "Recently";

        const diffMs = Date.now() - date.getTime();
        const minutes = Math.floor(diffMs / (1000 * 60));
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (minutes < 60) return `${Math.max(1, minutes)} minutes ago`;
        if (hours < 24) return `${hours} hours ago`;
        if (days < 7) return `${days} days ago`;
        return date.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
    };

    const recentActivities = useMemo(() => {
        return pendingRequests.slice(0, 3).map((req) => ({
            title: `New submission from ${req.userFullName}`,
            time: formatRelativeTime(req.createdAt),
            color: "blue",
        }));
    }, [pendingRequests]);

    const notificationItems = useMemo(() => {
        return pendingRequests
            .slice(0, 10)
            .map((req) => ({
                id: req.id,
                title: `Leave request from ${req.userFullName}`,
                time: req.createdAt,
                subtitle: `${req.userPosition || req.userRole} • ${req.totalDays} day(s) • ${formatPeriod(req.startDate, req.endDate)}`,
            }));
    }, [pendingRequests]);

    const unreadCount = useMemo(() => {
        if (!lastReadAt) return notificationItems.length;
        const lastReadTime = new Date(lastReadAt).getTime();
        return notificationItems.filter((item) => new Date(item.time).getTime() > lastReadTime).length;
    }, [lastReadAt, notificationItems]);

    const effectivePendingCount = useMemo(() => {
        return Math.max(pendingCount, dashboardPendingCount, pendingRequests.length);
    }, [pendingCount, dashboardPendingCount, pendingRequests.length]);

    useEffect(() => {
        const loadManagerDashboard = async () => {
            setIsLoadingData(true);
            setDataError("");
            try {
                const [dashboardRes, statsRes, pendingRes] = await Promise.all([
                    fetch(`http://localhost:8080/api/leave/dashboard?email=${encodeURIComponent(userEmail)}&t=${Date.now()}`, { cache: "no-store" }),
                    fetch(`http://localhost:8080/api/admin/dashboard-stats?email=${encodeURIComponent(userEmail)}&t=${Date.now()}`, { cache: "no-store" }),
                    fetch(`http://localhost:8080/api/admin/pending-requests?email=${encodeURIComponent(userEmail)}&t=${Date.now()}`, { cache: "no-store" }),
                ]);

                let pendingFromList: PendingLeaveRequestDto[] = [];
                let fallbackErrorMessage = "";

                if (dashboardRes.ok) {
                    const dashboardData: ManagerDashboardApiResponse = await dashboardRes.json();
                    if (dashboardData.success) {
                        setManagerName(dashboardData.user?.fullName || "Manager");
                        setDashboardPendingCount(dashboardData.pendingCount || 0);
                    }
                } else {
                    setManagerName(deriveNameFromEmail(userEmail));
                    fallbackErrorMessage = "Không tải được dashboard cơ bản";
                }

                if (statsRes.ok) {
                    const statsData: ManagerStatsResponse = await statsRes.json();
                    if (statsData.success) {
                        setApprovedThisMonth(statsData.approvedThisMonth || 0);
                        setRejectedThisMonth(statsData.rejectedThisMonth || 0);
                        setEmployeesWithPending(statsData.employeesWithPending || 0);
                    }
                }

                if (pendingRes.ok) {
                    const pendingData: PendingApiResponse = await pendingRes.json();
                    if (pendingData.success) {
                        pendingFromList = pendingData.data || [];
                        setPendingRequests(pendingFromList);
                        setPendingCount(pendingFromList.length);
                        setPendingListLoadFailed(false);
                    } else {
                        setPendingListLoadFailed(true);
                        fallbackErrorMessage = fallbackErrorMessage || pendingData.message || "Không tải được danh sách chờ duyệt";
                    }
                } else {
                    setPendingListLoadFailed(true);
                    try {
                        const pendingError = await pendingRes.json();
                        fallbackErrorMessage = fallbackErrorMessage || pendingError?.message || "Không tải được danh sách chờ duyệt";
                    } catch {
                        fallbackErrorMessage = fallbackErrorMessage || "Không tải được danh sách chờ duyệt";
                    }
                }

                if (!statsRes.ok && pendingRes.ok) {
                    const uniqueUsers = new Set(pendingFromList.map((request) => request.userId));
                    setEmployeesWithPending(uniqueUsers.size);
                }

                if (!dashboardRes.ok && !pendingRes.ok && fallbackErrorMessage) {
                    setDataError(fallbackErrorMessage);
                }
            } catch {
                setManagerName(deriveNameFromEmail(userEmail));
                setDataError("Không thể tải dữ liệu dashboard quản lý");
            } finally {
                setIsLoadingData(false);
            }
        };

        if (userEmail) {
            loadManagerDashboard();
        }
    }, [userEmail]);

    useEffect(() => {
        return () => {
            if (noticeTimerRef.current) {
                clearTimeout(noticeTimerRef.current);
            }
        };
    }, []);

    useEffect(() => {
        const saved = localStorage.getItem(notificationStorageKey);
        if (saved) {
            setLastReadAt(saved);
        }
    }, [notificationStorageKey]);

    useEffect(() => {
        if (!("Notification" in window)) return;

        if (Notification.permission === "default") {
            Notification.requestPermission().catch(() => {
                // Ignore permission failures.
            });
        }
    }, []);

    useEffect(() => {
        const previous = previousPendingCountRef.current;

        if (previous === null) {
            previousPendingCountRef.current = pendingCount;
            return;
        }

        if (pendingCount > previous) {
            const delta = pendingCount - previous;
            const message = `${delta} new leave request${delta > 1 ? "s" : ""} need review.`;
            showNotice(message);

            if ("Notification" in window && Notification.permission === "granted") {
                new Notification("New leave request", {
                    body: message,
                });
            }
        }

        previousPendingCountRef.current = pendingCount;
    }, [pendingCount]);

    useEffect(() => {
        if (!userEmail) return;

        const interval = setInterval(async () => {
            try {
                const [statsRes, pendingRes] = await Promise.all([
                    fetch(`http://localhost:8080/api/admin/dashboard-stats?email=${encodeURIComponent(userEmail)}&t=${Date.now()}`, { cache: "no-store" }),
                    fetch(`http://localhost:8080/api/admin/pending-requests?email=${encodeURIComponent(userEmail)}&t=${Date.now()}`, { cache: "no-store" }),
                ]);

                if (statsRes.ok) {
                    const statsData: ManagerStatsResponse = await statsRes.json();
                    if (statsData.success) {
                        setApprovedThisMonth(statsData.approvedThisMonth || 0);
                        setRejectedThisMonth(statsData.rejectedThisMonth || 0);
                        setEmployeesWithPending(statsData.employeesWithPending || 0);
                        setPendingCount(statsData.pendingCount || 0);
                    }
                }

                if (pendingRes.ok) {
                    const pendingData: PendingApiResponse = await pendingRes.json();
                    if (pendingData.success) {
                        const nextPending = pendingData.data || [];
                        setPendingRequests(nextPending);
                        setPendingCount(nextPending.length);
                        setPendingListLoadFailed(false);

                        if (!statsRes.ok) {
                            const uniqueUsers = new Set(nextPending.map((request) => request.userId));
                            setEmployeesWithPending(uniqueUsers.size);
                        }
                    } else {
                        setPendingListLoadFailed(true);
                    }
                } else {
                    setPendingListLoadFailed(true);
                }
            } catch {
                // Silent polling failure.
            }
        }, 30000);

        return () => clearInterval(interval);
    }, [userEmail]);

    const markAllNotificationsRead = () => {
        const now = new Date().toISOString();
        setLastReadAt(now);
        localStorage.setItem(notificationStorageKey, now);
    };

    const handleNotificationBellClick = () => {
        const nextOpen = !isNotificationOpen;
        setIsNotificationOpen(nextOpen);

        if (nextOpen) {
            markAllNotificationsRead();
        }
    };

    const handleExportMonthlyReport = async () => {
        setIsExporting(true);
        setDataError("");

        try {
            const response = await fetch(
                `http://localhost:8080/api/admin/reports/monthly-export?email=${encodeURIComponent(userEmail)}&month=${selectedMonth}&year=${selectedYear}`,
                { method: "GET" }
            );

            if (!response.ok) {
                let errorMessage = "Failed to export monthly report";
                try {
                    const errorPayload = await response.json();
                    errorMessage = errorPayload?.message || errorMessage;
                } catch {
                    // Ignore parse error and keep fallback message.
                }
                setDataError(errorMessage);
                return;
            }

            const blob = await response.blob();
            const fileName = `monthly_leave_report_${selectedYear}_${String(selectedMonth).padStart(2, "0")}.csv`;
            const downloadUrl = window.URL.createObjectURL(blob);
            const anchor = document.createElement("a");
            anchor.href = downloadUrl;
            anchor.download = fileName;
            document.body.appendChild(anchor);
            anchor.click();
            anchor.remove();
            window.URL.revokeObjectURL(downloadUrl);

            showNotice("Monthly report exported successfully.");
        } catch {
            setDataError("Cannot export monthly report right now");
        } finally {
            setIsExporting(false);
        }
    };

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
                    <button type="button" className="menu-item active">
                        <span className="icon">⊞</span> Dashboard
                    </button>
                    <button type="button" className="menu-item" onClick={onNavigateToPending}>
                        <span className="icon">◷</span> Pending Requests
                    </button>
                </nav>

                <div className="sidebar-footer">
                    <div className="user-info-mini">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="Avatar" />
                        <div className="user-text">
                            <p className="user-name">{managerName}</p>
                            <p className="user-role">Department Manager</p>
                        </div>
                    </div>
                    <button className="settings-btn" onClick={onLogout}>Logout</button>
                </div>
            </aside>

            {/* --- MAIN CONTENT --- */}
            <main className="main-content">
                <header className="header">
                    <div className="header-left">
                        <h2>Manager Dashboard</h2>
                        <p>Welcome back, {managerName}. Here's your overview.</p>
                    </div>
                    <div className="header-right">
                        {effectivePendingCount > 0 && <div className="pending-badge">{effectivePendingCount} pending</div>}
                        <div className="system-online">
                            <span className="online-dot"></span> System Online
                        </div>
                        <button className="notif-btn" onClick={handleNotificationBellClick}>
                            🔔
                            {unreadCount > 0 && <span className="notif-count">{unreadCount}</span>}
                        </button>
                        <button className="manager-btn" onClick={onLogout}>Manager ⮞</button>
                    </div>
                </header>

                {managerNotice && <div className="manager-notice">{managerNotice}</div>}

                {dataError && <div className="manager-notice">{dataError}</div>}

                {pendingListLoadFailed && (
                    <div className="manager-notice">
                        Pending list is temporarily unavailable. Count is using fallback source.
                    </div>
                )}

                {isNotificationOpen && (
                    <div className="manager-notification-center">
                        <div className="manager-notification-head">
                            <h4>Notification Center</h4>
                            <button type="button" onClick={markAllNotificationsRead}>Mark all as read</button>
                        </div>

                        {notificationItems.length === 0 ? (
                            <p className="manager-notification-empty">No notifications</p>
                        ) : (
                            <div className="manager-notification-list">
                                {notificationItems.map((item) => (
                                    <button
                                        key={item.id}
                                        type="button"
                                        className="manager-notification-item"
                                        onClick={onNavigateToPending}
                                    >
                                        <div className="manager-notification-title">{item.title}</div>
                                        <div className="manager-notification-sub">{item.subtitle}</div>
                                        <div className="manager-notification-time">{formatRelativeTime(item.time)}</div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                <div className="dashboard-body">
                    {/* Cột Trái */}
                    <div className="body-left">
                        {/* Banner Blue */}
                        <div className="urgent-banner">
                            <span className="banner-tag">URGENT REVIEW</span>
                            <h1>{isLoadingData ? "Đang tải dữ liệu..." : `${effectivePendingCount} Pending Requests`}</h1>
                            <p>Requires your immediate approval for next week's roster.</p>
                            <div className="banner-actions">
                                <button className="btn-white" onClick={onNavigateToPending}>Go to Pending Requests</button>
                                <button className="btn-outline">View Analytics</button>
                            </div>
                        </div>

                        {/* Danh sách List */}
                        <div className="list-section-container">
                            <div className="list-header">
                                <h3>Pending Approval List</h3>
                                <button className="view-all-link" onClick={onNavigateToPending}>View All Requests</button>
                            </div>
                            <div className="approval-list">
                                {isLoadingData ? (
                                    <div className="approval-row">
                                        <div className="row-user">
                                            <div>
                                                <p className="u-name">Đang tải danh sách chờ duyệt...</p>
                                            </div>
                                        </div>
                                    </div>
                                ) : pendingRequests.length === 0 ? (
                                    <div className="approval-row">
                                        <div className="row-user">
                                            <div>
                                                <p className="u-name">No pending requests</p>
                                                <p className="u-type">All caught up</p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    pendingRequests.slice(0, 5).map((request) => (
                                        <ApprovalItem
                                            key={request.id}
                                            name={request.userFullName}
                                            type={`${request.userPosition || request.userRole} • ${request.totalDays} Days`}
                                            period={formatPeriod(request.startDate, request.endDate)}
                                        />
                                    ))
                                )}
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
                                    <select
                                        value={selectedMonth}
                                        onChange={(event) => setSelectedMonth(Number(event.target.value))}
                                        disabled={isExporting}
                                    >
                                        {monthOptions.map((month) => (
                                            <option key={month.value} value={month.value}>
                                                {month.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="select-group">
                                    <label>YEAR</label>
                                    <select
                                        value={selectedYear}
                                        onChange={(event) => setSelectedYear(Number(event.target.value))}
                                        disabled={isExporting}
                                    >
                                        {yearOptions.map((year) => (
                                            <option key={year} value={year}>
                                                {year}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <button
                                className="btn-export"
                                onClick={handleExportMonthlyReport}
                                disabled={isExporting}
                            >
                                {isExporting ? "Exporting..." : "📥 Export Monthly Report"}
                            </button>
                        </div>
                    </div>

                    {/* Cột Phải */}
                    <div className="body-right">
                        <StatCard label="EMPLOYEES WITH PENDING" value={String(employeesWithPending)} icon="👥" />
                        <StatCard label="APPROVED THIS MONTH" value={String(approvedThisMonth)} icon="✅" active />
                        <StatCard label="REJECTED THIS MONTH" value={String(rejectedThisMonth)} icon="❌" />

                        <div className="activity-card">
                            <h3>Recent Activity</h3>
                            <div className="timeline">
                                {recentActivities.length === 0 ? (
                                    <ActivityItem title="No recent pending activity" time="-" color="blue" />
                                ) : (
                                    recentActivities.map((activity) => (
                                        <ActivityItem
                                            key={`${activity.title}-${activity.time}`}
                                            title={activity.title}
                                            time={activity.time}
                                            color={activity.color}
                                        />
                                    ))
                                )}
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
type ApprovalItemProps = {
    name: string;
    type: string;
    period: string;
};

const ApprovalItem = ({ name, type, period }: ApprovalItemProps) => (
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

type StatCardProps = {
    label: string;
    value: string;
    icon: string;
    active?: boolean;
};

const StatCard = ({ label, value, icon, active }: StatCardProps) => (
    <div className={`stat-card-v2 ${active ? 'active' : ''}`}>
        <div className="stat-info">
            <label>{label}</label>
            <p>{value}</p>
        </div>
        <div className="stat-icon-v2">{icon}</div>
    </div>
);

type ActivityItemProps = {
    title: string;
    time: string;
    color: string;
};

const ActivityItem = ({ title, time, color }: ActivityItemProps) => (
    <div className="activity-row">
        <div className={`activity-dot ${color}`}></div>
        <div className="activity-text">
            <p>{title}</p>
            <span>{time}</span>
        </div>
    </div>
);

export default ManagerDashboard;