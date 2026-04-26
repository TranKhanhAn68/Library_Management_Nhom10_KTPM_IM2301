import React from 'react';

const Page404 = () => {
    return (
        <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-h-screen tw-bg-gray-100">
            <h1 className="tw-text-6xl tw-font-bold tw-text-red-600">404</h1>
            <p className="tw-mt-4 tw-text-xl tw-text-gray-700">
                Không tìm thấy! Vui lòng quay lại
            </p>
            <a
                href="/"
                className="tw-mt-6 tw-px-6 tw-py-3 tw-bg-blue-500 tw-text-white tw-rounded-lg tw-shadow-md 
                           tw-hover:bg-blue-600 tw-transition-colors"
            >
                Quay về trang chủ
            </a>
        </div>
    );
}

export default Page404;
