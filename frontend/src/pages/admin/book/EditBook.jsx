import { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { AuthContent } from "../../../utils/AuthContext"
import { BookIDAPI, UpdateBook } from "../../../services/BookAPI"
import { AuthorListAPI } from "../../../services/AuthorAPI"
import { PublisherListAPI } from "../../../services/PublisherAPI"
import { CategoryListAPI } from "../../../services/CategoryAPI"
import Loading from "../../../components/Loading"
import { getError } from "../../../utils/GetError"
import BaseModal from "../../../components/BaseModal"

const EditBook = () => {
    const navigate = useNavigate()
    const { token } = useContext(AuthContent)
    const { id } = useParams()

    const book = BookIDAPI(id, token)
    const [authors] = AuthorListAPI(token)
    const [publishers] = PublisherListAPI(token)
    const [categories] = CategoryListAPI(token)

    // form state
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [imageFile, setImageFile] = useState(null)
    const [preview, setPreview] = useState("")
    const [categoryId, setCategoryId] = useState("")
    const [authorId, setAuthorId] = useState("")
    const [publisherId, setPublisherId] = useState("")
    const [bookCode, setBookCode] = useState("")
    const [totalQuantity, setTotalQuantity] = useState("")
    const [active, setActive] = useState(false)

    const [loading, setLoading] = useState(true)
    const [openModal, setOpenModal] = useState(false)
    const [message, setMessage] = useState("")
    const [isSuccess, setIsSuccess] = useState(false)

    // fill data
    useEffect(() => {
        if (book && authors && publishers && categories) {
            setName(book.name || "")
            setDescription(book.description || "")
            setCategoryId(book.category?.id || "")
            setAuthorId(book.author?.id || "")
            setPublisherId(book.publisher?.id || "")
            setTotalQuantity(book.total_quantity || "")
            setBookCode(book.book_id || "")
            setActive(book.active || false)
            setPreview(book.image || "")

            setLoading(false)
        }
    }, [book, authors, publishers, categories])

    const handleSubmit = async (e) => {
        e.preventDefault()

        const formData = new FormData()

        formData.append("name", name)
        formData.append("description", description)
        formData.append("category_id", Number(categoryId))
        formData.append("author_id", Number(authorId))
        formData.append("publisher_id", Number(publisherId))
        formData.append("book_id", bookCode)
        formData.append("total_quantity", Number(totalQuantity))
        formData.append("active", active ? 1 : 0)

        if (imageFile) {
            formData.append("image", imageFile)
        }

        // debug FormData

        try {
            setLoading(true)
            const result = await UpdateBook(token, id, formData)
            if (result) {
                setMessage(result?.message)
                setOpenModal(true)
                setIsSuccess(true)
            }
        } catch (err) {
            const error = getError(err)
            setMessage(error)
            setOpenModal(true)
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <Loading loading={loading} />

    return (
        <div className='tw-p-6 tw-max-w-md tw-mx-auto tw-bg-pink-300 tw-rounded-2xl tw-shadow-lg'>
            <h2 className='tw-text-2xl tw-font-bold tw-mb-6 tw-flex tw-justify-center'>
                Cập nhật sách
            </h2>

            <form className='tw-flex tw-flex-col tw-gap-4' onSubmit={handleSubmit}>

                <input
                    type="text"
                    placeholder="Tên sách"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className='tw-border tw-p-3 tw-rounded-lg'
                />

                <textarea
                    placeholder="Mô tả"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className='tw-border tw-p-3 tw-rounded-lg'
                />

                {/* IMAGE */}
                <label className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-w-full tw-py-4 tw-border tw-border-dashed tw-border-gray-400 tw-rounded-xl tw-cursor-pointer tw-bg-gray-50 hover:tw-bg-gray-100 tw-transition-all ">
                    <svg className="tw-w-12 tw-h-12 tw-text-gray-400 tw-mb-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" >
                        <path d="M12 9a3.75 3.75 0 1 0 0 7.5A3.75 3.75 0 0 0 12 9Z" />
                        <path fillRule="evenodd" d="M9.344 3.071a49.52 49.52 0 0 1 5.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 0 1-3 3h-15a3 3 0 0 1-3-3V9.574c0-1.416.997-2.67 2.429-2.909.382-.064.766-.123 1.151-.178a1.56 1.56 0 0 0 1.11-.71l.822-1.315a2.942 2.942 0 0 1 2.332-1.39ZM6.75 12.75a5.25 5.25 0 1 1 10.5 0 5.25 5.25 0 0 1-10.5 0Zm12-1.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
                    </svg>
                    <span className="tw-text-sm tw-text-gray-600">
                        {imageFile ? imageFile.name : "Nhấn để chọn tệp"}
                    </span>
                    <input
                        type="file"
                        className="tw-hidden"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files[0]
                            if (file) {
                                setImageFile(e.target.files[0])
                                setPreview(URL.createObjectURL(file))
                                e.target.value = ""
                            }
                        }} />
                </label>

                {preview && (
                    <div className="tw-relative tw-inline-block tw-w-fit tw-h-fit">
                        <img src={preview} className="tw-w-24 tw-h-24 tw-rounded-xl tw-object-cover tw-border" />
                        <button
                            className="tw-absolute tw-top-0 tw-right-0 tw-w-6 tw-h-6 tw-bg-white tw-rounded-full tw-flex tw-items-center tw-justify-center tw-shadow"
                            onClick={() => {
                                setPreview(null)
                                setImageFile(null)
                            }}
                        >
                            <i className="fa-solid fa-circle-xmark tw-text-red-500"></i>
                        </button>
                    </div>)}

                {/* BOOK CODE */}
                <input
                    type="text"
                    placeholder="Mã sách"
                    value={bookCode}
                    onChange={e => setBookCode(e.target.value)}
                    className='tw-border tw-p-3 tw-rounded-lg'
                />

                {/* QUANTITY */}
                <input
                    type="number"
                    placeholder="Tổng số lượng"
                    value={totalQuantity}
                    onChange={e => setTotalQuantity(e.target.value)}
                    className='tw-border tw-p-3 tw-rounded-lg'
                />


                {/* CATEGORY */}
                <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className='tw-border tw-p-3 tw-rounded-lg'
                >
                    <option value="" disabled>Chọn danh mục</option>
                    {categories?.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>

                {/* AUTHOR */}
                <select
                    value={authorId}
                    onChange={(e) => setAuthorId(e.target.value)}
                    className='tw-border tw-p-3 tw-rounded-lg'
                >
                    <option value="" disabled>Chọn tác giả</option>
                    {authors?.map(a => (
                        <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                </select>

                {/* PUBLISHER */}
                <select
                    value={publisherId}
                    onChange={(e) => setPublisherId(e.target.value)}
                    className='tw-border tw-p-3 tw-rounded-lg'
                >
                    <option value="" disabled>Chọn nhà xuất bản</option>
                    {publishers?.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                </select>

                {/* ACTIVE */}
                <label className="tw-flex tw-items-center tw-gap-2">
                    <input
                        type="checkbox"
                        checked={active}
                        onChange={e => setActive(e.target.checked)}
                    />
                    Kích hoạt
                </label>

                <button
                    type="submit"
                    className='tw-bg-red-500 tw-text-white tw-p-3 tw-rounded-lg'
                >
                    Lưu
                </button>

                <button
                    type="button"
                    onClick={() => navigate("/dashboard/books")}
                    className='tw-bg-gray-300 tw-p-3 tw-rounded-lg'
                >
                    Hủy
                </button>
            </form>

            <BaseModal open={openModal} close={() => {
                setOpenModal(false)
                if (isSuccess)
                    navigate('/dashboard/books')
            }}>
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
    )
}

export default EditBook