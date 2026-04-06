import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContent } from '../../utils/AuthContext';

const AdminLogin = () => {
    const { login } = useContext(AuthContent)
    const ref = useRef()

    useEffect(() => {
        ref.current.focus()
    }, [])
    const navigate = useNavigate();
    const [username, setUsername] = useState(() => {
        const storedUsername = localStorage.getItem('savedUsername')
        if (storedUsername)
            return JSON.parse(storedUsername)
        return ""
    });
    const [password, setPassword] = useState('');
    const [err, setErr] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();

        if (username.trim().length === 0 || password.trim().length === 0) {
            setErr('Không được bỏ trống')
            return
        }

        const authUser = login(username, password)
        if (authUser) {
            if (['admin', 'employee'].includes(authUser.role)) {
                setErr("")
                localStorage.setItem('savedUsername', JSON.stringify(username))
                localStorage.setItem('authUser', JSON.stringify(authUser))
                navigate('/dashboard');
            }
            else {
                setErr(`Lỗi: Tên người dùng ${username} không được đăng ký hoặc không có quyền hạn trên trang web này.`);
            }
        } else {
            setErr(`Lỗi: Tên người dùng ${username} không được đăng ký hoặc không có quyền hạn trên trang web này.`);
        }
        console.log(localStorage.getItem('authUser'))
    };

    return (
        <div className="tw-flex tw-items-center tw-justify-center tw-h-screen tw-bg-gray-100">
            <div className="tw-bg-white tw-p-6 tw-rounded-lg tw-shadow-md tw-w-full tw-max-w-md">
                <div className="tw-text-center tw-mb-6">
                    <h1 className="tw-text-3xl tw-font-bold tw-py-3">
                        Admin <span className="tw-text-indigo-700 tw-font-bold">Login</span>
                    </h1>
                </div>

                <form className="tw-flex tw-flex-col tw-gap-4" onSubmit={handleLogin}>
                    <input
                        type="text"
                        placeholder="Enter username"
                        className="tw-border tw-border-gray-300 tw-rounded tw-px-3 tw-py-2 tw-focus:outline-none tw-focus:ring-2 tw-focus:ring-blue-500"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        ref={ref}
                    />
                    <input
                        type="password"
                        placeholder="Enter password"
                        className="tw-border tw-border-gray-300 tw-rounded tw-px-3 tw-py-2 tw-focus:outline-none tw-focus:ring-2 tw-focus:ring-blue-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {err && (
                        <p className="tw-bg-red-500 tw-text-white tw-text-sm tw-p-2 tw-rounded">{err}</p>
                    )}

                    <button
                        type="submit"
                        className="tw-bg-indigo-400 tw-text-white tw-font-bold tw-py-2 tw-rounded 
                                hover:tw-bg-indigo-600 tw-transition-all tw-duration-300"
                    >
                        Sign in
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;