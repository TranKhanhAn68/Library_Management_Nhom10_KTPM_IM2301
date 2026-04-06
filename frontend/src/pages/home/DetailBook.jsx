import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { BookIDAPI } from '../../services/BookAPI';

const DetailBook = () => {

    const { id } = useParams()
    const [qTy, setQTy] = useState(1)
    const book = BookIDAPI(id)

    if (!book) return <div>Loading...</div>
    return (

        <div>

            <div className='d-flex gap-5 m-5 fs'>
                <div className='d-block h-5'>
                    <img
                        src={book.image || ""}
                        className="img-fluid rounded hover-shadow"
                        alt={book.name || ""}
                        style={{ objectFit: 'cover' }}
                    />
                </div>

                <div className='lh-lg px-4 fs-4'>
                    <div>Mã sách: <span className='text-primary fw-bold'>{book.book_id || ""}</span></div>
                    <div>Tên sách: <span className='text-secondary'>{book.name || ""}</span></div>
                    <div>Thể loại: <span className='text-secondary'>{book.category_id || ""}</span></div>
                    <div>Số lượng còn lại: <span className='text-secondary'>{book.available_quantity || 0}</span></div>

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

                    <button className='btn btn-primary shadow mt-3 py-2 px-4 rounded-4'>
                        Thêm vào giỏ hàng
                    </button>
                </div>
            </div>

            <hr />

            <div className='d-block w-100 mx-5 my-2'>
                <h1 className='fw-bold text-decoration-underline fs-1'>Description</h1>
                <div className='mt-2 fs-5'>{book.description || ""}</div>
            </div>
        </div>
    );
}

export default DetailBook;