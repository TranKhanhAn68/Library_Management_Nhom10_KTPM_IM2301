## Xác định người dùng của hệ thống (Actors)
- Độc giả (User/Borrower): Người tìm kiếm, mượn, trả và đặt trước sách. 
- Thủ thư (Librarian): Người thực hiện các nghiệp vụ trực tiếp tại quầy như hỗ trợ checkout, check-in và cập nhật số lượng sách. 
- Admin: Người quản lý toàn bộ hệ thống, danh mục và nhân sự.

## Xác định chức năng hệ thống
    - Hệ thống được chia thành các nhóm chức năng:
+ Tìm kiếm Sách: Cho phép Độc giả tìm sách theo danh mục, tên. 
+ Quản lý Sách & Danh mục: Quản lý thông tin sách, tác giả, nhà xuất bản và phân loại sách. 
+ Quản lý Mượn/Trả: Thực hiện checkout (mượn), check-in (trả).
+ Quản lý Đặt trước (Reservation): Cho phép độc giả giữ chỗ sách khi sách chưa sẵn có. 
+ Quản lý Tài khoản: Đăng nhập, quản lý thông tin Độc giả, Nhân viên và Admin. 
+ Hệ thống Phạt: Tính toán phí phạt dựa trên số tuần trả trễ. 
+ Báo cáo: Thống kê doanh thu, tổng số sách và tình trạng mượn/trả.
+ Thông báo tự động: Gửi Email hoặc tin nhắn thông báo khi: Sách sắp đến hạn trả, sách đặt trước đã có sẵn trong kho, hoặc thông báo bị phạt.
+ Gợi ý sách: Dựa vào lịch sử mượn của độc giả để gợi ý các cuốn sách cùng thể loại hoặc cùng tác giả.
+ Đánh giá và phản hồi: Độc giả có thể viết nhận xét và chấm điểm sao cho cuốn sách.
+ Quản lý kho: quản lý số lượng sách của kho, số lượng sách còn lại trong kho và số lượng đang được mượn, đặt trước; quản lý tình trạng sách (mới, cũ, mất trang, đã lạc mất); nhập thêm sách mới xuất bản, sách cũ đã hư hỏng nặng

## Xác định yêu cầu chi tiết: 
1. Tìm kiếm sách
Giới thiệu: Chức năng tìm kiếm sách cho phép độc giả tìm kiếm sách dựa trên các thông tin cơ bản như tên sách, tên tác giả hoặc thể loại. 
Mô tả: Người dùng nhập từ khóa, hệ thống thực hiện truy vấn JOIN giữa book, author, category để trả kết quả.
Actors: Độc giả
Ràng buộc:
    - Phải nhập ít nhất một tiêu chí
    - Hệ thống có dữ liệu
Tính năng:
    - Tìm theo tên, tác giả, thể loại
    - Hiển thị danh sách kết quả
Yêu cầu chức năng:
    - Nhận input từ người dùng
    - Truy vấn database
    - Hiển thị thông tin sách

2. Xem chi tiết sách và tình trạng
Giới thiệu: Chức năng này cho phép độc giả xem thông tin chi tiết của một cuốn sách trong hệ thống thư viện, bao gồm các thông tin như tên sách, tác giả, nhà xuất bản, thể loại và tình trạng hiện tại của sách.
Mô tả: Sau khi tìm kiếm sách, độc giả có thể chọn một cuốn sách cụ thể từ danh sách kết quả. Hệ thống sẽ hiển thị thông tin chi tiết của cuốn sách đó, đồng thời cho biết tình trạng của sách như còn sẵn để mượn hay đang được mượn bởi người khác.
Actors: Độc giả
Ràng buộc:
    - Sách phải tồn tại trong hệ thống
    - Người dùng phải chọn sách từ danh sách tìm kiếm
Tính năng:
    - Hiển thị thông tin chi tiết
    - Hiển thị trạng thái
    - Hiển thị số lượng sách còn
Yêu cầu chức năng:
    - Truy vấn thông tin, tình trạng của sách 
    - Cho phép chuyển sang đặt trước nếu sách đã hết

3. Mượn sách (Check-out)
Giới thiệu: Chức năng này cho phép thủ thư thực hiện việc cho độc giả mượn sách trong hệ thống thư viện.
Mô tả: Khi độc giả đến mượn sách, thủ thư sẽ kiểm tra tình trạng sách và thông tin tài khoản của độc giả. Nếu các điều kiện hợp lệ, thủ thư sẽ xác nhận giao dịch mượn sách và hệ thống sẽ ghi nhận thông tin giao dịch.
Actors: Thủ thư
Ràng buộc:
    - remaining_quantity > 0
    - User ≤ 3 sách
    - Đã đăng nhập
Tính năng:
    - Tạo giao dịch mượn
    - Tính ngày trả
Yêu cầu chức năng:
    - Lưu dữ liệu mượn
    - Cập nhật số lượng

4. Trả sách (Check-in)
Giới thiệu: Chức năng này cho phép thủ thư ghi nhận việc độc giả trả sách cho thư viện.
Mô tả: Khi độc giả trả sách, thủ thư sẽ cập nhật trạng thái của sách trong hệ thống. Hệ thống cũng sẽ kiểm tra xem sách có được trả đúng hạn hay không để tính toán phí phạt nếu cần.
Actors: Thủ thư
Ràng buộc: Sách đang được mượn
Tính năng:
    - Cập nhật trạng thái
    - Tính phí phạt
Yêu cầu chức năng:
    - Cập nhật database
    - Lưu lịch sử

5. Đặt trước sách
Giới thiệu: Cho phép giữ chỗ khi sách hết.
Mô tả: Độc giả có thể gửi yêu cầu đặt trước thông qua hệ thống khi hết sách. Hệ thống sẽ lưu yêu cầu này vào danh sách chờ. Khi sách được trả lại, người đầu tiên trong danh sách đặt trước sẽ được thông báo.
Actors: Độc giả
Ràng buộc:
    - Người dùng phải đăng nhập được
    - Sách hết
Tính năng:
    - Tạo yêu cầu
    - Quản lý danh sách chờ
Yêu cầu chức năng:
    - Cho phép người dùng tạo yêu cầu đặt trước
    - Lưu trữ danh sách đặt trước

6. Xử lý đặt trước
Giới thiệu: Thủ thư quản lý và xử lý các yêu cầu đặt trước sách của độc giả.
Mô tả: Khi một cuốn sách được trả lại, hệ thống sẽ kiểm tra xem có yêu cầu đặt trước nào cho cuốn sách đó hay không. Nếu có, thủ thư sẽ thông báo cho người đầu tiên trong danh sách đặt trước để đến mượn sách.
Actors: Thủ thư
Ràng buộc: Có danh sách đặt trước
Tính năng:
    - Xem danh sách đặt trước
    - Thông báo cho độc giả
Yêu cầu chức năng: Lưu danh sách đặt trước và xử lý yêu cầu theo thứ tự

7. Quản lý sách & danh mục
Giới thiệu: Chức năng này cho phép quản trị viên quản lý các danh mục sách trong hệ thống thư viện.
Mô tả: Thêm/sửa/xóa/ẩn các danh mục sách.
Actors: Admin
Ràng buộc: tên danh mục không trùng lặp
Tính năng:
    - Thêm danh mục mới
    - Cập nhật và xóa danh mục
Yêu cầu chức năng:
    - Lưu DB
    - Kiểm tra dữ liệu

8. Chức năng “Quản lý tác giả và nhà xuất bản”
Giới thiệu: Admin quản lý thông tin tác giả và nhà xuất bản liên quan đến các sách trong hệ thống.
Mô tả: Admin có thể thêm mới, chỉnh sửa hoặc xóa thông tin của tác giả và nhà xuất bản nhằm đảm bảo dữ liệu sách được quản lý chính xác.
Roles: Admin
Ràng buộc: Không được tạo trùng tác giả hoặc nhà xuất bản.
Tính năng
    - Thêm/xóa tác giả.
    - Thêm/xóa nhà xuất bản.
    - Cập nhật thông tin.
Yêu cầu chức năng
    - Hệ thống phải lưu thông tin tác giả.
    - Hệ thống phải liên kết tác giả và nhà xuất bản với sách.

9. Chức năng “Cấu hình quy định”
Giới thiệu: Admin thiết lập các quy định liên quan đến hoạt động mượn và trả sách trong thư viện.
Mô tả: Admin có thể thiết lập các thông số như số ngày mượn tối đa, số sách được phép mượn, và mức phí phạt khi trả sách quá hạn.
Roles: Admin
Ràng buộc: Giá trị cấu hình phải hợp lệ và phù hợp với quy định của thư viện.
Tính năng
    - Thiết lập số ngày mượn tối đa.
    - Thiết lập phí phạt quá hạn.
    - Cập nhật các quy định.
Yêu cầu chức năng
    - Hệ thống phải cho phép admin thay đổi các tham số cấu hình.
    - Hệ thống phải áp dụng các quy định này cho toàn bộ giao dịch mượn trả.



Hình ảnh usecase:
https://drive.google.com/file/d/1BWyzlkHjMfNrB27vnAzIAuF-hR3PlKUM/view?usp=sharing

Link giao diện:
https://drive.google.com/drive/folders/1Dmiw_CRRreNfZLFOmGALgkfg6aNLVpnn?usp=sharing