import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BaseModal from '../../../components/BaseModal';
import Input from '../../../components/Input';
import { OrderChangeStatus, ReservationListAPI } from '../../../services/ReservationAPI';
import { AuthContent } from '../../../utils/AuthContext';
import { RESERVATION_STATUS_CONFIG } from '../../../config';
const Order = () => {
    const navigate = useNavigate();
    const { token } = useContext(AuthContent)
    const [reload, setReload] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [searchName, setSearchName] = useState("")
    const [searchBookName, setSearchBookName] = useState("")

    const data = ReservationListAPI(currentPage, token, reload, searchName, searchBookName)
    const orders = data?.results
    const [selectedOrder, setSelectedOrder] = useState(null);

    const [selectedStatus, setSelectedStatus] = useState(null);
    const [openModalChangeStatus, setOpenModalChangeStatus] = useState(false);
    const [message, setMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [openModalMsg, setOpenModalMsg] = useState(false);

    const [openModal, setOpenModal] = useState(false);

    const handleSelected = (order) => {
        setSelectedOrder(order);
        setOpenModal(true);
    };

    const handleSearch = () => {
        setCurrentPage(1)
        setReload(prev => !prev)
    }

    const handleClose = () => {
        setOpenModal(false);
        setOpenModalMsg(false);
        setOpenModalChangeStatus(false);

        setTimeout(() => {
            setSelectedOrder(null);   // đúng state
            setSelectedStatus(null);
            setMessage("");
            setIsSuccess(false);
        }, 200);
    };

    const handleUpdateStatus = async () => {
        try {
            const result = await OrderChangeStatus(
                selectedStatus.value,
                selectedStatus.item_id,
                token
            );

            setMessage(result.data.message || "Cập nhật thành công");

            if (result.status >= 200 && result.status < 300) {
                setIsSuccess(true);
                setReload(prev => !prev);
                setSelectedStatus(null);
            } else {
                setIsSuccess(false);
            }

        } catch (err) {
            setMessage("Server không phản hồi");
            setIsSuccess(false);
        } finally {
            setOpenModalMsg(true);
            setOpenModalChangeStatus(false);
        }
    };
    return (
        <div className='tw-p-6 tw-bg-purple-50 min-h-screen'>

            {/* Header */}
            <div className='tw-flex tw-justify-between tw-items-center tw-mb-6'>
                <h1 className='tw-text-3xl tw-font-bold tw-text-purple-800'>
                    <i className='fa-solid fa-cart-shopping tw-text-purple-600'></i>
                    Order Management
                </h1>
                <Link
                    to="add-order"
                    className='tw-bg-purple-600 tw-text-white tw-px-4 tw-py-2 tw-rounded'
                >
                    Add Order
                </Link>
            </div>

            <div className="tw-flex tw-gap-3 tw-my-3">
                <Input
                    className="tw-bg-purple-100 
                            focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-purple-300 
                            focus:tw-ring-offset-2 focus:tw-ring-offset-purple-300 tw-shadow-lg"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    placeholder="Tên người mượn"
                />

                <Input
                    className="tw-bg-purple-100 
                            focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-purple-300 
                            focus:tw-ring-offset-2 focus:tw-ring-offset-purple-300 tw-shadow-lg"
                    value={searchBookName}
                    onChange={(e) => setSearchBookName(e.target.value)}
                    placeholder="Tên sách"
                />

                <button
                    className='tw-bg-purple-600 hover:tw-bg-purple-700 tw-text-white tw-px-4 tw-py-2 tw-rounded'
                    onClick={handleSearch}
                >
                    Tìm kiếm
                </button>

            </div>

            {/* Table */}
            <table className='tw-w-full tw-bg-purple-100 tw-border-collapse tw-shadow tw-rounded-2xl tw-shadow-sm overflow-hidden'>
                <thead>
                    <tr className='tw-bg-purple-500 tw-text-gray-700 tw-text-center'>
                        <th className='tw-p-3'>ID</th>
                        <th className='tw-p-3'>Khách hàng</th>
                        <th className='tw-p-3'>Sách</th>
                        <th className='tw-p-3'>Ngày tạo</th>
                        <th className='tw-p-3'>Trạng thái</th>
                        <th className='tw-p-3'>Thông tin chi tiết</th>
                    </tr>
                </thead>

                <tbody>
                    {orders?.map((order) => {
                        const statusInfo = RESERVATION_STATUS_CONFIG[order.status] || { label: item.status, className: "tw-bg-gray-100" };
                        return (
                            <tr key={order.id} className='tw-text-center border-b hover:tw-bg-gray-50'>
                                <td className='tw-p-3'>{order.id}</td>

                                <td>
                                    <div className='tw-flex tw-items-center tw-gap-3 '>
                                        <img
                                            src={order.user.image}
                                            className='tw-w-10 tw-h-10 tw-rounded-full tw-object-cover'
                                        />
                                        <div className='tw-text-left'>
                                            <p className='tw-font-medium'>
                                                {order.user.first_name} {order.user.last_name}
                                            </p>
                                            <p className='tw-text-xs tw-text-gray-500'>
                                                {order.user.email}
                                            </p>
                                        </div>
                                    </div>
                                </td>

                                <td>
                                    <div className='tw-flex tw-items-center tw-gap-3'>
                                        <img
                                            src={order.book.image}
                                            className='tw-w-12 tw-h-16 tw-object-cover tw-rounded'
                                        />
                                        <span className='tw-font-medium'>{order.book.name}</span>

                                    </div>
                                </td>

                                <td>
                                    {new Date(order.created_at).toLocaleString("vi-vn")}
                                </td>

                                <td>
                                    <span
                                        className={`tw-px-3 tw-py-1 tw-rounded-full tw-text-xs tw-font-semibold tw-cursor-pointer ${statusInfo?.className}`}
                                        onClick={() => {
                                            setSelectedStatus({
                                                ...statusInfo,
                                                item_id: order.id
                                            });
                                            setOpenModalChangeStatus(true)
                                        }}
                                    >
                                        {statusInfo?.label}
                                    </span>
                                </td>

                                {/* ACTION */}
                                <td>
                                    <button
                                        onClick={() => handleSelected(order)}
                                        className='tw-bg-blue-500 tw-text-white tw-px-3 tw-py-1 rounded'
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {/* Pagination */}
            {/* <div className="tw-flex tw-justify-center tw-gap-2 tw-mt-5">

                <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    className="tw-bg-purple-600 tw-text-white tw-px-3 tw-py-1 rounded"
                >
                    Prev
                </button>

                {Array.from({ length: totalPages }, (_, index) => {
                    const page = index + 1;
                    return (
                        <button
                            key={index}
                            onClick={() => setCurrentPage(page)}
                            className={`tw-px-3 tw-py-1 border rounded
                            ${currentPage === page
                                    ? "tw-bg-purple-500 tw-text-white"
                                    : "tw-bg-white"}`}
                        >
                            {page}
                        </button>
                    );
                })}

                <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    className="tw-bg-purple-600 tw-text-white tw-px-3 tw-py-1 rounded"
                >
                    Next
                </button>

            </div> */}

            {message &&
                <BaseModal open={openModalMsg} close={handleClose}>
                    <div className="tw-p-3 tw-flex tw-items-center tw-justify-center tw-gap-3" style={{ width: "300px" }}>
                        {isSuccess ?
                            <i className="fa-solid fa-circle-check tw-text-green-500 tw-text-lg"></i> :
                            <i class="fa-solid fa-circle-xmark tw-text-red-500 tw-text-lg"></i>
                        }
                        <div>
                            {message}
                        </div>
                    </div>
                </BaseModal>}

            {selectedOrder && (
                <BaseModal open={openModal} close={handleClose}>
                    <div className="tw-space-y-4 tw-px-4 tw-py-2">
                        {/* HEADER */}
                        <div className="tw-border-b tw-pb-3">
                            <h2 className="tw-text-xl tw-font-bold tw-text-gray-800">
                                Chi tiết đơn
                            </h2>
                            <p className="tw-text-sm tw-text-gray-400">
                                #{selectedOrder.id}
                            </p>
                        </div>

                        {/* CONTENT */}
                        <div className="tw-grid tw-grid-cols-2 tw-gap-4 tw-text-sm">

                            <div>
                                <p className="tw-text-gray-400">Khách hàng</p>
                                <p className="tw-font-semibold">
                                    {selectedOrder.user.first_name} {selectedOrder.user.last_name}
                                </p>
                            </div>

                            <div className="tw-col-span-2">
                                <p className="tw-text-gray-400">Sách</p>
                                <p className="tw-font-semibold">
                                    {selectedOrder.book.name}
                                </p>
                            </div>

                            <div>
                                <p className="tw-text-gray-400">Ngày tạo</p>
                                <p className="tw-font-semibold">
                                    {new Date(selectedOrder.created_at).toLocaleString("vi-vn")}
                                </p>
                            </div>

                            <div>
                                <p className="tw-text-gray-400">Ngày cập nhật</p>
                                <p className="tw-font-semibold">
                                    {new Date(selectedOrder.updated_at).toLocaleString("vi-vn")}
                                </p>
                            </div>

                            <div>
                                <p className="tw-text-gray-400">Trạng thái</p>
                                <span
                                    className={`tw-inline-block tw-mt-1 tw-px-3 tw-py-1 tw-rounded-full tw-text-xs tw-font-semibold ${RESERVATION_STATUS_CONFIG[selectedOrder.status]?.className ||
                                        "tw-bg-gray-100"
                                        }`}
                                >
                                    {RESERVATION_STATUS_CONFIG[selectedOrder.status]?.label ||
                                        selectedOrder.status}
                                </span>
                            </div>
                        </div>

                        {/* FOOTER */}
                        <div className="tw-flex tw-justify-end tw-pt-3 tw-border-t">
                            <button
                                onClick={() => setOpenModal(false)}
                                className="tw-bg-gray-200 hover:tw-bg-gray-300 tw-text-gray-700 tw-px-4 tw-py-2 tw-rounded"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </BaseModal>
            )}

            {selectedStatus && (
                <BaseModal open={openModalChangeStatus} close={handleClose}>
                    <div className="tw-w-[400px] tw-bg-white tw-rounded-xl tw-shadow-lg tw-overflow-hidden">

                        {/* HEADER */}
                        <div className="tw-p-4 tw-border-b tw-font-semibold tw-text-gray-700 tw-flex tw-justify-between">
                            Cập nhật trạng thái
                            <span>#{selectedStatus.item_id}</span>
                        </div>

                        {/* BODY */}
                        <div className="tw-p-4">
                            <select
                                value={selectedStatus.value}
                                onChange={(e) => {
                                    const newStatus = Object.values(RESERVATION_STATUS_CONFIG).find(
                                        item => item.value === e.target.value
                                    );
                                    setSelectedStatus({
                                        ...newStatus,
                                        item_id: selectedStatus.item_id
                                    });
                                }}
                                className="tw-w-full tw-p-2 tw-rounded-md tw-border"
                            >
                                {Object.values(RESERVATION_STATUS_CONFIG).map(item => (
                                    <option key={item.value} value={item.value}>
                                        {item.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* FOOTER */}
                        <div className="tw-flex tw-justify-end tw-gap-2 tw-p-4 tw-border-t">
                            <button
                                onClick={() => setOpenModalChangeStatus(false)}
                                className="tw-px-4 tw-py-2 tw-rounded-md tw-bg-gray-200"
                            >
                                Hủy
                            </button>

                            <button
                                onClick={handleUpdateStatus}
                                className="tw-px-4 tw-py-2 tw-rounded-md tw-bg-purple-600 tw-text-white hover:tw-bg-purple-700"
                            >
                                Xác nhận
                            </button>
                        </div>
                    </div>
                </BaseModal>
            )}

        </div>
    );
};

export default Order;