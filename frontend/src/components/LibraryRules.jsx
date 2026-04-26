import React from 'react';

const LibraryRules = () => {
    return (
        <div className="tw-max-w-4xl tw-mx-auto tw-p-6 tw-bg-white tw-min-h-screen">
            {/* Tiêu đề chính */}
            <div className="tw-text-center tw-mb-12">
                <h1 className="tw-text-4xl tw-font-black tw-text-gray-900 tw-uppercase tw-tracking-tighter">
                    Nội Quy Thư Viện
                </h1>
                <p className="tw-text-gray-500 tw-mt-2 tw-text-lg">Các quy định chung về việc mượn và trả tài liệu</p>
                <div className="tw-w-24 tw-h-1 tw-bg-red-500 tw-mx-auto tw-mt-4"></div>
            </div>

            {/* Khối quy định chính - Viết tĩnh từng thẻ */}
            <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-8">

                {/* Thẻ 1: Số lượng */}
                <div className="tw-bg-gray-50 tw-p-6 tw-rounded-2xl tw-border-l-4 tw-border-blue-500">
                    <div className="tw-flex tw-items-center tw-gap-3 tw-mb-3">
                        <i className="fa-solid fa-book tw-text-blue-500 tw-text-xl"></i>
                        <h3 className="tw-font-bold tw-text-gray-800 tw-text-lg">Số lượng mượn</h3>
                    </div>
                    <p className="tw-text-gray-600 tw-leading-relaxed">
                        Mỗi bạn đọc được mượn tối đa <strong>05 cuốn sách</strong> trong cùng một thời điểm. Đối với tài liệu đặc biệt (từ điển, báo chí), chỉ được đọc tại chỗ.
                    </p>
                </div>

                {/* Thẻ 2: Thời hạn */}
                <div className="tw-bg-gray-50 tw-p-6 tw-rounded-2xl tw-border-l-4 tw-border-green-500">
                    <div className="tw-flex tw-items-center tw-gap-3 tw-mb-3">
                        <i className="fa-solid fa-clock tw-text-green-500 tw-text-xl"></i>
                        <h3 className="tw-font-bold tw-text-gray-800 tw-text-lg">Thời hạn mượn</h3>
                    </div>
                    <p className="tw-text-gray-600 tw-leading-relaxed">
                        Thời gian giữ sách tối đa là <strong>14 ngày</strong>. Bạn có thể yêu cầu gia hạn thêm 07 ngày nếu không có người khác đang đặt hàng.
                    </p>
                </div>

                {/* Thẻ 3: Trách nhiệm */}
                <div className="tw-bg-gray-50 tw-p-6 tw-rounded-2xl tw-border-l-4 tw-border-orange-500">
                    <div className="tw-flex tw-items-center tw-gap-3 tw-mb-3">
                        <i className="fa-solid fa-shield-halved tw-text-orange-500 tw-text-xl"></i>
                        <h3 className="tw-font-bold tw-text-gray-800 tw-text-lg">Trách nhiệm</h3>
                    </div>
                    <p className="tw-text-gray-600 tw-leading-relaxed">
                        Người mượn có trách nhiệm bảo quản sách nguyên vẹn. Không viết vẽ, làm rách hoặc đánh dấu trực tiếp vào trang sách.
                    </p>
                </div>

                {/* Thẻ 4: Xử phạt */}
                <div className="tw-bg-gray-50 tw-p-6 tw-rounded-2xl tw-border-l-4 tw-border-red-500">
                    <div className="tw-flex tw-items-center tw-gap-3 tw-mb-3">
                        <i className="fa-solid fa-circle-exclamation tw-text-red-500 tw-text-xl"></i>
                        <h3 className="tw-font-bold tw-text-gray-800 tw-text-lg">Xử lý vi phạm</h3>
                    </div>
                    <p className="tw-text-gray-600 tw-leading-relaxed">
                        Trả sách trễ hạn sẽ bị phạt <strong>2.000 VNĐ/ngày/cuốn</strong>. Nếu làm mất sách, phải bồi thường bằng sách mới hoặc tiền mặt gấp đôi giá trị.
                    </p>
                </div>

            </div>

            {/* Thông tin thêm bên dưới */}
            <div className="tw-mt-12 tw-p-8 tw-bg-indigo-900 tw-rounded-3xl tw-text-white">
                <h2 className="tw-text-xl tw-font-bold tw-mb-4 tw-flex tw-items-center tw-gap-2">
                    <i className="fa-solid fa-circle-info"></i>
                    Lưu ý quan trọng
                </h2>
                <ul className="tw-list-disc tw-list-inside tw-space-y-2 tw-text-indigo-100 tw-text-sm">
                    <li>Mang theo thẻ thư viện mỗi khi thực hiện giao dịch mượn trả.</li>
                    <li>Kiểm tra kỹ tình trạng sách trước khi rời khỏi quầy.</li>
                    <li>Thư viện đóng cửa vào các ngày lễ và Chủ Nhật hàng tuần.</li>
                </ul>
            </div>


        </div>
    );
};

export default LibraryRules;