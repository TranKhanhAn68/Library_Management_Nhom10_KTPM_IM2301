import React, { act, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddCategory = ({ onAdd, categoryID }) => {
    const [name, setName] = useState("");
    const [active, setActive] = useState(true);
    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim() === "")
            return alert("Name can not be empty");
        onAdd({ id: categoryID + 1, categoryID, name, active, created_at: new Date().toISOString().split("T")[0] })
        navigate("/dashboard/categories")
    }
    return (
        <div className='tw-p-6 tw-max-w-md tw-mx-auto tw-bg-yellow-100 tw-rounded-2xl tw-shadow-lg'>
            <h2 className='tw-text-red-800 tw-text-2xl tw-font-bold 
                    tw-mb-6 tw-bg-slate-300 tw-px-4 tw-py-2 tw-rounded-lg tw-flex tw-justify-center tw-shadow'>
                Form Add Category
            </h2>
            <form className='tw-flex tw-flex-col tw-gap-4' onSubmit={handleSubmit}>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder='Nhập vào tên Category'
                    className='tw-border tw-border-gray-400 tw-p-3 tw-rounded-lg focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500'
                />
                <label className='tw-flex tw-items-center tw-gap-2'>
                    <input type='checkbox' checked={active} onChange={e => setActive(e.target.value)} className='tw-w-5 tw-h-5' />
                    Active
                </label>

                <button type='submit' onClick={handleSubmit} className='tw-px-4 tw-py-2 tw-rounded-lg tw-bg-green-500 tw-text-white hover:tw-bg-red-600 transition: tw-colors'>Add Category</button>
                <button type='button' onClick={() => navigate('/dashboard/categories')}
                    className='tw-px-4 tw-py-2 tw-rounded-lg tw-bg-violet-500 tw-text-white hover:tw-bg-pink-600 transition: tw-colors'>Cancel</button>
            </form>
        </div>
    );
}

export default AddCategory;
