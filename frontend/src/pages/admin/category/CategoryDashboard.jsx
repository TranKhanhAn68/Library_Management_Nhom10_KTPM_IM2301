import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { CategoryListAPI, DeleteCategory } from '../../../services/CategoryAPI';
import { AuthContent } from '../../../utils/AuthContext';
import Loading from '../../../components/Loading';
import BaseModal from '../../../components/BaseModal';
import Input from '../../../components/Input';

const CategoryDashboard = () => {
    const { token } = useContext(AuthContent)
    const [reload, setReload] = useState(false)
    const [categories] = CategoryListAPI(token, reload)
    const [selectedBookByID, setSelectedBookByID] = useState("")


    const [openModalNotification, setOpenModalNotification] = useState(false)
    const [openModalMsg, setOpenModalMsg] = useState("")
    const [loading, setLoading] = useState(true)
    const [isSuccess, setIsSuccess] = useState(false)
    const [message, setMessage] = useState("")
    useEffect(() => {
        setLoading(false)
    }, [categories])

    const handleDelete = async (e, id) => {
        e.preventDefault()
        try {
            setLoading(true)
            const result = await DeleteCategory(id, token)
            if (result) {
                setMessage(result?.message)
                setOpenModalMsg(true)
                setIsSuccess(true)
                setReload(prev => !prev)
            }
        } catch (err) {
            const error = getError(err)
            setMessage(error)
        } finally {
            handleClose()
            setLoading(false)
        }
    }

    const handleClose = () => {
        if (openModalNotification) {
            setOpenModalNotification(false)
            setSelectedBookByID('')
        }
        if (openModalMsg) {
            setOpenModalMsg(false)
            setMessage('')
            setIsSuccess(false)
        }
    }

    if (loading) return <Loading loading={loading} />

    return (
        <div className='tw-p-6'>
            <div className='tw-flex tw-items-center tw-justify-between tw-mb-6'>
                <h1 className='tw-text-3xl tw-font-bold tw-text-blue-700 tw-flex tw-items-center tw-gap-2'>
                    <i className='fa fa-tag'></i>
                    <span>Category</span>
                </h1>
                <Link
                    to='add-category'
                    className='tw-bg-blue-600 hover:tw-bg-red-300 tw-text-white tw-px-4 tw-py-2 tw-rounded-lg tw-flex tw-items-center tw-gap-2 tw-shadow'
                >
                    Add Category
                </Link>
            </div>

            <div className='tw-flex tw-justify-end tw-my-4 tw-gap-2'>

                <Input
                    placeholder="Tìm category..."
                    className="tw-w-64 tw-bg-white tw-border-orange-300 tw-text-gray-700 placeholder:tw-text-gray-400 tw-outline-none
                    focus:tw-border-yellow-500 focus:tw-ring-2 focus:tw-ring-yellow-300 tw-transition-all"
                />

                <button
                    className="tw-bg-orange-300 hover:tw-bg-yellow-600 tw-text-white tw-px-4 tw-rounded-lg
                            tw-flex tw-items-center tw-gap-2 tw-shadow-sm hover:tw-shadow-md tw-transition-all"
                >
                    <i className="fa fa-search"></i>
                    Tìm
                </button>

            </div>
            <div className='tw-bg-orange-100 tw-p-6 tw-rounded-2xl tw-shadow-sm'>
                <h2 className='tw-text-xl tw-font-semibold tw-mb-4 tw-text-blue-700'>
                    List Category
                </h2>
                <div className="max-h-[400px] overflow-y-auto">

                    <table className='tw-w-full tw-border-collapse tw-bg-yellow-200'>
                        <thead>
                            <tr className="tw-bg-yellow-400 text-left text-gray-600">
                                <th className="p-3">ID</th>
                                <th className="p-3">Name</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Create at</th>
                                <th className='p-3'>Lastest update</th>
                                <th className="p-3 text-center">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {categories.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="tw-text-center tw-p-4 tw-text-gray-500 tw-text-sm">
                                        <small className='tw-text-center tw-text-gray-500 '>Không có dữ liệu</small>
                                    </td>
                                </tr>
                            ) : (
                                categories.map((cate, index) => {
                                    return (
                                        <tr
                                            key={cate.id}
                                            className={`tw-border-b hover:tw-bg-green-100 ${index % 2 === 0 ? "tw-bg-slate-300" : "tw-bg-gray-100"
                                                }`}
                                        >
                                            <td className='tw-p-3 tw-font-medium'>{cate.id}</td>
                                            <td className='tw-p-3'>{cate.name}</td>

                                            <td className='tw-p-3'>
                                                {cate.active ? (
                                                    <span className='tw-text-green-600 tw-flex tw-items-center tw-gap-1'>
                                                        <i className='fa fa-toggle-on'></i>
                                                        <span>Active</span>
                                                    </span>
                                                ) : (
                                                    <span className='tw-text-red-600 tw-flex tw-items-center tw-gap-1'>
                                                        <i className='fa fa-toggle-off'></i>
                                                        <span>Inactive</span>
                                                    </span>
                                                )}
                                            </td>

                                            <td className='tw-p-3'>
                                                {new Date(cate.created_at).toLocaleString('vi-vn')}
                                            </td>

                                            <td className='tw-p-3'>
                                                {cate.updated_at
                                                    ? new Date(cate.updated_at).toLocaleString('vi-vn')
                                                    : "-"}
                                            </td>

                                            <td className='tw-p-3 tw-text-center'>
                                                <div className='tw-flex tw-justify-center tw-gap-3'>
                                                    <Link
                                                        to={`edit-category/${cate.id}`}
                                                        className='tw-text-blue-600 hover:tw-text-green-300'
                                                    >
                                                        <i className="fa-solid fa-pen-to-square"></i>
                                                    </Link>

                                                    <button
                                                        className='tw-text-blue-600 hover:tw-text-pink-500'
                                                        onClick={() => {
                                                            setSelectedBookByID(cate.id)
                                                            setOpenModalNotification(true)
                                                        }}
                                                    >
                                                        <i className='fa fa-trash' />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {selectedBookByID &&
                <BaseModal open={openModalNotification} close={handleClose}>
                    <div className="p-3">
                        <h5>Xác nhận xóa?</h5>
                        <p>Bạn có chắc chắn muốn xóa ?</p>
                        <div className="d-flex justify-content-end gap-2 mt-3">
                            <button className="btn btn-secondary" onClick={handleClose}>Hủy</button>
                            <button
                                className="btn btn-danger"
                                onClick={(e) => handleDelete(e, selectedBookByID)}
                            >
                                Xóa
                            </button>
                        </div>
                    </div>
                </BaseModal>
            }

            {message
                && <BaseModal open={openModalMsg} close={handleClose}>
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

export default CategoryDashboard;
