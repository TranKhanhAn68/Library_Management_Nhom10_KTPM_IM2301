import React, { useContext, useState, useEffect } from "react";
import { AuthContent } from "../utils/AuthContext"

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
    const { user } = useContext(AuthContent);

    // State cho việc hiển thị ảnh preview
    const [preview, setPreview] = useState(user?.image);
    const [formData, setFormData] = useState({});

    // Cập nhật preview khi dữ liệu user từ context thay đổi (quan trọng!)
    useEffect(() => {
        if (user?.image) {
            setPreview(user.image);
        }
    }, [user?.image]);

    // Xử lý thay đổi file
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 1024 * 1024) {
                alert("Kích thước ảnh quá lớn (tối đa 1MB)");
                return;
            }
            setPreview(URL.createObjectURL(file));
            setFormData({ ...formData, avatar: file });
        }
    };

    // Hàm xử lý submit (Thay vì dùng action của form)
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Ở đây bạn sẽ thực hiện gọi API update user
        // console.log("Dữ liệu cần update:", formData);
        alert("Chức năng cập nhật đang được xử lý!");
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
                                                    onChange={handleFileChange}
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
                                                className="form-control form-control-lg fs-6 shadow-none border-start-0"
                                                value={user?.first_name}
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
                                                className="form-control form-control-lg fs-6 shadow-none border-start-0"
                                                value={user?.last_name}
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
                                            <select className="form-select form-control-lg fs-6 shadow-none border-start-0" defaultValue={user?.gender}>
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
                                                className="form-control form-control-lg fs-6 shadow-none border-start-0"
                                                value={user?.dob}
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
                                                className="form-control form-control-lg fs-6 shadow-none border-start-0"
                                                value={user?.phone_number}
                                                placeholder="Nhập số điện thoại mới"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="modal-footer border-top-0 p-4 pt-0">
                                <button type="button" className="btn btn-light px-4 fw-semibold rounded-pill" data-bs-dismiss="modal">Hủy bỏ</button>
                                <button type="submit" className="btn btn-primary px-5 shadow-sm fw-semibold rounded-pill">
                                    <i className="fas fa-save me-2"></i> Lưu thay đổi
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