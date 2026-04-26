import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BaseModal from '../../../components/BaseModal';
import { BookListAPI, DeleteBook } from '../../../services/BookAPI';
import { AuthContent } from '../../../utils/AuthContext';
import Pagination from '../../../components/Pagination';
import Loading from '../../../components/Loading';
import { getError } from '../../../utils/GetError';
import Input from '../../../components/Input';
const Book = () => {
    const { token } = useContext(AuthContent)
    const [reload, setReload] = useState(false) //Biến cờ cập nhật dữ liệu book lại khi xóa
    const [currentPage, setCurrentPage] = useState(1)
    const [searchBookName, setSearchBookName] = useState("")
    const dataBooks = BookListAPI(currentPage, "", "", "", token, reload)
    const books = dataBooks?.results || []
    const [selectedBook, setSelectedBook] = useState(null)
    const [selectedBookByID, setSelectedBookByID] = useState("")
    const totalPages = Math.ceil((dataBooks?.count || 0) / 8)

    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState("")
    const [isSuccess, setIsSuccess] = useState(false)
    const [openModal, setOpenModal] = useState(false)
    const [openModalNotification, setOpenModalNotification] = useState(false)
    const [openModalMsg, setOpenModalMsg] = useState("")

    useEffect(() => {
        setLoading(false)
    }, [books])

    const handleSelected = (book) => {
        setSelectedBook(book)
        setOpenModal(true)

    }

    const handleSearch = () => {
        setCurrentPage(1)
        setReload(prev => !prev)
    }

    const goPage = (page) => {
        setCurrentPage(page)
    }

    const handleDelete = async (e, id) => {
        e.preventDefault()
        try {
            setLoading(true)
            const result = await DeleteBook(id, token)
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
        setOpenModal(false)
        setOpenModalNotification(false)
        setOpenModalMsg(false)

        setTimeout(() => {
            setSelectedBook(null)
            setSelectedBookByID('')
            setMessage('')
            setIsSuccess(false)
        }, 200)
    }
    if (loading) return <Loading loading={loading} />

    return (
        <div className='tw-p-6'>
            <div className='tw-flex tw-justify-between tw-items-center tw-mb-6'>
                <h1 className='tw-text-3xl tw-font-bold tw-text-red-600'>
                    <i className='fa-solid fa-p tw-text-blue-600'></i>
                    Quản lý sách
                </h1>
                <Link to="add-book"
                    className='tw-bg-blue-600 tw-text-white tw-px-4 tw-py-2 tw-rounded'>
                    Add Book
                </Link>
            </div>
            <div className='tw-flex tw-justify-end tw-my-4 tw-gap-2'>

                <Input
                    placeholder="Tìm sách..."
                    value={searchBookName}
                    onChange={(e) => setSearchBookName(e.target.value)}
                    className="tw-w-64 tw-border-blue-300 tw-bg-whitetw-text-gray-700
                                placeholder:tw-text-gray-400 focus:tw-border-indigo-500 tw-outline-none
                                focus:tw-ring-2 focus:tw-ring-indigo-300tw-transition-all"
                />

                <button
                    onClick={handleSearch}
                    className="
            tw-bg-indigo-500 
            hover:tw-bg-indigo-600 
            tw-text-white 
            tw-px-4 
            tw-rounded-lg 
            tw-flex 
            tw-items-center 
            tw-gap-2
            tw-shadow-sm
            hover:tw-shadow-md
            tw-transition-all
        "
                >
                    <i className="fa fa-search"></i>
                    Tìm
                </button>

            </div>
            <table className='tw-w-full tw-bg-pink-300 tw-border-collapse tw-shadow tw-rounded-2xl tw-shadow-sm overflow-hidden'>
                <thead>
                    <tr className='tw-bg-blue-200 tw-text-center tw-text-red-500'>
                        <th className='tw-p-3'>ID</th>
                        <th className='tw-p-3'>Name</th>
                        <th className='tw-p-3'>Total quantity</th>
                        <th className='tw-p-3'>Available quantity</th>
                        <th className='tw-p-3'>Active</th>
                        <th className='tw-p-3'>Detail</th>
                        <th className='tw-p-3'>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {books.length === 0 ? (
                        <tr>
                            <td colSpan="7" className="tw-text-center tw-p-4 tw-text-gray-500 tw-text-sm">
                                <small className='tw-text-center tw-text-gray-500 '>Không có dữ liệu</small>
                            </td>
                        </tr>
                    ) : (books.map(book => (
                        <tr key={book.id} className='border-b tw-text-center '>
                            <td className='tw-p-3'>{book.id}</td>
                            <td className='tw-flex tw-gap-3 tw-p-3 tw-items-center'>
                                <img src={book.image} alt={book.name} className="tw-w-16 tw-h-20 tw-object-cover " />
                                <div>
                                    {book.name}
                                </div>
                            </td>
                            <td>{book.total_quantity}</td>
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
                                        onClick={() => {
                                            setOpenModalNotification(true)
                                            setSelectedBookByID(book.id)
                                        }}
                                    >
                                        <i className='fa fa-trash tw-text-red-600' />
                                    </button>
                                </div>
                            </td>
                        </tr>

                    )))}


                </tbody>


            </table>
            {/* pagination */}
            <Pagination currentPage={currentPage}
                totalPages={totalPages}
                item={books}
                goPage={goPage}

            />

            <BaseModal open={openModal} close={handleClose}>
                {
                    selectedBook &&
                    <div className='container'>
                        <div className="tw-flex tw-justify-between tw-items-center tw-mb-4">
                            <h2 className="tw-text-xl tw-font-bold">Chi tiết sách</h2>
                            <button onClick={handleClose} className="tw-text-gray-500 hover:tw-text-black">
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
                                <p><b>Mã sách:</b> {selectedBook.book_id}</p>
                                <p><b>Danh mục:</b> {selectedBook.category_id}</p>

                                <p>
                                    <b>Trạng thái: </b>
                                    <span className={selectedBook.active ? "tw-text-green-600" : "tw-text-red-500"}>
                                        {selectedBook.active ? "Hoạt động" : "Ngừng"}
                                    </span>
                                </p>

                                <p>
                                    <b>Tác giả: </b>
                                    <span>{selectedBook.author.name}</span>
                                </p>

                                <p>
                                    <b>Nhà xuất bản: </b>
                                    <span>{selectedBook.publisher.name}</span>
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
                    </div>

                }
            </BaseModal>

            {selectedBookByID &&
                <BaseModal open={openModalNotification} close={handleClose}>
                    <div className="p-3">
                        <h5>Xác nhận xóa?</h5>
                        <p>Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?</p>
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
                            {/* {typeof (message) === "string" && message.trim().length > 0 && message} */}
                            {message}
                        </div>
                    </div>
                </BaseModal>
            }
        </div>


    );
}

export default Book;
