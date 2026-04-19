import React, { useContext, useEffect, useState } from 'react';
import BaseModal from '../../../components/BaseModal';
import { AuthContent } from '../../../utils/AuthContext';
import Pagination from '../../../components/Pagination';
import Loading from '../../../components/Loading';
import { getError } from '../../../utils/GetError';

// API bạn tự đổi lại
import { BorrowListAPI } from '../../../services/BorrowAPI';

const Transaction = () => {
    const { token } = useContext(AuthContent)

    const [reload, setReload] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)

    const data = BorrowListAPI(currentPage, token, reload)
    const borrows = data?.results || []

    const totalPages = Math.ceil((data?.count || 0) / 8)

    const [selected, setSelected] = useState(null)
    const [selectedID, setSelectedID] = useState("")

    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState("")
    const [isSuccess, setIsSuccess] = useState(false)

    const [openModal, setOpenModal] = useState(false)
    const [openConfirm, setOpenConfirm] = useState(false)
    const [openMsg, setOpenMsg] = useState(false)

    useEffect(() => {
        setLoading(false)
    }, [borrows])

    const handleSelected = (item) => {
        setSelected(item)
        setOpenModal(true)
    }

    const goPage = (page) => {
        setCurrentPage(page)
    }

    const handleDelete = async (e, id) => {
        e.preventDefault()
        try {
            setLoading(true)
            const res = await DeleteBorrow(id, token)
            if (res) {
                setMessage(res.message)
                setIsSuccess(true)
                setOpenMsg(true)
                setReload(prev => !prev)
            }
        } catch (err) {
            setMessage(getError(err))
            setIsSuccess(false)
            setOpenMsg(true)
        } finally {
            handleClose()
            setLoading(false)
        }
    }

    const handleClose = () => {
        setOpenModal(false)
        setOpenConfirm(false)
        setOpenMsg(false)
        setSelectedID("")
        setMessage("")
        setTimeout(() => setSelected(null), 200)

    }

    if (loading) return <Loading loading={loading} />

    return (
        <div className='tw-p-6'>
            <h1 className='tw-text-3xl tw-font-bold tw-text-blue-600 tw-mb-6'>
                Quản lý sách đã đặt
            </h1>

            <table className='tw-w-full tw-bg-white tw-shadow tw-rounded-xl overflow-hidden'>
                <thead>
                    <tr className='tw-bg-gray-200 tw-text-center'>
                        <th>ID</th>
                        <th>User</th>
                        <th>Book</th>
                        <th>Ngày mượn</th>
                        <th>Trạng thái</th>
                        <th>Giá</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {borrows.length === 0 ? (
                        <tr>
                            <td colSpan="7" className="tw-text-center tw-p-4">
                                Không có dữ liệu
                            </td>
                        </tr>
                    ) : borrows.map(item => (
                        <tr key={item.id} className='tw-border-b hover:tw-bg-gray-50 tw-text-center tw-text-sm'>
                            <td className='tw-p-3'>{item.id}</td>

                            {/* USER */}
                            <td className='tw-p-3'>
                                <div className='tw-flex tw-items-center tw-gap-3 '>
                                    <img
                                        src={item.user.image}
                                        className='tw-w-10 tw-h-10 tw-rounded-full tw-object-cover'
                                    />
                                    <div className='tw-text-left'>
                                        <p className='tw-font-medium'>
                                            {item.user.first_name} {item.user.last_name}
                                        </p>
                                        <p className='tw-text-xs tw-text-gray-500'>
                                            {item.user.email}
                                        </p>
                                    </div>
                                </div>
                            </td>

                            {/* BOOK */}
                            <td className=' tw-p-3'>
                                <div className='tw-flex tw-items-center tw-gap-3'>
                                    <img
                                        src={item.book.image}
                                        className='tw-w-12 tw-h-16 tw-object-cover tw-rounded'
                                    />
                                    <span className='tw-font-medium'>{item.book.name}</span>

                                </div>
                            </td>

                            <td>
                                {new Date(item.borrowing_book_date).toLocaleDateString()}
                            </td>

                            {/* STATUS BADGE */}
                            <td>
                                <span className={`tw-px-3 tw-py-1 tw-rounded-full tw-text-xs tw-font-semibold
            ${item.status === "PENDING" && "tw-bg-yellow-100 tw-text-yellow-600"}
            ${item.status === "BORROWED" && "tw-bg-blue-100 tw-text-blue-600"}
            ${item.status === "RETURNED" && "tw-bg-green-100 tw-text-green-600"}
        `}>
                                    {item.status}
                                </span>
                            </td>

                            <td className='tw-font-medium'>
                                {Number(item.price).toLocaleString()}đ
                            </td>

                            {/* ACTION */}
                            <td>
                                <div className='tw-flex tw-justify-center tw-gap-2'>
                                    <button
                                        onClick={() => handleSelected(item)}
                                        className='tw-bg-blue-500 hover:tw-bg-blue-600 tw-text-white tw-px-3 tw-py-1 tw-rounded-lg tw-text-sm'
                                    >
                                        <i className="fa fa-eye"></i>
                                    </button>

                                    <button
                                        onClick={() => {
                                            setSelectedID(item.id)
                                            setOpenConfirm(true)
                                        }}
                                        className='tw-bg-red-500 hover:tw-bg-red-600 tw-text-white tw-px-3 tw-py-1 tw-rounded-lg tw-text-sm'
                                    >
                                        <i className="fa fa-trash"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                goPage={goPage}
            />

            {/* DETAIL */}
            <BaseModal open={openModal} close={handleClose}>
                {selected &&
                    <div className="tw-w-full tw-bg-white tw-rounded-2xl tw-shadow-xl tw-p-6 tw-border tw-border-gray-50">

                        {/* HEADER */}
                        <div className="tw-flex tw-justify-between tw-items-center tw-mb-5">
                            <h2 className="tw-text-xl tw-font-bold tw-text-gray-800">Chi tiết giao dịch</h2>
                            <button
                                onClick={handleClose}
                                className="tw-w-8 tw-h-8 tw-flex tw-justify-center tw-items-center tw-bg-gray-50 tw-rounded-full tw-text-gray-400 hover:tw-text-gray-700 hover:tw-bg-gray-100 tw-transition-colors"
                                aria-label="Đóng"
                            >
                                ✕
                            </button>
                        </div>

                        {/* USER PROFILE */}
                        <div className="tw-flex tw-items-center tw-gap-4 tw-p-3 tw-bg-gray-50 tw-rounded-xl tw-mb-5">
                            <img
                                src={selected.user.image}
                                alt={`${selected.user.first_name} ${selected.user.last_name}`}
                                className="tw-w-12 tw-h-12 tw-rounded-full tw-object-cover tw-border tw-border-white tw-shadow-sm"
                            />
                            <div>
                                <p className="tw-font-bold tw-text-gray-800">
                                    {selected.user.first_name} {selected.user.last_name}
                                </p>
                                <p className="tw-text-sm tw-text-gray-500">
                                    {selected.user.email}
                                </p>
                            </div>
                        </div>

                        {/* BOOK INFO */}
                        <div className="tw-flex tw-items-start tw-gap-4 tw-mb-5">
                            <div className="tw-shrink-0 tw-shadow-sm tw-rounded-md tw-overflow-hidden tw-border tw-border-gray-100">
                                <img
                                    src={selected.book.image}
                                    alt={selected.book.name}
                                    className="tw-w-16 tw-h-24 tw-object-cover"
                                />
                            </div>
                            <div className="tw-space-y-1">
                                <p className="tw-font-bold tw-text-gray-800 tw-leading-tight line-clamp-2">
                                    {selected.book.name}
                                </p>
                                <p className="tw-text-sm tw-text-gray-500 tw-pt-1">
                                    <span className="tw-inline-block tw-w-20">Mượn:</span>
                                    <span className="tw-font-medium tw-text-gray-700">
                                        {new Date(selected.borrowing_book_date).toLocaleDateString('vi-VN')}
                                    </span>
                                </p>
                                <p className="tw-text-sm tw-text-gray-500">
                                    <span className="tw-inline-block tw-w-20">Trả:</span>
                                    <span className={`tw-font-medium ${selected.returning_book_date ? "tw-text-gray-700" : "tw-text-amber-500"}`}>
                                        {selected.returning_book_date
                                            ? new Date(selected.returning_book_date).toLocaleDateString('vi-VN')
                                            : "Chưa trả"}
                                    </span>
                                </p>
                            </div>
                        </div>

                        <hr className="tw-my-5 tw-border-gray-100" />

                        {/* SUMMARY GRID */}
                        <div className="tw-grid tw-grid-cols-2 tw-gap-3">
                            {/* Box Số lượng */}
                            <div className="tw-bg-gray-50 tw-p-3 tw-rounded-xl">
                                <p className="tw-text-xs tw-text-gray-500 tw-mb-1">Số lượng</p>
                                <p className="tw-text-lg tw-font-bold tw-text-gray-800">
                                    {selected.borrowing_quantity} <span className="tw-text-sm tw-font-normal tw-text-gray-500">quyển</span>
                                </p>
                            </div>

                            {/* Box Giá tiền */}
                            <div className="tw-bg-blue-50/50 tw-p-3 tw-rounded-xl tw-border tw-border-blue-50">
                                <p className="tw-text-xs tw-text-blue-600/80 tw-mb-1">Tổng thanh toán</p>
                                <p className="tw-text-lg tw-font-bold tw-text-blue-700">
                                    {Number(selected.price).toLocaleString('vi-VN')}đ
                                </p>
                            </div>

                            {/* Trạng thái */}
                            <div className="tw-col-span-2 tw-flex tw-justify-between tw-items-center tw-bg-gray-50 tw-p-3 tw-rounded-xl tw-mt-1">
                                <p className="tw-text-sm tw-text-gray-600 tw-font-medium">Trạng thái giao dịch</p>
                                <span className={`tw-px-3 tw-py-1.5 tw-rounded-full tw-text-xs tw-font-bold tw-uppercase tw-tracking-wide
                ${selected.status === "PENDING" ? "tw-bg-amber-100 tw-text-amber-700" : ""}
                ${selected.status === "BORROWING" ? "tw-bg-blue-100 tw-text-blue-700" : ""}
                ${selected.status === "CONFIRMED" ? "tw-bg-emerald-100 tw-text-emerald-700" : ""}
            `}>
                                    {selected.status}
                                </span>
                            </div>
                        </div>

                    </div>
                }
            </BaseModal>

            {/* CONFIRM DELETE */}
            {openConfirm &&
                <BaseModal open={openConfirm} close={handleClose}>
                    <div>
                        <p>Bạn chắc chắn muốn xóa?</p>
                        <button onClick={handleClose}>Hủy</button>
                        <button onClick={(e) => handleDelete(e, selectedID)}>Xóa</button>
                    </div>
                </BaseModal>
            }

            {/* MESSAGE */}
            {openMsg &&
                <BaseModal open={openMsg} close={handleClose}>
                    <div>{message}</div>
                </BaseModal>
            }
        </div>
    )
}

export default Transaction;