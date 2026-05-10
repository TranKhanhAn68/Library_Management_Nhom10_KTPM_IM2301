import React, { useContext, useState, useEffect } from "react";
import { AuthContent } from "../utils/AuthContext"
import { getError } from "../utils/GetError";
import BaseModal from "./BaseModal";

const InfoItem = ({ icon, label, value, isSuccess }) => (
    <div className="col-md-6">
        <div className="d-flex align-items-center gap-3 p-2 rounded-3 hover-bg-light transition-all">
            <div className="bg-primary bg-opacity-10 p-3 rounded-circle text-primary d-flex align-items-center justify-content-center" style={{ width: "50px", height: "50px" }}>
                <i className={`bi ${icon} fs-5`}></i>
            </div>
            <div>
                <small className="text-muted d-block mb-0" style={{ fontSize: '0.75rem' }}>{label}</small>
                <span className={`fw-bold ${isSuccess ? 'text-success' : 'text-dark'}`}>{value || "---"}</span>
            </div>
        </div>
    </div>
);

const InformationUser = () => {
    const { user, setUser, token } = useContext(AuthContent);
    const [loading, setLoading] = useState(false)
    const [openModal, setOpenModal] = useState(false)
    // State cho việc hiển thị ảnh preview
    const [preview, setPreview] = useState(user?.image);
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        gender: "",
        dob: "",
        phone_number: "",
        avatar: ""
    });
    const [errors, setErrors] = useState([])
    // Cập nhật preview khi dữ liệu user từ context thay đổi (quan trọng!)
    useEffect(() => {
        if (user) {
            setFormData({
                first_name: user.first_name || "",
                last_name: user.last_name || "",
                gender: user.gender || "",
                dob: user.dob || "",
                phone_number: user.phone_number || "",
            });

            if (user.image) {
                setPreview(user.image);
            }
        }
    }, [user]);
    // Xử lý thay đổi file
    const handleFileChange = (file) => {
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                alert("Kích thước ảnh quá lớn (tối đa 1MB)");
                return;
            }
            setPreview(URL.createObjectURL(file));
            setFormData({ ...formData, avatar: file });
        }
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target
        if (name === "avatar") {
            handleFileChange(files[0])
            return;
        }
        setFormData({
            ...formData,
            [name]: value
        });
    }

    const validFormData = () => {
        const errors = [];

        if (!formData.first_name.trim()) {
            errors.push("Họ không được để trống");
        }

        if (!formData.last_name.trim()) {
            errors.push("Tên không được để trống");
        }

        if (!formData.gender) {
            errors.push("Vui lòng chọn giới tính");
        }

        if (!formData.phone_number.trim()) {
            errors.push("Số điện thoại không được để trống");
        } else if (!/^\d{9,11}$/.test(formData.phone_number)) {
            errors.push("Số điện thoại không hợp lệ");
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validFormData();
        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            return;
        }

        const form = new FormData();
        form.append("first_name", formData.first_name);
        form.append("last_name", formData.last_name);
        form.append("gender", formData.gender);
        form.append("dob", formData.dob);
        form.append("phone_number", formData.phone_number);

        if (formData.avatar) {
            form.append("image", formData.avatar);
        }

        try {
            setLoading(true);
            setErrors([]);
            const res = await fetch("http://127.0.0.1:8000/users/current_user/", {
                method: "PATCH",
                headers: {
                    ...(token && { Authorization: `Token ${token}` })
                },
                body: form
            });

            const result = await res.json();

            if (!res.ok) {
                const errors = getError(result);
                setErrors(errors);
                return;
            }

            setUser(prev => ({
                ...prev,
                ...result
            }));

            alert("Cập nhật thành công!");
            setOpenModal(false)
        } catch (e) {
            setErrors([e.message || "Có lỗi xảy ra"]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid py-2 animate-fade-in">
            <div className="d-flex align-items-center justify-content-between mb-4">
                <div>
                    <h3 className="fw-bold text-dark mb-1">Thông tin cá nhân</h3>
                    <p className="text-muted small mb-0">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
                </div>
                <button
                    className="btn btn-primary shadow-sm px-4 d-flex align-items-center gap-2 rounded-pill"
                    onClick={() => setOpenModal(true)}
                >
                    <i className="bi bi-pencil-square"></i>
                    Chỉnh sửa hồ sơ
                </button>
            </div>

            <div className="row g-4">
                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm text-center p-4 h-100 rounded-4">
                        <div className="mb-3">
                            <img
                                src={user?.image || "https://via.placeholder.com/120"}
                                alt="Avatar"
                                className="rounded-circle img-thumbnail shadow-sm"
                                style={{ width: "120px", height: "120px", objectFit: "cover" }}
                            />
                        </div>
                        <h5 className="fw-bold mb-1">{user?.first_name + user?.last_name || "Người dùng"}</h5>
                        <span className="badge bg-primary bg-opacity-10 text-primary border border-primary-subtle rounded-pill mb-3 px-3">
                            Thành viên chính thức
                        </span>
                        <div className="d-flex justify-content-center gap-2">
                            <button className="btn btn-outline-secondary btn-sm rounded-circle"><i className="bi bi-facebook"></i></button>
                            <button className="btn btn-outline-secondary btn-sm rounded-circle"><i className="bi bi-envelope-at"></i></button>
                        </div>
                    </div>
                </div>

                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm p-4 h-100 rounded-4">
                        <div className="row g-4">
                            <InfoItem icon="fas fa-user" label="Họ và tên" value={user?.first_name + " " + user?.last_name.trim()} />
                            <InfoItem icon="fas fa-venus-mars" label="Giới tính" value={user?.gender || "Chưa cập nhật"} />
                            <InfoItem
                                icon="fas fa-calendar-day"
                                label="Ngày sinh"
                                value={user?.dob ? new Date(user?.dob).toLocaleDateString('vi-VN') : "Chưa cập nhật"}
                            />
                            <InfoItem icon="fas fa-phone-alt" label="Số điện thoại" value={user?.phone_number || "Chưa cập nhật"} />
                            <InfoItem icon="fas fa-envelope" label="Email" value={user?.email} />
                            <InfoItem icon="fas fa-user-check" label="Trạng thái" value={user?.is_active ? "Đã kích hoạt" : "Chưa kích hoạt"} isSuccess />
                        </div>
                    </div>
                </div>
            </div>

            <BaseModal open={openModal} close={() => setOpenModal(false)}>
                <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">

                    <div className="modal-header border-0 px-4 py-3 bg-light">
                        <h5 className="modal-title fw-bold fs-5 mb-0">
                            Cập nhật thông tin
                        </h5>

                        <button
                            type="button"
                            className="btn-close"
                            onClick={() => setOpenModal(false)}
                        />
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="modal-body p-4">

                            {/* AVATAR */}
                            <div className="text-center mb-4">
                                <div className="position-relative d-inline-block">
                                    <img
                                        src={preview || "https://via.placeholder.com/110"}
                                        alt="Preview"
                                        className="rounded-circle border shadow-sm"
                                        style={{
                                            width: "110px",
                                            height: "110px",
                                            objectFit: "cover"
                                        }}
                                    />

                                    <label
                                        htmlFor="file_name"
                                        className="btn btn-primary btn-sm position-absolute bottom-0 end-0 rounded-circle shadow d-flex align-items-center justify-content-center"
                                        style={{ width: "34px", height: "34px" }}
                                    >
                                        <i className="fas fa-camera"></i>
                                        <input
                                            type="file"
                                            id="file_name"
                                            name="avatar"
                                            className="d-none"
                                            accept="image/*"
                                            onChange={handleChange}
                                        />
                                    </label>
                                </div>

                                <p className="text-muted small mt-2 mb-0">
                                    Dung lượng tối đa 1MB
                                </p>
                            </div>

                            {/* FORM GRID */}
                            <div className="row g-3">

                                {/* HỌ */}
                                <div className="col-md-6">
                                    <label className="form-label small text-muted mb-1">
                                        Họ
                                    </label>

                                    <div className="input-group input-group-lg">
                                        <span className="input-group-text bg-light">
                                            <i className="fas fa-id-card"></i>
                                        </span>

                                        <input
                                            type="text"
                                            name="first_name"
                                            className="form-control shadow-none"
                                            value={formData.first_name}
                                            onChange={handleChange}
                                            placeholder="Nguyễn"
                                        />
                                    </div>
                                </div>

                                {/* TÊN */}
                                <div className="col-md-6">
                                    <label className="form-label small text-muted mb-1">
                                        Tên
                                    </label>

                                    <div className="input-group input-group-lg">
                                        <span className="input-group-text bg-light">
                                            <i className="fas fa-user"></i>
                                        </span>

                                        <input
                                            type="text"
                                            name="last_name"
                                            className="form-control shadow-none"
                                            value={formData.last_name}
                                            onChange={handleChange}
                                            placeholder="Văn An"
                                        />
                                    </div>
                                </div>

                                {/* GIỚI TÍNH */}
                                <div className="col-md-6">
                                    <label className="form-label small text-muted mb-1">
                                        Giới tính
                                    </label>

                                    <div className="input-group input-group-lg">
                                        <span className="input-group-text bg-light">
                                            <i className="fas fa-venus-mars"></i>
                                        </span>

                                        <select
                                            className="form-select shadow-none"
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleChange}
                                        >
                                            <option value="">-- Chọn --</option>
                                            <option value="Nam">Nam</option>
                                            <option value="Nữ">Nữ</option>
                                            <option value="Khác">Khác</option>
                                        </select>
                                    </div>
                                </div>

                                {/* NGÀY SINH */}
                                <div className="col-md-6">
                                    <label className="form-label small text-muted mb-1">
                                        Ngày sinh
                                    </label>

                                    <div className="input-group input-group-lg">
                                        <span className="input-group-text bg-light">
                                            <i className="fas fa-calendar"></i>
                                        </span>

                                        <input
                                            type="date"
                                            name="dob"
                                            className="form-control shadow-none"
                                            value={formData.dob}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                {/* SỐ ĐIỆN THOẠI */}
                                <div className="col-12">
                                    <label className="form-label small text-muted mb-1">
                                        Số điện thoại
                                    </label>

                                    <div className="input-group input-group-lg">
                                        <span className="input-group-text bg-light">
                                            <i className="fas fa-phone"></i>
                                        </span>

                                        <input
                                            type="tel"
                                            name="phone_number"
                                            className="form-control shadow-none"
                                            value={formData.phone_number}
                                            onChange={handleChange}
                                            placeholder="0123456789"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>



                        {errors?.length > 0 && (
                            <div className="alert alert-danger py-2" role="alert">
                                <ul className="mb-0 ps-3">
                                    {errors?.map((err, index) => (
                                        <li key={index}>{err}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        <div className="modal-footer border-top-0 p-4 pt-0">
                            <button type="button" className="btn btn-light px-4 fw-semibold rounded-pill" data-bs-dismiss="modal">Hủy bỏ</button>
                            <button
                                type="submit"
                                className="btn btn-primary px-5 shadow-sm fw-semibold rounded-pill"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" />
                                        Đang lưu...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-save me-2"></i>
                                        Lưu thay đổi
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </BaseModal>

            <style>{`
                .animate-fade-in { animation: fadeIn 0.5s ease-in-out; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
                .form-control:focus, .form-select:focus { border-color: #0d6efd; box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.1); }
            `}</style>
        </div >
    );
}



export default InformationUser;