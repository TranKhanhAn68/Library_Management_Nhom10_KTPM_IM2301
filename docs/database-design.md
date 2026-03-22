### Ảnh Database
[Database Image](./Design_Database_Library_Management.png)

### Đường link đến Database Design
[Database Link](https://dbdiagram.io/d/Design_Database_Library_Management-69aea161cf54053b6f3bb748)

### Chuyển thành T-Script MySQL Workbench
CREATE DATABASE IF NOT EXISTS library_management;
USE library_management;

-- ================== USER ==================
CREATE TABLE library_management_user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    password VARCHAR(128),
    last_login DATETIME(6),
    is_superuser BOOLEAN,
    username VARCHAR(150) UNIQUE,
    first_name VARCHAR(150),
    last_name VARCHAR(150),
    email VARCHAR(254),
    is_staff BOOLEAN,
    is_active BOOLEAN,
    date_joined DATETIME(6),
    phone_number VARCHAR(15),
    image VARCHAR(255)
);

-- ================== CATEGORY ==================
CREATE TABLE library_management_category (
    id INT AUTO_INCREMENT PRIMARY KEY,
    created_at DATE,
    update_at DATE,
    active BOOLEAN,
    name VARCHAR(50)
);

-- ================== AUTHOR ==================
CREATE TABLE library_management_author (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    date_of_birth DATE,
    death_of_birth DATE,
    biography TEXT
);

-- ================== PUBLISHER ==================
CREATE TABLE library_management_publisher (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100)
);

-- ================== BOOK ==================
CREATE TABLE library_management_book (
    id INT AUTO_INCREMENT PRIMARY KEY,
    book_id VARCHAR(10) UNIQUE,
    created_date DATE,
    updated_at DATE,
    active BOOLEAN,
    name VARCHAR(255),
    total_quantity INT,
    available_quantity INT,
    image VARCHAR(255),
    category_id INT,
    author_id INT,
    publisher_id INT,
    description TEXT,

    FOREIGN KEY (category_id) REFERENCES library_management_category(id),
    FOREIGN KEY (author_id) REFERENCES library_management_author(id),
    FOREIGN KEY (publisher_id) REFERENCES library_management_publisher(id)
);

-- ================== USER_BOOK (BORROW) ==================
CREATE TABLE library_management_user_book (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    book_id INT,
    borrowing_book_date DATE,
    returning_book_date DATE,
    due_date DATE,
    borrowing_quantity INT,
    status VARCHAR(100),
    note TEXT,

    FOREIGN KEY (user_id) REFERENCES library_management_user(id),
    FOREIGN KEY (book_id) REFERENCES library_management_book(id)
);

-- ================== FINE DETAIL ==================
CREATE TABLE library_management_setting (
    id INT AUTO_INCREMENT PRIMARY KEY,
    borrowing_days INT,
    borrowing_overdue_fine DECIMAL(10,2)
);

CREATE TABLE library_management_user_book_detail_fine (
    id INT AUTO_INCREMENT PRIMARY KEY,
    late_dates INT,
    total_fine_overdue DECIMAL(10,2),
    setting_id INT UNIQUE,

    FOREIGN KEY (setting_id) REFERENCES library_management_setting(id)
);

-- ================== RESERVATION ==================
CREATE TABLE library_management_reservation (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    book_id INT,
    reservation_date DATETIME,
    status VARCHAR(100),

    FOREIGN KEY (user_id) REFERENCES library_management_user(id),
    FOREIGN KEY (book_id) REFERENCES library_management_book(id)
);

-- ================== EMPLOYEE ==================
CREATE TABLE library_management_employee (
    id INT PRIMARY KEY,
    employee_id VARCHAR(20) UNIQUE,
    shift VARCHAR(50),
    identity_card VARCHAR(20),

    FOREIGN KEY (id) REFERENCES library_management_user(id)
);

-- ================== REPORT ==================
CREATE TABLE library_management_report (
    id INT AUTO_INCREMENT PRIMARY KEY,
    current_date DATE,
    total_book INT,
    total_current_book INT,
    total_borrowing_book INT,
    total_revenue DECIMAL(10,2)
);

-- ================== COMMENT ==================
CREATE TABLE library_management_comment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    book_id INT,
    user_id INT,
    content TEXT,

    FOREIGN KEY (book_id) REFERENCES library_management_book(id),
    FOREIGN KEY (user_id) REFERENCES library_management_user(id)
);

-- ================== LIKE ==================
CREATE TABLE library_management_like (
    id INT AUTO_INCREMENT PRIMARY KEY,
    is_like BOOLEAN,
    book_id INT,
    user_id INT,

    UNIQUE (user_id, book_id),

    FOREIGN KEY (book_id) REFERENCES library_management_book(id),
    FOREIGN KEY (user_id) REFERENCES library_management_user(id)
);

-- ================== ACTIVITY LOG ==================
CREATE TABLE library_management_activity_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action VARCHAR(50),
    target_type VARCHAR(50),
    target_id INT,
    created_date DATE,

    FOREIGN KEY (user_id) REFERENCES library_management_user(id)
);

