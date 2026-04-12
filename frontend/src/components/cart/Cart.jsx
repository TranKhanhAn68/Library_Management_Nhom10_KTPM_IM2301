import React, { useEffect, useState } from 'react';
import BaseModal from '../BaseModal';
import Loading from '../Loading';
const Cart = ({ cart, setCart, handleIncreaseQTy, handleDecreaseQTy }) => {
    const [openModal, setOpenModal] = useState(false)
    const [selectedItem, setSelectedItem] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleSelectedItem = (book) => {
        setOpenModal(true)
        setSelectedItem(book)
    }

    const handleRemoveItem = async () => {
        if (!selectedItem) return;

        setIsLoading(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            setCart(prev => prev.filter(book => book.book_id !== selectedItem.book_id));

            setOpenModal(false);
            setSelectedItem(null);
        } catch (error) {
            console.error("Lỗi khi xóa:", error);
            alert("Không thể xóa sản phẩm, vui lòng thử lại!");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='d-block w-100'>
            <table className="table text-center align-middle">
                <thead className="table-light">
                    <tr>
                        <th>Số thứ tự</th>
                        <th>Sản phẩm</th>
                        <th>Ngày mượn</th>
                        <th>Tổng số ngày mượn</th>
                        <th>Số lượng</th>
                        <th>Thành tiền</th>
                    </tr>
                </thead>

                <tbody>
                    {!cart || cart.length === 0 ? (
                        <tr>
                            <td colSpan="7" className="py-4 text-muted ">
                                Không có sản phẩm trong giỏ
                            </td>
                        </tr>
                    ) : (
                        cart.map((book, index) => (
                            <tr key={book.id || index}>
                                <td>{index + 1}</td>
                                <td>
                                    <div className='d-flex align-items-center gap-3'>
                                        <img
                                            src={book.image}
                                            width="80"
                                            height="100"
                                            style={{ objectFit: "cover", borderRadius: "8px" }}
                                            alt={book.name}
                                        />
                                        <div className="fw-medium text-start" title={book.name} style={{
                                            maxWidth: '150px',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }}>{book.name}</div>
                                    </div>
                                </td>

                                <td>{book.date}</td>
                                <td>{book.setting?.borrowing_days} ngày</td>

                                <td>
                                    <div className="input-group py-2 mx-auto" style={{ width: "120px" }}>
                                        <button
                                            className="btn btn-outline-secondary btn-warning"
                                            type="button"
                                            onClick={() => handleDecreaseQTy(book.id)}
                                            disabled={book.borrowing_quantity <= 1}
                                        >
                                            -
                                        </button>
                                        <input type="text" className="form-control text-center" value={book.borrowing_quantity} readOnly />
                                        <button
                                            className="btn btn-outline-secondary btn-warning"
                                            type="button"
                                            onClick={() => handleIncreaseQTy(book.id)}
                                        >
                                            +
                                        </button>
                                    </div>
                                </td>

                                <td className="text-danger fw-bold">
                                    {(book?.price || 0).toLocaleString()}đ
                                </td>

                                <td>
                                    <button className='btn btn-sm border-2 border-dark' onClick={() => handleSelectedItem(book)}>
                                        <i className="fa-solid fa-x"></i>
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {selectedItem && <BaseModal open={openModal} close={() => !isLoading && setOpenModal(false)}>
                <div className="p-3">
                    <h5>Xác nhận xóa?</h5>
                    <p>Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?</p>
                    <div className="d-flex justify-content-end gap-2 mt-3">
                        <button className="btn btn-secondary" disabled={isLoading} onClick={() => setOpenModal(false)}>Hủy</button>
                        <button
                            className="btn btn-danger"
                            disabled={isLoading}
                            onClick={handleRemoveItem}
                        >
                            {isLoading ?
                                (<Loading loading={isLoading} />)
                                : (
                                    'Xóa'
                                )}
                        </button>
                    </div>
                </div>
            </BaseModal>
            }
        </div>
    );
}

export default Cart;
