import React, { useEffect, useState } from 'react';
import thumnailImg from '../../assets/thumnail.jpg'
import Cart from '../../cart/Cart'
const CartPage = () => {

    const [cart, setCart] = useState(() => {
        const cartData = localStorage.getItem("cart")
        if (!cartData)
            return []
        return JSON.parse(cartData)
    });

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0)
    const handleIncreaseQTy = (id) => {
        setCart(prev => prev.map(cart => {
            if (cart.id == id) {
                let newQTy = cart.qty
                newQTy++
                return { ...cart, qty: newQTy }
            }
            return cart
        }))
    }

    const handleDecreaseQTy = (id) => {
        setCart(prev => prev.map(cart => {
            if (cart.id == id) {
                let newQTy = cart.qty
                if (newQTy > 1)
                    newQTy--
                return { ...cart, qty: newQTy }
            }
            return cart
        }))
    }

    if (!cart) return (<div class="spinner-border"></div>)
    return (
        <div className='container'>
            <div className="d-block w-100 overflow-hidden position-relative mt-3">
                <img src={thumnailImg} className='w-100 rounded-5' style={{ height: "300px", objectFit: "cover" }}
                    alt="" />
                <div className='detail-banner position-absolute top-50  start-50 translate-middle text-white fs-1 fw-bold fs-3'>
                    Giỏ hàng
                </div>
            </div>
            <div className='d-md-flex justify-content-between gap-4 mt-3 '>
                <div className="flex-grow-1">
                    <Cart cart={cart} handleDecreaseQTy={handleDecreaseQTy} handleIncreaseQTy={handleIncreaseQTy} />
                </div>

                <div className="shadow rounded-4 overflow-hidden" style={{ minWidth: '350px', height: 'fit-content' }}>
                    <div className='bg-warning px-4 py-3 d-block text-white fw-bold fs-5'>
                        Tổng hóa đơn
                    </div>

                    <div className="px-4 py-2">
                        <div className='d-flex justify-content-between border-bottom border-dark my-2 pb-2'>
                            <div className='fw-bold'>Sản phẩm</div>
                            <div className='fw-bold text-end'>Thành tiền</div>
                        </div>

                        {cart.map(book => (
                            <div key={book.id} className='d-flex justify-content-between align-items-center my-2'>
                                <div className="text-truncate" style={{ maxWidth: '180px' }}>{book.name}</div>
                                <div className='fw-semibold '>{(book.price * book.qty).toLocaleString()}đ</div>
                            </div>
                        ))}

                        <hr />
                        <div className='d-flex justify-content-between align-items-center mt-3 mb-2'>
                            <div className='fw-bold fs-5'>Tổng cộng:</div>
                            <div className='fw-bold fs-5 text-danger'>{totalPrice.toLocaleString()}đ</div>
                        </div>

                        <button className="btn btn-warning w-100 mt-3 mb-3 text-white fw-bold py-2">
                            ĐẶT NGAY
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default CartPage;
