import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { SettingListAPI, UpdateSetting } from '../../../services/SettingAPI';
import { AuthContent } from '../../../utils/AuthContext';
import Loading from '../../../components/Loading';
import BaseModal from '../../../components/BaseModal';
const SettingDashboard = () => {
    const { token } = useContext(AuthContent)
    const [reload, setReload] = useState(false)
    const [settings, setSettings] = SettingListAPI(token, reload)
    const [selectedItem, setSelectedItem] = useState(null)
    const [listActiveSettings, setListActiveSettings] = useState([])

    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState("")
    const [openModal, setOpenModal] = useState(false)
    const [openModalMsg, setOpenModalMsg] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    useEffect(() => {
        setLoading(false)
    }, [])
    useEffect(() => {
        setListActiveSettings(
            settings.filter(item => item.active)
        )
    }, [settings])

    const handleChangeActive = async (item) => {
        setOpenModalMsg(true)
        try {
            setLoading(true)

            const changeSetting = await UpdateSetting(item.id, !item.active, token)

            if (changeSetting) {
                setSettings(prev => prev.map(s => s.id === changeSetting.id ? changeSetting : s))
                setMessage(changeSetting?.message)
                setIsSuccess(true)
                setReload(prev => !prev)
            }

        } catch (err) {
            const error = getError(err)
            setMessage(error)
        } finally {
            setLoading(false)
        }
    }

    const handleOpenModal = (item) => {
        setOpenModal(true)
        setSelectedItem(item)
    }
    if (loading) return <Loading loading={loading} />
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
            <div className={`tw-p-6 ${loading ? 'tw-opacity-50 tw-pointer-events-none' : ''}`}>
                <ul className='tw-flex tw-justify-center tw-gap-4 tw-bg-gray-300 tw-px-4 tw-py-2 tw tw-flex-wrap'>
                    {settings.length === 0 ? (
                        <small className='tw-text-center tw-text-gray-500'>Không có dữ liệu</small>
                    ) : (
                        settings.map(item => (
                            <li key={item.id} className='tw-bg-white tw-shadow-lg tw-px-4 tw-py-2 tw-w-64 tw-rounded-lg'>
                                <label className='tw-flex tw-items-center tw-gap-2'>
                                    <input
                                        type='checkbox'
                                        checked={item.active}
                                        onChange={() => handleChangeActive(item)}
                                        disabled={loading}
                                    />
                                    <button className='tw-w-full tw-text-left ' onClick={() => handleOpenModal(item)}>
                                        {item.borrowing_days}, {item.borrowing_fee}, {item.borrowing_overdue_fine}
                                    </button>
                                </label>
                            </li>
                        ))
                    )}

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

            {selectedItem && (
                <BaseModal open={openModal} close={() => {
                    setOpenModal(false)
                    setSelectedItem(null)
                }}>
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

            {message.trim().length > 0 &&
                <BaseModal open={openModalMsg} close={() => {
                    setOpenModalMsg(false)
                    setMessage("")
                }}>
                    <div className="tw-p-3 tw-flex tw-items-center tw-justify-center tw-gap-3" style={{ width: "300px" }}>
                        {isSuccess ?
                            <i className="fa-solid fa-circle-check tw-text-green-500 tw-text-lg"></i> :
                            <i class="fa-solid fa-circle-xmark tw-text-red-500 tw-text-lg"></i>
                        }
                        <div>
                            {typeof (message) === "string" && message.trim().length > 0 && message}
                        </div>
                    </div>
                </BaseModal>
            }
        </div>
    );
}

export default SettingDashboard;
