import React, { useContext, useState } from 'react';
import { AuthContent } from '../../../utils/AuthContext';
import { AuthorListAPI, DeleteAuthor, PostAuthor } from '../../../services/AuthorAPI';
import Loading from '../../../components/Loading';
import AddAuthor from './AddAuthor';

const AuthorDashboard = () => {
    const { token } = useContext(AuthContent)
    const [reload, setReload] = useState(false)
    const [authors] = AuthorListAPI(token, reload)
    const [errors, setErrors] = useState([])
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [authorData, setAuthorData] = useState({
        name: '',
        date_of_birth: '',
        date_of_death: '',
        biography: '',
        description: '',
        image: null,
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        setAuthorData((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    const validateAuthor = () => {
        const errors = []
        if (!authorData.name.trim())
            errors.push('Tên tác giả không được để trống');

        if (!authorData.date_of_birth)
            errors.push('Vui lòng chọn ngày sinh');


        if (!authorData.biography.trim())
            errors.push('Tiểu sử không được để trống');


        if (!authorData.description.trim())
            errors.push('Mô tả không được để trống');

        if (
            authorData.date_of_death &&
            new Date(authorData.date_of_death) <
            new Date(authorData.date_of_birth)
        )
            errors.push('Ngày mất phải lớn hơn ngày sinh');

        if (new Date(authorData.date_of_birth) > new Date())
            errors.push('Ngày sinh không được lớn hơn ngày hiện tại');
        return errors;

    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validateAuthor()
        if (errors.length > 0) {
            setErrors(errors)
            return
        }

        const formData = new FormData();

        formData.append('name', authorData.name);
        formData.append('date_of_birth', authorData.date_of_birth);
        formData.append('date_of_death', authorData.date_of_death);
        formData.append('biography', authorData.biography);
        formData.append('description', authorData.description);
        if (authorData.image) {
            formData.append('image', authorData.image);
        }
        try {
            setLoading(true)
            const result = await PostAuthor(token, formData)
            setErrors([])
            setSuccess(true)
            setReload(prev => !prev)
            setAuthorData({
                name: '',
                date_of_birth: '',
                date_of_death: '',
                biography: '',
                description: '',
                image: null,
            })
        } catch (e) {
            setErrors([...errors, e])
        } finally {
            setLoading(false)
        }
    };

    const handleDelete = async (e, id) => {
        try {
            setLoading(true)
            await DeleteAuthor(token, id)
            setReload(prev => !prev)
            alert("Xóa thành công!")

        } catch (e) {
            alert(e)
        } finally {
            setLoading(false)
        }
    }
    return (
        <div className="tw-min-h-screen tw-bg-[#f5f7fb] tw-p-6">
            <div className="tw-max-w-7xl tw-mx-auto tw-space-y-6">

                <div className="tw-bg-white tw-rounded-3xl tw-border tw-border-gray-100 tw-p-8 tw-shadow-sm">
                    <p className="tw-uppercase tw-text-sm tw-font-bold tw-tracking-[3px] tw-text-purple-600">
                        Authors
                    </p>

                    <h2 className="tw-mt-2 tw-text-5xl tw-font-black tw-text-slate-900">
                        Quản lý tác giả
                    </h2>
                </div>

                <AddAuthor authorData={authorData} handleChange={handleChange}
                    handleSubmit={handleSubmit} errors={errors} success={success} loading={loading} />

                <div className="tw-bg-white tw-rounded-3xl tw-border tw-border-gray-100 tw-p-6 tw-shadow-sm">

                    <div className="tw-flex tw-items-center tw-justify-between">
                        <h3 className="tw-text-3xl tw-font-bold tw-text-slate-900">
                            Danh sách tác giả
                        </h3>

                        <div className="tw-bg-gray-100 tw-text-gray-600 tw-px-4 tw-py-2 tw-rounded-full tw-text-sm tw-font-semibold">
                            {authors.length} tác giả
                        </div>
                    </div>

                    <div className="tw-overflow-x-auto tw-mt-6">
                        <table className="tw-w-full tw-border-separate tw-border-spacing-y-3">

                            <thead>
                                <tr>
                                    <th className="tw-text-left tw-text-sm tw-font-bold tw-text-gray-700 tw-px-4">
                                        ID
                                    </th>

                                    <th className="tw-text-left tw-text-sm tw-font-bold tw-text-gray-700 tw-px-4">
                                        Hình ảnh
                                    </th>

                                    <th className="tw-text-left tw-text-sm tw-font-bold tw-text-gray-700 tw-px-4">
                                        Tên
                                    </th>

                                    <th className="tw-text-left tw-text-sm tw-font-bold tw-text-gray-700 tw-px-4">
                                        Ngày sinh
                                    </th>

                                    <th className="tw-text-left tw-text-sm tw-font-bold tw-text-gray-700 tw-px-4">
                                        Ngày mất
                                    </th>

                                    <th className="tw-text-left tw-text-sm tw-font-bold tw-text-gray-700 tw-px-4">
                                        Mô tả
                                    </th>

                                    <th className="tw-text-left tw-text-sm tw-font-bold tw-text-gray-700 tw-px-4">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {authors?.map((author, index) => (
                                    <tr
                                        key={index}
                                        className="tw-bg-[#fafbfd] hover:tw-bg-[#f7f2ff] tw-transition"
                                    >
                                        <td className="tw-px-4 tw-py-5 tw-rounded-l-2xl tw-font-semibold tw-text-slate-800">
                                            {author.id}
                                        </td>

                                        <td className="tw-px-4 tw-py-5 tw-text-gray-600">
                                            {author.image ? (
                                                <img
                                                    src={author.image}
                                                    alt={author.name}
                                                    className="tw-w-14 tw-h-14 tw-rounded-xl tw-object-cover tw-border tw-border-gray-200"
                                                />
                                            ) : (
                                                <div className="tw-w-14 tw-h-14 tw-rounded-xl tw-bg-gray-100 tw-flex tw-items-center tw-justify-center tw-text-gray-400">
                                                    <i className="fa-solid fa-image"></i>
                                                </div>
                                            )}
                                        </td>

                                        <td className="tw-px-4 tw-py-5 tw-rounded-l-2xl tw-font-semibold tw-text-slate-800">
                                            {author.name}
                                        </td>

                                        <td className="tw-px-4 tw-py-5 tw-text-gray-600">
                                            {author.date_of_birth}
                                        </td>

                                        <td className="tw-px-4 tw-py-5 tw-text-gray-600">
                                            {author.date_of_death || '-'}
                                        </td>

                                        <td className="tw-px-4 tw-py-5 tw-text-gray-600">
                                            {author.description}
                                        </td>

                                        <td className="tw-px-4 tw-py-5 tw-text-center tw-rounded-r-2xl">
                                            <button
                                                onClick={(e) => handleDelete(e, author.id)}
                                                disabled={loading}
                                                className={`tw-mt-6 tw-h-14 tw-rounded-2xl tw-px-8 tw-text-white tw-font-semibold tw-transition tw-shadow-lg hover:tw-shadow-xl
                                                    ${loading
                                                        ? 'tw-bg-gray-400 tw-cursor-not-allowed'
                                                        : 'tw-bg-purple-600 hover:tw-bg-purple-700'
                                                    }`}
                                            >
                                                {loading ? (
                                                    <span className="tw-flex tw-items-center tw-gap-2">
                                                        <i className="fa-solid fa-spinner fa-spin"></i>
                                                        <Loading loading={loading} />
                                                    </span>
                                                ) : (
                                                    <i className="fa-solid fa-xmark"></i>

                                                )}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthorDashboard;