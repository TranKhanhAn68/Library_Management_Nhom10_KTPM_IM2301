import React from 'react';
import { Link } from 'react-router-dom';

const SideBar = () => {
    return (
        <div>
            <aside className='tw-fixed tw-top-0 tw-left-0 tw-h-screen tw-w-64 tw-bg-white tw-border-r tw-p-4'>
                <h2 className='tw-text-2xl tw-font-bold tw-text-blue-600 tw-mb-8'>My Dashboard</h2>
                <nav>
                    <ul className='tw-space-y-4 tw-text-gray-700'>
                        <li>
                            <Link to='/dashboard' className='tw-block tw-hover:text-blue-500'>
                                <i className="fa-solid fa-house tw-text-red-500 tw-mr-2"></i>
                                <span>Dashboard</span>
                            </Link>
                        </li>
                        <li>
                            <Link to='/dashboard/users' className='tw-block tw-hover:text-blue-500'>
                                <i class="fa-solid fa-user tw-text-red-500 tw-mr-2"></i>
                                <span>Quản lý User</span>
                            </Link>
                        </li>
                        <li>
                            <Link to='/dashboard/categories' className='tw-block tw-hover:text-blue-500'>
                                <i class="fa-solid fa-layer-group tw-text-red-500 tw-mr-2"></i>
                                <span>Quản lý đầu sách</span>
                            </Link>
                        </li>
                        <li>
                            <Link to='/dashboard/books' className='tw-block tw-hover:text-blue-500'>
                                <i class='fa-solid fa-book tw-text-red-500 tw-mr-2'></i>
                                <span>Quản lý sách</span>

                            </Link>
                        </li>

                        <li>
                            <Link to='dashboard/settings' className='tw-block tw-hover:text-blue-500'>
                                <i class="fa-solid fa-gear tw-text-red-500 tw-mr-2"></i>
                                <span>Cài đặt</span>
                            </Link>
                        </li>
                    </ul>
                </nav>
            </aside>
        </div>
    );
}

export default SideBar;
