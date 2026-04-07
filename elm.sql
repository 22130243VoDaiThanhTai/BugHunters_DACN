/*
 Navicat Premium Dump SQL

 Source Server         : ELM
 Source Server Type    : MySQL
 Source Server Version : 100432 (10.4.32-MariaDB)
 Source Host           : localhost:3306
 Source Schema         : elm

 Target Server Type    : MySQL
 Target Server Version : 100432 (10.4.32-MariaDB)
 File Encoding         : 65001

 Date: 03/04/2026 13:58:13
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for approvals
-- ----------------------------
DROP TABLE IF EXISTS `approvals`;
CREATE TABLE `approvals`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `request_id` int NOT NULL,
  `manager_id` int NOT NULL,
  `action` enum('APPROVE','REJECT') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `action_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `note` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `request_id`(`request_id` ASC) USING BTREE,
  INDEX `manager_id`(`manager_id` ASC) USING BTREE,
  CONSTRAINT `approvals_ibfk_1` FOREIGN KEY (`request_id`) REFERENCES `leave_requests` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `approvals_ibfk_2` FOREIGN KEY (`manager_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of approvals
-- ----------------------------
INSERT INTO `approvals` VALUES (1, 1, 1, 'APPROVE', '2026-04-03 13:45:32', 'OK');
INSERT INTO `approvals` VALUES (2, 2, 1, 'REJECT', '2026-04-03 13:45:32', 'Khong hop le');
INSERT INTO `approvals` VALUES (3, 4, 2, 'APPROVE', '2026-04-03 13:45:32', 'OK');
INSERT INTO `approvals` VALUES (4, 6, 2, 'REJECT', '2026-04-03 13:45:32', 'Ly do khong ro');
INSERT INTO `approvals` VALUES (5, 7, 1, 'APPROVE', '2026-04-03 13:45:32', 'OK');

-- ----------------------------
-- Table structure for leave_balance
-- ----------------------------
DROP TABLE IF EXISTS `leave_balance`;
CREATE TABLE `leave_balance`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `total_days` int NULL DEFAULT 12,
  `used_days` int NULL DEFAULT 0,
  `remaining_days` int NULL DEFAULT 12,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `user_id`(`user_id` ASC) USING BTREE,
  CONSTRAINT `leave_balance_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 32 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of leave_balance
-- ----------------------------
INSERT INTO `leave_balance` VALUES (1, 26, 12, 0, 12);
INSERT INTO `leave_balance` VALUES (2, 7, 12, 0, 12);
INSERT INTO `leave_balance` VALUES (3, 6, 12, 0, 12);
INSERT INTO `leave_balance` VALUES (4, 12, 12, 0, 12);
INSERT INTO `leave_balance` VALUES (5, 25, 12, 0, 12);
INSERT INTO `leave_balance` VALUES (6, 5, 12, 0, 12);
INSERT INTO `leave_balance` VALUES (7, 3, 12, 0, 12);
INSERT INTO `leave_balance` VALUES (8, 27, 12, 0, 12);
INSERT INTO `leave_balance` VALUES (9, 19, 12, 0, 12);
INSERT INTO `leave_balance` VALUES (10, 14, 12, 0, 12);
INSERT INTO `leave_balance` VALUES (11, 13, 12, 0, 12);
INSERT INTO `leave_balance` VALUES (12, 28, 12, 0, 12);
INSERT INTO `leave_balance` VALUES (13, 8, 12, 0, 12);
INSERT INTO `leave_balance` VALUES (14, 24, 12, 0, 12);
INSERT INTO `leave_balance` VALUES (15, 16, 12, 0, 12);
INSERT INTO `leave_balance` VALUES (16, 1, 12, 0, 12);
INSERT INTO `leave_balance` VALUES (17, 20, 12, 0, 12);
INSERT INTO `leave_balance` VALUES (18, 18, 12, 0, 12);
INSERT INTO `leave_balance` VALUES (19, 15, 12, 0, 12);
INSERT INTO `leave_balance` VALUES (20, 9, 12, 0, 12);
INSERT INTO `leave_balance` VALUES (21, 30, 12, 0, 12);
INSERT INTO `leave_balance` VALUES (22, 4, 12, 0, 12);
INSERT INTO `leave_balance` VALUES (23, 23, 12, 0, 12);
INSERT INTO `leave_balance` VALUES (24, 29, 12, 0, 12);
INSERT INTO `leave_balance` VALUES (25, 17, 12, 0, 12);
INSERT INTO `leave_balance` VALUES (26, 2, 12, 0, 12);
INSERT INTO `leave_balance` VALUES (27, 22, 12, 0, 12);
INSERT INTO `leave_balance` VALUES (28, 11, 12, 0, 12);
INSERT INTO `leave_balance` VALUES (29, 21, 12, 0, 12);
INSERT INTO `leave_balance` VALUES (30, 10, 12, 0, 12);

-- ----------------------------
-- Table structure for leave_requests
-- ----------------------------
DROP TABLE IF EXISTS `leave_requests`;
CREATE TABLE `leave_requests`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `total_days` int NULL DEFAULT NULL,
  `reason` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `status` enum('PENDING','APPROVED','REJECTED','CANCELLED') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT 'PENDING',
  `rejection_reason` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `user_id`(`user_id` ASC) USING BTREE,
  CONSTRAINT `leave_requests_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of leave_requests
-- ----------------------------
INSERT INTO `leave_requests` VALUES (1, 3, '2025-04-01', '2025-04-03', 3, 'Du lich', 'APPROVED', NULL, '2026-04-03 13:45:32');
INSERT INTO `leave_requests` VALUES (2, 4, '2025-04-02', '2025-04-04', 3, 'Om', 'REJECTED', NULL, '2026-04-03 13:45:32');
INSERT INTO `leave_requests` VALUES (3, 5, '2025-04-05', '2025-04-06', 2, 'Viec rieng', 'PENDING', NULL, '2026-04-03 13:45:32');
INSERT INTO `leave_requests` VALUES (4, 6, '2025-04-07', '2025-04-08', 2, 'Gia dinh', 'APPROVED', NULL, '2026-04-03 13:45:32');
INSERT INTO `leave_requests` VALUES (5, 7, '2025-04-10', '2025-04-12', 3, 'Du lich', 'PENDING', NULL, '2026-04-03 13:45:32');
INSERT INTO `leave_requests` VALUES (6, 8, '2025-04-11', '2025-04-11', 1, 'Om', 'REJECTED', NULL, '2026-04-03 13:45:32');
INSERT INTO `leave_requests` VALUES (7, 9, '2025-04-12', '2025-04-13', 2, 'Viec rieng', 'APPROVED', NULL, '2026-04-03 13:45:32');
INSERT INTO `leave_requests` VALUES (8, 10, '2025-04-13', '2025-04-15', 3, 'Du lich', 'PENDING', NULL, '2026-04-03 13:45:32');

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `full_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `gender` enum('MALE','FEMALE','OTHER') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `date_of_birth` date NULL DEFAULT NULL,
  `department` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `position` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `role` enum('EMPLOYEE','MANAGER') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT 'EMPLOYEE',
  `hire_date` date NULL DEFAULT NULL,
  `status` enum('ACTIVE','INACTIVE') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT 'ACTIVE',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `username`(`username` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 31 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (1, 'nguyenvana', '123', 'Nguyễn Văn An', 'an.nguyen@company.com', '0901000001', 'MALE', NULL, 'HR', 'Manager', 'MANAGER', '2020-01-01', 'ACTIVE', '2026-04-03 13:45:32');
INSERT INTO `users` VALUES (2, 'tranthib', '123', 'Trần Thị Bình', 'binh.tran@company.com', '0901000002', 'FEMALE', NULL, 'IT', 'Manager', 'MANAGER', '2020-02-01', 'ACTIVE', '2026-04-03 13:45:32');
INSERT INTO `users` VALUES (3, 'leminhduc', '123', 'Lê Minh Đức', 'duc.le@company.com', '0901000011', 'MALE', NULL, 'IT', 'Staff', 'EMPLOYEE', '2022-01-01', 'ACTIVE', '2026-04-03 13:45:32');
INSERT INTO `users` VALUES (4, 'phamthuhuong', '123', 'Phạm Thu Hương', 'huong.pham@company.com', '0901000012', 'FEMALE', NULL, 'IT', 'Staff', 'EMPLOYEE', '2022-01-02', 'ACTIVE', '2026-04-03 13:45:32');
INSERT INTO `users` VALUES (5, 'hoangvanhieu', '123', 'Hoàng Văn Hiếu', 'hieu.hoang@company.com', '0901000013', 'MALE', NULL, 'HR', 'Staff', 'EMPLOYEE', '2022-01-03', 'ACTIVE', '2026-04-03 13:45:32');
INSERT INTO `users` VALUES (6, 'dangthimaitrang', '123', 'Đặng Thị Mai Trang', 'trang.dang@company.com', '0901000014', 'FEMALE', NULL, 'HR', 'Staff', 'EMPLOYEE', '2022-01-04', 'ACTIVE', '2026-04-03 13:45:32');
INSERT INTO `users` VALUES (7, 'buituananh', '123', 'Bùi Tuấn Anh', 'anh.bui@company.com', '0901000015', 'MALE', NULL, 'Finance', 'Staff', 'EMPLOYEE', '2022-01-05', 'ACTIVE', '2026-04-03 13:45:32');
INSERT INTO `users` VALUES (8, 'nguyenthilan', '123', 'Nguyễn Thị Lan', 'lan.nguyen@company.com', '0901000016', 'FEMALE', NULL, 'Finance', 'Staff', 'EMPLOYEE', '2022-01-06', 'ACTIVE', '2026-04-03 13:45:32');
INSERT INTO `users` VALUES (9, 'phamquanghuy', '123', 'Phạm Quang Huy', 'huy.pham@company.com', '0901000017', 'MALE', NULL, 'IT', 'Staff', 'EMPLOYEE', '2022-01-07', 'ACTIVE', '2026-04-03 13:45:32');
INSERT INTO `users` VALUES (10, 'vuthimy', '123', 'Vũ Thị My', 'my.vu@company.com', '0901000018', 'FEMALE', NULL, 'IT', 'Staff', 'EMPLOYEE', '2022-01-08', 'ACTIVE', '2026-04-03 13:45:32');
INSERT INTO `users` VALUES (11, 'trinhvankien', '123', 'Trịnh Văn Kiên', 'kien.trinh@company.com', '0901000019', 'MALE', NULL, 'HR', 'Staff', 'EMPLOYEE', '2022-01-09', 'ACTIVE', '2026-04-03 13:45:32');
INSERT INTO `users` VALUES (12, 'doanthuha', '123', 'Đoàn Thu Hà', 'ha.doan@company.com', '0901000020', 'FEMALE', NULL, 'HR', 'Staff', 'EMPLOYEE', '2022-01-10', 'ACTIVE', '2026-04-03 13:45:32');
INSERT INTO `users` VALUES (13, 'nguyenhoanglong', '123', 'Nguyễn Hoàng Long', 'long.nguyen@company.com', '0901000021', 'MALE', NULL, 'Finance', 'Staff', 'EMPLOYEE', '2022-01-11', 'ACTIVE', '2026-04-03 13:45:32');
INSERT INTO `users` VALUES (14, 'lethithao', '123', 'Lê Thị Thảo', 'thao.le@company.com', '0901000022', 'FEMALE', NULL, 'Finance', 'Staff', 'EMPLOYEE', '2022-01-12', 'ACTIVE', '2026-04-03 13:45:32');
INSERT INTO `users` VALUES (15, 'phamngoctuan', '123', 'Phạm Ngọc Tuấn', 'tuan.pham@company.com', '0901000023', 'MALE', NULL, 'IT', 'Staff', 'EMPLOYEE', '2022-01-13', 'ACTIVE', '2026-04-03 13:45:32');
INSERT INTO `users` VALUES (16, 'nguyenthuydung', '123', 'Nguyễn Thùy Dung', 'dung.nguyen@company.com', '0901000024', 'FEMALE', NULL, 'IT', 'Staff', 'EMPLOYEE', '2022-01-14', 'ACTIVE', '2026-04-03 13:45:32');
INSERT INTO `users` VALUES (17, 'tranngocbao', '123', 'Trần Ngọc Bảo', 'bao.tran@company.com', '0901000025', 'MALE', NULL, 'HR', 'Staff', 'EMPLOYEE', '2022-01-15', 'ACTIVE', '2026-04-03 13:45:32');
INSERT INTO `users` VALUES (18, 'phamdinhphuc', '123', 'Phạm Đình Phúc', 'phuc.pham@company.com', '0901000026', 'MALE', NULL, 'HR', 'Staff', 'EMPLOYEE', '2022-01-16', 'ACTIVE', '2026-04-03 13:45:32');
INSERT INTO `users` VALUES (19, 'lethimyhanh', '123', 'Lê Thị Mỹ Hạnh', 'hanh.le@company.com', '0901000027', 'FEMALE', NULL, 'Finance', 'Staff', 'EMPLOYEE', '2022-01-17', 'ACTIVE', '2026-04-03 13:45:32');
INSERT INTO `users` VALUES (20, 'nguyenvanthanh', '123', 'Nguyễn Văn Thành', 'thanh.nguyen@company.com', '0901000028', 'MALE', NULL, 'Finance', 'Staff', 'EMPLOYEE', '2022-01-18', 'ACTIVE', '2026-04-03 13:45:32');
INSERT INTO `users` VALUES (21, 'vuducmanh', '123', 'Vũ Đức Mạnh', 'manh.vu@company.com', '0901000029', 'MALE', NULL, 'IT', 'Staff', 'EMPLOYEE', '2022-01-19', 'ACTIVE', '2026-04-03 13:45:32');
INSERT INTO `users` VALUES (22, 'tranthikimngan', '123', 'Trần Thị Kim Ngân', 'ngan.tran@company.com', '0901000030', 'FEMALE', NULL, 'IT', 'Staff', 'EMPLOYEE', '2022-01-20', 'ACTIVE', '2026-04-03 13:45:32');
INSERT INTO `users` VALUES (23, 'phamvanloc', '123', 'Phạm Văn Lộc', 'loc.pham@company.com', '0901000031', 'MALE', NULL, 'HR', 'Staff', 'EMPLOYEE', '2022-01-21', 'ACTIVE', '2026-04-03 13:45:32');
INSERT INTO `users` VALUES (24, 'nguyenthingoc', '123', 'Nguyễn Thị Ngọc', 'ngoc.nguyen@company.com', '0901000032', 'FEMALE', NULL, 'HR', 'Staff', 'EMPLOYEE', '2022-01-22', 'ACTIVE', '2026-04-03 13:45:32');
INSERT INTO `users` VALUES (25, 'hoangminhquan', '123', 'Hoàng Minh Quân', 'quan.hoang@company.com', '0901000033', 'MALE', NULL, 'Finance', 'Staff', 'EMPLOYEE', '2022-01-23', 'ACTIVE', '2026-04-03 13:45:32');
INSERT INTO `users` VALUES (26, 'buitronghieu', '123', 'Bùi Trọng Hiếu', 'hieu.bui@company.com', '0901000034', 'MALE', NULL, 'Finance', 'Staff', 'EMPLOYEE', '2022-01-24', 'ACTIVE', '2026-04-03 13:45:32');
INSERT INTO `users` VALUES (27, 'lethanhtruc', '123', 'Lê Thanh Trúc', 'truc.le@company.com', '0901000035', 'FEMALE', NULL, 'IT', 'Staff', 'EMPLOYEE', '2022-01-25', 'ACTIVE', '2026-04-03 13:45:32');
INSERT INTO `users` VALUES (28, 'nguyenkhanhlinh', '123', 'Nguyễn Khánh Linh', 'linh.nguyen@company.com', '0901000036', 'FEMALE', NULL, 'IT', 'Staff', 'EMPLOYEE', '2022-01-26', 'ACTIVE', '2026-04-03 13:45:32');
INSERT INTO `users` VALUES (29, 'tranminhduc', '123', 'Trần Minh Đức', 'duc.tran@company.com', '0901000037', 'MALE', NULL, 'HR', 'Staff', 'EMPLOYEE', '2022-01-27', 'ACTIVE', '2026-04-03 13:45:32');
INSERT INTO `users` VALUES (30, 'phamthanhha', '123', 'Phạm Thanh Hà', 'ha.pham@company.com', '0901000038', 'FEMALE', NULL, 'HR', 'Staff', 'EMPLOYEE', '2022-01-28', 'ACTIVE', '2026-04-03 13:45:32');

SET FOREIGN_KEY_CHECKS = 1;
