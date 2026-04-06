import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EditBook = ({ books }) => {
    const { id } = useParams();
    const book = books.find(b => b.id === parseInt(id));
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [image, setImage] = useState("")
    const [categoryId, setCategoryId] = useState("")
    const [availableQuantity, setAvailableQuantity] = useState("")
    const [totalQuantity, setTotalQuantity] = useState("")
    const [bookId, setBookId] = useState("")
    const [active, setActive] = useState(false)
    const navigate = useNavigate();

    useEffect(() => {
        if (book) {
            setName(book.name);
            setDescription(book.description);
            setImage(book.image);
            setCategoryId(book.category_id);
            setAvailableQuantity(book.available_quantity);
            setTotalQuantity(book.total_quantity);
            setBookId(book.book_id);
            setActive(book.active);
        }
    }, [book])
    const handleSubmit = (e) => {
        e.preventDefault();
        onEdit({ ...cate, name, active, updated_at: new Date().toISOString().split("T")[0] });
        navigate("/dashboard/categories")
    }
    return (
        <div className='tw-p-6 tw-max-w-md tw-mx-auto tw-bg-pink-300 tw-rounded-2xl tw-shadow-lg'>
            <h2 className='tw-text-red-800 tw-text-2xl tw-font-bold 
                tw-mb-6 tw-bg-blue-200 tw-px-4 tw-py-2 tw-rounded-lg tw-flex tw-justify-center tw-shadow'>
                Form Add Book
            </h2>

            <form className='tw-flex tw-flex-col tw-gap-4' onSubmit={handleSubmit}>

                <input type="text" placeholder="Book name"
                    value={name} onChange={e => setName(e.target.value)}
                    className='tw-border tw-p-3 tw-rounded-lg' />

                <textarea placeholder="Description"
                    value={description} onChange={e => setDescription(e.target.value)}
                    className='tw-border tw-p-3 tw-rounded-lg' />

                <input type="text" placeholder="Image URL"
                    value={image} onChange={e => setImage(e.target.value)}
                    className='tw-border tw-p-3 tw-rounded-lg' />

                <input type="text" placeholder="Book ID (BK-0001)"
                    value={bookId} onChange={e => setBookId(e.target.value)}
                    className='tw-border tw-p-3 tw-rounded-lg' />

                <input type="number" placeholder="Category ID"
                    value={categoryId} onChange={e => setCategoryId(e.target.value)}
                    className='tw-border tw-p-3 tw-rounded-lg' />

                <input type="number" placeholder="Available Quantity"
                    value={availableQuantity} onChange={e => setAvailableQuantity(e.target.value)}
                    className='tw-border tw-p-3 tw-rounded-lg' />

                <input type="number" placeholder="Total Quantity"
                    value={totalQuantity} onChange={e => setTotalQuantity(e.target.value)}
                    className='tw-border tw-p-3 tw-rounded-lg' />

                <label className='tw-flex tw-items-center tw-gap-2'>
                    <input type='checkbox'
                        checked={active}
                        onChange={e => setActive(e.target.checked)}
                    />
                    Active
                </label>

                <button type='submit'
                    className='tw-px-4 tw-py-2 tw-rounded-lg 
                        tw-bg-red-500 tw-text-white 
                        hover:tw-bg-red-600 
                        tw-transition-colors'
                    onClick={() => { }}
                >
                    Add Book
                </button>

                <button type='button'
                    onClick={() => navigate('/dashboard/books')}
                    className='tw-px-4 tw-py-2 tw-rounded-lg 
                        tw-bg-gray-200 tw-text-gray-700 
                        hover:tw-bg-gray-300 
                        tw-transition-colors'
                >
                    Cancel
                </button>

            </form>
        </div>
    );
}

export default EditBook;
