import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PostCategory, UpdateCategory } from '../../../services/CategoryAPI';
import { AuthContent } from '../../../utils/AuthContext';
import Loading from '../../../components/Loading';
import BaseModal from '../../../components/BaseModal';
import { getError } from '../../../utils/GetError';

const AddCategory = () => {
    const { token } = useContext(AuthContent)
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState("")
    const [openModal, setOpenModal] = useState(false)
    const [name, setName] = useState("")
    const [active, setActive] = useState(true)
    const navigate = useNavigate();

    const [isSuccess, setIsSuccess] = useState(false)

    useEffect(() => {
        setLoading(false)
    }, []);


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (name.trim() === "") {
            setMessage("Không được để trống")
            return
        }

        setOpenModal(true)
        try {
            setLoading(true)
            const createCategory = await PostCategory(name, active, token)
            if (createCategory) {
                setMessage("Tạo thành công")
                setIsSuccess(true)
            }
        } catch (err) {
            const error = getError(err)
            setMessage(error)
        } finally {
            setLoading(false)
        }
    }
    if (loading) return <Loading loading={loading} />

    return (
        <div>
            <div className='tw-p-6 tw-max-w-md tw-mx-auto tw-bg-yellow-100 tw-rounded-2xl tw-shadow-lg'>
                <h2 className='tw-text-red-800 tw-text-2xl tw-font-bold 
                    tw-mb-6 tw-bg-slate-300 tw-px-4 tw-py-2 tw-rounded-lg tw-flex tw-justify-center tw-shadow'>
                    Thêm danh mục sách mới
                </h2>

                <form className='tw-flex tw-flex-col tw-gap-4' onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder='Nhập vào tên Category'
                        className='tw-border tw-border-gray-400 tw-p-3 tw-rounded-lg focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500'
                    />

                    <label className="tw-flex tw-items-center tw-p-4 tw-border tw-rounded-xl tw-cursor-pointer">
                        <input
                            type="checkbox"
                            checked={active}
                            onChange={(e) => setActive(e.target.checked)}
                            className="tw-w-4 tw-h-4"
                        />
                        <span className="tw-ml-3 tw-text-sm">Kích hoạt</span>
                    </label>

                    <button
                        type='submit'
                        className='tw-px-4 tw-py-2 tw-rounded-lg tw-bg-green-500 tw-text-white hover:tw-bg-green-600 tw-transition-colors'
                        onClick={handleSubmit}
                    >
                        Thêm mới
                    </button>

                    <button
                        type='button'
                        onClick={() => navigate('/dashboard/categories')}
                        className='tw-px-4 tw-py-2 tw-rounded-lg tw-bg-violet-500 tw-text-white hover:tw-bg-pink-600 tw-transition-colors'
                    >
                        Hủy bỏ
                    </button>
                </form>
            </div>
            {message &&
                <BaseModal open={openModal} close={() => {
                    setOpenModal(false)
                    setMessage("")
                    if (isSuccess)
                        navigate('/dashboard/categories')
                }}
                >
                    <div className="tw-p-3 tw-flex tw-items-center tw-justify-center tw-gap-3" style={{ width: "300px" }}>
                        {isSuccess ?
                            <i className="fa-solid fa-circle-check tw-text-green-500 tw-text-lg"></i> :
                            <i class="fa-solid fa-circle-xmark tw-text-red-500 tw-text-lg"></i>
                        }
                        <div>
                            {message.trim().length > 0 && message}
                        </div>
                    </div>
                </BaseModal>}
        </div>
    );
}
export default AddCategory;
