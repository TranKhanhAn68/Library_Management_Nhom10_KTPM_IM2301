import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContent } from '../../utils/AuthContext';

const SideBar = () => {
    const location = useLocation();
    const { user } = useContext(AuthContent)
    const menuAdmin = [
        { link: '/dashboard', label: "Dashboard", icon: 'fa-solid fa-house', exact: true },
        { link: '/dashboard/users', label: "Quản lý User", icon: 'fa-solid fa-user' },
        { link: '/dashboard/categories', label: "Quản lý loại sách", icon: 'fa-solid fa-layer-group' },
        { link: '/dashboard/books', label: "Quản lý sách", icon: 'fa-solid fa-book' },
        { link: '/dashboard/settings', label: "Cài đặt", icon: 'fa-solid fa-gear' }
    ];

    const menuEmployee = [
        { link: '/dashboard', label: "Dashboard", icon: 'fa-solid fa-house', exact: true },
        { link: '/dashboard/employee/transactions', label: "Quản lý sách mượn", icon: 'fa-solid fa-book-open-reader' },
        { link: '/dashboard/employee/orders', label: "Quản lý đặt trước sách", icon: 'fa-solid fa-bookmark' }
    ]

    const menu = user?.is_superuser ? menuAdmin : menuEmployee
    return (
        <aside className='tw-fixed tw-top-0 tw-left-0 tw-h-screen tw-w-64 tw-bg-white tw-border-r'>
            <h2 className='tw-text-2xl tw-font-bold tw-text-blue-600 tw-p-6'>Admin Panel</h2>
            <nav className='tw-px-4'>
                <ul className='tw-space-y-2 tw-text-gray-700 tw-text-lg'>
                    {menu && menu.map((item, index) => {

                        const isActive = item.exact
                            ? location.pathname === item.link
                            : location.pathname.startsWith(item.link);

                        return (
                            <li key={index}>
                                <Link
                                    to={item.link}
                                    className={`tw-flex tw-items-center tw-py-3 tw-px-4 tw-gap-2 tw-rounded-xl tw-transition-all ${isActive
                                        ? "tw-bg-blue-50 tw-text-blue-600 tw-font-bold"
                                        : "hover:tw-bg-gray-200 tw-text-gray-600"
                                        }`}
                                >
                                    <i className={`${item.icon} tw-w-8 ${isActive ? 'tw-text-blue-600' : 'tw-text-gray-400'}`}></i>
                                    <span>{item.label}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </aside>
    );
}

export default SideBar;