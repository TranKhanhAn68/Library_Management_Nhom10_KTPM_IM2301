import React, { useContext, useEffect, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import { BookIDAPI } from '../../services/BookAPI';
import { AddToCart } from '../../utils/CartAction';
import { SettingListAPI } from '../../services/SettingAPI';
import Loading from '../../components/Loading';
import { AuthContent } from '../../utils/AuthContext';
import Page404 from '../../components/Page404';
import BaseModal from '../../components/BaseModal';
import { OrderBookAPI } from '../../services/ReservationAPI';

const DetailBook = () => {
    const { token } = useContext(AuthContent)
    const { setCart } = useOutletContext()
    const { id } = useParams()
    const [qTy, setQTy] = useState(1)
    const [selected, setSelected] = useState(null)
    const [settings] = SettingListAPI()
    const [loading, setLoading] = useState(false)
    const { book, err } = BookIDAPI(id, token)
    const [message, setMessage] = useState(null)
    const [openModal, setOpenModal] = useState(false)

    const handleAddToCart = () => {
        setOpenModal(true)
        if (!selected) {
            setMessage("Vui lòng chọn số ngày mượn trước khi thêm!");
            return;
        }
        try {
            if (book.available_quantity <= 0)
                throw new Error('Sách đã hết! Vui lòng đặt trước trong phần chi tiết sách')
            setLoading(true)
            AddToCart(book, selected, qTy, setCart)
            setMessage(`${book.name} đã được thêm vào giỏ hàng!`)
            setSelected(null)
        } catch (err) {
            console.error("Lỗi khi thêm:", err.message);
            setMessage(err.message || "Không thể thêm sản phẩm, vui lòng thử lại!");
        } finally {
            setLoading(false)
        }
    }

    const handleOrderBook = async () => {
        setOpenModal(true)
        setLoading(true);
        try {
            const orderData = {
                book: book.id,
            };
            const message = await OrderBookAPI(token, orderData);
            setMessage(message)
        } catch (err) {
            setMessage(err)
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        setOpenModal(false)
        setMessage(null)
    }

    if (!book || !settings) {
        return <Loading loading={true} />
    }

    if (book && !book.active)
        return <Page404 />
    return (
        <div>

            <div className='d-flex gap-5 m-5 fs'>
                <div className='d-block h-5'>
                    <img
                        src={book?.image || ""}
                        className="img-fluid rounded hover-shadow"
                        alt={book?.name || ""}
                        style={{ objectFit: 'cover' }}
                    />
                </div>

                <div className='lh-lg px-4 fs-4'>
                    <div>Mã sách: <span className='text-primary fw-bold'>{book?.book_id || ""}</span></div>
                    <div>Tên sách: <span className='text-secondary'>{book?.name || ""}</span></div>
                    <div>Thể loại: <span className='text-secondary'>{book?.category.name || ""}</span></div>
                    <div>Tác giả: <span className='text-secondary'>{book?.author.name || ""}</span></div>
                    <div>Nhà xuất bản: <span className='text-secondary'>{book?.publisher.name || ""}</span></div>
                    <div>
                        <span>Số ngày mượn</span>
                        <select
                            className="form-select text-dark"
                            value={selected?.id || ""}
                            onChange={(e) => {
                                const value = e.target.value;
                                const setObj = settings.find(s => s.id.toString() === value);
                                setSelected(setObj);
                            }}
                        >
                            <option value="" disabled>Vui lòng chọn</option>
                            {settings.map(s => (
                                <option key={s.id} value={s.id}>
                                    {s.borrowing_days} ngày
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>Số lượng còn lại: <span className='text-secondary'>{book?.available_quantity || 0}</span></div>

                    <div className="input-group py-2" style={{ width: "120px" }}>
                        <button
                            className="btn btn-outline-secondary btn-warning"
                            type="button"
                            onClick={() => qTy > 1 && setQTy(prev => prev - 1)}
                            disabled={qTy <= 1}
                        >
                            -
                        </button>

                        <input type="text" className="form-control text-center" value={qTy} readOnly />

                        <button
                            className="btn btn-outline-secondary btn-warning"
                            type="button"
                            onClick={() => setQTy(prev => prev + 1)}
                        >
                            +
                        </button>
                    </div>
                    {book.available_quantity > 0 ? (
                        <button
                            className="btn btn-primary d-flex align-items-center gap-2 px-4 py-2 fw-semibold"
                            onClick={handleAddToCart}
                            disabled={isAdding}
                            style={{ borderRadius: "12px" }}
                        >
                            {isAdding ? (
                                <>
                                    <span className="spinner-border spinner-border-sm"></span>
                                    Đang thêm...
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-cart-plus"></i>
                                    Thêm vào giỏ
                                </>
                            )}
                        </button>
                    ) : (
                        <button
                            className="btn btn-outline-primary d-flex align-items-center gap-2 px-4 py-2 fw-semibold rounded-4"
                            onClick={handleOrderBook}
                        >
                            <i className="bi bi-clock-history"></i>
                            Đặt trước
                        </button>
                    )}
                </div>
            </div>

            <hr />

            <div className='d-block w-100 mx-5 my-2'>
                <h1 className='fw-bold text-decoration-underline fs-1'>Description</h1>
                <div className='mt-2 fs-5'>{book?.description || ""}</div>
            </div>

            {message &&
                <BaseModal open={openModal} close={handleCloseModal}>
                    <div className='p-3 fs-5 fw-bold text-dark'>{message}</div>
                </BaseModal>}
        </div>
    );
}

export default DetailBook;