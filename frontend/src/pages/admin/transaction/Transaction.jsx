import React, { useContext, useEffect, useState } from 'react';
import BaseModal from '../../../components/BaseModal';
import { AuthContent } from '../../../utils/AuthContext';
import Pagination from '../../../components/Pagination';
import Loading from '../../../components/Loading';
import { getError } from '../../../utils/GetError';
import { Link } from 'react-router-dom'
// API bạn tự đổi lại
import { BorrowChange, BorrowChangeStatus, BorrowListAPI } from '../../../services/BorrowAPI';
import { STATUS_CONFIG } from '../../../config'
import DetailTransaction from './DetailTransaction';
import Input from '../../../components/Input';
const Transaction = () => {
    const { token } = useContext(AuthContent)

    const [reload, setReload] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [searchName, setSearchName] = useState("")
    const [searchBookName, setSearchBookName] = useState("")


    const data = BorrowListAPI(currentPage, token, reload, searchName, searchBookName)
    const borrows = data?.results
    const totalPages = Math.ceil((data?.count || 0) / 8)

    const [selected, setSelected] = useState(null)
    const [selectedID, setSelectedID] = useState("")
    const [selectedStatus, setSelectedStatus] = useState(null)

    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState("")
    const [isSuccess, setIsSuccess] = useState(false)

    const [openModal, setOpenModal] = useState(false)
    const [openConfirm, setOpenConfirm] = useState(false)
    const [openModalMsg, setOpenModalMsg] = useState(false)
    const [openModalChangeStatus, setOpenModalChangeStatus] = useState(false)


    const [editNote, setEditNote] = useState(false)
    const [note, setNote] = useState(null)

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


    const handleSearch = () => {
        setCurrentPage(1)
        setReload(prev => !prev)
    }

    const handleUpdateNote = async () => {
        try {
            setLoading(true)

            const result = await BorrowChange(
                note,
                selected?.id,
                token,
            )
            setMessage(result.data.message || "Cập nhật thành công")
            setIsSuccess(true)
            setReload(prev => !prev)

        } catch (err) {
            console.log("API error:", err)

            setMessage(err?.message || "Server không phản hồi")
            setIsSuccess(false)

        } finally {
            setLoading(false)
            setOpenModal(false)
            setOpenModalMsg(true)
        }
    }

    const handleUpdateStatus = async () => {
        try {
            setLoading(true)
            const result = await BorrowChangeStatus(
                selectedStatus?.value,
                selectedStatus?.item_id,
                token,
                reload
            )
            setMessage(result.data.message)
            if (result.status >= 200 && result.status < 300) {
                setIsSuccess(true)
                setReload(prev => !prev)
                setSelectedStatus(null)
            } else {
                setIsSuccess(false)
            }

        } catch (err) {
            setMessage("Server không phản hồi")
            setIsSuccess(false)

            console.log(err)
        } finally {
            setLoading(false)
            setOpenModalMsg(true)
            setOpenModalChangeStatus(false)
        }
    }

    const handleClose = () => {
        setOpenModal(false)
        setOpenConfirm(false)
        setOpenModalMsg(false)
        setOpenModalChangeStatus(false)
        setEditNote(false)
        setTimeout(() => {
            setSelectedID(null)
            setSelected(null)
            setMessage(null)
            setSelectedStatus(null)
            setNote(null)
        }, 200)

    }


    return (
        <div className='tw-p-6'>
            <div className="tw-flex tw-items-center tw-justify-between tw-mb-6">
                {loading && <Loading loading={loading} />}
                <h1 className="tw-text-3xl tw-font-bold tw-text-blue-600">
                    Quản lý sách đã đặt
                </h1>

                <div className="tw-flex tw-gap-3">
                    <Input
                        className="tw-w-52"
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                        placeholder="Tên người mượn"
                    />

                    <Input
                        className="tw-w-52"
                        value={searchBookName}
                        onChange={(e) => setSearchBookName(e.target.value)}
                        placeholder="Tên sách"
                    />

                    <button
                        className="tw-px-4 tw-py-2 tw-bg-blue-600 tw-text-white tw-rounded-lg hover:tw-bg-blue-700 tw-transition"
                        onClick={handleSearch}
                    >
                        Tìm kiếm
                    </button>
                </div>
            </div>

            <table className='tw-w-full tw-bg-white tw-shadow tw-rounded-xl overflow-hidden'>
                <thead>
                    <tr className='tw-bg-gray-200 tw-text-center'>
                        <th>ID</th>
                        <th>Khách hàng</th>
                        <th>Sách</th>
                        <th>Ngày mượn</th>
                        <th>Ngày tạo đơn</th>
                        <th>Trạng thái</th>
                        <th>Giá</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {borrows?.length === 0 ? (
                        <tr>
                            <td colSpan="7" className="tw-text-center tw-p-4">
                                Không có dữ liệu
                            </td>
                        </tr>
                    ) : borrows?.map(item => {
                        const status = {
                            ...STATUS_CONFIG[item.status],
                            item_id: item.id
                        }
                        return (
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
                                    {item.borrowing_book_date
                                        ? new Date(item.borrowing_book_date).toLocaleDateString("vi-VN")
                                        : "—"}
                                </td>

                                <td>
                                    {new Date(item.created_at).toLocaleString('vi-VN')}
                                </td>

                                {/* STATUS BADGE */}
                                <td>
                                    <span
                                        className={`tw-px-4 tw-py-2 tw-rounded-full tw-text-xs tw-font-semibold tw-cursor-pointer
                                        ${status?.className}
                                        `}
                                        onClick={() => {
                                            setOpenModalChangeStatus(true)
                                            setSelectedStatus(status)
                                            setSelectedID(item.id)
                                        }}
                                    >
                                        {status?.label}
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
                                            className='tw-bg-gray-500 hover:tw-bg-gray-600 tw-text-white tw-px-3 tw-py-1 tw-rounded-lg tw-text-sm'
                                        >
                                            <i className="fa fa-eye"></i>
                                        </button>


                                    </div>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                goPage={goPage}
            />


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

            <DetailTransaction
                selected={selected}
                openModal={openModal}
                handleClose={handleClose}
                editNote={editNote}
                setEditNote={setEditNote}
                note={note}
                setNote={setNote}
                handleUpdateNote={handleUpdateNote}
            />

            {selectedStatus &&
                <BaseModal open={openModalChangeStatus} close={handleClose}>
                    <div className="tw-w-[400px] tw-bg-white tw-rounded-xl tw-shadow-lg tw-overflow-hidden">
                        {/* Header */}
                        <div className="tw-p-4 tw-border-b tw-font-semibold tw-text-gray-700 tw-flex tw-justify-between">
                            Cập nhật trạng thái
                            <span>Đơn hàng số: {selectedStatus.item_id}</span>
                        </div>

                        {/* Body */}
                        <div className="tw-p-4">

                            <select
                                value={selectedStatus.value}
                                onChange={(e) => {
                                    const newStatus = Object.values(STATUS_CONFIG).find(
                                        item => item.value === e.target.value
                                    );
                                    setSelectedStatus({ ...newStatus, 'item_id': selectedStatus.item_id });
                                }}
                                className="tw-w-full tw-p-2 tw-rounded-md tw-border tw-outline-none "
                            >
                                {Object.values(STATUS_CONFIG)?.map(item => (
                                    <option key={item.value} value={item.value}>
                                        {item.label}
                                    </option>
                                ))}
                            </select>

                        </div>

                        {/* Footer */}
                        <div className="tw-flex tw-justify-end tw-gap-2 tw-p-4 tw-border-t">
                            <button
                                onClick={handleClose}
                                className="tw-px-4 tw-py-2 tw-rounded-md tw-bg-gray-200 hover:tw-bg-gray-300"
                            >
                                Hủy
                            </button>

                            <button
                                onClick={() => handleUpdateStatus()}
                                className="tw-px-4 tw-py-2 tw-rounded-md tw-bg-blue-500 tw-text-white hover:tw-bg-blue-600"
                            >
                                Xác nhận
                            </button>
                        </div>
                    </div>
                </BaseModal>
            }
        </div>
    )
}

export default Transaction;