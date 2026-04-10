CREATE DATABASE leave_management;
USE leave_management;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,

    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),

    gender ENUM('MALE', 'FEMALE', 'OTHER'),
    date_of_birth DATE,

    department VARCHAR(100),
    position VARCHAR(100),

    role ENUM('EMPLOYEE', 'MANAGER') DEFAULT 'EMPLOYEE',

    hire_date DATE,
    status ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE leave_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,

    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days INT,

    reason TEXT,

    status ENUM('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED') DEFAULT 'PENDING',
    rejection_reason TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE approvals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    request_id INT NOT NULL,
    manager_id INT NOT NULL,

    action ENUM('APPROVE', 'REJECT'),
    action_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    note TEXT,

    FOREIGN KEY (request_id) REFERENCES leave_requests(id),
    FOREIGN KEY (manager_id) REFERENCES users(id)
);

CREATE TABLE leave_balance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,

    total_days INT DEFAULT 12,
    used_days INT DEFAULT 0,
    remaining_days INT DEFAULT 12,

    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE login_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,

    action ENUM('LOGIN', 'LOGOUT'),
    log_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id)
);