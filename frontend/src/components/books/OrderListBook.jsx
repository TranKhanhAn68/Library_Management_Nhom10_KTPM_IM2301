import React, { useContext, useState } from 'react';
import { AuthContent } from '../../utils/AuthContext';
import { OrderListByUser } from '../../services/UserAPI';
import { RESERVATION_STATUS_CONFIG } from '../../config';

const OrderListBook = () => {
    const { token } = useContext(AuthContent);
    const [currentPage, setCurrentPage] = useState(1);

    const data = OrderListByUser(token, currentPage);
    const orders = data?.results;

    return (
        <div className="tw-max-w-4xl tw-mx-auto tw-p-6 tw-bg-gray-50 tw-min-h-screen">
            <header className="tw-mb-8">
                <h1 className="tw-text-3xl tw-font-black tw-text-gray-900">
                    DANH SÁCH ĐƠN HÀNG
                </h1>
                <p className="tw-text-gray-500 tw-mt-1">
                    Theo dõi danh sách sách bạn đã đặt
                </p>
            </header>

            <div className="tw-grid tw-gap-5">
                {orders?.map((order, index) => {
                    const statusInfo =
                        RESERVATION_STATUS_CONFIG[order.status] || {
                            label: order.status,
                            className: "tw-bg-gray-100",
                        };

                    return (
                        <div
                            key={order.id}
                            className="tw-bg-white tw-rounded-2xl tw-shadow-sm tw-border tw-border-gray-100 hover:tw-shadow-md tw-transition-all"
                        >
                            <div className="tw-p-5 tw-flex tw-flex-col md:tw-flex-row tw-gap-6">
                                {/* LEFT */}
                                <div className="tw-flex-1">
                                    <div className="tw-flex tw-justify-between tw-items-start tw-mb-4">
                                        <div>
                                            <h3 className="tw-text-lg tw-font-bold tw-text-gray-800">
                                                {index + 1}. {order.book?.name}
                                            </h3>
                                            <small>
                                                Ngày tạo:{" "}
                                                {new Date(order.created_at).toLocaleString("vi-vn")}
                                            </small>
                                        </div>

                                        <span
                                            className={`tw-px-3 tw-py-1 tw-rounded-full tw-text-[11px] tw-font-bold tw-uppercase ${statusInfo.className}`}
                                        >
                                            {statusInfo.label}
                                        </span>
                                    </div>
                                </div>

                                {/* RIGHT */}
                                <div className="tw-flex tw-items-center tw-justify-center tw-bg-gray-50 tw-px-6 tw-py-4 md:tw-min-w-[160px] tw-border-t md:tw-border-l tw-border-gray-100">
                                    <p className="tw-text-sm tw-text-gray-500">
                                        {order.status}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {(!orders || orders.length === 0) && (
                    <div className="tw-text-center tw-py-20 tw-text-gray-400">
                        Không có đơn hàng nào.
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderListBook;