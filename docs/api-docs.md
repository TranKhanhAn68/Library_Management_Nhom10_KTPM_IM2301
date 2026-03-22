### Authentication API
##### 1. Login:
- Endpoint: /account/login/
- Methods: POST
- Permission: Anyone
- Mô tả: Đăng nhập vào nhập token trả về

##### 2. Logout:
- Endpoint: /account/logout/
- Method: POST
- Permission: Authentication
- Mô tả đăng xuất ra khỏi hệ thống và xóa token

##### 3. Registration:
- Endpoint: /account/registration/
- Method: POST
- Permission: Anyone
- Mô tả: Đăng ký tài khoản cho hệ thống


### User API
##### 1. Get info a User
- Endpoint: /users/{id}/
- Method: GET
- Permission: Admin hoặc người sở hữu tài khoản
- Mô tả: Lấy thông tin của 1 user cụ thể trong hệ thống

##### 2. Get all users
- Endpoint: /users/
- Method: GET
- Permission: Admin
- Mô tả: Lấy toàn bộ user trong hệ thống

##### 3. Update user
- Endpoint: /users/{id}/
- Method: PUT/PATCH
- Permission: Người sở hữu tài khoản hoặc admin
- Mô tả: Update thông tin của user

##### 4. Delete user
- Endpoint: /users/{id}/
- Method: DELETE
- Permission: Admin
- Mô tả: Xóa user khỏi hệ thống

##### 5. Create user
- Endpoint: /users/
- Method: POST
- Permission: Admin
- Mô tả: Tạo user mới


### Category API
##### 1. List Categories
- Endpoint: /categories/
- Method: GET
- Permission: Public

##### 2. Create Category
- Endpoint: /categories/
- Method: POST
- Permission: Admin

##### 3. Delete Category
- Endpoint: /categories/{id}/
- Method: DELETE
- Permission: Admin

##### 4. Update Category
- Endpoint: /categories/{id}/
- Method: PUT/PATCH
- Permission: Admin


### Book API
##### 1. List Books
- Endpoint: /books/
- Method: GET
- Permission: Public
- Query params:
+ q: tìm theo tên sách
+ category_id: lọc theo danh mục

##### 2. Book Detail
- Endpoint: /books/{id}/
- Method: GET
- Permission: Public

##### 3. Update Book
- Endpoint: /books/{id}/
- Method: PUT/PATCH
- Permission: Admin

##### 4. Create Book
- Endpoint: /books/
- Method: POST
- Permission: Admin

##### 5. Delete Book
- Endpoint: /books/{id}/
- Method: DELETE
- Permission: Admin


### Author API
##### 1. List Authors
- Endpoint: /authors/
- Method: GET
- Permission: Public

##### 2. Author Detail
- Endpoint: /authors/{id}/
- Method: GET
- Permission: Public

##### 3. Update Author
- Endpoint: /books/{id}/
- Method: PUT/PATCH
- Permission: Admin

##### 4. Create Author
- Endpoint: /authors/
- Method: POST
- Permission: Admin

##### 5. Delete Author
- Endpoint: /authors/{id}/
- Method: DELETE
- Permission: Admin


### Publisher API
##### 1. List Authors
- Endpoint: /publishers/
- Method: GET
- Permission: Public

##### 2. Delete Author
- Endpoint /publishers/{id}
- Method: DELETE
- Permission: Admin

##### 3. Author Detail
- Endpoint: /publishers/{id}
- Method: GET
- Permission: Public


### Reservation API
##### 1. Reservation List
- Endpoint: /reservations/
- Method: GET
- Permission: User, Staff
- Mô tả: User có thể xem được các reservations của chính mình còn staff thì có thể xem được tất cả

##### 2. Reservation detail
- Endpoint: /reservations/{id}/
- Method: GET
- Permission: User, Staff
- Mô tả: giống như Reservations List

##### 3. Create reservation
- Endpoint: /reservations/create/
- Method: POST
- Permission: User, Staff
- Mô tả: User có thể tạo 1 đặt trước sách thông qua hệ thống, staff có thể tạo giúp mọi user tạo reservation

##### 4. Cancel Reservations
- Endpoint: /reservations/cancel/
- Method: POST
- Permission: User, Staff
- Mô tả: User có thể hủy đặt trước sách, staff cũng có thể hủy đặt trước của bất kỳ user nào

##### 5. Update Status Reservations
- Endpoint: /reservations/update-status/
- Method: PUT/PATCH
- Permission: Staff
- Mô tả: Đổi trạng thái lịch đặt trước của khách khi cần thiết


### Borrowing API
##### 1. Borrowing List
- Endpoint: /borrowing-books/
- Method: GET
- Permission: User, Staff
- Mô tả: User có thể xem được sách đã mượn của chính mình còn staff thì có thể xem được tất cả

##### 2. Book Cart
- Endpoint: /borrowing-books/cart/
- Method: POST
- Permission: User
- Mô tả: User thêm sách mượn vào giỏ và nhấn mượn sách

##### 3.  Reservation detail
- Endpoint: /borrowing-books/{id}/
- Method: GET
- Permission: User, Staff
- Mô tả: giống như Borrowing List

##### 4. Update Status borrowing-books
- Endpoint: /borrowing-books/update-status/
- Method: PUT/PATCH
- Permission: Staff
- Mô tả: Đổi trạng thái mượn của khách khi cần thiết


### Setting API
##### 1. Get Setting
- Endpoint: /settings/
- Method: GET
- Permission: Anyone
- Mô tả: lấy cài đặt về ngày mượn, phí mượn, phí phạt

##### 2. Update Setting
- Endpoint: /settings/{id}
- Method: PUT/PATCH
- Permission: Admin
- Mô tả: Chỉnh lại cài đặt về ngày mượn, phí mượn, phí phạt...

##### 3. Post setting
- Endpoint: /settings/
- Method: POST
- Permission: Admin
- Mô tả: Thêm vào 1 cài đặt mới về ngày mượn