import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="tw-bg-white tw-border-t tw-border-gray-100 tw-mt-12">
            <div className="tw-max-w-6xl tw-mx-auto tw-px-6 tw-py-10">
                <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-8">

                    {/* Cột 1: Giới thiệu */}
                    <div className="tw-space-y-4">
                        <div className="tw-flex tw-items-center tw-gap-2">
                            <div className="tw-w-8 tw-h-8 tw-bg-indigo-600 tw-rounded-lg tw-flex tw-items-center tw-justify-center">
                                <i className="fa-solid fa-book-bookmark tw-text-white tw-text-sm"></i>
                            </div>
                            <span className="tw-text-lg tw-font-bold tw-text-gray-800 tw-tracking-tight">
                                SmartLib System
                            </span>
                        </div>
                        <p className="tw-text-gray-500 tw-text-sm tw-leading-relaxed">
                            Hệ thống quản lý thư viện hiện đại, giúp bạn kết nối với tri thức một cách nhanh chóng và tiện lợi nhất.
                        </p>
                    </div>

                    {/* Cột 2: Liên kết nhanh */}
                    <div className="tw-flex tw-flex-col tw-gap-3">
                        <h4 className="tw-text-sm tw-font-bold tw-text-gray-900 tw-uppercase tw-tracking-wider">Hỗ trợ</h4>
                        <nav className="tw-flex tw-flex-col tw-gap-2">
                            <Link to="" className="tw-text-sm tw-text-gray-500 hover:tw-text-indigo-600 tw-transition-colors">Hướng dẫn mượn sách</Link>
                            <Link to="library_rules" className="tw-text-sm tw-text-gray-500 hover:tw-text-indigo-600 tw-transition-colors">Chính sách bảo mật</Link>
                            <Link href="#" className="tw-text-sm tw-text-gray-500 hover:tw-text-indigo-600 tw-transition-colors">Câu hỏi thường gặp</Link>
                        </nav>
                    </div>

                    {/* Cột 3: Liên hệ */}
                    <div className="tw-flex tw-flex-col tw-gap-3">
                        <h4 className="tw-text-sm tw-font-bold tw-text-gray-900 tw-uppercase tw-tracking-wider">Liên hệ</h4>
                        <div className="tw-space-y-2">
                            <div className="tw-flex tw-items-center tw-gap-2 tw-text-sm tw-text-gray-500">
                                <i className="fa-solid fa-phone tw-w-4"></i>
                                <span>+84 123 456 789</span>
                            </div>
                            <div className="tw-flex tw-items-center tw-gap-2 tw-text-sm tw-text-gray-500">
                                <i className="fa-solid fa-envelope tw-w-4"></i>
                                <span>support@smartlib.vn</span>
                            </div>
                            <div className="tw-flex tw-items-center tw-gap-2 tw-text-sm tw-text-gray-500">
                                <i className="fa-solid fa-location-dot tw-w-4"></i>
                                <span>99 Tô Hiến Thành, Đà Nẵng</span>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Dòng bản quyền dưới cùng */}
                <div className="tw-mt-10 tw-pt-6 tw-border-t tw-border-gray-50 tw-flex tw-flex-col md:tw-flex-row tw-justify-between tw-items-center tw-gap-4">
                    <p className="tw-text-xs tw-text-gray-400">
                        © 2026 <span className="tw-font-medium">SmartLib</span>. All rights reserved.
                        <span className="tw-ml-2 tw-hidden md:tw-inline">|</span>
                        <span className="tw-ml-2">Nội quy áp dụng từ 01/01/2026</span>
                    </p>
                    <div className="tw-flex tw-gap-4">
                        <Link href="#" className="tw-w-8 tw-h-8 tw-bg-gray-50 tw-text-gray-400 tw-rounded-full tw-flex tw-items-center tw-justify-center hover:tw-bg-indigo-50 hover:tw-text-indigo-600 tw-transition-all">
                            <i className="fa-brands fa-facebook-f"></i>
                        </Link>
                        <Link href="#" className="tw-w-8 tw-h-8 tw-bg-gray-50 tw-text-gray-400 tw-rounded-full tw-flex tw-items-center tw-justify-center hover:tw-bg-indigo-50 hover:tw-text-indigo-600 tw-transition-all">
                            <i className="fa-brands fa-github"></i>
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;