import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CategoryByIDAPI, UpdateCategory } from '../../../services/CategoryAPI';
import { AuthContent } from '../../../utils/AuthContext';

const EditCategory = () => {
    const { token } = useContext(AuthContent)
    const { id } = useParams();
    const [name, setName] = useState("");
    const [active, setActive] = useState(false);
    const [cate] = CategoryByIDAPI(id);
    const navigate = useNavigate();

    useEffect(() => {
        if (cate) {
            setName(cate.name);
            setActive(cate.active);
        }
    }, [cate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (name.trim() === "")
            return alert("Không được để trống");
        try {
            const updateCategory = await UpdateCategory(id, name, active, token)
            if (updateCategory) {
                alert("Thay đổi thành công")
            }
            navigate("/dashboard/categories")
        } catch (err) {
            console.error("Lỗi", err)
        }
    }

    if (!cate) {
        return <div className="tw-text-center tw-mt-10">Đang tải dữ liệu...</div>;
    }

    return (
        <div>
            <div className='tw-p-6 tw-max-w-md tw-mx-auto tw-bg-yellow-100 tw-rounded-2xl tw-shadow-lg'>
                <h2 className='tw-text-red-800 tw-text-2xl tw-font-bold 
                    tw-mb-6 tw-bg-slate-300 tw-px-4 tw-py-2 tw-rounded-lg tw-flex tw-justify-center tw-shadow'>
                    Sửa Danh Mục ID: {cate.id}
                </h2>

                <form className='tw-flex tw-flex-col tw-gap-4' onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder='Nhập vào tên Category'
                        className='tw-border tw-border-gray-400 tw-p-3 tw-rounded-lg focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500'
                    />

                    <label className='tw-flex tw-items-center tw-gap-2 tw-cursor-pointer'>
                        <input
                            type='checkbox'
                            checked={active}
                            onChange={e => setActive(e.target.checked)}
                            className='tw-w-5 tw-h-5'
                        />
                        <span className="tw-font-medium">Kích hoạt (Active)</span>
                    </label>

                    <button
                        type='submit'
                        className='tw-px-4 tw-py-2 tw-rounded-lg tw-bg-green-500 tw-text-white hover:tw-bg-green-600 tw-transition-colors'
                    >
                        Cập nhật
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
        </div>
    );
}

export default EditCategory;