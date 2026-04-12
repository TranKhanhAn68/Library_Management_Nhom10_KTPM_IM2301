import React, { useContext, useEffect, useState } from 'react';
import logo from '../../assets/logo.png'
import './header.scss'
import { Link } from 'react-router-dom';
import { AuthContent } from '../../utils/AuthContext';
import Tooltip from 'bootstrap/js/dist/tooltip';
import Menu from './Menu';
const Header = ({ handleSearch, searchParams, cart, authors }) => {
    const { logout, user, status } = useContext(AuthContent)
    const [openMenuHover, setOpenMenuHover] = useState(false)
    const [inputSearch, setInputSearch] = useState('')
    useEffect(() => {
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        tooltipTriggerList.forEach(el => new Tooltip(el));
    }, [user]);
    useEffect(() => {
        const query = searchParams.get('q')
        setInputSearch(query)
    }, [searchParams])

    const handleSubmit = (e) => {
        e.preventDefault()
        handleSearch(inputSearch.trim())
    }
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
                        <div className="offcanvas-body d-md-flex d-block gap-4 align-items-center">
                            <Link className="nav-link my-3" to="/">
                                <i class="fa-solid fa-house m-2"></i>
                                Home
                            </Link>
                            <div className="dropdown ">
                                <button type='button'
                                    className="nav-link my-3  dropdown-toggle" data-bs-toggle="dropdown"
                                >
                                    <i class="fa-solid fa-magnifying-glass m-2"></i>
                                    Khám phá
                                </button>
                                <Menu openMenuHover={openMenuHover} setOpenMenuHover={setOpenMenuHover} authors={authors} />

                            </div>
                            {status ? (
                                <div className='d-flex justify-items-center'>
                                    <div className="dropdown ">
                                        <div href="#" className="d-block m-2" id="avatarDropdown" data-bs-toggle="dropdown" >
                                            <button type='button' className="d-flex align-items-center gap-3" >
                                                <img src={user.image || ""}
                                                    alt={`${user.first_name || ""} ${user.last_name || ""}`}
                                                    data-bs-toggle="tooltip"
                                                    title={`${user.first_name || ""} ${user.last_name || ""}`}
                                                    className="rounded-circle me-2"
                                                    data-bs-placement="bottom"
                                                    style={{ maxWidth: "50px" }}
                                                />
                                            </button>
                                        </div>

                                        <ul className="dropdown-menu dropdown fs-6 shadow"
                                            aria-labelledby="avatarDropdown"
                                            style={{ minWidth: "250px" }}
                                        >

                                            <li className="px-3 py-2">
                                                <i className="fas fa-address-card me-1"></i>
                                                Họ và tên: <b>{user.first_name} {user.last_name}</b>
                                            </li>
                                            <li className="px-3 py-2">
                                                <i className="far fa-id-card me-1"></i>
                                                Tên tài khoản: <b>{user.username}</b>
                                            </li>

                                            <li>
                                                <hr className="dropdown-divider" />
                                            </li>

                                            <li>
                                                <a className="dropdown-item" href="/order">
                                                    <i className="fas fa-book me-1"></i>
                                                    Sách đã đặt
                                                </a>
                                            </li>

                                            <li>
                                                <a className="dropdown-item">
                                                    <i className="fas fa-user me-1"></i>
                                                    Thông tin cá nhân
                                                </a>
                                            </li>

                                            <li>
                                                <a className="dropdown-item" >
                                                    <i className="fas fa-unlock me-1"></i>
                                                    Đổi mật khẩu
                                                </a>
                                            </li>


                                        </ul>
                                    </div>

                                    <button
                                        className='nav-link nav-link-checkin my-3'
                                        onClick={logout}
                                    >
                                        Đăng xuất
                                    </button>
                                </div>
                            ) : (
                                <Link className="nav-link nav-link-checkin" to="/login" >Đăng nhập</Link>
                            )}
                        </div>
                        <div className="form-group d-md-flex d-block h-50 p-3 gap-4 align-items-center">
                            <Link to='shopping-cart' className='mx-2  position-relative'>
                                <i className="fa-solid fa-cart-shopping fs-3"></i>
                                <span
                                    className={`position-absolute top-0 start-100 translate-middle badge 
                                    rounded-pill bg-danger ${cart.length <= 0 ? "d-none" : ""}`}>
                                    {cart.length}
                                </span>
                            </Link>
                            <form onSubmit={handleSubmit} >
                                <div className='d-flex gap-3 align-items-md-center p-2'>

                                    <label htmlFor='search-book'><i className="fa-solid fa-magnifying-glass text-dark"></i></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="search-book"
                                        placeholder='Nhập vào sách cần tìm'
                                        name='q'
                                        value={inputSearch}
                                        onChange={(e) => setInputSearch(e.target.value)}

                                    />
                                    <button type='submit' className="btn btn-primary text-nowrap">
                                        <small>Tìm kiếm</small>
                                    </button>
                                </div>

                            </form>

                        </div>
                    </div>
                </div>


            </nav>

        </>
    );
}

export default Header;