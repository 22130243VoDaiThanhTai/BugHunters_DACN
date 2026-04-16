import React, { useState } from "react";
import { Card, DatePicker, Input, Button, Typography, Alert } from "antd";
import type { Dayjs } from "dayjs";
import {
    CalendarOutlined,
} from "@ant-design/icons";
import "../styles/EmployeeDashboard.css";
import "../styles/RequestPageStyle.css";

const { Title, Text } = Typography;
const { TextArea } = Input;

type SubmitRequestPageProps = {
    userEmail: string;
    onBackToDashboard?: () => void;
    onNavigateToHistory?: () => void;
    onLogout?: () => void;
};

type SubmitApiResponse = {
    success: boolean;
    message: string;
};

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
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
);

const IconHistory = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="1 4 1 10 7 10" />
        <path d="M3.51 15a9 9 0 1 0 .49-4.95" />
    </svg>
);

const IconLogout = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
);

const SubmitRequestPage: React.FC<SubmitRequestPageProps> = ({
    userEmail,
    onBackToDashboard,
    onNavigateToHistory,
    onLogout,
}) => {
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState<Dayjs | null>(null);
    const [endDate, setEndDate] = useState<Dayjs | null>(null);
    const [reason, setReason] = useState("");
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);

    const displayName = (() => {
        const localPart = (userEmail || "User").split("@")[0];
        return localPart
            .replace(/[._-]+/g, " ")
            .split(" ")
            .filter(Boolean)
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
            .join(" ");
    })();

    const initials = displayName
        .split(" ")
        .filter(Boolean)
        .map((part) => part.charAt(0))
        .slice(0, 2)
        .join("")
        .toUpperCase();

    const clearForm = () => {
        setStartDate(null);
        setEndDate(null);
        setReason("");
    };

    const handleSubmitRequest = async () => {
        if (!startDate || !endDate) {
            setIsError(true);
            setMessage("Please select both start date and end date");
            return;
        }

        setLoading(true);
        setMessage("");
        setIsError(false);

        try {
            const response = await fetch("http://localhost:8080/api/leave/requests", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: userEmail,
                    startDate: startDate.format("YYYY-MM-DD"),
                    endDate: endDate.format("YYYY-MM-DD"),
                    reason,
                }),
            });

            const data: SubmitApiResponse = await response.json();
            if (!response.ok || !data.success) {
                setIsError(true);
                setMessage(data.message || "Submit request failed");
                return;
            }

            setIsError(false);
            setMessage(data.message || "Request submitted successfully");
            clearForm();
        } catch (error) {
            setIsError(true);
            setMessage("Cannot connect to backend server");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ed-root submit-page">
            <aside className="ed-sidebar">
                <div className="ed-logo">
                    <div className="ed-logo__icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                                stroke="white"
                                strokeWidth="2"
                            />
                        </svg>
                    </div>
                    <div>
                        <div className="ed-logo__name">Azure Horizon</div>
                        <div className="ed-logo__sub">Employee Portal</div>
                    </div>
                </div>

                <nav className="ed-nav">
                    <button type="button" className="ed-nav__btn" onClick={onBackToDashboard}>
                        <span className="ed-nav__icon"><IconDashboard /></span>
                        Dashboard
                    </button>
                    <button type="button" className="ed-nav__btn ed-nav__btn--active">
                        <span className="ed-nav__icon"><IconRequest /></span>
                        Submit Request
                    </button>
                    <button type="button" className="ed-nav__btn" onClick={onNavigateToHistory}>
                        <span className="ed-nav__icon"><IconHistory /></span>
                        History
                    </button>
                </nav>

                <div className="ed-manager-badge">
                    <div className="ed-manager-badge__title">Leave Portal</div>
                    <p className="ed-manager-badge__desc">
                        Prepare a request, choose your dates, and send it to your manager.
                    </p>
                </div>
            </aside>

            <main className="ed-main submit-main">
                <header className="ed-topbar">
                    <h2 className="ed-topbar__title">Request Time Off</h2>
                    <div className="ed-topbar__user">
                        <div className="ed-topbar__user-info">
                            <span className="ed-topbar__user-name">{displayName}</span>
                            <span className="ed-topbar__user-role">Employee</span>
                        </div>
                        <div className="ed-avatar ed-avatar--header">{initials || "U"}</div>
                        {onLogout && (
                            <button className="ed-logout-btn" onClick={onLogout}>
                                <IconLogout /> Logout
                            </button>
                        )}
                    </div>
                </header>

                <div className="submit-content">
                    <div className="content-container submit-container">
                        <div className="page-intro">
                            <div className="intro-text">
                                <Text type="secondary" className="breadcrumb">
                                    PORTAL {">"} LEAVE MANAGEMENT
                                </Text>
                                <Title level={2}>Request Time Off</Title>
                                <Text type="secondary">Plan your balance and notify your team leads.</Text>
                            </div>

                            <Card className="remaining-days-card">
                                <div className="days-info">
                                    <div className="calendar-icon-box">
                                        <CalendarOutlined />
                                    </div>
                                    <div>
                                        <Text type="secondary" className="label">REQUEST STATUS</Text>
                                        <div className="days-count">Ready to submit</div>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {message && (
                            <Alert
                                style={{ marginBottom: 16 }}
                                type={isError ? "error" : "success"}
                                message={message}
                                showIcon
                            />
                        )}

                        <div className="submit-grid-container">
                            <div className="form-section submit-form-section">
                                <Card className="main-form-card">
                                    <div className="date-row">
                                        <div className="input-field">
                                            <label>START DATE</label>
                                            <DatePicker
                                                placeholder="mm/dd/yyyy"
                                                className="full-width"
                                                value={startDate}
                                                onChange={setStartDate}
                                            />
                                        </div>
                                        <div className="input-field">
                                            <label>END DATE</label>
                                            <DatePicker
                                                placeholder="mm/dd/yyyy"
                                                className="full-width"
                                                value={endDate}
                                                onChange={setEndDate}
                                            />
                                        </div>
                                    </div>

                                    <div className="input-field reason-box">
                                        <label>REASON FOR LEAVE</label>
                                        <TextArea
                                            placeholder="Briefly describe your request (optional)..."
                                            rows={6}
                                            value={reason}
                                            onChange={(event) => setReason(event.target.value)}
                                        />
                                    </div>

                                    <div className="form-actions">
                                        <Button
                                            type="primary"
                                            size="large"
                                            className="submit-btn"
                                            loading={loading}
                                            onClick={handleSubmitRequest}
                                        >
                                            Submit Request
                                        </Button>
                                        <Button size="large" className="cancel-btn" onClick={onBackToDashboard}>
                                            Cancel
                                        </Button>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SubmitRequestPage;
