Xác định người dùng của hệ thống (Actors)
Độc giả (User/Borrower): Người tìm kiếm, mượn, trả và đặt trước sách. 
Nhân viên (Staff): Người thực hiện các nghiệp vụ trực tiếp tại quầy như hỗ trợ checkout, check-in và cập nhật số lượng sách. 
Thủ thư (Admin/Librarian): Người quản lý toàn bộ hệ thống, danh mục và nhân sự.

Xác định chức năng hệ thống
Hệ thống được chia thành các nhóm chức năng:
Tìm kiếm Sách: Cho phép Độc giả tìm sách theo danh mục, tên. 
Quản lý Sách & Danh mục: Quản lý thông tin sách, tác giả, nhà xuất bản và phân loại sách. 
Quản lý Mượn/Trả: Thực hiện checkout (mượn), check-in (trả). 
Quản lý Đặt trước (Reservation): Cho phép độc giả giữ chỗ sách khi sách chưa sẵn có. 
Quản lý Tài khoản: Đăng nhập, quản lý thông tin Độc giả, Nhân viên và Admin. 
Hệ thống Phạt: Tính toán phí phạt dựa trên số tuần trả trễ. 
Báo cáo: Thống kê doanh thu, tổng số sách và tình trạng mượn/trả.
Thông báo tự động: Gửi Email hoặc tin nhắn thông báo khi: Sách sắp đến hạn trả, sách đặt trước đã có sẵn trong kho, hoặc thông báo bị phạt.
Gợi ý sách: Dựa vào lịch sử mượn của độc giả để gợi ý các cuốn sách cùng thể loại hoặc cùng tác giả.
Đánh giá và phản hồi: Độc giả có thể viết nhận xét và chấm điểm sao cho cuốn sách.
Quản lý kho: quản lý số lượng sách của kho, số lượng sách còn lại trong kho và số lượng đang được mượn, đặt trước; quản lý tình trạng sách (mới, cũ, mất trang, đã lạc mất); nhập thêm sách mới xuất bản, sách cũ đã hư hỏng nặng

Xác định yêu cầu chi tiết: 
Tìm kiếm Sách
Độc giả nhập từ khóa (Tên sách, Tác giả, hoặc Thể loại).
Xử lý: Hệ thống thực hiện truy vấn JOIN giữa bảng library_management_book, author, và category để trả về danh sách kết quả.
Hiển thị: Kết quả bao gồm ảnh bìa, tên sách, tác giả, nhà xuất bản và số lượng còn lại.

Quản lý Sách & Danh mục
Thêm mới: Admin/Nhân viên nhập thông tin sách mới vào bảng library_management_book. Nếu Tác giả hoặc Nhà xuất bản chưa tồn tại, hệ thống yêu cầu tạo mới trong bảng author/publisher trước.
Cập nhật: Cho phép chỉnh sửa thông tin sách hoặc ẩn sách (thay đổi trường active) nếu sách không còn lưu hành.

Quản lý Tài khoản
Đăng nhập: Hệ thống kiểm tra username và password trong bảng user. Phân quyền dựa trên trường is_staff và is_superuser.
Phân quyền: 
Admin: Quản lý toàn bộ user và employee.
Nhân viên: Thực hiện nghiệp vụ Mượn/Trả/Kho.
Độc giả: Xem lịch sử cá nhân, đặt trước và đánh giá.

Mượn sách (Checkout): 
Độc giả đăng nhập -> Tìm kiếm sách -> Tạo đơn đặt trước hoặc thực hiện mượn sách tại chỗ. Hệ thống kiểm tra remaining_quantity (số lượng còn lại) trong bảng library_management_book. 
Nếu còn sách: Nhân viên thực hiện Checkout -> Tạo bản ghi mới trong bảng library_management_user_book. Hệ thống tự động thực hiện Update số lượng (giảm remaining_quantity). 

Trả sách (Check-in): 
Nhân viên xác nhận sách trả từ Độc giả. Cập nhật returning_book_date và chuyển status sang "Returned". 
Hệ thống tự động tăng lại remaining_quantity. 
Nếu trả trễ (returning_book_date > due_date): Hệ thống tự động tạo bản ghi phạt trong bảng library_management_user_book_detail_fine. 

Đặt trước (Reservation): 
Độc giả chọn sách đang bận và tạo yêu cầu đặt trước. Lưu thông tin vào bảng library_management_reservation. Nhân viên xử lý đặt trước khi sách được trả về.

Hệ thống Phạt
Tính toán: Hệ thống chạy tiến trình tự động hàng ngày. Với mỗi bản ghi mượn có due_date < current_date, tính số tuần trễ và nhân với fine_per_week để lưu vào bảng detail_fine.
Thanh toán: Khi độc giả nộp tiền, nhân viên cập nhật trạng thái thanh toán để độc giả có thể tiếp tục mượn sách.

Báo cáo (Report)
Thống kê: Tổng hợp dữ liệu từ bảng report và user_book.
Nội dung: Báo cáo doanh thu phí phạt, danh sách 10 cuốn sách được mượn nhiều nhất tháng, và tỷ lệ sách đang được mượn so với tổng kho.

Thông báo tự động
Sắp hết hạn: Gửi thông báo khi current_date cách due_date 2 ngày.
Đặt trước: Khi sách được trả (Check-in), hệ thống kiểm tra bảng reservation. Nếu có người đợi, gửi thông báo: "Sách bạn đặt đã sẵn sàng".

Gợi ý sách
Logic: Hệ thống quét bảng user_book để tìm thể loại (category_id) hoặc tác giả (author_id) mà người dùng đó mượn nhiều nhất.
Kết quả: Hiển thị danh sách các sách thuộc cùng thể loại hoặc tác giả đó tại trang chủ cá nhân.
Đánh giá và Phản hồi
Điều kiện: Chỉ tài khoản đã có lịch sử mượn cuốn sách đó (trạng thái "Returned") mới được đánh giá.
Xử lý: Lưu số sao và nội dung vào bảng đánh giá. Hệ thống tính điểm trung bình để hiển thị lên thông tin chung của cuốn sách.

Quản lý kho (Inventory Management)
Kiểm kho: Hệ thống đối soát giữa original_quantity (tổng nhập) với available_quantity (số lượng có thể phục vụ) và remaining_quantity (thực tế trên kệ).
Tình trạng vật lý: Nhân viên cập nhật trường status (Mới, Cũ, Hỏng, Mất).
Nếu "Hỏng nặng/Mất": Giảm số lượng khả dụng trong kho và cập nhật báo cáo thất thoát.
Nếu "Nhập mới": Tăng cả available_quantity và remaining_quantity.

Xác định quy tắc nghiệp vụ 
Quy tắc mượn/trả: 
Phải Đăng nhập mới được thực hiện các chức năng Mượn, Trả, Đặt trước (Quan hệ <<Include>>). 
Thời hạn trả sách được xác định bởi due_date (thông thường từ 1-2 tuần tùy quy định của Admin). 
Độc giả không thể mượn quá 3 quyển sách cùng một lúc

Quy tắc phạt (Fine): Tiền phạt được tính theo đơn vị tuần (late_weeks). 
Mức phí phạt cố định (fine_per_week) được quản lý bởi Admin trong bảng cấu hình quy định. 

Quy tắc quản lý kho: 
Không cho phép mượn nếu remaining_quantity = 0. Chỉ Admin mới có quyền quản lý danh mục tác giả, nhà xuất bản và tài khoản nhân viên.
Khi nhập sách phải cập nhật tình trạng vật lý ban đầu. Khi trả sách cũng phải cập nhật tình trạng vật lý khi nhận lại sách. Nếu sách đã quá hạn trả lại hơn 30 ngày hoặc kiểm kho kiểm tra không thấy sách đúng với số lượng trong remaining_quantity, cập nhật tình trạng Mất (Lost).

Quy tắc Đặt trước: 
Sách đặt trước chỉ được giữ tại quầy trong vòng 48 giờ. Sau thời gian này nếu độc giả không đến lấy, hệ thống tự động chuyển lượt cho người tiếp theo hoặc đưa lại vào kho.

Xử lý sách làm mất/hư hỏng: 
Nếu làm mất sách -> phạt bằng 200% giá bìa của sách. 
Nếu làm hư hỏng sách -> Phạt dựa trên mức độ hỏng (từ 50% đến 100% giá bìa của sách).
Khóa tài khoản User: Tự động khóa chức năng mượn sách nếu độc giả đang có sách quá hạn trả 7 ngày hoặc tổng tiền phạt chưa thanh toán vượt quá mức 100.000vnd


Hình ảnh usecase:
https://drive.google.com/file/d/1BWyzlkHjMfNrB27vnAzIAuF-hR3PlKUM/view?usp=sharing

Link giao diện:
https://drive.google.com/drive/folders/1Dmiw_CRRreNfZLFOmGALgkfg6aNLVpnn?usp=sharing