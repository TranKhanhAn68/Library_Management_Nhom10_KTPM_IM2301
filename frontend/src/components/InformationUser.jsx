import React, { useContext, useState, useEffect } from "react";
import { AuthContent } from "../utils/AuthContext"
import { getError } from "../utils/GetError";

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
    const [message, setMessage] = useState("")
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
            if (file.size > 1024 * 1024) {
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
            setMessage("");
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
            setMessage("");

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

            setMessage("Cập nhật thành công!");

        } catch (e) {
            setErrors([e.message || "Có lỗi xảy ra"]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid py-2 animate-fade-in">
            {/* HEADER SECTION */}
            <div className="d-flex align-items-center justify-content-between mb-4">
                <div>
                    <h3 className="fw-bold text-dark mb-1">Thông tin cá nhân</h3>
                    <p className="text-muted small mb-0">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
                </div>
                <button
                    className="btn btn-primary shadow-sm px-4 d-flex align-items-center gap-2 rounded-pill"
                    data-bs-toggle="modal"
                    data-bs-target="#editProfileModal"
                >
                    <i className="bi bi-pencil-square"></i>
                    Chỉnh sửa hồ sơ
                </button>
            </div>

            {/* INFO CARD */}
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
                            <InfoItem icon="fas fa-user" label="Họ và tên" value={user?.first_name + " " + user?.last_name} />
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

            {/* MODAL CHỈNH SỬA */}
            <div className="modal fade" id="editProfileModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content border-0 shadow-lg rounded-4">
                        <div className="modal-header border-bottom-0 pt-4 px-4">
                            <h5 className="modal-title fw-bold fs-4">Cập nhật thông tin</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="modal-body p-4">
                                <div className="row g-3">
                                    {/* 1. Upload Avatar Section */}
                                    <div className="col-12 text-center mb-3">
                                        <div className="position-relative d-inline-block">
                                            <img
                                                src={preview || "https://via.placeholder.com/110"}
                                                className="rounded-circle border shadow-sm"
                                                style={{ width: "110px", height: "110px", objectFit: "cover" }}
                                                alt="Preview"
                                            />
                                            <label
                                                htmlFor="file_name"
                                                className="btn btn-sm btn-primary position-absolute bottom-0 end-0 rounded-circle shadow-sm d-flex align-items-center justify-content-center"
                                                style={{ width: "32px", height: "32px" }}
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
                                        <p className="text-muted small mt-2 mb-0">Dung lượng file tối đa 1MB.</p>
                                    </div>

                                    {/* 2. Họ và Tên - Tách riêng để dễ quản lý dữ liệu */}
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold text-secondary small">Họ</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light border-end-0 text-muted">
                                                <i className="fas fa-address-card"></i>
                                            </span>
                                            <input
                                                type="text"
                                                name="first_name"
                                                className="form-control form-control-lg fs-6 shadow-none border-start-0"
                                                value={formData.first_name}
                                                onChange={handleChange}
                                                placeholder="VD: Nguyễn"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold text-secondary small">Tên</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light border-end-0 text-muted">
                                                <i className="fas fa-user"></i>
                                            </span>
                                            <input
                                                type="text"
                                                name="last_name"
                                                className="form-control form-control-lg fs-6 shadow-none border-start-0"
                                                value={formData.last_name}
                                                onChange={handleChange}
                                                placeholder="VD: Văn An"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* 3. Giới tính */}
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold text-secondary small">Giới tính</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light border-end-0 text-muted">
                                                <i className="fas fa-venus-mars"></i>
                                            </span>
                                            <select className="form-select form-control-lg fs-6 shadow-none border-start-0"
                                                value={formData.gender} onChange={handleChange}
                                                name="gender"
                                            >
                                                <option value="" disabled>-- Chọn giới tính --</option>
                                                <option value="Nam">Nam</option>
                                                <option value="Nữ">Nữ</option>
                                                <option value="Khác">Khác</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* 4. Ngày sinh */}
                                    <div className="col-md-6">
                                        <label className="form-label fw-semibold text-secondary small">Ngày sinh</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light border-end-0 text-muted">
                                                <i className="fas fa-calendar-alt"></i>
                                            </span>
                                            <input
                                                type="date"
                                                name="dob"
                                                className="form-control form-control-lg fs-6 shadow-none border-start-0"
                                                value={formData.dob}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    {/* 5. Số điện thoại */}
                                    <div className="col-12">
                                        <label className="form-label fw-semibold text-secondary small">Số điện thoại</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light border-end-0 text-muted">
                                                <i className="fas fa-phone-alt"></i>
                                            </span>
                                            <input
                                                type="tel"
                                                name="phone_number"
                                                className="form-control form-control-lg fs-6 shadow-none border-start-0"
                                                value={formData.phone_number}
                                                onChange={handleChange}
                                                placeholder="Nhập số điện thoại mới"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {message && (
                                <div className="alert alert-success py-2">
                                    {message}
                                </div>
                            )}

                            {errors?.length > 0 && (
                                <div className="alert alert-danger py-2">
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
                </div>
            </div>

            <style>{`
                .animate-fade-in { animation: fadeIn 0.5s ease-in-out; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
                .form-control:focus, .form-select:focus { border-color: #0d6efd; box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.1); }
            `}</style>
        </div>
    );
}



export default InformationUser;