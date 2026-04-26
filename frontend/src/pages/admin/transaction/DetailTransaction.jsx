import React, { useEffect } from 'react';
import BaseModal from '../../../components/BaseModal';
import { STATUS_CONFIG } from '../../../config';

const DetailTransaction = ({
    selected,
    openModal,
    handleClose,
    editNote,
    setEditNote,
    note,
    setNote,
    handleUpdateNote
}) => {
    useEffect(() => {
        if (selected)
            setNote(selected?.note)
    }, [selected])

    return (
        selected &&
        <BaseModal open={openModal} close={handleClose}>
            <div className="tw-w-full tw-bg-white tw-rounded-2xl tw-shadow-xl tw-p-6 tw-border tw-border-gray-50">

                {/* HEADER */}
                <div className="tw-flex tw-justify-between tw-items-center tw-mb-5">
                    <div>
                        <h2 className="tw-text-xl tw-font-bold tw-text-gray-800">Chi tiết giao dịch</h2>
                        <small className='tw-text-gray-500 tx-text-bold'>
                            Ngày cập nhật mới nhất: {new Date(selected.updated_at).toLocaleString('vi-vn')}
                        </small>
                    </div>
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
                                {selected.borrowing_book_date
                                    ? new Date(selected.borrowing_book_date).toLocaleDateString("vi-VN")
                                    : "—"}
                            </span>
                        </p>
                        <p className="tw-text-sm tw-text-gray-500">
                            <span className="tw-inline-block tw-w-20">Ngày đến hẹn:</span>
                            <span className={`tw-font-medium ${selected.returning_book_date ? "tw-text-gray-700" : "tw-text-amber-500"}`}>
                                {selected.due_date
                                    ? new Date(selected.due_date).toLocaleDateString('vi-VN')
                                    : "—"}
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

                    {/* FINE INFO */}
                    <div className="tw-mt-4 tw-bg-red-50 tw-border tw-border-red-100 tw-rounded-xl tw-p-3">
                        <p className="tw-text-sm tw-font-bold tw-text-red-600 tw-mb-2">
                            Thông tin phạt
                        </p>

                        <div className="tw-grid tw-grid-cols-2 tw-gap-2 tw-text-sm">
                            <div>
                                <p className="tw-text-gray-500">Số ngày trễ</p>
                                <p className="tw-font-semibold tw-text-gray-800">
                                    {selected.fine?.late_dates ?? 0} ngày
                                </p>
                            </div>

                            <div>
                                <p className="tw-text-gray-500">Số ngày mượn</p>
                                <p className="tw-font-semibold tw-text-gray-800">
                                    {selected.fine?.setting?.borrowing_days ?? 0} ngày
                                </p>
                            </div>

                            <div>
                                <p className="tw-text-gray-500">Phí mượn</p>
                                <p className="tw-font-semibold tw-text-gray-800">
                                    {Number(selected.fine?.setting?.borrowing_fee ?? 0).toLocaleString('vi-VN')}đ
                                </p>
                            </div>

                            <div>
                                <p className="tw-text-gray-500">Phạt quá hạn</p>
                                <p className="tw-font-semibold tw-text-red-600">
                                    {Number(selected.fine?.setting?.borrowing_overdue_fine ?? 0).toLocaleString('vi-VN')}đ
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="tw-mt-4 tw-bg-red-50 tw-border tw-border-red-100 tw-rounded-xl tw-p-3">
                        <p className=" tw-font-bold tw-text-red-600 tw-mb-2">
                            Số tiền phạt: 0
                        </p>
                        <div>
                            <p className="tw-text-gray-500">Ngày trả</p>
                            <p className="tw-font-semibold tw-text-gray-800">
                                {selected.returning_book_date
                                    ? new Date(selected.returning_book_date).toLocaleDateString("vi-VN")
                                    : "Chưa trả"}
                            </p>
                        </div>
                    </div>

                    {/* Trạng thái */}
                    <div className="tw-col-span-2 tw-flex tw-justify-between tw-items-center tw-bg-gray-50 tw-p-3 tw-rounded-xl tw-mt-1">
                        <p className="tw-text-sm tw-text-gray-600 tw-font-medium">Trạng thái giao dịch</p>
                        <span className={`tw-px-3 tw-py-1.5 tw-rounded-full tw-text-xs tw-font-bold tw-uppercase tw-tracking-wide
                            ${STATUS_CONFIG[selected.status].className}
                        `}>
                            {STATUS_CONFIG[selected.status].label}
                        </span>
                    </div>


                </div>
                <div className="tw-mt-4 tw-bg-yellow-50 tw-border tw-border-yellow-100 tw-rounded-xl tw-p-3">
                    <p className="tw-text-sm tw-font-bold tw-text-yellow-700 tw-mb-2">
                        Ghi chú
                    </p>
                    {!editNote ?
                        (<p className={`tw-text-sm tw-py-sm tw-text-gray-700 tw-leading-relaxed`}>
                            {note ? note : "Không có ghi chú"}
                        </p>) :
                        (<textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className="tw-w-full tw-p-2 tw-border tw-rounded-lg tw-text-sm tw-text-gray-700"
                            placeholder="Nhập ghi chú..."
                            disabled={!editNote}
                        />)}
                    {!editNote ? (
                        <button
                            onClick={() => setEditNote(true)}
                            className="tw-mt-2 tw-bg-gray-500 tw-text-white tw-px-3 tw-py-1 tw-rounded-lg"
                        >
                            Chỉnh sửa
                        </button>) : (
                        <div className='tw-flex tw-items-center tw-gap-2'>
                            <button
                                className="tw-mt-2 tw-bg-green-500 tw-text-white tw-px-3 tw-py-1 tw-rounded-lg"
                                onClick={handleUpdateNote}
                            >
                                Lưu
                            </button>

                            <button
                                onClick={() => setEditNote(false)}
                                className="tw-mt-2 tw-bg-red-500 tw-text-white tw-px-3 tw-py-1 tw-rounded-lg"
                            >
                                Hủy bỏ
                            </button>
                        </div>

                    )}

                </div>
            </div>

        </BaseModal>
    )
}
export default DetailTransaction;
