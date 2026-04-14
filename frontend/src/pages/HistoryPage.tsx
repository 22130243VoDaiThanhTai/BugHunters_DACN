import React, { useEffect, useMemo, useState } from "react";

type HistoryPageProps = {
    userEmail: string;
    onBackToDashboard: () => void;
    onNavigateToSubmit: () => void;
    onViewDetail: (id: number) => void;
};

type LeaveStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

type LeaveRequestDto = {
    id: number;
    startDate: string;
    endDate: string;
    totalDays: number;
    reason: string;
    status: LeaveStatus;
};

type DashboardResponse = {
    success: boolean;
    message: string;
    user?: {
        id: number;
        fullName: string;
        department: string;
        position: string;
        role: string;
    };
    leaveBalance?: {
        totalDays: number;
        usedDays: number;
        remainingDays: number;
    };
    pendingCount?: number;
    recentRequests?: LeaveRequestDto[];
};

type HistoryResponse = {
    success: boolean;
    message: string;
    requests?: LeaveRequestDto[];
};

type ViewMode = "list" | "detail";

type LeaveRequestViewModel = {
    id: number;
    title: string;
    startDate: string;
    endDate: string;
    totalDays: number;
    reason: string;
    status: LeaveStatus;
    submittedText: string;
    dateRangeText: string;
    typeIcon: "annual" | "personal" | "sick";
};

const API_BASE_URL = "http://localhost:8080";

const palette = {
    bg: "#f3f5f8",
    card: "#ffffff",
    border: "#e8edf3",
    text: "#1f2d3d",
    subtext: "#7d8a9a",
    primary: "#1565d8",
    primarySoft: "#e8f1ff",
    danger: "#ea4335",
    dangerSoft: "#fff1f0",
    success: "#16a34a",
    warning: "#f59e0b",
};

const IconBack = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M19 12H5" />
        <path d="M12 19l-7-7 7-7" />
    </svg>
);

const IconCalendar = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);

const IconClock = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v6l4 2" />
    </svg>
);

const IconFlag = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
        <line x1="4" y1="22" x2="4" y2="15" />
    </svg>
);

const IconUser = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

const IconMedical = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <path d="M12 8v8" />
        <path d="M8 12h8" />
    </svg>
);

const IconWarning = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
);

const IconShield = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
);

const getStatusColors = (status: LeaveStatus) => {
    switch (status) {
        case "APPROVED":
            return { bg: "#e7f6ec", color: "#17803d" };
        case "PENDING":
            return { bg: "#fff3d6", color: "#b7791f" };
        case "REJECTED":
            return { bg: "#ffe4e1", color: "#d93025" };
        default:
            return { bg: "#edf2f7", color: "#64748b" };
    }
};

const inferLeaveType = (reason: string): LeaveRequestViewModel["title"] => {
    const text = (reason || "").toLowerCase();

    if (
        text.includes("sick") ||
        text.includes("ốm") ||
        text.includes("hospital") ||
        text.includes("doctor") ||
        text.includes("medical")
    ) {
        return "Sick Leave";
    }

    if (
        text.includes("family") ||
        text.includes("personal") ||
        text.includes("wedding") ||
        text.includes("private")
    ) {
        return "Personal Leave";
    }

    return "Annual Leave";
};

const inferTypeIcon = (title: string): LeaveRequestViewModel["typeIcon"] => {
    if (title === "Sick Leave") return "sick";
    if (title === "Personal Leave") return "personal";
    return "annual";
};

const formatShortDate = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
    }).format(date);
};

const formatDateRange = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
        return `${start} - ${end}`;
    }

    const startText = new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "2-digit",
    }).format(startDate);

    const endText = new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
    }).format(endDate);

    return `${startText} - ${endText}`;
};

const deriveNameFromEmail = (email: string) => {
    const local = email.split("@")[0] || "Employee";
    return local
        .replace(/[._-]+/g, " ")
        .split(" ")
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
};

const getAvatarUrl = (name: string) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=E8EEF9&color=1F2D3D&rounded=true&size=96`;

const getAvailabilityPercent = (requests: LeaveRequestViewModel[], activeId: number) => {
    const pendingOrApproved = requests.filter(
        (item) => item.id !== activeId && (item.status === "PENDING" || item.status === "APPROVED")
    ).length;

    const percent = Math.max(55, 100 - pendingOrApproved * 7);
    return Math.min(percent, 95);
};

const getOverlapCount = (requests: LeaveRequestViewModel[], activeRequest: LeaveRequestViewModel) => {
    const startA = new Date(activeRequest.startDate).getTime();
    const endA = new Date(activeRequest.endDate).getTime();

    return requests.filter((item) => {
        if (item.id === activeRequest.id) return false;
        if (!(item.status === "PENDING" || item.status === "APPROVED")) return false;

        const startB = new Date(item.startDate).getTime();
        const endB = new Date(item.endDate).getTime();

        return startA <= endB && startB <= endA;
    }).length;
};

const LeaveTypeIcon: React.FC<{ type: LeaveRequestViewModel["typeIcon"] }> = ({ type }) => {
    const commonBox: React.CSSProperties = {
        width: 44,
        height: 44,
        borderRadius: 14,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#eef4ff",
        color: palette.primary,
        flexShrink: 0,
    };

    if (type === "personal") {
        return (
            <div style={commonBox}>
                <IconUser />
            </div>
        );
    }

    if (type === "sick") {
        return (
            <div style={commonBox}>
                <IconMedical />
            </div>
        );
    }

    return (
        <div style={commonBox}>
            <IconFlag />
        </div>
    );
};

type LeaveRequestCardProps = {
    item: LeaveRequestViewModel;
    onClick: (item: LeaveRequestViewModel) => void;
};

const LeaveRequestCard: React.FC<LeaveRequestCardProps> = ({ item, onClick }) => {
    const statusStyle = getStatusColors(item.status);

    return (
        <button
            type="button"
            onClick={() => onClick(item)}
            style={{
                width: "100%",
                border: `1px solid ${palette.border}`,
                background: palette.card,
                borderRadius: 20,
                padding: 20,
                cursor: "pointer",
                textAlign: "left",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 18,
                transition: "all 0.2s ease",
                boxShadow: "0 8px 24px rgba(15, 23, 42, 0.04)",
            }}
        >
            <div style={{ display: "flex", alignItems: "center", gap: 16, minWidth: 0 }}>
                <LeaveTypeIcon type={item.typeIcon} />
                <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: palette.text, marginBottom: 6 }}>
                        {item.title}
                    </div>
                    <div style={{ color: palette.subtext, fontSize: 14, marginBottom: 6 }}>
                        {item.dateRangeText}
                    </div>
                    <div style={{ color: palette.subtext, fontSize: 13 }}>
                        {item.totalDays} work day{item.totalDays > 1 ? "s" : ""} · submitted {item.submittedText}
                    </div>
                </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
                <span
                    style={{
                        padding: "8px 14px",
                        borderRadius: 999,
                        background: statusStyle.bg,
                        color: statusStyle.color,
                        fontSize: 12,
                        fontWeight: 800,
                        letterSpacing: 0.5,
                    }}
                >
                    {item.status}
                </span>

                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8A94A6" strokeWidth="2">
                    <path d="M9 18l6-6-6-6" />
                </svg>
            </div>
        </button>
    );
};

type LeaveRequestDetailProps = {
    item: LeaveRequestViewModel;
    employeeName: string;
    employeeRole: string;
    department: string;
    remainingDays: number;
    currentBalance: number;
    availabilityPercent: number;
    overlapCount: number;
    onBack: () => void;
    onCancel?: (requestId: number) => void;
};

const LeaveRequestDetail: React.FC<LeaveRequestDetailProps> = ({
                                                                   item,
                                                                   employeeName,
                                                                   employeeRole,
                                                                   department,
                                                                   remainingDays,
                                                                   currentBalance,
                                                                   availabilityPercent,
                                                                   overlapCount,
                                                                   onBack,
                                                                   onCancel,
                                                               }) => {
    const statusStyle = getStatusColors(item.status);
    const avatarUrl = getAvatarUrl(employeeName);

    return (
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 18,
                    padding: "0 4px 18px",
                    borderBottom: `1px solid ${palette.border}`,
                    marginBottom: 22,
                }}
            >
                <button
                    type="button"
                    onClick={onBack}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        border: "none",
                        background: "transparent",
                        color: "#6b7a90",
                        cursor: "pointer",
                        fontWeight: 600,
                    }}
                >
                    <IconBack />
                    Back to requests
                </button>

                <div style={{ fontSize: 22, fontWeight: 700, color: palette.primary }}>
                    Detail Requests
                </div>
            </div>

            <div
                style={{
                    background: palette.card,
                    borderRadius: 22,
                    border: `1px solid ${palette.border}`,
                    boxShadow: "0 14px 32px rgba(15, 23, 42, 0.06)",
                    padding: 28,
                }}
            >
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1.4fr 0.9fr",
                        gap: 24,
                    }}
                >
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 18 }}>
                            <img
                                src={avatarUrl}
                                alt={employeeName}
                                style={{ width: 62, height: 62, borderRadius: 18, objectFit: "cover" }}
                            />

                            <div>
                                <div style={{ fontSize: 18, fontWeight: 800, color: palette.text }}>
                                    {employeeName}
                                </div>
                                <div style={{ color: palette.subtext, fontSize: 14, marginTop: 4 }}>
                                    {employeeRole} · {department}
                                </div>

                                <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 10 }}>
                                    <div
                                        style={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: 6,
                                            color: item.status === "REJECTED" ? palette.danger : palette.primary,
                                            fontSize: 11,
                                            fontWeight: 800,
                                            letterSpacing: 0.5,
                                        }}
                                    >
                                        <IconShield />
                                        {item.status === "REJECTED" ? "REJECT APPROVAL" : "LEAVE REQUEST"}
                                    </div>

                                    <span
                                        style={{
                                            padding: "5px 10px",
                                            borderRadius: 999,
                                            background: statusStyle.bg,
                                            color: statusStyle.color,
                                            fontSize: 10,
                                            fontWeight: 800,
                                            letterSpacing: 0.5,
                                        }}
                                    >
                                        {item.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr",
                                gap: 16,
                                marginBottom: 18,
                            }}
                        >
                            <div
                                style={{
                                    background: "#f7f9fc",
                                    border: `1px solid ${palette.border}`,
                                    borderRadius: 16,
                                    padding: 18,
                                }}
                            >
                                <div style={{ color: palette.subtext, fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>
                                    DURATION
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
                                    <div style={{ color: palette.primary }}>
                                        <IconClock />
                                    </div>
                                    <div>
                                        <span style={{ fontSize: 34, fontWeight: 800, color: palette.primary, lineHeight: 1 }}>
                                            {item.totalDays}
                                        </span>
                                        <span style={{ marginLeft: 6, color: palette.text, fontWeight: 600 }}>
                                            Work Days
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div
                                style={{
                                    background: "#f7f9fc",
                                    border: `1px solid ${palette.border}`,
                                    borderRadius: 16,
                                    padding: 18,
                                }}
                            >
                                <div style={{ color: palette.subtext, fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>
                                    DATE RANGE
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}>
                                    <div style={{ color: palette.primary }}>
                                        <IconCalendar />
                                    </div>
                                    <div style={{ color: palette.text, fontWeight: 700 }}>
                                        {item.dateRangeText}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{ marginBottom: 10, color: palette.danger, fontSize: 12, fontWeight: 700 }}>
                            {item.status === "REJECTED" ? "Reason Reject" : "Reason"}
                        </div>

                        <div
                            style={{
                                background: "#eef3f8",
                                borderLeft: `3px solid ${item.status === "REJECTED" ? palette.danger : palette.primary}`,
                                borderRadius: 12,
                                padding: 18,
                                color: "#5f6f82",
                                lineHeight: 1.7,
                                minHeight: 110,
                            }}
                        >
                            "{item.reason || "No reason provided"}"
                        </div>

                        <div style={{ marginTop: 24 }}>
                            {item.status === "PENDING" ? (
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (onCancel && window.confirm("Are you sure you want to cancel this leave request?")) {
                                            onCancel(item.id);
                                        }
                                    }}
                                    style={{
                                        width: "100%",
                                        border: "none",
                                        background: palette.danger,
                                        color: "#fff",
                                        height: 44,
                                        borderRadius: 10,
                                        fontWeight: 700,
                                        cursor: "pointer",
                                    }}
                                >
                                    Cancel Request
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={onBack}
                                    style={{
                                        width: "100%",
                                        border: "none",
                                        background: palette.primary,
                                        color: "#fff",
                                        height: 44,
                                        borderRadius: 10,
                                        fontWeight: 700,
                                        cursor: "pointer",
                                    }}
                                >
                                    Back
                                </button>
                            )}
                        </div>
                    </div>

                    <div>
                        <div
                            style={{
                                background: "#f7f9fc",
                                border: `1px solid ${palette.border}`,
                                borderRadius: 16,
                                padding: 18,
                                marginBottom: 16,
                            }}
                        >
                            <div style={{ color: palette.subtext, fontSize: 11, fontWeight: 700, letterSpacing: 1, marginBottom: 14 }}>
                                TEAM AVAILABILITY
                            </div>

                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                                <div style={{ color: palette.text, fontSize: 12, fontWeight: 700 }}>
                                    {department || "Team"}
                                </div>
                                <div style={{ color: palette.primary, fontSize: 11, fontWeight: 800 }}>
                                    {availabilityPercent}% Available
                                </div>
                            </div>

                            <div
                                style={{
                                    width: "100%",
                                    height: 6,
                                    background: "#e6ebf2",
                                    borderRadius: 999,
                                    overflow: "hidden",
                                    marginBottom: 10,
                                }}
                            >
                                <div
                                    style={{
                                        width: `${availabilityPercent}%`,
                                        height: "100%",
                                        background: palette.primary,
                                        borderRadius: 999,
                                    }}
                                />
                            </div>

                            <div style={{ color: palette.subtext, fontSize: 12, lineHeight: 1.6 }}>
                                {overlapCount > 0
                                    ? `${overlapCount} other team member(s) are on leave during this period.`
                                    : "No major overlap detected during this period."}
                            </div>
                        </div>

                        <div
                            style={{
                                background: palette.card,
                                border: `1px solid ${palette.border}`,
                                borderRadius: 16,
                                padding: 18,
                            }}
                        >
                            <div style={{ color: palette.subtext, fontSize: 11, fontWeight: 700, letterSpacing: 1, marginBottom: 14 }}>
                                BALANCE IMPACT
                            </div>

                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr auto 1fr",
                                    alignItems: "center",
                                    gap: 12,
                                }}
                            >
                                <div>
                                    <div style={{ color: palette.subtext, fontSize: 10, fontWeight: 700 }}>CURRENT</div>
                                    <div style={{ fontSize: 30, fontWeight: 800, color: palette.text }}>
                                        {currentBalance}
                                        <span style={{ fontSize: 16, fontWeight: 600, marginLeft: 4 }}>days</span>
                                    </div>
                                </div>

                                <div style={{ color: "#9aa7b8", fontSize: 24 }}>→</div>

                                <div>
                                    <div style={{ color: palette.subtext, fontSize: 10, fontWeight: 700 }}>REMAINING</div>
                                    <div style={{ fontSize: 30, fontWeight: 800, color: palette.primary }}>
                                        {remainingDays}
                                        <span style={{ fontSize: 16, fontWeight: 600, marginLeft: 4 }}>days</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const HistoryPage: React.FC<HistoryPageProps> = ({ userEmail, onBackToDashboard, onViewDetail }) => {
    const [loading, setLoading] = useState(true);
    const [requests, setRequests] = useState<LeaveRequestViewModel[]>([]);
    const [employeeName, setEmployeeName] = useState("");
    const [employeeRole, setEmployeeRole] = useState("Employee");
    const [department, setDepartment] = useState("Engineering");
    const [totalBalance, setTotalBalance] = useState(18);
    const [remainingBalance, setRemainingBalance] = useState(12);
    const [viewMode, setViewMode] = useState<ViewMode>("list");
    const [selectedRequest, setSelectedRequest] = useState<LeaveRequestViewModel | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!userEmail) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);

                const [dashboardRes, historyRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/api/leave/dashboard?email=${encodeURIComponent(userEmail)}`),
                    fetch(`${API_BASE_URL}/api/leave/requests/me?email=${encodeURIComponent(userEmail)}`),
                ]);

                let dashboardData: DashboardResponse | null = null;
                let historyData: HistoryResponse | null = null;

                if (dashboardRes.ok) dashboardData = await dashboardRes.json();
                if (historyRes.ok) historyData = await historyRes.json();

                const user = dashboardData?.user;
                const leaveBalance = dashboardData?.leaveBalance;
                const rawRequests = historyData?.requests || [];

                const mapped: LeaveRequestViewModel[] = rawRequests.map((item) => {
                    const title = inferLeaveType(item.reason);

                    return {
                        id: item.id,
                        title,
                        startDate: item.startDate,
                        endDate: item.endDate,
                        totalDays: item.totalDays,
                        reason: item.reason,
                        status: item.status,
                        submittedText: formatShortDate(item.startDate),
                        dateRangeText: formatDateRange(item.startDate, item.endDate),
                        typeIcon: inferTypeIcon(title),
                    };
                });

                setRequests(mapped);
                setEmployeeName(user?.fullName || deriveNameFromEmail(userEmail));
                setEmployeeRole(user?.position || user?.role || "Employee");
                setDepartment(user?.department || "Engineering");
                setTotalBalance(leaveBalance?.totalDays ?? 18);
                setRemainingBalance(leaveBalance?.remainingDays ?? 12);
            } catch (error) {
                console.error("Failed to fetch leave data:", error);
                setEmployeeName(deriveNameFromEmail(userEmail));
                setEmployeeRole("Employee");
                setDepartment("Engineering");
                setRequests([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userEmail]);

    const detailRemainingBalance = useMemo(() => {
        if (!selectedRequest) return remainingBalance;
        return Math.max(0, totalBalance - selectedRequest.totalDays);
    }, [remainingBalance, selectedRequest, totalBalance]);

    const availabilityPercent = useMemo(() => {
        if (!selectedRequest) return 85;
        return getAvailabilityPercent(requests, selectedRequest.id);
    }, [requests, selectedRequest]);

    const overlapCount = useMemo(() => {
        if (!selectedRequest) return 0;
        return getOverlapCount(requests, selectedRequest);
    }, [requests, selectedRequest]);

    const openDetail = (item: LeaveRequestViewModel) => {
        onViewDetail(item.id);
    };

    const handleCancel = async (requestId: number) => {
        try {
            const res = await fetch(
                `${API_BASE_URL}/api/leave/requests/${requestId}/cancel?email=${encodeURIComponent(userEmail)}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await res.json();

            if (data.success) {
                alert("Leave request cancelled successfully");
                // Update the requests list
                setRequests((prev) =>
                    prev.map((req) =>
                        req.id === requestId ? { ...req, status: "CANCELLED" } : req
                    )
                );
                // Go back to list view
                setSelectedRequest(null);
                setViewMode("list");
            } else {
                alert(data.message || "Failed to cancel request");
            }
        } catch (error) {
            alert("Error cancelling request. Please try again.");
            console.error(error);
        }
    };

    const closeDetail = () => {
        setSelectedRequest(null);
        setViewMode("list");
    };

    if (loading) {
        return (
            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: palette.bg,
                    color: palette.text,
                    fontSize: 16,
                    fontWeight: 600,
                }}
            >
                Loading...
            </div>
        );
    }

    return (
        <div
            style={{
                minHeight: "100vh",
                background: palette.bg,
                padding: "28px 20px",
                fontFamily: "Inter, Segoe UI, Arial, sans-serif",
            }}
        >
            {viewMode === "list" ? (
                <div style={{ maxWidth: 980, margin: "0 auto" }}>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: 22,
                        }}
                    >
                        <div>
                            <div style={{ fontSize: 30, fontWeight: 800, color: palette.text }}>
                                My Leave Requests
                            </div>
                            <div style={{ color: palette.subtext, marginTop: 6 }}>
                                Click one leave request to open detail page.
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={onBackToDashboard}
                            style={{
                                border: `1px solid ${palette.border}`,
                                background: "#fff",
                                color: palette.text,
                                borderRadius: 12,
                                height: 42,
                                padding: "0 16px",
                                fontWeight: 700,
                                cursor: "pointer",
                            }}
                        >
                            Back Dashboard
                        </button>
                    </div>

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                            gap: 16,
                            marginBottom: 24,
                        }}
                    >
                        <div
                            style={{
                                background: "#fff",
                                borderRadius: 18,
                                padding: 20,
                                border: `1px solid ${palette.border}`,
                            }}
                        >
                            <div style={{ color: palette.subtext, fontSize: 11, fontWeight: 800, letterSpacing: 1 }}>
                                EMPLOYEE
                            </div>
                            <div style={{ fontSize: 24, fontWeight: 800, color: palette.text, marginTop: 10 }}>
                                {employeeName}
                            </div>
                            <div style={{ color: palette.subtext, marginTop: 6 }}>{employeeRole}</div>
                        </div>

                        <div
                            style={{
                                background: "#fff",
                                borderRadius: 18,
                                padding: 20,
                                border: `1px solid ${palette.border}`,
                            }}
                        >
                            <div style={{ color: palette.subtext, fontSize: 11, fontWeight: 800, letterSpacing: 1 }}>
                                CURRENT BALANCE
                            </div>
                            <div style={{ fontSize: 36, fontWeight: 800, color: palette.text, marginTop: 10 }}>
                                {totalBalance}
                                <span style={{ fontSize: 14, fontWeight: 600, color: palette.subtext, marginLeft: 6 }}>
                                    Days
                                </span>
                            </div>
                        </div>

                        <div
                            style={{
                                background: "#fff",
                                borderRadius: 18,
                                padding: 20,
                                border: `1px solid ${palette.border}`,
                            }}
                        >
                            <div style={{ color: palette.subtext, fontSize: 11, fontWeight: 800, letterSpacing: 1 }}>
                                REMAINING
                            </div>
                            <div style={{ fontSize: 36, fontWeight: 800, color: palette.primary, marginTop: 10 }}>
                                {remainingBalance}
                                <span style={{ fontSize: 14, fontWeight: 600, color: palette.subtext, marginLeft: 6 }}>
                                    Days
                                </span>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        {requests.length > 0 ? (
                            requests.map((item) => (
                                <LeaveRequestCard key={item.id} item={item} onClick={openDetail} />
                            ))
                        ) : (
                            <div
                                style={{
                                    background: "#fff",
                                    borderRadius: 18,
                                    border: `1px solid ${palette.border}`,
                                    padding: 28,
                                    textAlign: "center",
                                    color: palette.subtext,
                                }}
                            >
                                No leave requests found.
                            </div>
                        )}
                    </div>
                </div>
            ) : selectedRequest ? (
                <LeaveRequestDetail
                    item={selectedRequest}
                    employeeName={employeeName}
                    employeeRole={employeeRole}
                    department={department}
                    remainingDays={detailRemainingBalance}
                    currentBalance={totalBalance}
                    availabilityPercent={availabilityPercent}
                    overlapCount={overlapCount}
                    onBack={closeDetail}
                    onCancel={handleCancel}
                />
            ) : null}

            {selectedRequest?.status === "REJECTED" && viewMode === "detail" && (
                <div
                    style={{
                        position: "fixed",
                        right: 22,
                        bottom: 20,
                        width: 44,
                        height: 44,
                        borderRadius: "50%",
                        background: "#fff",
                        border: `1px solid ${palette.border}`,
                        boxShadow: "0 10px 25px rgba(15,23,42,0.08)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: palette.primary,
                    }}
                >
                    <IconWarning />
                </div>
            )}
        </div>
    );
};

export default HistoryPage;