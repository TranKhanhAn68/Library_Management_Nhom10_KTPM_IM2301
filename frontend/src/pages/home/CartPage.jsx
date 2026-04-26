import React, { useContext, useEffect, useState } from 'react';
import thumnailImg from '../../assets/thumnail.jpg'
import Cart from '../../components/cart/Cart'
import Loading from '../../components/Loading';
import { useOutletContext } from 'react-router-dom';
import BaseModal from '../../components/BaseModal';
import { BorrowingBookAPI } from '../../services/BorrowAPI';
import { AuthContent } from '../../utils/AuthContext';
const CartPage = () => {
    const { token } = useContext(AuthContent)
    const { cart, setCart } = useOutletContext();
    const [data, setData] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [openModal, setOpenModal] = useState(false)
    const [openResultModal, setOpenResultModal] = useState(false)
    const totalPrice = cart?.reduce((sum, item) => sum + item.price, 0);
    const handleIncreaseQTy = (id) => {
        setCart(prev => prev.map(item => {
            if (item.book_id === id) {
                const qty = item.borrowing_quantity + 1
                return { ...item, borrowing_quantity: qty, price: qty * Number(item.setting.borrowing_fee) };
            }
            return item;
        }));
    };

    const handleDecreaseQTy = (id) => {
        setCart(prev => prev.map(item => {
            if (item.book_id === id && item.borrowing_quantity > 1) {
                const qty = item.borrowing_quantity - 1
                return { ...item, borrowing_quantity: qty, price: qty * Number(item.setting.borrowing_fee) };
            }
            return item;
        }));
    };

    const handleSubmit = async () => {
        setIsLoading(true)
        try {
            const filterdCart = cart.map(item => ({
                book_id: item.book_id,
                borrowing_quantity: item.borrowing_quantity,
                price: item.price,
                setting: item.setting
            }))

            const data = await BorrowingBookAPI(filterdCart, token)
            setData(data)
        } catch (error) {
            console.error("Lỗi đặt sách:", error);
            alert("Không thể đặt sách, vui lòng thử lại!");
        } finally {
            setOpenModal(false)
            setOpenResultModal(true)
            setIsLoading(false)
            setCart(null)
        }
    }


    return (
        <div className='container'>
            <div className="d-block w-100 overflow-hidden position-relative mt-3">

                <img src={thumnailImg} className='w-100 rounded-5' style={{ height: "300px", objectFit: "cover" }}
                    alt="" />
                <div className='detail-banner position-absolute top-50  start-50 translate-middle text-white fs-1 fw-bold fs-3'>
                    Giỏ hàng
                </div>
            </div>

            <div className='mt-3 position-relative'>
                <div className='d-md-flex justify-content-between gap-4 '>
                    <div className="flex-grow-1">
                        <Cart cart={cart} setCart={setCart} handleDecreaseQTy={handleDecreaseQTy} handleIncreaseQTy={handleIncreaseQTy} />
                    </div>
                    <div
                        className={`shadow rounded-4 overflow-hidden ${!cart || cart.length <= 0 ? "d-none" : ""}`}
                        style={{ minWidth: '350px', height: 'fit-content' }}
                    >
                        <div className='bg-warning px-4 py-3 d-block text-white fw-bold fs-5'>
                            Tổng hóa đơn
                        </div>

                        <div className="px-4 py-2">
                            <div className='d-flex justify-content-between border-bottom border-dark my-2 pb-2'>
                                <div className='fw-bold'>Sản phẩm</div>
                                <div className='fw-bold text-end'>Thành tiền</div>
                            </div>

                            {cart.map(book => (
                                <div key={book?.id} className='d-flex justify-content-between align-items-center my-2'>
                                    <div className="text-truncate" style={{ maxWidth: '180px' }}>{book?.name}</div>
                                    <div className='fw-semibold '>{(book?.price || 0).toLocaleString()}đ</div>
                                </div>
                            ))}

                            <hr />
                            <div className='d-flex justify-content-between align-items-center mt-3 mb-2'>
                                <div className='fw-bold fs-5'>Tổng cộng:</div>
                                <div className='fw-bold fs-5 text-danger'>{totalPrice.toLocaleString()}đ</div>
                            </div>

                            <button
                                className="btn btn-warning w-100 mt-3 mb-3 text-white fw-bold py-2"
                                onClick={() => setOpenModal(true)}
                            >
                                ĐẶT NGAY
                            </button>
                        </div>
                    </div>
                </div>


            </div>
            <BaseModal open={openModal} close={() => setOpenModal(false)}>
                <div style={{ width: "300px" }}>
                    <h5 className="px-3 py-1">Xác nhận đặt sách?</h5>
                    <div className="d-flex justify-content-end gap-2 mt-2 px-3 py-1">
                        <button className="btn btn-secondary" disabled={isLoading} onClick={() => setOpenModal(false)}>Hủy</button>
                        <button
                            className="btn btn-info"
                            disabled={isLoading}
                            onClick={handleSubmit}
                        >
                            {isLoading ?
                                (<Loading loading={isLoading} />)
                                : (
                                    'Đặt sách'
                                )}
                        </button>
                    </div>
                </div>
            </BaseModal>

            {data && <BaseModal open={openResultModal} close={() => setOpenResultModal(false)}>
                <div className="p-3 d-flex align-items-center justify-content-center gap-3" style={{ width: "300px" }}>
                    <i
                        className={`fa-solid ${data?.success ? "fa-circle-check text-success"
                            : "fa-circle-xmark text-danger"} fs-2`}
                    ></i>

                    <div>
                        {data?.message}
                    </div>
                </div>
            </BaseModal>}
        </div>
    );
}

export default CartPage;
