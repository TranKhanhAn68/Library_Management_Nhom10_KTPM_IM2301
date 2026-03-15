import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const username = 'Admin';

    return (
        <header className='tw-fixed tw-tip-0 tw-left-64 tw-right-0 tw-h-16 tw-bg-white tw-border-b tw-flex 
                    tw-items-center tw-justify-between tw-px-6 tw-shadown-sm z-10'>
            <h1 className='tw-text-xl tw-font-semibold tw-text-gray-700'>Admin Page</h1>

            <div className='tw-flex items-center tw-space-x-2'>
                {/* Hiện avatar user */}
                <div className='tw-m-4'>
                    <i className="fa-solid fa-circle-user tw-text-blue-500 tw-mr-2"></i>
                    <span>Hello </span>
                    <span className='tw-text-shy-700'>{username}</span>
                </div>

                {/* Nút nhấn về giao diện chính */}
                <button className='tw-flex tw-items-center tw-bg-blue-500 tw-text-white
                                tw-my-2 tw-p-2 tw-hover:bg-green-500 tw-transition tw-rounded-xl'>
                    <Link to="/">Trang chủ</Link>
                </button>
            </div>
        </header>


    );
}

export default Navbar;
