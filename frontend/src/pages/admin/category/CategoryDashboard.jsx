import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { CategoryListAPI, DeleteCategory } from '../../../services/CategoryAPI';
import { AuthContent } from '../../../utils/AuthContext';
const CategoryDashboard = () => {
    const { token } = useContext(AuthContent)

    const [categories] = CategoryListAPI()

    const handleDelete = async (e, id) => {
        e.preventDefault()
        try {
            const deleteCategory = await DeleteCategory(id, token)
            if (deleteCategory) {
                alert("Xóa thành công")
            }
        } catch (err) {
            console.error("Lỗi", err)
        }
    }
    return (
        <div className='tw-p-6'>
            <div className='tw-flex tw-items-center tw-justify-between tw-mb-6'>
                <h1 className='tw-text-3xl tw-font-bold tw-flex tw-items-center tw-gap-2'>
                    <i className='fa fa-tag'></i>
                    <span>Category</span>
                </h1>
                <Link
                    to='add-category'
                    className='tw-bg-blue-600 hover:tw-bg-red-300 tw-text-white tw-px-4 tw-py-2 tw-rounded-lg tw-flex tw-items-center tw-gap-2 tw-shadow'
                >
                    Add Category
                </Link>
            </div>
            <div className='tw-bg-orange-100 tw-p-6 tw-rounded-2xl tw-shadow-sm'>
                <h2 className='tw-text-xl tw-font-semibold tw-mb-4 tw-text-blue-700'>
                    List Category
                </h2>
                <div className="max-h-[400px] overflow-y-auto">

                    <table className='tw-w-full tw-border-collapse'>
                        <thead>
                            <tr className="bg-yellow-200 text-left text-gray-600">
                                <th className="p-3">ID</th>
                                <th className="p-3">Name</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Create at</th>
                                <th className='p-3'>Lastest update</th>
                                <th className="p-3 text-center">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {categories.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="tw-text-center tw-p-4 tw-text-gray-500 tw-text-sm">
                                        The table has no data
                                    </td>
                                </tr>
                            ) : (
                                categories.map((cate, index) => {
                                    return (
                                        <tr
                                            key={cate.id}
                                            className={`tw-border-b hover:tw-bg-green-100 ${index % 2 === 0 ? "tw-bg-slate-300" : "tw-bg-gray-100"
                                                }`}
                                        >
                                            <td className='tw-p-3 tw-font-medium'>{cate.id}</td>
                                            <td className='tw-p-3'>{cate.name}</td>

                                            <td className='tw-p-3'>
                                                {cate.active ? (
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

                                            <td className='tw-p-3'>
                                                {new Date(cate.created_at).toLocaleDateString()}
                                            </td>

                                            <td className='tw-p-3'>
                                                {cate.updated_at
                                                    ? new Date(cate.updated_at).toLocaleDateString()
                                                    : "-"}
                                            </td>

                                            <td className='tw-p-3 tw-text-center'>
                                                <div className='tw-flex tw-justify-center tw-gap-3'>
                                                    <Link
                                                        to={`edit-category/${cate.id}`}
                                                        className='tw-text-blue-600 hover:tw-text-green-300'
                                                    >
                                                        <i className="fa-solid fa-pen-to-square"></i>
                                                    </Link>

                                                    <button
                                                        className='tw-text-blue-600 hover:tw-text-pink-500'
                                                        onClick={(e) => handleDelete(e, cate.id)}
                                                    >
                                                        <i className='fa fa-trash' />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    );
}

export default CategoryDashboard;
