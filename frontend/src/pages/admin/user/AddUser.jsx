import React, { useContext, useEffect, useState } from 'react';
import { UserListByIDAPI, UpdateUser, PostUser } from '../../../services/UserAPI'; // Giả sử bạn có hàm UpdateUserAPI
import { AuthContent } from '../../../utils/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../../../components/Loading';
import BaseModal from '../../../components/BaseModal';
import { getError } from '../../../utils/GetError';

const AddUser = () => {
    const { id } = useParams();
    const { token } = useContext(AuthContent);
    const [user] = UserListByIDAPI(id, token);

    // 1. Khai báo State
    const [preview, setPreview] = useState('') //Lấy ảnh ban đầu
    const [imageFile, setImageFile] = useState(null) // Lấy ảnh từ máy tính
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [active, setActive] = useState(false);
    const [isStaff, setIsStaff] = useState(false);
    const [isSuperuser, setIsSuperuser] = useState(false);
    const [employeeID, setEmployeeID] = useState('');
    const [shift, setShift] = useState('');
    const [identityCard, setIdentityCard] = useState('');

    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false)
    const [message, setMessage] = useState("")

    const isSuccess = message === "Cập nhật thành công";

    // 2. Đổ dữ liệu từ API vào State khi có dữ liệu user
    useEffect(() => {
        setLoading(false)
    }, []);

    // 3. Hàm xử lý Submits
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData()
        if (imageFile) formData.append('image', imageFile)
        formData.append('email', email);
        formData.append('password', password);
        formData.appent('username', username);
        formData.append('first_name', firstName);
        formData.append('last_name', lastName);
        formData.append('phone_number', phone);
        formData.append('is_active', active);
        formData.append('is_staff', isStaff);
        formData.append('is_superuser', isSuperuser);
        formData.append('employee_id', employeeID);
        formData.append('shift', shift);
        formData.append('identity_card', identityCard);

        setOpenModal(true)
        try {
            setLoading(true)
            const result = await PostUser(token, formData)
            if (result) {
                setMessage(result?.message)
            }
        } catch (err) {
            const error = getError(err)
            setMessage(error)
        } finally {
            setLoading(false)
        }
    };

    const onCancel = () => navigate("/dashboard/users");

    if (loading) return <Loading loading={loading} />;
    return (
        <div className="tw-min-h-screen tw-bg-gray-100 tw-py-10 tw-px-4">
            <div className="tw-max-w-3xl tw-mx-auto">
                {/* Nút Quay lại */}
                <button onClick={onCancel} className="tw-mb-6 tw-flex tw-items-center tw-text-gray-600 hover:tw-text-blue-600 tw-font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" className="tw-h-5 tw-w-5 tw-mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Quay lại danh sách
                </button>

                <div className="tw-bg-white tw-shadow-sm tw-rounded-2xl tw-overflow-hidden">
                    <div className="tw-px-8 tw-py-6 tw-border-b tw-border-gray-100">
                        <h1 className="tw-text-2xl tw-font-bold tw-text-gray-800">Chỉnh sửa người dùng</h1>
                    </div>

                    <form onSubmit={handleSubmit} className="tw-p-8 tw-space-y-8">

                        <div className="tw-flex  tw-flex-col sm:tw-flex-row tw-items-center tw-gap-6">
                            <div className="tw-relative ">
                                <img
                                    src={`${preview}`}
                                    alt="Avatar"
                                    className="tw-w-24 tw-h-24 tw-rounded-full tw-object-cover tw-border-2 tw-border-gray-200"
                                />

                                <label className="tw-absolute  tw-bottom-0 tw-right-0 tw-bg-blue-600 tw-p-2 tw-rounded-full tw-text-white tw-cursor-pointer hover:tw-bg-blue-700 tw-shadow-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="tw-h-4 tw-w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <input
                                        type="file"
                                        className="tw-hidden"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files[0]
                                            if (file) {
                                                setImageFile(file)
                                                setPreview(URL.createObjectURL(file))
                                            }
                                        }}
                                    />
                                </label>

                            </div>

                            <div>

                                <h3 className="tw-font-medium tw-text-gray-700">Ảnh đại diện</h3>

                                <p className="tw-text-xs tw-text-gray-400 tw-mt-1">JPG, GIF hoặc PNG. Tối đa 2MB.</p>

                            </div>

                        </div>
                        <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-6">

                            <div className="tw-flex tw-flex-col tw-gap-2">
                                <label className="tw-text-sm tw-font-semibold tw-text-gray-600">Username</label>
                                <input
                                    type="text"
                                    className="tw-border tw-p-2.5 tw-rounded-lg outline-none"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>

                            <div className="tw-flex tw-flex-col tw-gap-2">
                                <label className="tw-text-sm tw-font-semibold tw-text-gray-600">Password</label>
                                <input
                                    type="text"
                                    className="tw-border tw-p-2.5 tw-rounded-lg outline-none "
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>


                        <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-6">
                            <div className="tw-flex tw-flex-col tw-gap-2">
                                <label className="tw-text-sm tw-font-semibold tw-text-gray-600">Email</label>
                                <input
                                    type="email"
                                    className="tw-border tw-p-2.5 tw-rounded-lg outline-none"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="tw-flex tw-flex-col tw-gap-2">
                                <label className="tw-text-sm tw-font-semibold tw-text-gray-600">Họ</label>
                                <input
                                    type="text"
                                    className="tw-border tw-p-2.5 tw-rounded-lg outline-none"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            </div>

                            <div className="tw-flex tw-flex-col tw-gap-2">
                                <label className="tw-text-sm tw-font-semibold tw-text-gray-600">Tên</label>
                                <input
                                    type="text"
                                    className="tw-border tw-p-2.5 tw-rounded-lg outline-none"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </div>

                            {/* Số điện thoại */}
                            <div className="tw-flex tw-flex-col tw-gap-2">
                                <label className="tw-text-sm tw-font-semibold tw-text-gray-600">Số điện thoại</label>
                                <input
                                    type="text"
                                    className="tw-border tw-p-2.5 tw-rounded-lg outline-none"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Quyền hạn - Sử dụng e.target.checked cho Checkbox */}
                        <div className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-3 tw-gap-4">
                            <label className="tw-flex tw-items-center tw-p-4 tw-border tw-rounded-xl tw-cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={active}
                                    onChange={(e) => setActive(e.target.checked)}
                                    className="tw-w-4 tw-h-4"
                                />
                                <span className="tw-ml-3 tw-text-sm">Kích hoạt</span>
                            </label>

                            <label className="tw-flex tw-items-center tw-p-4 tw-border tw-rounded-xl tw-cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isStaff}
                                    onChange={(e) => setIsStaff(e.target.checked)}
                                    className="tw-w-4 tw-h-4"
                                />
                                <span className="tw-ml-3 tw-text-sm">Nhân viên</span>
                            </label>

                            <label className="tw-flex tw-items-center tw-p-4 tw-border tw-rounded-xl tw-cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isSuperuser}
                                    onChange={(e) => setIsSuperuser(e.target.checked)}
                                    className="tw-w-4 tw-h-4"
                                />
                                <span className="tw-ml-3 tw-text-sm">Quản trị tối cao</span>
                            </label>
                        </div>

                        {/* Các trường dành cho Nhân viên */}
                        {isStaff && (
                            <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-6 tw-bg-blue-50 tw-p-4 tw-rounded-xl">
                                <div className="tw-flex tw-flex-col tw-gap-2">
                                    <label className="tw-text-xs tw-font-bold">Mã nhân viên</label>
                                    <input
                                        type="text"
                                        value={employeeID}
                                        onChange={(e) => setEmployeeID(e.target.value)}
                                        className="tw-border tw-p-2 tw-rounded tw-bg-white"
                                    />
                                </div>
                                <div className="tw-flex tw-flex-col tw-gap-2">
                                    <label className="tw-text-xs tw-font-bold">Ca làm việc</label>
                                    <input
                                        type="text"
                                        value={shift}
                                        onChange={(e) => setShift(e.target.value)}
                                        className="tw-border tw-p-2 tw-rounded tw-bg-white"
                                    />
                                </div>
                                <div className="tw-flex tw-flex-col tw-gap-2">
                                    <label className="tw-text-xs tw-font-bold">CCCD/CMND</label>
                                    <input
                                        type="text"
                                        value={identityCard}
                                        onChange={(e) => setIdentityCard(e.target.value)}
                                        className="tw-border tw-p-2 tw-rounded tw-bg-white"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Nút Hành động */}
                        <div className="tw-flex tw-justify-end tw-gap-4">
                            <button type="button" onClick={onCancel} className="tw-px-6 tw-py-2 tw-border tw-rounded-lg">Hủy</button>
                            <button type="submit" className="tw-px-6 tw-py-2 tw-bg-blue-600 tw-text-white tw-rounded-lg hover:tw-bg-blue-700">Lưu thay đổi</button>
                        </div>
                    </form>
                </div>
            </div>
            <BaseModal open={openModal} close={() => {
                setOpenModal(false)
                if (isSuccess)
                    navigate('/dashboard/users')
            }}
            >
                <div className="tw-p-3 tw-flex tw-items-center tw-justify-center tw-gap-3" style={{ width: "300px" }}>
                    {isSuccess ?
                        <i className="fa-solid fa-circle-check tw-text-green-500 tw-text-lg"></i> :
                        <i class="fa-solid fa-circle-xmark tw-text-red-500 tw-text-lg"></i>
                    }
                    <div>
                        {typeof (message) === "string" && message.trim().length > 0 && message}
                    </div>
                </div>
            </BaseModal>
        </div>
    );
};

export default AddUser;