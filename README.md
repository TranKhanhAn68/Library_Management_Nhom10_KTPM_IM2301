Hệ thống Quản lý Thư viện

Đây là một ứng dụng web dùng để quản lý các hoạt động trong thư viện như tìm kiếm sách, mượn sách, đặt trước sách và quản lý người dùng.

Hệ thống được xây dựng với:

Backend: Django (Python) – cung cấp REST API

Frontend: ReactJS

Database: MySQL WorkBench

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

