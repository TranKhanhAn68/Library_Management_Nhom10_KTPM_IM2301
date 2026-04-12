const Loading = ({ loading }) => {
    if (!loading) return null;

    return (
        <div className="tw-absolute tw-inset-0 tw-z-50 tw-flex tw-items-center tw-justify-center tw-bg-black/30 tw-backdrop-blur-sm">
            <div className="tw-bg-white tw-rounded-2xl tw-shadow-xl tw-p-6 tw-flex tw-flex-col tw-items-center tw-gap-3">

                <div className="tw-animate-spin tw-rounded-full tw-h-10 tw-w-10 tw-border-4 tw-border-blue-500 tw-border-t-transparent"></div>

                <p className="tw-text-sm tw-text-gray-600 tw-font-medium">
                    Đang tải dữ liệu...
                </p>
            </div>
        </div>
    );
}

export default Loading