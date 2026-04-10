import React, { useState } from "react";
import { Layout, Menu, Card, DatePicker, Input, Button, Typography, Avatar, Space, Badge, Alert } from "antd";
import type { Dayjs } from "dayjs";
import {
    DashboardOutlined,
    PlusOutlined,
    HistoryOutlined,
    BellOutlined,
    SettingOutlined,
    CalendarOutlined,
} from "@ant-design/icons";
import "../styles/RequestPageStyle.css";

const { Header, Sider, Content } = Layout;
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
        <Layout className="leave-layout">
            <Sider width={260} className="leave-sider" theme="light">
                <div className="logo-container">
                    <div className="logo-icon">H</div>
                    <div className="logo-text">
                        <div className="main-title">Management</div>
                        <div className="sub-title">EMPLOYEE PORTAL</div>
                    </div>
                </div>

                <Menu mode="inline" selectedKeys={["2"]} className="side-menu">
                    <Menu.Item key="1" icon={<DashboardOutlined />} onClick={onBackToDashboard}>Dashboard</Menu.Item>
                    <Menu.Item key="2" icon={<PlusOutlined />}>Submit Request</Menu.Item>
                    <Menu.Item key="3" icon={<HistoryOutlined />} onClick={onNavigateToHistory}>History</Menu.Item>
                </Menu>

                <div className="new-request-btn">
                    <Button type="primary" icon={<PlusOutlined />} block size="large" disabled>
                        New Request
                    </Button>
                </div>
            </Sider>

            <Layout className="main-render">
                <Header className="leave-header">
                    <div className="header-left">
                        <span className="brand-name">Azure Horizon</span>
                        <Space className="nav-links" size="large">
                            <Text>Overview</Text>
                            <Text className="active-link">Requests</Text>
                            <Text>Team</Text>
                        </Space>
                    </div>
                    <div className="header-right">
                        <Space size="middle">
                            <Badge dot><BellOutlined className="icon-btn" /></Badge>
                            <SettingOutlined className="icon-btn" />
                            <Avatar>{(userEmail || "U").charAt(0).toUpperCase()}</Avatar>
                        </Space>
                    </div>
                </Header>

                <Content className="leave-content">
                    <div className="content-container">
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
                </Content>
            </Layout>
        </Layout>
    );
};

export default SubmitRequestPage;
