import React from 'react';
import { Link } from 'react-router-dom';
import { AddToCart } from '../../utils/CartAction';

const Card = ({ book, defaultSetting, setCart }) => {


    const handleAddToCart = (e) => {

        e.preventDefault()

        AddToCart(book, defaultSetting, 1, setCart);
        alert(`${book.name} đã được thêm vào giỏ hàng!`);
        console.log(JSON.parse(localStorage.getItem('cart')))
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
                    <small className='text-end w-100 d-block'>5 sao</small>
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
        </div>

    );
}

export default Card;
