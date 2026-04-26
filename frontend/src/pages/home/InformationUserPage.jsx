import React, { useContext } from "react";
import { NavLink, Outlet, useSearchParams } from "react-router-dom";
import { AuthContent } from "../../utils/AuthContext";
import InformationUser from "../../components/InformationUser";
import ChangePassword from "../../components/ChangePassword";

const InformationUserPage = () => {
    const { user } = useContext(AuthContent)
    const [searchParams] = useSearchParams();
    const currentTab = searchParams.get("tab") || "information";

    // Hàm kiểm tra active dựa trên query param
    const getLinkClass = (tabName) => {
        const baseClass = "d-flex align-items-center px-4 py-3 text-decoration-none transition-all fw-medium mb-1 mx-2 rounded-3";
        return currentTab === tabName
            ? `${baseClass} bg-primary bg-opacity-10 text-primary border-start border-4 border-primary`
            : `${baseClass} text-secondary hover-bg-light`;
    };

    return (
        <div className="container-fluid bg-light min-vh-100">
            <div className="row h-100">
                {/* SIDEBAR */}
                <aside className="col-md-3 col-lg-2 bg-white shadow-sm p-0 position-fixed h-100 border-end">
                    {/* Profile Header Section */}
                    <div className="p-4 mb-3 text-center border-bottom">
                        <div className="position-relative d-inline-block mb-3">
                            <img
                                src={user?.image}
                                className="rounded-circle shadow-sm"
                                alt="Avatar"
                                width="80"
                            />
                            <span className="position-absolute bottom-0 end-0 p-1 bg-success border border-white rounded-circle"></span>
                        </div>
                        <h6 className="mb-0 fw-bold text-dark">{user?.first_name} {user?.last_name}</h6>
                        <small className="text-muted text-truncate d-block">{user?.email}</small>
                    </div>

                    {/* Navigation Menu */}
                    <div className="mt-2">
                        <small className="text-uppercase text-muted fw-bold px-4 mb-2 d-block" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>
                            Quản lý tài khoản
                        </small>

                        <NavLink to="?tab=information" className={getLinkClass("information")}>
                            <i className="fas fa-user me-2"></i>
                            Thông tin cá nhân
                        </NavLink>

                        <NavLink to="?tab=change_password" className={getLinkClass("change_password")}>
                            <i className="fas fa-lock me-2"></i>
                            Bảo mật & Mật khẩu
                        </NavLink>

                        <hr className="mx-4 my-4 opacity-10" />

                        <small className="text-uppercase text-muted fw-bold px-4 mb-2 d-block" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>
                            Hệ thống
                        </small>

                        <NavLink to="/" className="d-flex align-items-center px-4 py-3 text-decoration-none text-dark hover-bg-light mb-1 mx-2 rounded-3">
                            <i className="fas fa-arrow-left me-2"></i>
                            Về Trang chủ
                        </NavLink>

                        <NavLink to="/logout" className="d-flex align-items-center px-4 py-3 text-decoration-none text-danger hover-bg-danger-soft mb-1 mx-2 rounded-3 mt-4">
                            <i className="fas fa-sign-out-alt me-2"></i>                            Đăng xuất
                        </NavLink>
                    </div>
                </aside>

                {/* CONTENT AREA */}
                <main className="col-md-9 col-lg-10 offset-md-3 offset-lg-2 p-4">
                    <div className="container-fluid">
                        <div className="bg-white rounded-4 shadow-sm border p-4 min-vh-90">
                            {/* Tiêu đề động cho Content */}
                            <header className="mb-4 pb-3 border-bottom">
                                <h4 className="fw-bold text-dark mb-1">
                                    {currentTab === "information" ? "Thông tin tài khoản" : "Đổi mật khẩu"}
                                </h4>
                                <p className="text-muted small">Quản lý và cập nhật thông tin cá nhân của bạn để bảo mật tài khoản.</p>
                            </header>

                            <div className="tab-content animate-fade-in">
                                {currentTab === 'information' && <InformationUser />}
                                {currentTab === 'change_password' && <ChangePassword />}
                            </div>
                        </div>
                    </div>
                </main>
            </div>

        </div>
    );
};

export default InformationUserPage;