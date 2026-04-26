import React, { useState } from "react";

const ChangePassword = () => {
    // State để ẩn/hiện mật khẩu
    const [showPasswords, setShowPasswords] = useState({
        old: false,
        new: false,
        confirm: false
    });

    const toggleVisibility = (field) => {
        setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
    };

    return (
        <div className="container py-4 animate-fade-in">
            <div className="row justify-content-center">
                <div className="col-12 col-md-10 col-lg-8">
                    {/* CARD THIẾT KẾ MỚI */}
                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                        <div className="card-header bg-white border-0 pt-4 px-4">
                            <h4 className="fw-bold text-dark mb-1">
                                <i className="fas fa-shield-alt text-primary me-2"></i>
                                Thiết lập mật khẩu
                            </h4>
                            <p className="text-muted small">Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác.</p>
                        </div>

                        <div className="card-body p-4">
                            <form id="changePasswordForm">
                                {/* Mật khẩu hiện tại */}
                                <div className="mb-4">
                                    <label className="form-label fw-semibold text-secondary small">Mật khẩu hiện tại</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-end-0 text-muted">
                                            <i className="fas fa-lock"></i>
                                        </span>
                                        <input
                                            type={showPasswords.old ? "text" : "password"}
                                            className="form-control form-control-lg fs-6 shadow-none border-start-0 border-end-0"
                                            placeholder="Nhập mật khẩu hiện tại"
                                            name="old-password"
                                            required
                                        />
                                        <span
                                            className="input-group-text bg-light border-start-0 text-muted cursor-pointer"
                                            onClick={() => toggleVisibility('old')}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <i className={`fas ${showPasswords.old ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                        </span>
                                    </div>
                                </div>

                                <hr className="my-4 opacity-10" />

                                {/* Mật khẩu mới */}
                                <div className="mb-4">
                                    <label className="form-label fw-semibold text-secondary small">Mật khẩu mới</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-end-0 text-muted">
                                            <i className="fas fa-key"></i>
                                        </span>
                                        <input
                                            type={showPasswords.new ? "text" : "password"}
                                            className="form-control form-control-lg fs-6 shadow-none border-start-0 border-end-0"
                                            placeholder="Tối thiểu 8 ký tự"
                                            name="new-password"
                                            required
                                        />
                                        <span
                                            className="input-group-text bg-light border-start-0 text-muted cursor-pointer"
                                            onClick={() => toggleVisibility('new')}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <i className={`fas ${showPasswords.new ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                        </span>
                                    </div>
                                </div>

                                {/* Nhập lại mật khẩu mới */}
                                <div className="mb-4">
                                    <label className="form-label fw-semibold text-secondary small">Xác nhận mật khẩu mới</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-end-0 text-muted">
                                            <i className="fas fa-check-double"></i>
                                        </span>
                                        <input
                                            type={showPasswords.confirm ? "text" : "password"}
                                            className="form-control form-control-lg fs-6 shadow-none border-start-0 border-end-0"
                                            placeholder="Nhập lại mật khẩu mới"
                                            name="confirm_new-password"
                                            required
                                        />
                                        <span
                                            className="input-group-text bg-light border-start-0 text-muted cursor-pointer"
                                            onClick={() => toggleVisibility('confirm')}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <i className={`fas ${showPasswords.confirm ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                        </span>
                                    </div>
                                </div>

                                {/* NÚT BẤM */}
                                <div className="d-flex justify-content-end gap-2 mt-5">
                                    <button type="reset" className="btn btn-light px-4 fw-semibold rounded-pill">Hủy bỏ</button>
                                    <button
                                        type="button"
                                        className="btn btn-danger px-4 fw-semibold rounded-pill shadow-sm"
                                        data-bs-toggle="modal"
                                        data-bs-target="#confirmModal"
                                    >
                                        Đổi mật khẩu
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL XÁC NHẬN (Nâng cấp giao diện) */}
            <div className="modal fade" id="confirmModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered shadow">
                    <div className="modal-content border-0 rounded-4">
                        <div className="modal-body text-center p-5">
                            <div className="mb-4">
                                <i className="fas fa-exclamation-circle text-warning display-3"></i>
                            </div>
                            <h4 className="fw-bold mb-3">Xác nhận thay đổi?</h4>
                            <p className="text-muted">Bạn có chắc chắn muốn cập nhật mật khẩu mới không? Bạn sẽ phải dùng mật khẩu mới cho lần đăng nhập sau.</p>

                            <div className="d-flex justify-content-center gap-3 mt-4">
                                <button type="button" className="btn btn-light px-4 rounded-pill fw-semibold" data-bs-dismiss="modal">Quay lại</button>
                                <button
                                    type="submit"
                                    form="changePasswordForm"
                                    className="btn btn-primary px-4 rounded-pill fw-semibold shadow-sm"
                                    onClick={() => document.getElementById("changePasswordForm").submit()}
                                >
                                    Đồng ý thay đổi
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .cursor-pointer:hover { color: #0d6efd !important; }
                .input-group-text { min-width: 45px; justify-content: center; }
                .animate-fade-in { animation: fadeIn 0.4s ease-out; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
};

export default ChangePassword;