import React from 'react';

const AddAuthor = ({ authorData, handleChange, handleSubmit, errors, success, loading }) => {
    return (
        <div className="tw-bg-white tw-rounded-3xl tw-border tw-border-gray-100 tw-p-6 tw-shadow-sm">

            <div className="tw-mt-6 tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-5">

                <div>
                    <label className="tw-block tw-mb-2 tw-text-sm tw-font-semibold tw-text-gray-700">
                        Tên tác giả
                    </label>

                    <input
                        type="text"
                        name="name"
                        value={authorData.name}
                        onChange={handleChange}
                        placeholder="Nguyễn Nhật Ánh"
                        className="tw-w-full tw-h-14 tw-rounded-2xl tw-border tw-border-purple-300 tw-bg-white tw-px-4 tw-outline-none focus:tw-ring-4 focus:tw-ring-purple-100"
                    />
                </div>

                <div>
                    <label
                        htmlFor="image"
                        className="tw-block tw-mb-2 tw-text-sm tw-font-semibold tw-text-gray-700"
                    >
                        Hình ảnh
                    </label>

                    <input
                        id="image"
                        type="file"
                        name="image"
                        onChange={handleChange}
                        className="tw-w-full tw-h-14 tw-rounded-2xl tw-border tw-border-gray-200 tw-bg-white tw-px-4 tw-py-3 tw-outline-none focus:tw-ring-4 focus:tw-ring-purple-100"
                    />
                </div>

                <div>
                    <label className="tw-block tw-mb-2 tw-text-sm tw-font-semibold tw-text-gray-700">
                        Ngày sinh
                    </label>

                    <input
                        type="date"
                        name="date_of_birth"
                        value={authorData.date_of_birth}
                        onChange={handleChange}
                        className="tw-w-full tw-h-14 tw-rounded-2xl tw-border tw-border-gray-200 tw-bg-white tw-px-4 tw-outline-none focus:tw-ring-4 focus:tw-ring-purple-100"
                    />
                </div>

                <div>
                    <label className="tw-block tw-mb-2 tw-text-sm tw-font-semibold tw-text-gray-700">
                        Ngày mất
                    </label>

                    <input
                        type="date"
                        name="date_of_death"
                        value={authorData.date_of_death}
                        onChange={handleChange}
                        className="tw-w-full tw-h-14 tw-rounded-2xl tw-border tw-border-gray-200 tw-bg-white tw-px-4 tw-outline-none focus:tw-ring-4 focus:tw-ring-purple-100"
                    />
                </div>

                <div className="lg:tw-col-span-2">
                    <label className="tw-block tw-mb-2 tw-text-sm tw-font-semibold tw-text-gray-700">
                        Tiểu sử
                    </label>

                    <textarea
                        rows={4}
                        name="biography"
                        value={authorData.biography}
                        onChange={handleChange}
                        placeholder="Nhập tiểu sử tác giả..."
                        className="tw-w-full tw-rounded-2xl tw-border tw-border-gray-200 tw-bg-white tw-px-4 tw-py-3 tw-outline-none focus:tw-ring-4 focus:tw-ring-purple-100"
                    />
                </div>

                <div className="lg:tw-col-span-2">
                    <label className="tw-block tw-mb-2 tw-text-sm tw-font-semibold tw-text-gray-700">
                        Mô tả
                    </label>

                    <textarea
                        rows={3}
                        name="description"
                        value={authorData.description}
                        onChange={handleChange}
                        placeholder="Nhập mô tả ngắn..."
                        className="tw-w-full tw-rounded-2xl tw-border tw-border-gray-200 tw-bg-white tw-px-4 tw-py-3 tw-outline-none focus:tw-ring-4 focus:tw-ring-purple-100"
                    />
                </div>
            </div>

            {errors?.length > 0 && (
                <div className="tw-mt-6 tw-space-y-2">
                    {errors?.map((error, index) => (
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
                    Thêm tác giả thành công
                </div>
            )}

            <button
                onClick={handleSubmit}
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
                        Đang thêm...
                    </span>
                ) : (
                    'Thêm tác giả'
                )}
            </button>
        </div>
    );
}

export default AddAuthor;
