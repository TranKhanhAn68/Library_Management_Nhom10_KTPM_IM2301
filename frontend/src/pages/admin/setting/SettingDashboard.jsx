import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BaseModal from '../../../components/BaseModal';
import { SettingListAPI, UpdateSetting } from '../../../services/SettingAPI';
import { AuthContent } from '../../../utils/AuthContext';
const SettingDashboard = () => {
    const { token } = useContext(AuthContent)
    const [settings] = SettingListAPI()
    const [openModal, setOpenModal] = useState(false)
    const [selectedItem, setSelectedItem] = useState(null)
    const [listActiveSettings, setListActiveSettings] = useState([

    ])

    useEffect(() => {
        setListActiveSettings(
            settings.filter(item => item.active)
        )
    }, [settings])

    const handleChangeActive = async (item) => {
        const changeSetting = await UpdateSetting(item.id, !item.active, token)

        if (changeSetting) {
            setListActiveSettings(prev => {
                if (changeSetting.active)
                    return [...prev.filter(s => s.id !== changeSetting.id), changeSetting];
                else
                    return prev.filter(s => s.id !== changeSetting.id)
            })
        }
        console.log(changeSetting)
    }

    const handleOpenModal = (item) => {
        setOpenModal(true)
        setSelectedItem(item)
    }

    return (
        <div className='tw-p-6'>
            <div className='tw-flex tw-items-center tw-justify-between tw-mb-6'>
                <h1 className='tw-text-3xl tw-font-bold tw-flex tw-items-center tw-gap-2'>
                    <i className='fa fa-gear'></i>
                    <span>Setting</span>
                </h1>
                <Link
                    to='add-setting'
                    className='tw-bg-blue-400 hover:tw-bg-blue-600 tw-text-white tw-px-4 tw-py-2 tw-rounded-lg tw-flex tw-items-center tw-gap-2 tw-shadow'
                >
                    Add Setting
                </Link>

            </div>
            <div className='tw-w-full'>
                <ul className='tw-flex tw-justify-center tw-gap-4 tw-bg-gray-300 tw-px-4 tw-py-2 tw tw-flex-wrap'>

                    {settings.map(item => (
                        <li key={item.id} className='tw-bg-white tw-shadow-lg tw-px-4 tw-py-2 tw-w-64 tw-rounded-lg'>
                            <label className='tw-flex tw-items-center tw-gap-2'>
                                <input
                                    type='checkbox'
                                    checked={item.active}
                                    onChange={() => handleChangeActive(item)}
                                />
                                <button className='tw-w-full tw-text-left ' onClick={() => handleOpenModal(item)}>
                                    {item.borrowing_days}, {item.borrowing_fee}, {item.borrowing_overdue_fine}
                                </button>
                            </label>
                        </li>
                    ))}

                </ul>
                <div className='tw-w-full tw-bg-gray-300 tw-rounded-lg tw-mt-4 gap-3 tw-px-4 tw-py-2'>
                    <h2 className='tw-font-bold tw-text-2xl tw-px-4 tw-py-2'>Các cài đặt đã được thực hiện</h2>
                    <div className='tw-flex tw-justify-center tw-gap-4 tw-bg-gray-300 tw-px-4 tw-py-2 tw tw-flex-wrap'>
                        {listActiveSettings.length === 0 ? (
                            <small className='tw-text-center tw-text-gray-500'>Không có dữ liệu</small>
                        ) : (
                            listActiveSettings.map(item => (
                                <div key={item.id} className='tw-bg-white tw-shadow-lg tw-px-4 tw-py-2 tw-rounded-lg'>
                                    <button
                                        className='tw-w-full tw-text-left'
                                        onClick={() => handleOpenModal(item)}
                                    >
                                        {item.borrowing_days}, {item.borrowing_fee}, {item.borrowing_overdue_fine}
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Modal */}
            {selectedItem && (
                <BaseModal open={openModal} close={() => setOpenModal(false)}>
                    <div className="tw-p-4 tw-w-[300px]">
                        <div className="tw-flex tw-justify-end tw-items-center tw-mb-4">
                            <button onClick={() => setOpenModal(false)} className="tw-text-gray-500 hover:tw-text-black">
                                ✕
                            </button>
                        </div>
                        <h2 className="tw-text-2xl tw-font-bold tw-mb-4 tw-text-red-500">
                            Chi tiết cài đặt
                        </h2>

                        <div className="tw-space-y-2">
                            <p>
                                <span className="tw-font-semibold">ID:</span>{" "}
                                {selectedItem.id}
                            </p>

                            <p>
                                <span className="tw-font-semibold">Số ngày mượn:</span>{" "}
                                {selectedItem.borrowing_days} ngày
                            </p>

                            <p>
                                <span className="tw-font-semibold">Tiền mượn:</span>{" "}
                                {selectedItem.borrowing_fee.toLocaleString()} đ
                            </p>

                            <p>
                                <span className="tw-font-semibold">Phí phạt:</span>{" "}
                                {selectedItem.borrowing_overdue_fine.toLocaleString()} đ
                            </p>

                            <div className="tw-mt-4 tw-flex tw-justify-end">
                                <button
                                    onClick={() => setOpenModal(false)}
                                    className="tw-bg-gray-400 hover:tw-bg-gray-600 tw-text-white tw-px-4 tw-py-2 tw-rounded"
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                </BaseModal>
            )}

        </div>
    );
}

export default SettingDashboard;
