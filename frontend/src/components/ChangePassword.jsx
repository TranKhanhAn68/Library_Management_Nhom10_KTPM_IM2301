import React, { useContext, useState } from "react";
import { getError } from "../utils/GetError";
import { AuthContent } from "../utils/AuthContext";

const ChangePassword = () => {
    const { token } = useContext(AuthContent)
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState([]);
    const [message, setMessage] = useState("");


    const [showPasswords, setShowPasswords] = useState({
        old: false,
        new: false,
        confirm: false
    });

    const toggleVisibility = (field) => {
        setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
    };

    // ✅ VALIDATE CHUẨN
    const validateForm = () => {
        const errs = [];

        if (!oldPassword.trim())
            errs.push("Vui lòng nhập mật khẩu hiện tại");

        if (!newPassword.trim())
            errs.push("Vui lòng nhập mật khẩu mới");

        if (!confirmPassword.trim())
            errs.push("Vui lòng xác nhận mật khẩu");

        if (newPassword && confirmPassword && newPassword !== confirmPassword)
            errs.push("Mật khẩu không khớp");

        return errs;
    };

    // ✅ HANDLE SUBMIT
    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validateForm();

        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            setLoading(true);
            setErrors([]);
            setMessage("");

            const res = await fetch("http://127.0.0.1:8000/users/current_user/update_password/", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    ...(token && { Authorization: `Token ${token}` })
                },
                body: JSON.stringify({
                    old_password: oldPassword,
                    new_password: newPassword
                })
            });

            const result = await res.json();

            if (!res.ok) {
                const errMsg = getError(result);
                throw new Error(errMsg);
            }

            setMessage(result.message || "Đổi mật khẩu thành công");
            setErrors([]);

            // reset form
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");

        } catch (e) {
            console.log(e)
            setErrors(prev => [...prev, e.message || "Có lỗi xảy ra"]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-4 animate-fade-in">
            <div className="row justify-content-center">
                <div className="col-12 col-md-10 col-lg-8">

                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                        <div className="card-header bg-white border-0 pt-4 px-4">
                            <h4 className="fw-bold text-dark mb-1">
                                <i className="fas fa-shield-alt text-primary me-2"></i>
                                Thiết lập mật khẩu
                            </h4>
                        </div>

                        <div className="card-body p-4">

                            {/* ✅ HIỂN THỊ ERROR */}
                            {errors.length > 0 && (
                                <div className="alert alert-danger">
                                    <ul className="mb-0">
                                        {errors.map((err, i) => (
                                            <li key={i}>{err}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* ✅ SUCCESS */}
                            {message && (
                                <div className="alert alert-success">{message}</div>
                            )}

                            <form onSubmit={handleSubmit}>

                                {/* OLD */}
                                <div className="mb-4">
                                    <label htmlFor="oldPassword" className="form-label">Mật khẩu hiện tại</label>
                                    <div className="input-group">
                                        <input
                                            id="oldPassword"
                                            type={showPasswords.old ? "text" : "password"}
                                            className="form-control"
                                            value={oldPassword}
                                            onChange={e => setOldPassword(e.target.value)}
                                        />
                                        <span className="input-group-text bg-light border-start-0 text-muted cursor-pointer"
                                            onClick={() => toggleVisibility('old')} style={{ cursor: 'pointer' }} >
                                            <i className={`fas ${showPasswords.old ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                        </span>
                                    </div>
                                </div>

                                {/* NEW */}
                                <div className="mb-4">
                                    <label htmlFor="newPassword" className="form-label">Mật khẩu mới</label>
                                    <div className="input-group">
                                        <input
                                            id="newPassword"
                                            type={showPasswords.new ? "text" : "password"}
                                            className="form-control"
                                            value={newPassword}
                                            onChange={e => setNewPassword(e.target.value)}
                                        />
                                        <span className="input-group-text bg-light border-start-0 text-muted cursor-pointer"
                                            onClick={() => toggleVisibility('new')} style={{ cursor: 'pointer' }} >
                                            <i className={`fas ${showPasswords.new ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                        </span>
                                    </div>
                                </div>

                                {/* CONFIRM */}
                                <div className="mb-4">
                                    <label htmlFor="confirmPassword" className="form-label">Xác nhận mật khẩu</label>
                                    <div className="input-group">
                                        <input
                                            id="confirmPassword"
                                            type={showPasswords.confirm ? "text" : "password"}
                                            className="form-control"
                                            value={confirmPassword}
                                            onChange={e => setConfirmPassword(e.target.value)}
                                        />
                                        <span className="input-group-text bg-light border-start-0 text-muted cursor-pointer"
                                            onClick={() => toggleVisibility('confirm')} style={{ cursor: 'pointer' }} >
                                            <i className={`fas ${showPasswords.confirm ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                        </span>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-danger"
                                    disabled={loading}
                                >
                                    {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    );
};

export default ChangePassword;