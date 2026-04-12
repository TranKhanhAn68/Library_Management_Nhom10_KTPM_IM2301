import React, { useContext } from 'react';
import { Link, useNavigate, } from 'react-router-dom';
import { AuthContent } from '../../utils/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContent)

    const libraryManagementURL = "/"
    const navigate = useNavigate()
    const handleGoToMain = () => {
        window.open(libraryManagementURL, "_blank")
    };

    const handleLogout = (e) => {
        logout()
        navigate('/admin/login')
    }

    return (
        <header className='tw-fixed tw-z-10 tw-top-0 tw-left-64 tw-right-0 tw-h-16 tw-bg-white tw-border-b tw-flex 
                    tw-items-center tw-justify-between tw-px-6 tw-shadown-sm z-10'>
            <h1 className='tw-text-xl tw-font-semibold tw-text-gray-700'>Admin Page</h1>

            <div className='tw-flex items-center tw-space-x-2'>
                <div className='tw-flex tw-mr tw-m-4 gap-3'>
                    <div>
                        <i className="fa-solid fa-circle-user tw-text-blue-500 tw-mr-2"></i>
                        <span>Hello </span>
                        <span className='tw-text-shy-700'>{user?.username || "Guest"}</span>
                    </div>

                    <div>
                        <button className='hover:tw-text-red-500 tw-text-gray-700' onClick={handleLogout}>
                            <i className="fa-solid fa-right-from-bracket tw-mr-2"></i>
                            <span>Logout</span>
                        </button>
                    </div>

                </div>

                <button className='tw-flex tw-items-center tw-bg-blue-500 tw-text-white
                                tw-my-2 tw-p-2 tw-hover:bg-green-500 tw-transition tw-rounded-xl'>
                    <Link onClick={handleGoToMain}>Trang chủ</Link>
                </button>
            </div>
        </header>


    );
}

export default Navbar;
