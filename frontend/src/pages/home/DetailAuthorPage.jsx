import React from 'react';

const DetailAuthorPage = () => {
    return (
        <div className="container mt-4 border p-3" style={{ maxWidth: '600px' }}>
            <img
                src="https://via.placeholder.com/150"
                alt="Tác giả"
                className="float-start me-3 mb-2 rounded" // float-start đẩy ảnh sang trái, me-3 tạo khoảng cách với chữ
                style={{ width: '150px' }}
            />

            <p className="text-justify">
                Đây là nội dung văn bản dài giống như trong sách giáo khoa. Khi có hình ảnh ở bên trái,
                văn bản sẽ tự động nép sang bên phải và bao quanh chân tấm hình. Nếu tấm hình này
                bị xóa đi hoặc không tồn tại, trình duyệt sẽ tự động đẩy đoạn văn bản này tràn ra
                hết toàn bộ chiều rộng của khung chứa mà không để lại khoảng trống nào.
            </p>

            <p>
                Cách làm này rất linh hoạt cho các trang tin tức, blog hoặc giới thiệu tiểu sử tác giả.
                Nó tạo cảm giác dàn trang chuyên nghiệp và tự nhiên hơn là chia cột cố định bằng Grid hay Flexbox.
            </p>
        </div>
    );
}

export default DetailAuthorPage;
