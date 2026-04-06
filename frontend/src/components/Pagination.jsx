import React from 'react';

const Pagination = ({ currentPage, totalPages, books, goPage }) => {
    const customPagination = () => {
        const displayDistance = 1 // Khoảng cách hiện trang quanh phần tử trung tâm
        const range = []
        let l
        const rangeWithDots = []

        for (let i = currentPage - displayDistance; i <= currentPage + displayDistance; i++) {
            if (i >= 1 && i < totalPages)
                range.push(i)
        }
        if (totalPages > 1)
            range.push(totalPages)

        for (let e of range) {
            if (l) {
                if (e - l > 1) {
                    rangeWithDots.push('...')
                }
            }
            l = e
            rangeWithDots.push(e)
        }
        return rangeWithDots
    }

    // const handleNextPage = (e) => {
    //     e.preventDefault()
    //     setCurrentPage(prev => prev + 1)
    // }

    // const handleBackPage = (e) => {
    //     e.preventDefault()
    //     setCurrentPage(prev => prev - 1)
    // }


    const pages = customPagination();

    if (books.length <= 0)
        return (
            <div className="position-absolute top-50 start-50 translate-middle">
                <small className="text-dark">Không có dữ liệu</small>
            </div>
        )


    return (


        <div className="tw-flex tw-justify-center tw-items-center tw-gap-2 tw-mt-5">

            <button
                className="tw-px-4 tw-py-2 tw-rounded
                     tw-bg-blue-600 tw-text-black hover:tw-bg-blue-700 disabled:tw-bg-gray-300"
                onClick={() => goPage(1)}

            >
                Trang đầu
            </button>

            <button
                className="tw-px-4 tw-py-2 tw-rounded
                     tw-bg-blue-600 tw-text-black hover:tw-bg-blue-700 disabled:tw-bg-gray-300"
                disabled={currentPage === 1}
                onClick={() => goPage(currentPage - 1)}

            >
                Prev
            </button>

            {pages.map((page, index) => {
                const isDotted = page === "...";

                if (isDotted) {
                    return (
                        <span
                            key={`dot-${index}`}
                            className="tw-px-4 tw-py-2 tw-text-gray-400 tw-cursor-default "
                        >
                            {page}
                        </span>
                    );
                }

                return (
                    <button
                        key={index}
                        onClick={() => goPage(page)}
                        className={`tw-px-4 tw-py-2 tw-text-sm tw-rounded tw-border tw-transition-all
                ${currentPage === page
                                ? "tw-bg-blue-600 tw-text-white tw-border-blue-600"
                                : "tw-bg-white tw-text-gray-700 tw-border-gray-200 hover:tw-border-blue-400"}
            `}
                    >
                        {page}
                    </button>
                );
            })}

            <button
                className="tw-px-4 tw-py-2 tw-rounded tw-bg-blue-600 tw-text-black hover:tw-bg-blue-700 disabled:tw-bg-gray-300"
                disabled={currentPage === totalPages}
                onClick={() => goPage(currentPage + 1)}
            >
                Next
            </button>

            <button
                className="tw-px-4 tw-py-2 tw-rounded
                     tw-bg-blue-600 tw-text-black hover:tw-bg-blue-700 disabled:tw-bg-gray-300"
                onClick={() => goPage(totalPages)}

            >
                Trang cuối
            </button>
        </div>
    );
}

export default Pagination;
