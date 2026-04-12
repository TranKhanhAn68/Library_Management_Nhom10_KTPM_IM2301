import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContent } from '../../../utils/AuthContext';
import Loading from '../../../components/Loading';
import BaseModal from '../../../components/BaseModal';

const AddSetting = () => {
    const { token } = useContext(AuthContent);
    const navigate = useNavigate();

    // Khởi tạo các biến state riêng lẻ
    const [borrowingDays, setBorrowingDays] = useState('');
    const [borrowingFee, setBorrowingFee] = useState('');
    const [borrowingOverdueFine, setBorrowingOverdueFine] = useState('');
    const [active, setActive] = useState(false);

    // Các state bổ trợ giao diện
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [openModalMsg, setOpenModalMsg] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setOpenModalMsg(true)
        try {
            const results = await CreateSetting(dataToSubmit, token);

            if (response) {
                setIsSuccess(true);
                setMessage("Thêm cài đặt mới thành công!");

            }
        } catch (err) {
            setIsSuccess(false);
            setMessage("Lỗi: " + (err.response?.data?.message || "Không thể thêm cài đặt"));
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loading loading={loading} />;

    return (
        <div className='tw-p-6'>
            <div className='tw-flex tw-items-center tw-justify-between tw-mb-6'>
                <h1 className='tw-text-3xl tw-font-bold tw-flex tw-items-center tw-gap-2'>
                    <i className='fa fa-plus-circle'></i>
                    <span>Add Setting</span>
                </h1>
                <Link to="/dashboard/settings" className='tw-bg-gray-500 tw-text-white tw-px-4 tw-py-2 tw-rounded-lg'>
                    Quay lại
                </Link>
            </div>

            <div className='tw-max-w-xl tw-mx-auto tw-bg-white tw-p-6 tw-shadow-md tw-rounded-xl'>
                <form onSubmit={handleSubmit} className='tw-flex tw-flex-col tw-gap-5'>

                    {/* Số ngày mượn */}
                    <div>
                        <label className='tw-block tw-font-bold tw-mb-1'>Số ngày mượn</label>
                        <input
                            type="number"
                            value={borrowingDays}
                            onChange={(e) => setBorrowingDays(e.target.value)}
                            className='tw-w-full tw-border tw-p-2 tw-rounded'
                            placeholder="Nhập số ngày..."
                            required
                        />
                    </div>

                    {/* Tiền mượn */}
                    <div>
                        <label className='tw-block tw-font-bold tw-mb-1'>Tiền mượn (VNĐ)</label>
                        <input
                            type="number"
                            value={borrowingFee}
                            onChange={(e) => setBorrowingFee(e.target.value)}
                            className='tw-w-full tw-border tw-p-2 tw-rounded'
                            placeholder="Nhập số tiền..."
                            required
                        />
                    </div>

                    {/* Phí quá hạn */}
                    <div>
                        <label className='tw-block tw-font-bold tw-mb-1'>Phí phạt quá hạn (VNĐ)</label>
                        <input
                            type="number"
                            value={borrowingOverdueFine}
                            onChange={(e) => setBorrowingOverdueFine(e.target.value)}
                            className='tw-w-full tw-border tw-p-2 tw-rounded'
                            placeholder="Nhập tiền phạt..."
                            required
                        />
                    </div>

                    {/* Trạng thái active */}
                    <div className='tw-flex tw-items-center tw-gap-2'>
                        <input
                            type="checkbox"
                            id="active-status"
                            checked={active}
                            onChange={(e) => setActive(e.target.checked)}
                            className='tw-w-5 tw-h-5'
                        />
                        <label htmlFor="active-status" className='tw-font-bold'>Kích hoạt cài đặt này</label>
                    </div>

                    <button
                        type="submit"
                        className='tw-bg-blue-500 hover:tw-bg-blue-600 tw-text-white tw-font-bold tw-py-3 tw-rounded-lg tw-mt-2'
                    >
                        Tạo cài đặt
                    </button>
                </form>
            </div>

            {/* Modal thông báo kết quả */}
            <BaseModal open={openModalMsg} close={() => setOpenModalMsg(false)}>
                <div className="tw-p-5 tw-flex tw-items-center tw-justify-center tw-gap-3" style={{ width: "320px" }}>
                    {isSuccess ?
                        <i className="fa-solid fa-circle-check tw-text-green-500 tw-text-xl"></i> :
                        <i className="fa-solid fa-circle-xmark tw-text-red-500 tw-text-xl"></i>
                    }
                    <div className='tw-font-medium'>{message}</div>
                </div>
            </BaseModal>
        </div>
    );
};

export default AddSetting;