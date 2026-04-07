USE leave_management;

-- ======================
-- 1. USERS (30 người)
-- ======================

INSERT INTO users (username, password, full_name, email, phone, gender, department, position, role, hire_date)
VALUES
-- MANAGER
('nguyenvana','123','Nguyễn Văn An','an.nguyen@company.com','0901000001','MALE','HR','Manager','MANAGER','2020-01-01'),
('tranthib','123','Trần Thị Bình','binh.tran@company.com','0901000002','FEMALE','IT','Manager','MANAGER','2020-02-01'),

-- EMPLOYEE
('leminhduc','123','Lê Minh Đức','duc.le@company.com','0901000011','MALE','IT','Staff','EMPLOYEE','2022-01-01'),
('phamthuhuong','123','Phạm Thu Hương','huong.pham@company.com','0901000012','FEMALE','IT','Staff','EMPLOYEE','2022-01-02'),
('hoangvanhieu','123','Hoàng Văn Hiếu','hieu.hoang@company.com','0901000013','MALE','HR','Staff','EMPLOYEE','2022-01-03'),
('dangthimaitrang','123','Đặng Thị Mai Trang','trang.dang@company.com','0901000014','FEMALE','HR','Staff','EMPLOYEE','2022-01-04'),
('buituananh','123','Bùi Tuấn Anh','anh.bui@company.com','0901000015','MALE','Finance','Staff','EMPLOYEE','2022-01-05'),
('nguyenthilan','123','Nguyễn Thị Lan','lan.nguyen@company.com','0901000016','FEMALE','Finance','Staff','EMPLOYEE','2022-01-06'),
('phamquanghuy','123','Phạm Quang Huy','huy.pham@company.com','0901000017','MALE','IT','Staff','EMPLOYEE','2022-01-07'),
('vuthimy','123','Vũ Thị My','my.vu@company.com','0901000018','FEMALE','IT','Staff','EMPLOYEE','2022-01-08'),
('trinhvankien','123','Trịnh Văn Kiên','kien.trinh@company.com','0901000019','MALE','HR','Staff','EMPLOYEE','2022-01-09'),
('doanthuha','123','Đoàn Thu Hà','ha.doan@company.com','0901000020','FEMALE','HR','Staff','EMPLOYEE','2022-01-10'),
('nguyenhoanglong','123','Nguyễn Hoàng Long','long.nguyen@company.com','0901000021','MALE','Finance','Staff','EMPLOYEE','2022-01-11'),
('lethithao','123','Lê Thị Thảo','thao.le@company.com','0901000022','FEMALE','Finance','Staff','EMPLOYEE','2022-01-12'),
('phamngoctuan','123','Phạm Ngọc Tuấn','tuan.pham@company.com','0901000023','MALE','IT','Staff','EMPLOYEE','2022-01-13'),
('nguyenthuydung','123','Nguyễn Thùy Dung','dung.nguyen@company.com','0901000024','FEMALE','IT','Staff','EMPLOYEE','2022-01-14'),
('tranngocbao','123','Trần Ngọc Bảo','bao.tran@company.com','0901000025','MALE','HR','Staff','EMPLOYEE','2022-01-15'),
('phamdinhphuc','123','Phạm Đình Phúc','phuc.pham@company.com','0901000026','MALE','HR','Staff','EMPLOYEE','2022-01-16'),
('lethimyhanh','123','Lê Thị Mỹ Hạnh','hanh.le@company.com','0901000027','FEMALE','Finance','Staff','EMPLOYEE','2022-01-17'),
('nguyenvanthanh','123','Nguyễn Văn Thành','thanh.nguyen@company.com','0901000028','MALE','Finance','Staff','EMPLOYEE','2022-01-18'),
('vuducmanh','123','Vũ Đức Mạnh','manh.vu@company.com','0901000029','MALE','IT','Staff','EMPLOYEE','2022-01-19'),
('tranthikimngan','123','Trần Thị Kim Ngân','ngan.tran@company.com','0901000030','FEMALE','IT','Staff','EMPLOYEE','2022-01-20'),
('phamvanloc','123','Phạm Văn Lộc','loc.pham@company.com','0901000031','MALE','HR','Staff','EMPLOYEE','2022-01-21'),
('nguyenthingoc','123','Nguyễn Thị Ngọc','ngoc.nguyen@company.com','0901000032','FEMALE','HR','Staff','EMPLOYEE','2022-01-22'),
('hoangminhquan','123','Hoàng Minh Quân','quan.hoang@company.com','0901000033','MALE','Finance','Staff','EMPLOYEE','2022-01-23'),
('buitronghieu','123','Bùi Trọng Hiếu','hieu.bui@company.com','0901000034','MALE','Finance','Staff','EMPLOYEE','2022-01-24'),
('lethanhtruc','123','Lê Thanh Trúc','truc.le@company.com','0901000035','FEMALE','IT','Staff','EMPLOYEE','2022-01-25'),
('nguyenkhanhlinh','123','Nguyễn Khánh Linh','linh.nguyen@company.com','0901000036','FEMALE','IT','Staff','EMPLOYEE','2022-01-26'),
('tranminhduc','123','Trần Minh Đức','duc.tran@company.com','0901000037','MALE','HR','Staff','EMPLOYEE','2022-01-27'),
('phamthanhha','123','Phạm Thanh Hà','ha.pham@company.com','0901000038','FEMALE','HR','Staff','EMPLOYEE','2022-01-28');
-- ======================
-- 2. LEAVE BALANCE
-- ======================
INSERT INTO leave_balance (user_id)
SELECT id FROM users;

-- ======================
-- 3. LEAVE REQUESTS
-- ======================
INSERT INTO leave_requests (user_id, start_date, end_date, total_days, reason, status)
VALUES
(3,'2025-04-01','2025-04-03',3,'Du lich','APPROVED'),
(4,'2025-04-02','2025-04-04',3,'Om','REJECTED'),
(5,'2025-04-05','2025-04-06',2,'Viec rieng','PENDING'),
(6,'2025-04-07','2025-04-08',2,'Gia dinh','APPROVED'),
(7,'2025-04-10','2025-04-12',3,'Du lich','PENDING'),
(8,'2025-04-11','2025-04-11',1,'Om','REJECTED'),
(9,'2025-04-12','2025-04-13',2,'Viec rieng','APPROVED'),
(10,'2025-04-13','2025-04-15',3,'Du lich','PENDING');

-- ======================
-- 4. APPROVALS
-- ======================
INSERT INTO approvals (request_id, manager_id, action, note)
VALUES
(1,1,'APPROVE','OK'),
(2,1,'REJECT','Khong hop le'),
(4,2,'APPROVE','OK'),
(6,2,'REJECT','Ly do khong ro'),
(7,1,'APPROVE','OK');