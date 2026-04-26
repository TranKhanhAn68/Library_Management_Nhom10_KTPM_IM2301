import React, { useContext, useState } from 'react';
import StatusSelect from '../StatusSelect';
import { STATUS_CONFIG } from '../../config';
import { AuthContent } from '../../utils/AuthContext';
import { BorrowingListByUser } from '../../services/UserAPI';

const BorrowingHistory = () => {
    const { token } = useContext(AuthContent)
    const [currentPage, setCurrentPage] = useState(1)
    const [status, setStatus] = useState("");

    const data = BorrowingListByUser(token, status, currentPage)

    const history = data?.results

    console.log(history)
    return (
        <div className="tw-max-w-4xl tw-mx-auto tw-p-6 tw-bg-gray-50 tw-min-h-screen">
            <header className="tw-mb-8 tw-flex tw-flex-col sm:tw-flex-row tw-justify-between tw-items-start sm:tw-items-end tw-gap-4">
                <div>
                    <h1 className="tw-text-3xl tw-font-black tw-text-gray-900">
                        LỊCH SỬ GIAO DỊCH
                    </h1>
                    <p className="tw-text-gray-500 tw-mt-1">
                        Theo dõi hoạt động mượn trả và chi phí của bạn
                    </p>
                </div>

                <StatusSelect
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                />
            </header>

            <div className="tw-grid tw-gap-5">
                {history?.map((item) => {
                    // Lấy config tương ứng với status của item
                    const statusInfo = STATUS_CONFIG[item.status] || { label: item.status, className: "tw-bg-gray-100" };

                    return (
                        <div
                            key={item.id}
                            className="tw-bg-white tw-rounded-2xl tw-shadow-sm tw-border tw-border-gray-100 hover:tw-shadow-md tw-transition-all tw-overflow-hidden"
                        >
                            <div className="tw-p-5 tw-flex tw-flex-col md:tw-flex-row tw-gap-6">
                                {/* LEFT CONTENT */}
                                <div className="tw-flex-1">
                                    <div className="tw-flex tw-justify-between tw-items-start tw-mb-4">
                                        <div>
                                            <h3 className="tw-text-lg tw-font-bold tw-text-gray-800">
                                                {item.book.name}
                                            </h3>
                                            <small>Ngày tạo: {new Date(item.created_at).toLocaleString("vi-vn")}</small>
                                            <p className="tw-text-sm tw-text-gray-500">
                                                Số lượng: <span className="tw-font-bold tw-text-gray-700">{item.borrowing_quantity}</span>
                                            </p>
                                        </div>

                                        {/* Badge trạng thái */}
                                        <span className={`tw-px-3 tw-py-1 tw-rounded-full tw-text-[11px] tw-font-bold tw-uppercase tw-tracking-wider ${statusInfo.className}`}>
                                            {statusInfo.label}
                                        </span>
                                    </div>

                                    <div className="tw-grid tw-grid-cols-2 sm:tw-grid-cols-4 tw-gap-4">
                                        <DetailItem label="Ngày mượn" value={item.borrowing_book_date} />
                                        <DetailItem label="Hạn trả" value={item.due_date} />
                                        <DetailItem label="Đơn giá" value={Number(item.price).toLocaleString() + " đ"} />
                                        <DetailItem label="Thành tiền" value={Number(item.price).toLocaleString() + " đ"} isBold />
                                    </div>
                                </div>

                                {/* RIGHT CONTENT (Bổ sung xử lý hiển thị) */}
                                <div className="tw-flex tw-flex-row md:tw-flex-col tw-justify-between tw-items-center tw-bg-gray-50 tw-px-6 tw-py-4 md:tw-min-w-[160px] tw-border-t md:tw-border-l tw-border-gray-100">
                                    <div className="tw-text-center">
                                        <p className="tw-text-[10px] tw-uppercase tw-text-gray-400 tw-font-bold">
                                            Thực tế trả
                                        </p>
                                        <p className={`tw-text-sm tw-font-bold ${item.returnDate ? 'tw-text-green-600' : 'tw-text-orange-500'}`}>
                                            {item.returning_book_date || "Chưa trả"}
                                        </p>
                                    </div>

                                    {/* Nút hành động nếu quá hạn */}
                                    {item.status === "OVERDUE" && (
                                        <button className="tw-mt-2 tw-bg-red-500 tw-text-white tw-px-4 tw-py-1.5 tw-rounded-lg tw-text-xs tw-font-bold hover:tw-bg-red-600 tw-transition-colors">
                                            Gia hạn / Phạt
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}

                {history?.length === 0 && (
                    <div className="tw-text-center tw-py-20 tw-text-gray-400">
                        Không có dữ liệu cho trạng thái này.
                    </div>
                )}
            </div>
        </div>
    );
};



const DetailItem = ({ label, value, isBold = false }) => (
    <div>
        <p className="tw-text-[10px] tw-uppercase tw-text-gray-400 tw-font-bold">{label}</p>
        <p className={`tw-text-sm ${isBold ? 'tw-font-bold tw-text-gray-900' : 'tw-text-gray-700'}`}>{value}</p>
    </div>
);

export default BorrowingHistory;