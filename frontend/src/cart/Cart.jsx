import React, { useState } from 'react';
const Cart = ({ cart, handleIncreaseQTy, handleDecreaseQTy }) => {

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
                    {cart && cart.map((book, index) => (
                        <tr key={book.id || index}>
                            <td>{index + 1}</td>
                            <td>
                                <div className='d-flex align-items-center gap-3'>
                                    <img
                                        src={book.image}
                                        width="80"
                                        height="100"
                                        style={{ objectFit: "cover", borderRadius: "8px" }}
                                        alt=""
                                    />
                                    <div className="fw-medium " title={book.name} style={{
                                        maxWidth: '150px',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}>{book.name}</div>
                                </div>
                            </td>

                            <td>{book.borrowDate}</td>

                            <td>{book.totalDays} ngày</td>

                            <td>
                                <div className="input-group py-2" style={{ width: "120px" }}>
                                    <button
                                        className="btn btn-outline-secondary btn-warning"
                                        type="button"
                                        onClick={() => handleDecreaseQTy(book.id)}
                                        disabled={book.qty <= 1}
                                    >
                                        -
                                    </button>

                                    <input type="text" className="form-control text-center" value={book.qty} readOnly />

                                    <button className="btn btn-outline-secondary btn-warning"
                                        type="button"
                                        onClick={() => handleIncreaseQTy(book.id)}
                                    >
                                        +
                                    </button>
                                </div>

                            </td>

                            <td className="text-danger fw-bold">
                                {(book.price * book.qty).toLocaleString()}đ
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

    );
}

export default Cart;
