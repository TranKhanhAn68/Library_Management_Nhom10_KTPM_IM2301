import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AddToCart } from '../../utils/CartAction';
import BaseModal from '../BaseModal';

const Card = ({ book, defaultSetting, setCart }) => {
    const [message, setMessage] = useState(null)
    const [openModal, setOpenModal] = useState(false)
    const handleCloseModal = () => {
        setOpenModal(false)
        setMessage(null)
    }
    const handleAddToCart = () => {
        setOpenModal(true)
        if (book.available_quantity <= 0) {
            setMessage('Sách đã hết! Vui lòng đặt trước trong phần chi tiết sách')
            return
        }
        AddToCart(book, defaultSetting, 1, setCart);
        setMessage(`${book.name} đã được thêm vào giỏ hàng!`);
    }

    return (
        <div className='col'>
            <div className="card h-100 shadow-sm">

                <div className="card-header">
                    <img
                        src={book.image}
                        className="card-img-top "
                        alt={book.name}
                        style={{ objectFit: 'cover' }}
                    />
                </div>
                <div className="card-body">
                    <h5 className="card-title text-truncate-2">{book.name}</h5>
                    <p className="card-text">Mô tả ngắn gọn về cuốn sách.</p>
                    <small className='text-end w-100 d-block'>Số lượng còn lại: {book.available_quantity}</small>
                </div>
                <div className='d-flex justify-content-between gap-1 px-2 py-1 card-footer'>
                    <Link to={`detail-book/${book.id}`} className="btn btn-primary ">
                        <small>Xem thông tin</small>
                    </Link>

                    <button onClick={handleAddToCart} className="btn btn-primary">
                        <small>Thêm vào giỏ hàng</small>
                    </button>
                </div>
            </div>

            {message &&
                <BaseModal open={openModal} close={handleCloseModal}>
                    <div className='p-3 fs-5 fw-bold text-dark'>{message}</div>
                </BaseModal>}
        </div>

    );
}

export default Card;
