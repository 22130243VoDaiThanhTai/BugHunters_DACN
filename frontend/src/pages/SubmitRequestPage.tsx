import React, { useState } from "react";
import { Card, DatePicker, Input, Button, Typography, Alert } from "antd";
import type { Dayjs } from "dayjs";
import { CalendarOutlined } from "@ant-design/icons";
import "../styles/RequestPageStyle.css";

const { Title, Text } = Typography;
const { TextArea } = Input;

type SubmitRequestPageProps = {
    userEmail: string;
    onBackToDashboard?: () => void;
    onNavigateToHistory?: () => void;
};

type SubmitApiResponse = {
    success: boolean;
    message: string;
};

const SubmitRequestPage: React.FC<SubmitRequestPageProps> = ({ userEmail, onBackToDashboard, onNavigateToHistory }) => {
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState<Dayjs | null>(null);
    const [endDate, setEndDate] = useState<Dayjs | null>(null);
    const [reason, setReason] = useState("");
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);

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
        <div className="submit-content-only">
            <div className="page-intro">
                <div className="intro-text">
                    <Text type="secondary" className="breadcrumb">PORTAL {">"} LEAVE MANAGEMENT</Text>
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

            <div className="grid-container">
                <div className="form-section">
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
    );
};

export default SubmitRequestPage;
