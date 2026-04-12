import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContent } from '../../utils/AuthContext';

const AdminLogin = () => {
    const { login, setUser, setStatus, setToken } = useContext(AuthContent);
    const usernameRef = useRef();
    const navigate = useNavigate();

    const [username, setUsername] = useState(() => {
        try {
            const saved = localStorage.getItem('savedUsername');
            return saved ? JSON.parse(saved) : "";
        } catch { return ""; }
    });
    const [password, setPassword] = useState('');
    const [err, setErr] = useState('');

    useEffect(() => {
        usernameRef.current.focus();
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!username.trim() || !password.trim()) {
            setErr('Vui lòng điền đầy đủ thông tin');
            return;
        }

        const authUser = await login(username, password);

        if (authUser?.status) {
            if (authUser.user?.is_staff || authUser.user?.is_superuser) {
                setErr("");
                localStorage.setItem('savedUsername', JSON.stringify(username));
                localStorage.setItem('authUser', JSON.stringify(authUser))
                setUser(authUser.user)
                setStatus(authUser.status)
                setToken(authUser.token)
                navigate('/dashboard');
            } else {
                setErr(`Tài khoản ${username} không có quyền truy cập trang quản trị.`);
            }
        } else {
            setErr("Tên đăng nhập hoặc mật khẩu không chính xác.");
        }
    };
    return (
        <div className="tw-flex tw-items-center tw-justify-center tw-h-screen tw-bg-gray-100">
            <div className="tw-bg-white tw-p-8 tw-rounded-xl tw-shadow-lg tw-w-full tw-max-w-md">
                <div className="tw-text-center tw-mb-8">
                    <h1 className="tw-text-3xl tw-font-bold">
                        Admin <span className="tw-text-indigo-700">Login</span>
                    </h1>
                </div>

                <form className="tw-flex tw-flex-col tw-gap-5" onSubmit={handleLogin}>
                    <div>
                        <label className="tw-text-sm tw-font-medium tw-text-gray-700">Username</label>
                        <input
                            type="text"
                            placeholder="Nhập tên đăng nhập"
                            className="tw-w-full tw-mt-1 tw-border tw-border-gray-300 tw-rounded-lg tw-px-4 tw-py-2 tw-focus:ring-2 tw-focus:ring-indigo-500 tw-outline-none"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            ref={usernameRef}
                        />
                    </div>

                    <div>
                        <label className="tw-text-sm tw-font-medium tw-text-gray-700">Password</label>
                        <input
                            type="password"
                            placeholder="Nhập mật khẩu"
                            className="tw-w-full tw-mt-1 tw-border tw-border-gray-300 tw-rounded-lg tw-px-4 tw-py-2 tw-focus:ring-2 tw-focus:ring-indigo-500 tw-outline-none"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {err && (
                        <p className="tw-bg-red-50 tw-text-red-600 tw-text-sm tw-p-3 tw-rounded-lg tw-border tw-border-red-200">
                            {err}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="tw-bg-indigo-600 tw-text-white tw-font-bold tw-py-2.5 tw-rounded-lg 
                                   hover:tw-bg-indigo-700 tw-transition-all tw-duration-200 tw-mt-2"
                    >
                        Sign in
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;