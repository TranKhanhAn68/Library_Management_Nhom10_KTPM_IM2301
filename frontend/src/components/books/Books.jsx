import React, { useContext, useEffect, useState } from 'react';
import Card from '../card/Card'
import './books.scss'
import { Link, useOutletContext } from 'react-router-dom';
import Pagination from '../Pagination';
import { SettingListAPI } from '../../services/SettingAPI';
import Loading from '../Loading';
import { AuthContent } from '../../utils/AuthContext';
const Books = () => {
    const { token } = useContext(AuthContent)
    const { books,
        authors,
        categories,
        currentPage,
        dataBooks,
        goPage,
        goSearchToCategory,
        goSearchToAuthor,
        setCart
    } = useOutletContext();
    const [settings] = SettingListAPI(token)
    const [loading, setLoading] = useState(false)
    const [searchAuthor, setSearchAuthor] = useState("")
    const [filteredAuthor, setFilteredAuthor] = useState([])
    const totalPages = Math.ceil((dataBooks?.count || 0) / 8)
    const [defaultSetting, setDefaultSetting] = useState(null)

    useEffect(() => {
        if (!books || books.length === 0) {
            setLoading(true);

            const timer = setTimeout(() => {
                setLoading(false);
            }, 1500);

            return () => clearTimeout(timer);
        }
        else {
            setLoading(false)
        }
    }, [books]);

    useEffect(() => {
        setDefaultSetting(settings[0])
    }, [settings])

    useEffect(() => {
        setFilteredAuthor(authors)
    }, [authors])

    useEffect(() => {
        let filterAuthors = []

        if (searchAuthor.trim().length > 0) {
            filterAuthors = authors.filter(author =>
                author.name.toLowerCase().includes(searchAuthor.toLowerCase()))
        } else {
            filterAuthors = authors
        }
        setFilteredAuthor(filterAuthors)
    }, [searchAuthor, authors])

    const handleSearchAuthor = (e, id) => {
        e.preventDefault()
        goSearchToAuthor(id)
        console.log(id)
    }

    const handleSearchCategory = (e, id) => {
        e.preventDefault()
        goSearchToCategory(id)
    }
    console.log(settings)
    return (
        <div className='book-container mx-auto position-relative'>
            {loading && <Loading loading={loading} />}

            <div className='d-flex justify-content-center gap-4  book-container-header p-3'>

                <div className="dropdown">
                    <button
                        type="button"
                        className="btn btn-primary dropdown-toggle shadow-sm"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        <i class="fa-solid fa-magnifying-glass"></i> Tìm kiếm theo thể loại
                    </button>

                    <ul className="dropdown-menu dropdown-menu-light shadow-lg border-0">
                        <div className="custom-scroll" style={{ maxHeight: "150px", overflowY: "auto" }}>
                            <ul className="list-unstyled mb-0">
                                {categories &&
                                    categories.map(cate => (
                                        <li key={cate.id}>
                                            <button
                                                className="dropdown-item bg-transparent text-dark"
                                                onClick={(e) => handleSearchCategory(e, cate.id)}
                                            >
                                                {cate.name}
                                            </button>
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                    </ul>
                </div>

                <div className="dropdown">
                    <button
                        type="button"
                        className="btn btn-primary dropdown-toggle shadow-sm"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        <i class="fa-solid fa-magnifying-glass"></i> Tìm kiếm theo tác giả
                    </button>

                    <ul className="dropdown-menu dropdown-menu-dark shadow-lg border-0">
                        <li className="p-2">
                            <input
                                type="text"
                                className="form-control form-control-sm bg-secondary text-white border-0"
                                placeholder="Nhập tên tác giả..."
                                onChange={(e) => { setSearchAuthor(e.target.value) }}
                                value={searchAuthor}
                            />
                        </li>
                        <li><hr className="dropdown-divider opacity-50" /></li>

                        <div className="custom-scroll" style={{ maxHeight: "150px", overflowY: "auto" }}>
                            <ul className="list-unstyled mb-0">
                                {filteredAuthor &&
                                    filteredAuthor.map(author => (
                                        <li key={author.id}>
                                            <button
                                                className="dropdown-item bg-transparent text-white"
                                                onClick={(e) => handleSearchAuthor(e, author.id)}
                                            >
                                                {author.name}
                                            </button>
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>

                        <li><hr className="dropdown-divider opacity-50" /></li>
                    </ul>
                </div>
            </div>
            <div className='position-relative' style={{ minHeight: "150px" }}>
                <div className="row row-cols-2 row-cols-md-4 g-2 p-1">
                    {books.map(book => (
                        <Card key={book.id} book={book} setCart={setCart} defaultSetting={defaultSetting} />
                    ))}
                </div>

                <Pagination currentPage={currentPage}
                    totalPages={totalPages}
                    item={books}
                    goPage={goPage}

                />
            </div>


        </div>
    );
}

export default Books;