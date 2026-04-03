import React, {useState} from 'react';
import {
    Layout, Menu, Card, DatePicker, Input,
    Button, Typography, Avatar, Space, Badge
} from 'antd';
import {
    DashboardOutlined, PlusOutlined, HistoryOutlined,
    BellOutlined, SettingOutlined,
    CalendarOutlined,
} from '@ant-design/icons';
import '../styles/RequestPageStyle.css';

const {Header, Sider, Content} = Layout;
const {Title, Text} = Typography;
const {TextArea} = Input;

const SubmitRequest: React.FC = () => {
    const [loading, setLoading] = useState(false);

    return (
        <Layout className="leave-layout">
            {/* Sidebar - Cột menu bên trái */}
            <Sider width={260} className="leave-sider" theme="light">
                <div className="logo-container">
                    <div className="logo-icon">H</div>
                    <div className="logo-text">
                        <div className="main-title">Management</div>
                        <div className="sub-title">EMPLOYEE PORTAL</div>
                    </div>
                </div>

                <Menu mode="inline" defaultSelectedKeys={['2']} className="side-menu">
                    <Menu.Item key="1" icon={<DashboardOutlined/>}>Dashboard</Menu.Item>
                    <Menu.Item key="2" icon={<PlusOutlined/>}>Submit Request</Menu.Item>
                    <Menu.Item key="3" icon={<HistoryOutlined/>}>History</Menu.Item>
                </Menu>

                <div className="new-request-btn">
                    <Button type="primary" icon={<PlusOutlined/>} block size="large">
                        New Request
                    </Button>
                </div>
            </Sider>

            <Layout className="main-render">
                {/* Header - Thanh điều hướng trên cùng */}
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
                            <Badge dot><BellOutlined className="icon-btn"/></Badge>
                            <SettingOutlined className="icon-btn"/>
                            <Avatar src="https://i.pravatar.cc/100"/>
                        </Space>
                    </div>
                </Header>

                {/* Content - Nội dung chính */}
                <Content className="leave-content">
                    <div className="content-container">
                        <div className="page-intro">
                            <div className="intro-text">
                                <Text type="secondary" className="breadcrumb">PORTAL {'>'} LEAVE MANAGEMENT</Text>
                                <Title level={2}>Request Time Off</Title>
                                <Text type="secondary">Plan your balance and notify your team leads.</Text>
                            </div>

                            {/* Card hiển thị số ngày phép còn lại */}
                            <Card className="remaining-days-card">
                                <div className="days-info">
                                    <div className="calendar-icon-box">
                                        <CalendarOutlined/>
                                    </div>
                                    <div>
                                        <Text type="secondary" className="label">REMAINING LEAVE DAYS</Text>
                                        <div className="days-count">10 days left</div>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        <div className="grid-container">
                            {/* Form đăng ký */}
                            <div className="form-section">
                                <Card className="main-form-card">
                                    <div className="date-row">
                                        <div className="input-field">
                                            <label>START DATE</label>
                                            <DatePicker placeholder="mm/dd/yyyy" className="full-width"/>
                                        </div>
                                        <div className="input-field">
                                            <label>END DATE</label>
                                            <DatePicker placeholder="mm/dd/yyyy" className="full-width"/>
                                        </div>
                                    </div>

                                    <div className="input-field reason-box">
                                        <label>REASON FOR LEAVE</label>
                                        <TextArea
                                            placeholder="Briefly describe your request (optional)..."
                                            rows={6}
                                        />
                                    </div>

                                    <div className="form-actions">
                                        <Button type="primary" size="large" className="submit-btn" loading={loading}>
                                            Submit Request
                                        </Button>
                                        <Button size="large" className="cancel-btn">Cancel</Button>
                                    </div>
                                </Card>
                            </div>

                            {/* Panel bên phải - Hướng dẫn và Nhóm */}
                        </div>
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default SubmitRequest;