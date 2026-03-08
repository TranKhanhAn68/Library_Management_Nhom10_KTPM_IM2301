# TÊN DỰ ÁN: Hệ thống Quản lý Thư viện

# MÔ TẢ: Đây là một ứng dụng web dùng để quản lý các hoạt động trong thư viện như tìm kiếm sách, mượn sách, đặt trước sách và quản lý người dùng.

## Thành viên nhóm:
| Họ tên                | MSSV        |  Vai trò    |
|-----------------------|-------------|-------------|
| Trần Khánh An         | 2351050004  | Nhóm trưởng |
| Nguyễn Ngọc Khiết Băng| 2354050016  | Thành viên  |
| Phùng Thị Kim Ngân    | 2354050073  | Thành viên  |

## YÊU CẦU
- Python 3.10 trở lên
- Nodejs 18
- Mysql workbench

## CÔNG NGHỆ SỬ DỤNG
- Backend: Django (Python) – cung cấp REST API
- Frontend: ReactJS
- Database: MySQL WorkBench

<!-- Hướng dẫn cài đặt -->
<!-- Clone project -->
git clone https://github.com/TranKhanhAn68/Library_Management_Nhom10_KTPM_IM2301.git
cd Library_Management


 <!-- Cài đặt Backend (Django) -->
1. Di chuyển vào thư mục backend
cd backend
2. Tạo môi trường ảo (Virtual Environment)
python -m venv venv

Kích hoạt môi trường:

Windows

venv\Scripts\activate

Mac / Linux

source venv/bin/activate
3. Cài đặt các thư viện cần thiết
pip install -r requirements.txt
4. Chạy migration database
python manage.py migrate
5. Tạo tài khoản admin (tuỳ chọn)
python manage.py createsuperuser
6. Chạy server Django
python manage.py runserver

Backend sẽ chạy tại:

http://127.0.0.1:8000


<!-- Cài đặt Frontend (React) -->
1. Mở terminal mới và di chuyển vào thư mục frontend
cd frontend
2. Cài đặt các thư viện
npm install
3. Chạy ứng dụng React
npm start

Frontend sẽ chạy tại:

http://localhost:3000

## DEMO

## TÀI LIỆU

# ĐỀ TÀI BÀI TẬP LỚN – KIỂM THỬ PHẦN MỀM
## 1.	THÔNG TIN NHÓM
-	Nhóm: 10
-	Thành viên:
    + Trần Khánh An - 2351050004
    + Nguyễn Ngọc Khiết Băng – 2354050016
    + Phùng Thị Kim Ngân – 2354050073
-	GVHD: Võ Việt Khoa

## 2.	ĐỀ TÀI
-	Tên đề tài: Hệ thống Quản lý Thư viện
-   Mô tả ngắn: Xây dựng Hệ thống Quản lý Thư viện làm môi trường thực hành các kỹ thuật kiểm thử phần mềm nhằm đánh giá chất lượng hệ thống. Qua quá trình kiểm thử để tiến hành phát hiện lỗi, kiểm tra tính chính xác của các chức năng và đánh giá mức độ ổn định của hệ thống. Đồng thời, đề tài giúp áp dụng kiến thức lý thuyết vào thực tế và rèn luyện kỹ năng thiết kế test case, xây dựng kịch bản kiểm thử.

## 3.	TÍNH NĂNG CHÍNH
- Tính năng 1: Tra cứu và tìm kiếm thông tin sách
- Tính năng 2: Quản lý mượn – trả sách
- Tính năng 3: Đặt trước sách
- Tính năng 4: Quản lý danh mục và thông tin sách

## 4.	CÔNG NGHỆ DỰ KIẾN
- Test: Pytest
- Frontend: ReactJS
- Backend: django
- DB: MySQL

## 5. Phân Công Công Việc
| Thành viên            | Công việc                        | Timeline |
|-----------------------|----------------------------------|----------|
| Trần Khánh An         | Wireframe, frontend, backend     | Tuần 9   |
| Nguyễn Ngọc Khiết Băng| Thiết kế database, frontend      | Tuần 9   |
| Phùng Thị Kim Ngân    | Thiết kế database, frontend      | Tuần 9   |

## 6.	TIMELINE
- Tuần 1-2: Lập nhóm, phân công, phân tích yêu cầu
- Tuần 3: Thiết kế database
- Tuần 4-6: Backend
- Tuần 7-8: Frontend
- Tuần 9-10: Báo cáo, demo, nộp bài và bảo vệ