import React from 'react';
import { Link } from 'react-router-dom'
import './fast_link.scss'
const FastLink = () => {
    return (
        <div className='left d-block'>
            <div className='title-fast-link mb-3'>Liên Kết Nhanh</div>
            <ul className='list-group'>
                <li>
                    <Link className='d-flex gap-2 align-items-center fast-link' to='/'>
                        <i className="fa-solid fa-house"></i>
                        <span>Trang chủ</span>
                    </Link>
                </li>

                <li>
                    <Link className='d-flex gap-2 align-items-center fast-link' to='/notification'>
                        <i className="fa-solid fa-bell"></i>
                        <span>Thông báo</span>

                    </Link>
                </li>
                {/* <li>
                    <Link className='d-flex gap-2 align-items-center fast-link' to='/notification'>
                        <i className="fa-solid fa-bell"></i>
                        <span>Thông báo</span>
                    </Link>
                </li>
                <li>
                    <Link className='d-flex gap-2 align-items-center fast-link' to='/borrow-history'>
                        <i className="fa-solid fa-clock-rotate-left"></i>
                        <span>Lịch sử mượn</span>
                    </Link>
                </li>
                <li>
                    <Link className='d-flex gap-2 align-items-center fast-link' to='/borrow-penalties'>
                        <i className="fa-solid fa-money-bill"></i>
                        <span>Xử phạt</span>
                    </Link>
                </li>

                <li>
                    <Link className='d-flex gap-2 align-items-center fast-link' to='/library-policies'>
                        <i className="fa-solid fa-scale-balanced"></i>
                        <span>Quy tắc mượn sách tại thư viện</span>
                    </Link>
                </li>

                <li>
                    <Link className='d-flex gap-2 align-items-center fast-link' to='/library-favorite-book'>
                        <i className="fa-solid fa-heart"></i>
                        <span>Sách yêu thích</span>
                    </Link>
                </li> */}
            </ul>

        </div>
    );
}

export default FastLink;
