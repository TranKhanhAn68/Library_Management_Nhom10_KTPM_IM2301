import React from 'react';
import logo from '../../assets/logo.png'
import './header.scss'
import { Link } from 'react-router-dom';
const Header = () => {
    return (
        <>
            <nav className="navbar navbar-expand-md navbar-dark bg-light py-3 ">

                <a className="navbar-brand d-flex" href="/">
                    <img src={logo} className="rounded" alt="logo" />
                </a>

                <button
                    className="navbar-toggler border-0 shadow-none"
                    type="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#mobileMenu"
                >
                    <i className="fa-solid fa-bars text-dark"></i>
                </button>

                <div
                    className="offcanvas offcanvas-start vh-100 vw-50"
                    tabIndex="-1"
                    id="mobileMenu"
                >
                    <div className="offcanvas-header">
                        <h5 className="offcanvas-title">Menu</h5>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="offcanvas"
                        ></button>
                    </div>
                    <div className='d-md-flex d-block justify-content-between'>
                        <div className="offcanvas-body d-md-flex d-block gap-4 align-items-md-center">
                            <Link className="nav-link mt-3 mb-3" to="/">Home</Link>
                            <Link className="nav-link mt-3 mb-3" to="/category">Chọn thể loại sách</Link>
                            <Link className="nav-link mt-3 mb-3" to="/login">Đăng nhập</Link>
                        </div>
                        <div class="form-group d-flex h-50 p-3 gap-2 align-items-md-center">
                            <label htmlFor='search-book'><i class="fa-solid fa-magnifying-glass text-dark"></i></label>
                            <input type="text" class="form-control" id="search-book" name='search-book'
                                placeholder='Nhập vào sách cần tìm' />
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
}

export default Header;