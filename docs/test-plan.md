Hai phương pháp kiểm thử chính được sử dụng là kiểm thử hộp đen (Black-box testing) và kiểm thử hộp trắng (White-box testing).

- Kiểm thử hộp đen tập trung vào việc kiểm tra chức năng của hệ thống thông qua dữ liệu đầu vào và kết quả đầu ra, nhằm đảm bảo hệ thống đáp ứng đúng yêu cầu người dùng.

- Kiểm thử hộp trắng tập trung vào việc kiểm tra logic xử lý bên trong, bao gồm các điều kiện rẽ nhánh và luồng xử lý, nhằm đảm bảo tất cả các trường hợp đều được xử lý chính xác.

Các kỹ thuật kiểm thử được áp dụng trong hệ thống bao gồm: phân vùng tương đương (Equivalence Partitioning), phân tích giá trị biên (Boundary Value Analysis), kiểm thử bảng quyết định (Decision Table Testing), kiểm thử chuyển trạng thái (State Transition Testing), kiểm thử theo kịch bản sử dụng (Use Case Testing) và kiểm thử đường dẫn cơ sở (Basis Path Testing).


1. Tìm kiếm sách
*Phương pháp kiểm thử*
- Black-box testing: Tester nhập dữ liệu tìm kiếm (title, author, category) qua giao diện người dùng, sau đó kiểm tra danh sách kết quả trả về. Mục tiêu là đảm bảo hệ thống trả về đúng các sách phù hợp với điều kiện tìm kiếm. 
- White-box testing: Phân tích logic truy vấn: 
    + Kiểm tra việc kết nối dữ liệu giữa các bảng book, author, category 
    + Kiểm tra cách xử lý các trường hợp: có input, không có input thì báo lỗi, có nhiều điều kiện tìm kiếm thì xử lý AND/OR 
*Kỹ thuật kiểm thử*
- Equivalence Partitioning: chia dữ liệu thành các nhóm input hợp lệ, không hợp lệ và rỗng 
-	Boundary Value Analysis: kiểm tra độ dài chuỗi: rỗng, ngắn, dài, rất dài 
-	Use Case Testing 
    + Tìm theo từng tiêu chí 
    + Tìm kết hợp nhiều tiêu chí

2. Xem chi tiết sách
*Phương pháp kiểm thử*
- Black-box testing: Người dùng chọn một sách từ danh sách và kiểm tra thông tin hiển thị, bao gồm nội dung chi tiết và trạng thái sách. 
- White-box tesing: Kiểm tra logic: 
    + Truy vấn dữ liệu dựa trên book_id 
    + Xác định trạng thái sách dựa trên số lượng còn lại (còn hoặc hết)
*Kỹ thuật kiểm thử*
- Equivalence Partitioning (ID hợp lệ / ID không tồn tại) 
- Decision Table (xác định trạng thái sách: còn sách / hết sách) 

3. Mượn sách (Check-out)
*Phương pháp kiểm thử*
- Black-box testing: Test các tình huống sau:
    + Nếu sách còn thì cho mượn 
    + Nếu sách hết thì không mượn được 
    + 1 user mượn nhiều hơn 3 sách thì không được 
- White-box testing: Phân tích logic xử lý bên trong hệ thống, đảm bảo:
    + Có kiểm tra số lượng sách còn lại 
    + Có kiểm tra số sách người dùng đã mượn 
    + Tất cả các nhánh điều kiện đều được xử lý đúng
*Kỹ thuật kiểm thử*
- Decision Table: xác định kết quả dựa trên các điều kiện
- State Transition: Available -> Borrowed 
- Equivalence Partitioning: phân loại user và trạng thái sách

4. Trả sách (Check-in)
*Phương pháp kiểm thử*
- Black-box testing: Kiểm tra các trường hợp trả đúng hạn hay trả trễ 
- White-box testing: Kiểm tra logic xử lý: 
    + So sánh ngày trả và ngày hết hạn để xác định có tính phí phạt hay không   
    + Update trạng thái của sách
    + Tăng số lượng sách
*Kỹ thuật kiểm thử*
- Boundary Value: kiểm tra thời gian trả (trước hạn, đúng hạn, quá hạn)
- Decision Table: xác định việc áp dụng phí phạt
- State Transition 

5. Đặt trước sách
*Phương pháp kiểm thử*
- Black-box testing
    + Nếu sách hết thì đặt trước được, ngược lại sách còn thì không cho đặt 
    + Người dùng chưa login thì không đặt được
- White-box testing: Kiểm tra logic xử lý điều kiện đặt trước, đảm bảo yêu cầu chỉ được tạo khi sách đã hết và người dùng đã login
*Kỹ thuật kiểm thử*
- Decision Table: xác định điều kiện đặt trước
- State Transition: Available -> Reserved 

6. Xử lý đặt trước
*Phương pháp kiểm thử*
- Black-box testing: Nếu có danh sách đặt trước thì xử lý, không có thì bỏ qua 
- White-box testing: Kiểm tra FIFO
*Kỹ thuật kiểm thử*
- State Transition: Reserved -> Borrowed
- Decision Table: có hoặc không có danh sách đặt trước 
- Use Case Testing: nhiều người đặt, hủy đặt

7. Quản lý sách & danh mục
*Phương pháp kiểm thử*
- Black-box testing: Kiểm tra các chức năng thêm, sửa, xóa
- White-box testing: Kiểm tra logic xử lý bên trong:
    + Validate dữ liệu đầu vào 
    + Xử lý các trường hợp dữ liệu trùng hoặc rỗng 
    + Xử lý lỗi 
*Kỹ thuật kiểm thử*
- Equivalence Partitioning: dữ liệu hợp lệ, trùng, rỗng
- Boundary Value: kiểm tra giới hạn dữ liệu

8. Quản lý tác giả & nhà xuất bản
*Phương pháp kiểm thử*
- Black-box testing: Kiểm tra các thao tác thêm, sửa, xóa 
- White-box testing: Kiểm tra: 
    + Logic kiểm tra dữ liệu trùng 
    + Mối quan hệ giữa tác giả, nhà xuất bản và sách 
*Kỹ thuật kiểm thử*
- Equivalence Partitioning 
- Boundary Value 
- Use Case Testing 

9. Cấu hình quy định
*Phương pháp kiểm thử*
- Black-box testing: Nhập vào số ngày và phí để test xem các giá trị có hợp lệ hay không, giá trị âm, giá trị lớn
- White-box testing: Kiểm tra logic xử lý:
    + Chỉ chấp nhận giá trị hợp lệ 
    + Từ chối các giá trị không hợp lệ 
    + Đảm bảo cấu hình được áp dụng đúng vào hệ thống
*Kỹ thuật kiểm thử*
- Boundary Value Analysis: giá trị nhỏ nhất và lớn nhất
- Equivalence Partitioning: giá trị hợp lệ và không hợp lệ
- Decision Table: xác định hành vi hệ thống theo giá trị nhập
