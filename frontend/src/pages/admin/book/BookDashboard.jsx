import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BookData from '../../../data/BookData';
import BaseModal from '../../../components/BaseModal';
const Book = () => {
    const navigate = useNavigate()

    const [books, setBooks] = useState(BookData || [])
    const [selectedBook, setSelectedBook] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const pageSize = 4
    const totalPages = Math.ceil(books.length / pageSize)
    const pageItems = books.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    )

    const [openModal, setOpenModal] = useState(false)

    const handleSelected = (book) => {
        setSelectedBook(book)
        setOpenModal(true)
    }
    return (
        <div className='tw-p-6'>
            <div className='tw-flex tw-justify-between tw-items-center tw-mb-6'>
                <h1 className='tw-text-3xl tw-font-bold tw-text-red-600'>
                    <i className='fa-solid fa-p tw-text-blue-600'></i>
                    Manager Book
                </h1>
                <Link to="add-book"
                    className='tw-bg-blue-600 tw-text-white tw-px-4 tw-py-2 tw-rounded'>
                    Add Book
                </Link>
            </div>

            <table className='tw-w-full tw-bg-pink-300 tw-border-collapse tw-shadow tw-rounded-2xl tw-shadow-sm overflow-hidden'>
                <thead>
                    <tr className='tw-bg-blue-200 tw-text-center tw-text-red-500'>
                        <th className='tw-p-3'>ID</th>
                        <th className='tw-p-3'>Name</th>
                        <th className='tw-p-3'>Available quantity</th>
                        <th className='tw-p-3'>Active</th>
                        <th className='tw-p-3'>Detail</th>
                        <th className='tw-p-3'>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {pageItems.map(book => (
                        <tr key={book.id} className='border-b tw-text-center '>
                            <td className='tw-p-3'>{book.book_id}</td>
                            <td className='tw-flex tw-gap-3 tw-p-3 tw-items-center'>
                                <img src={book.image} alt={book.name} className="tw-w-16 tw-h-20 tw-object-cover " />
                                <div>
                                    {book.name}
                                </div>
                            </td>
                            <td>{book.available_quantity}</td>
                            <td className='tw-p-3'>
                                {book.active ? (
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
                            <td>
                                <button onClick={() => handleSelected(book)} class="tw-bg-blue-500 hover:tw-bg-blue-700 tw-text-white tw-font-bold 
                                tw-py-2 tw-px-4 rounded">
                                    Xem chi tiết
                                </button>

                            </td>

                            <td className='tw-p-3 tw-text-center'>
                                <div className='tw-flex tw-justify-center tw-gap-3'>
                                    <Link
                                        to={`edit-book/${book.id}`}
                                        className='tw-text-blue-600 hover:tw-text-green-300'
                                    >
                                        <i className="fa-solid fa-pen-to-square"></i>
                                    </Link>

                                    <button
                                        className='tw-text-blue-600 hover:tw-text-pink-500'
                                        onClick={() => onDelete(book)}
                                    >
                                        <i className='fa fa-trash' />
                                    </button>
                                </div>
                            </td>
                        </tr>

                    ))}


                </tbody>


            </table>
            {/* pagination */}
            <div className="tw-flex tw-justify-center tw-items-center tw-gap-2 tw-mt-5">

                <button
                    className="tw-px-4 tw-py-2 tw-rounded tw-bg-blue-500 tw-text-white hover:tw-bg-blue-700 disabled:tw-bg-gray-300"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                >
                    Prev
                </button>

                {Array.from({ length: totalPages }, (_, index) => {
                    const page = index + 1
                    return (
                        <button
                            key={index}
                            onClick={() => setCurrentPage(page)}
                            className={`tw-px-3 tw-py-1 tw-border tw-rounded tw-transition-all
                                    hover:tw-bg-gray-200 tw-duration-200
                                    ${currentPage === page
                                    ? "tw-bg-blue-500 tw-text-white tw-border-blue-500"
                                    : "tw-bg-white"}
                                `}
                        >
                            {page}
                        </button>
                    );
                })}

                {/* Next */}
                <button
                    className="tw-px-4 tw-py-2 tw-rounded tw-bg-blue-500 tw-text-white hover:tw-bg-blue-700 disabled:tw-bg-gray-300"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                >
                    Next
                </button>

            </div>

            {
                selectedBook && <BaseModal open={openModal} close={() => setOpenModal(false)}>
                    <div className="tw-flex tw-justify-between tw-items-center tw-mb-4">
                        <h2 className="tw-text-xl tw-font-bold">Chi tiết sách</h2>
                        <button onClick={() => setOpenModal(false)} className="tw-text-gray-500 hover:tw-text-black">
                            ✕
                        </button>
                    </div>

                    <div className="tw-flex tw-gap-4">

                        <img
                            src={selectedBook.image}
                            alt={selectedBook.name}
                            className="tw-w-40 tw-h-56 tw-object-cover tw-rounded-lg tw-border"
                        />

                        {/* Info */}
                        <div className="tw-flex-1 tw-space-y-2 tw-text-sm">

                            <p><b>Tên sách:</b> {selectedBook.name}</p>
                            <p><b>Mã sách:</b> {selectedBook.selectedBook_id}</p>
                            <p><b>Danh mục:</b> {selectedBook.category_id}</p>

                            <p>
                                <b>Trạng thái:</b>{" "}
                                <span className={selectedBook.active ? "tw-text-green-600" : "tw-text-red-500"}>
                                    {selectedBook.active ? "Hoạt động" : "Ngừng"}
                                </span>
                            </p>

                            <p><b>Số lượng còn:</b> {selectedBook.available_quantity}</p>
                            <p><b>Tổng số lượng:</b> {selectedBook.total_quantity}</p>

                            <p>
                                <b>Ngày tạo:</b>{" "}
                                {new Date(selectedBook.created_at).toLocaleString()}
                            </p>

                            <p>
                                <b>Cập nhật:</b>{" "}
                                {new Date(selectedBook.updated_at).toLocaleString()}
                            </p>

                        </div>
                    </div>

                    <div className="tw-mt-4">
                        <p className="tw-font-semibold">Mô tả:</p>
                        <p className="tw-text-gray-600 tw-text-sm tw-mt-1">
                            {selectedBook.description}
                        </p>
                    </div>

                </BaseModal>
            }
        </div >


    );
}

export default Book;
