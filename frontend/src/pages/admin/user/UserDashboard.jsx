import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BaseModal from '../../../components/BaseModal';
import { BookListAPI } from '../../../services/BookAPI';
import { AuthContent } from '../../../utils/AuthContext';
import Pagination from '../../../components/Pagination';
import { UserListAPI } from '../../../services/UserAPI';
const UserDashboard = () => {
    const { token } = useContext(AuthContent)
    const [currentPage, setCurrentPage] = useState(1)
    const dataUsers = UserListAPI(currentPage, token)
    const users = dataUsers?.results || []
    const [selectedUser, setSelectedUser] = useState(null)
    const totalPages = Math.ceil((dataUsers?.count || 0) / 5)

    const [openModal, setOpenModal] = useState(false)

    const handleSelected = (user) => {
        setSelectedUser(user)
        setOpenModal(true)
    }

    const goPage = (page) => {
        setCurrentPage(page)
    }
    console.log(dataUsers)
    return (
        <div className='tw-p-6'>
            <div className='tw-flex tw-justify-between tw-items-center tw-mb-6'>
                <h1 className='tw-text-3xl tw-font-bold tw-bg-gradient-to-r tw-from-blue-600 tw-to-cyan-500 tw-text-transparent tw-bg-clip-text tw-flex tw-items-center tw-gap-2'>
                    <i className='fa-regular fa-user tw-text-blue-600'></i>
                    Quản lý User
                </h1>

                <Link to="add-user"
                    className='tw-bg-green-500 hover:tw-bg-green-600 tw-text-white tw-px-4 tw-py-2 tw-rounded'>
                    Thêm User
                </Link>
            </div>

            <table className='tw-w-full tw-bg-green-200 tw-border-collapse tw-shadow tw-rounded-2xl tw-shadow-sm overflow-hidden'>
                <thead>
                    <tr className='tw-bg-green-400 tw-text-center tw-text-red-500'>
                        <th className='tw-p-3'>ID</th>
                        <th className='tw-p-3'>First name</th>
                        <th className='tw-p-3'>Last name</th>
                        <th className='tw-p-3'>Last login</th>
                        <th className='tw-p-3'>Active</th>
                        <th className='tw-p-3'>Detail</th>
                        <th className='tw-p-3'>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {users?.length === 0 ? (
                        <tr>
                            <td colSpan={7} className='text-center tw-px-4 tw-py-2'>
                                <small className='tw-text-center tw-text-gray-500 '>Không có dữ liệu</small>
                            </td>
                        </tr>
                    ) : (
                        users.map(user => (
                            <tr key={user.id} className='border-b tw-text-center '>
                                <td className='tw-p-3'>{user.id}</td>
                                <td className='tw-flex tw-gap-3 tw-p-3 tw-items-center'>
                                    <img src={user.image} alt={user.name} className="tw-w-16 tw-h-20 tw-object-cover " />
                                    <div>
                                        {user.first_name}
                                    </div>
                                </td>
                                <td>{user.last_name}</td>
                                <td>{user.last_login
                                    ? new Date(user.last_login).toLocaleString('vi-VN')
                                    : "Chưa từng đăng nhập"}</td>
                                <td className='tw-p-3'>
                                    {user.is_active ? (
                                        <span className='tw-text-green-600 tw-flex tw-items-center tw-gap-1'>
                                            <i className='fa fa-toggle-on'></i>
                                            <span>Active</span>
                                        </span>
                                    ) : (
                                        <span className='tw-text-red-600 tw-flex tw-items-center tw-gap-1'>
                                            <i className='fa fa-toggle-off'></i>
                                            <span>Inactive</span>
                                        </span>
                                    )}
                                </td>
                                <td>
                                    <button onClick={() => handleSelected(user)} class="tw-bg-cyan-500 hover:tw-bg-cyan-700 tw-text-white tw-font-bold 
                                tw-py-2 tw-px-4 rounded">
                                        Xem chi tiết
                                    </button>

                                </td>

                                <td className='tw-p-3 tw-text-center'>
                                    <div className='tw-flex tw-justify-center tw-gap-3'>
                                        <Link
                                            to={`edit-user/${user.id}`}
                                            className='tw-text-blue-600 hover:tw-text-green-300'
                                        >
                                            <i className="fa-solid fa-pen-to-square"></i>
                                        </Link>

                                        <button
                                            className='tw-text-blue-600 hover:tw-text-pink-500'
                                            onClick={() => onDelete(user)}
                                        >
                                            <i className='fa fa-trash' />
                                        </button>
                                    </div>
                                </td>
                            </tr>

                        ))
                    )}


                </tbody>


            </table>
            {/* pagination */}
            <Pagination currentPage={currentPage}
                totalPages={totalPages}
                item={users}
                goPage={goPage}

            />

            {
                selectedUser && (
                    <BaseModal open={openModal} close={() => setOpenModal(false)}>
                        <div className='tw-container tw-p-4'>
                            {/* Header */}
                            <div className="tw-flex tw-justify-between tw-items-center tw-mb-6">
                                <h2 className="tw-text-xl tw-font-bold tw-text-gray-800">Chi tiết người dùng</h2>
                                <button
                                    onClick={() => setOpenModal(false)}
                                    className="tw-text-gray-500 hover:tw-text-black tw-transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="tw-h-6 tw-w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="tw-flex tw-flex-col md:tw-flex-row tw-gap-6">
                                {/* Avatar/Image */}
                                <div className="tw-flex-shrink-0">
                                    <img
                                        src={selectedUser.image || 'https://via.placeholder.com/150'}
                                        alt={selectedUser.username}
                                        className="tw-w-40 tw-h-40 tw-object-cover tw-rounded-xl tw-border-2 tw-border-gray-100 tw-shadow-sm"
                                    />
                                </div>

                                {/* Info List */}
                                <div className="tw-flex-1 tw-space-y-3 tw-text-sm">
                                    <p className="tw-text-lg tw-font-bold tw-text-blue-600 tw-mb-2">
                                        @{selectedUser.username}
                                    </p>

                                    <p><b className="tw-text-gray-700">Họ và tên:</b> {`${selectedUser.first_name} ${selectedUser.last_name}`}</p>
                                    <p><b className="tw-text-gray-700">Email:</b> {selectedUser.email}</p>
                                    <p><b className="tw-text-gray-700">Số điện thoại:</b> {selectedUser.phone_number || "Chưa cập nhật"}</p>

                                    <div className="tw-grid tw-grid-cols-2 tw-gap-2 tw-py-2">
                                        <p>
                                            <b className="tw-text-gray-700">Trạng thái: </b>
                                            <span className={selectedUser.is_active ? "tw-text-green-600 tw-font-semibold" : "tw-text-red-500 tw-font-semibold"}>
                                                {selectedUser.is_active ? "Đang hoạt động" : "Bị khóa"}
                                            </span>
                                        </p>
                                        <p>
                                            <b className="tw-text-gray-700">Loại tài khoản: </b>
                                            <span className="tw-text-indigo-600">
                                                {selectedUser.is_superuser ? "Admin" : (selectedUser.is_staff ? "Nhân viên" : "Người dùng")}
                                            </span>
                                        </p>
                                    </div>

                                    <div className="tw-border-t tw-pt-3 tw-space-y-2 tw-text-gray-500 tw-text-xs">
                                        <p>
                                            <b>Ngày tham gia:</b>{" "}
                                            {new Date(selectedUser.date_joined).toLocaleString('vi-VN')}
                                        </p>
                                        <p>
                                            <b>Lần cuối đăng nhập:</b>{" "}
                                            {selectedUser.last_login
                                                ? new Date(selectedUser.last_login).toLocaleString('vi-VN')
                                                : "Chưa từng đăng nhập"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Phần bổ sung nếu cần (giống description trong mẫu của bạn) */}
                            <div className="tw-mt-6 tw-p-4 tw-bg-gray-50 tw-rounded-lg">
                                <p className="tw-font-semibold tw-text-sm tw-text-gray-700">Ghi chú hệ thống:</p>
                                <p className="tw-text-gray-600 tw-text-xs tw-mt-1">
                                    Tài khoản này được tạo tự động bởi hệ thống quản lý.
                                    ID định danh duy nhất: <span className="tw-font-mono tw-text-blue-500">{selectedUser.id}</span>
                                </p>
                            </div>
                        </div>
                    </BaseModal>
                )
            }
        </div>


    );
}

export default UserDashboard;
