import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BaseModal from '../../../components/BaseModal';

const OrderData = [
    {
        id: 1,
        order_id: "ORD001",
        customer: "Nguyễn Văn A",
        total_price: 500000,
        status: "completed",
        created_at: "2024-05-01",
    },
    {
        id: 2,
        order_id: "ORD002",
        customer: "Trần Thị B",
        total_price: 300000,
        status: "pending",
        created_at: "2024-05-02",
    },
    {
        id: 3,
        order_id: "ORD003",
        customer: "Lê Văn C",
        total_price: 700000,
        status: "cancel",
        created_at: "2024-05-03",
    },
];

const Order = () => {
    const navigate = useNavigate();

    const [orders, setOrders] = useState(OrderData);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 4;

    const totalPages = Math.ceil(orders.length / pageSize);

    const pageItems = orders.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const [searchOrder, setSearchOrder] = useState("");

    useEffect(() => {
        navigate(`?page=${currentPage}`);
    }, [currentPage, navigate]);

    const searchURL = (e) => {
        e.preventDefault();
        navigate(`?q=${searchOrder}`);
    };

    const [openModal, setOpenModal] = useState(false);

    const handleSelected = (order) => {
        setSelectedOrder(order);
        setOpenModal(true);
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

            {/* Search */}
            <form
                className='tw-flex tw-justify-end tw-my-3'
                onSubmit={searchURL}
            >
                <input
                    type='text'
                    onChange={(e) => setSearchOrder(e.target.value)}
                    className=' tw-bg-purple-100 tw-mr-4 tw-rounded-lg tw-px-4 tw-py-2
                            focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-purple-300 
                            focus:tw-ring-offset-2 focus:tw-ring-offset-purple-300 tw-shadow-lg'                    placeholder='Search order...'
                />
                <button className='tw-bg-purple-600 hover:tw-bg-purple-700 tw-text-white tw-px-4 tw-py-2 tw-rounded'>
                    Search
                </button>
            </form>

            {/* Table */}
            <table className='tw-w-full tw-bg-purple-100 tw-border-collapse tw-shadow tw-rounded-2xl tw-shadow-sm overflow-hidden'>
                <thead>
                    <tr className='tw-bg-purple-500 tw-text-gray-700 tw-text-center'>
                        <th className='tw-p-3'>Order ID</th>
                        <th className='tw-p-3'>Customer</th>
                        <th className='tw-p-3'>Total</th>
                        <th className='tw-p-3'>Status</th>
                        <th className='tw-p-3'>Date</th>
                        <th className='tw-p-3'>Detail</th>
                    </tr>
                </thead>

                <tbody>
                    {pageItems.map(order => (
                        <tr key={order.id} className='tw-text-center border-b hover:tw-bg-gray-50'>
                            <td className='tw-p-3'>{order.order_id}</td>
                            <td>{order.customer}</td>
                            <td>{order.total_price.toLocaleString()} đ</td>

                            <td>
                                {order.status === "completed" && (
                                    <span className='tw-text-green-600'>Completed</span>
                                )}
                                {order.status === "pending" && (
                                    <span className='tw-text-yellow-600'>Pending</span>
                                )}
                                {order.status === "cancel" && (
                                    <span className='tw-text-red-600'>Cancel</span>
                                )}
                            </td>

                            <td>{order.created_at}</td>

                            <td>
                                <button
                                    onClick={() => handleSelected(order)}
                                    className='tw-bg-blue-500 tw-text-white tw-px-3 tw-py-1 rounded'
                                >
                                    View
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="tw-flex tw-justify-center tw-gap-2 tw-mt-5">

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

            </div>

            {/* Modal */}
            {selectedOrder && (
                <BaseModal open={openModal} close={() => setOpenModal(false)}>
                    <h2 className="tw-text-xl tw-font-bold mb-3">Order Detail</h2>

                    <p><b>Order ID:</b> {selectedOrder.order_id}</p>
                    <p><b>Customer:</b> {selectedOrder.customer}</p>
                    <p><b>Total:</b> {selectedOrder.total_price.toLocaleString()} đ</p>
                    <p><b>Status:</b> {selectedOrder.status}</p>
                    <p><b>Date:</b> {selectedOrder.created_at}</p>
                </BaseModal>
            )}

        </div>
    );
};

export default Order;