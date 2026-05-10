import React, { useContext, useState } from 'react';
import { DeletePublisher, PostPublisher, PublisherListAPI } from '../../../services/PublisherAPI';
import { AuthContent } from '../../../utils/AuthContext';
import { PostAuthor } from '../../../services/AuthorAPI';
import Loading from '../../../components/Loading';
import { getError } from '../../../utils/GetError';

const PublisherDashboard = () => {
    const { token } = useContext(AuthContent)

    const [name, setName] = useState('')
    const [reload, setReload] = useState(false)
    const [publishers] = PublisherListAPI(token, reload)
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const validatePublisher = () => {
        const errors = [];

        if (!name.trim()) {
            errors.push('Tên nhà xuất bản không được để trống');
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setErrors([]);
        setSuccess(false);

        const validateErrors = validatePublisher();

        if (validateErrors.length > 0) {
            setErrors(validateErrors);
            return;
        }

        try {
            setLoading(true);
            const result = await PostPublisher(token, name);
            setErrors([]);
            setReload(prev => !prev);
            setName('');
            setSuccess(true);
            setName('')
        } catch (e) {
            const error = getError(e)
            alert(
                Array.isArray(error)
                    ? error[0] || "Không thể thêm người dùng"
                    : error || "Lỗi server"
            )
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (e, id) => {
        try {
            setLoading(true)
            await DeletePublisher(token, id)
            setReload(prev => !prev)
            alert("Xóa thành công")
        } catch (e) {
            alert(e)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="tw-min-h-screen tw-bg-[#f5f7fb] tw-p-6">
            <div className="tw-max-w-6xl tw-mx-auto tw-space-y-6">

                <div className="tw-bg-white tw-rounded-3xl tw-border tw-border-gray-100 tw-p-8 tw-shadow-sm">
                    <p className="tw-uppercase tw-text-sm tw-font-bold tw-tracking-[3px] tw-text-emerald-600">
                        Publishers
                    </p>

                    <h2 className="tw-mt-2 tw-text-5xl tw-font-black tw-text-slate-900">
                        Quản lý nhà xuất bản
                    </h2>

                    <p className="tw-mt-4 tw-text-gray-500 tw-text-lg">
                        Thêm và quản lý nhà xuất bản trong hệ thống.
                    </p>
                </div>

                <div className="tw-bg-white tw-rounded-3xl tw-border tw-border-gray-100 tw-p-6 tw-shadow-sm">

                    <div>
                        <label className="tw-block tw-mb-2 tw-text-sm tw-font-semibold tw-text-gray-700">
                            Tên nhà xuất bản
                        </label>

                        <input
                            type="text"
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="NXB Kim Đồng"
                            className="tw-w-full tw-h-14 tw-rounded-2xl tw-border tw-border-emerald-300 tw-bg-white tw-px-4 tw-outline-none focus:tw-ring-4 focus:tw-ring-emerald-100"
                        />
                    </div>

                    {errors.length > 0 && (
                        <div className="tw-mt-6 tw-space-y-2">
                            {errors.map((error, index) => (
                                <div
                                    key={index}
                                    className="tw-bg-red-100 tw-border tw-border-red-200 tw-text-red-700 tw-px-4 tw-py-3 tw-rounded-2xl"
                                >
                                    {error}
                                </div>
                            ))}
                        </div>
                    )}

                    {success && (
                        <div className="tw-mt-6 tw-bg-green-100 tw-border tw-border-green-200 tw-text-green-700 tw-px-4 tw-py-3 tw-rounded-2xl">
                            Thêm nhà xuất bản thành công
                        </div>
                    )}

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className={`tw-mt-6 tw-h-14 tw-rounded-2xl tw-px-8 tw-text-white tw-font-semibold tw-transition tw-shadow-lg hover:tw-shadow-xl
                        ${loading
                                ? 'tw-bg-gray-400 tw-cursor-not-allowed'
                                : 'tw-bg-emerald-600 hover:tw-bg-emerald-700'
                            }`}
                    >
                        {loading ? (
                            <span className="tw-flex tw-items-center tw-gap-2">
                                <i className="fa-solid fa-spinner fa-spin"></i>
                                Đang thêm...
                            </span>
                        ) : (
                            'Thêm nhà xuất bản'
                        )}
                    </button>
                </div>

                <div className="tw-bg-white tw-rounded-3xl tw-border tw-border-gray-100 tw-p-6 tw-shadow-sm">

                    <div className="tw-flex tw-items-center tw-justify-between">
                        <h3 className="tw-text-3xl tw-font-bold tw-text-slate-900">
                            Danh sách nhà xuất bản
                        </h3>

                        <div className="tw-bg-gray-100 tw-text-gray-600 tw-px-4 tw-py-2 tw-rounded-full tw-text-sm tw-font-semibold">
                            {publishers.length} nhà xuất bản
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
                                        Tên nhà xuất bản
                                    </th>

                                    <th className="tw-text-center tw-text-sm tw-font-bold tw-text-gray-700 tw-px-4">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {publishers.map((publisher) => (
                                    <tr
                                        key={publisher.id}
                                        className="tw-bg-[#fafbfd] hover:tw-bg-[#f1fffb] tw-transition"
                                    >
                                        <td className="tw-px-4 tw-py-5 tw-rounded-l-2xl tw-font-semibold tw-text-slate-800">
                                            {publisher.id}
                                        </td>

                                        <td className="tw-px-4 tw-py-5 tw-rounded-l-2xl tw-font-semibold tw-text-slate-800">
                                            {publisher.name}
                                        </td>

                                        <td className="tw-px-4 tw-py-5 tw-text-center tw-rounded-r-2xl">
                                            <button
                                                onClick={(e) => handleDelete(e, publisher.id)}
                                                disabled={loading}
                                                className={`tw-mt-6 tw-h-14 tw-rounded-2xl tw-px-8 tw-text-white tw-font-semibold tw-transition tw-shadow-lg hover:tw-shadow-xl
                                                    ${loading
                                                        ? 'tw-bg-gray-400 tw-cursor-not-allowed'
                                                        : 'tw-bg-emerald-600 hover:tw-bg-emerald-700'
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

export default PublisherDashboard;