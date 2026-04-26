import React from 'react';
import { Link } from 'react-router-dom'
import './fast_link.scss'
const FastLink = () => {
    return (
        <div className='left mx-auto my-2 d-block ' style={{ minWidth: "300px", height: "fit-content" }}>
            <div className='title-fast-link mb-3'>Liên Kết Nhanh</div>
            <ul className='list-group'>
                <li>
                    <Link className=' fast-link' to='/'>
                        <i className="fa-solid fa-house"></i>
                        <span>Trang chủ</span>
                    </Link>
                </li>


                <li>
                    <Link className=' fast-link' to='current_user/borrowing-history'>
                        <i className="fa-solid fa-clock-rotate-left"></i>
                        <span>Lịch sử mượn</span>
                    </Link>
                </li>

                <li>
                    <Link className=' fast-link' to='current_user/orders'>
                        <i class="fa-solid fa-clock"></i>
                        <span>Danh sách đặt trước</span>
                    </Link>
                </li>

                <li>
                    <Link className=' fast-link' to='library_rules'>
                        <i className="fa-solid fa-scale-balanced"></i>
                        <span>Quy tắc mượn sách tại thư viện</span>
                    </Link>
                </li>

                <li>
                    <Link className='fast-link' to='authors'>
                        <i className="fa-solid fa-user-pen"></i>
                        <span>Danh sách tác giả</span>
                    </Link>
                </li>
            </ul>

        </div>
    );
}

export default FastLink;
