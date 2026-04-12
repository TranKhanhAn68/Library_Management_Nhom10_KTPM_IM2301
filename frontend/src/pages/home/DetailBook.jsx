import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { BookIDAPI } from '../../services/BookAPI';
import { AddToCart } from '../../utils/CartAction';
import { SettingListAPI } from '../../services/SettingAPI';
import Loading from '../../components/Loading';

const DetailBook = () => {

    const { id } = useParams()
    const [qTy, setQTy] = useState(1)
    const book = BookIDAPI(id)
    const [isLoading, setIsLoading] = useState(false)
    const [selected, setSelected] = useState(null)
    const [settings] = SettingListAPI()


    const handleAddToCart = async () => {
        if (!selected) {
            alert("Vui lòng chọn số ngày mượn trước khi thêm!");
            return;
        }
        setIsLoading(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            AddToCart(book, selected, qTy)
            alert(`${book.name} đã được thêm vào giỏ hàng!`)
            setSelected(null)
        } catch {
            console.error("Lỗi khi thêm:", error);
            alert("Không thể thêm sản phẩm, vui lòng thử lại!");
        } finally {
            setIsLoading(false)
        }
        // localStorage.removeItem("cart")
        console.log(JSON.parse(localStorage.getItem("cart")))
    }

    // console.log(selected)
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
                    <div>Thể loại: <span className='text-secondary'>{book.category.name || ""}</span></div>
                    <div>Tác giả: <span className='text-secondary'>{book.author.name || ""}</span></div>
                    <div>Nhà xuất bản: <span className='text-secondary'>{book.publisher.name || ""}</span></div>
                    <div>
                        <span>Số ngày mượn</span>
                        <select
                            class="form-select text-dark"
                            onChange={(e) => {
                                const value = e.target.value
                                const setObj = settings.find(s => s.id.toString() === value)
                                setSelected(setObj)
                            }}
                        >
                            <option selected disabled className=' text-secondary'>Vui lòng chọn</option>
                            {settings.map(s => (
                                <option key={s.id} value={s.id} className='text-dark'>{s.borrowing_days} ngày</option>
                            ))}
                        </select>
                    </div>
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

                    <button
                        className='btn btn-primary shadow mt-3 py-2 px-4 rounded-4'
                        onClick={handleAddToCart}
                        disabled={isLoading}
                    >
                        {isLoading ?
                            <Loading Loading={Loading} /> :
                            ('Thêm vào giỏ hàng')
                        }
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