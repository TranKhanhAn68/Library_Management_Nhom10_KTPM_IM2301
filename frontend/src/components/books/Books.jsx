import React, { useEffect, useState } from 'react';
import Card from '../card/Card'
import './books.scss'
import { data, Link, useOutletContext } from 'react-router-dom';
import AuthorData from '../../data/AuthorData';
import { CategoryListAPI } from '../../services/CategoryAPI';
import Pagination from '../Pagination';
import { AuthorListAPI } from '../../services/AuthorAPI';
const Books = () => {
    const { books,
        currentPage,
        dataBooks,
        goPage,
        goSearchToCategory,
        goSearchToAuthor
    } = useOutletContext();
    const [authors] = AuthorListAPI()
    const [categories] = CategoryListAPI()
    const [searchAuthor, setSearchAuthor] = useState("")
    const [filteredAuthor, setFilteredAuthor] = useState([])
    const totalPages = Math.ceil((dataBooks?.count || 0) / 4)

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


    return (
        <div className='book-container mx-auto '>
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
                                {!categories && (<div>Loading...</div>)}
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
                                {!authors && (
                                    <div>Loading...</div>
                                )}
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
                {!dataBooks && (<div>Loading...</div>)}
                <div className="row row-cols-2 row-cols-md-4 g-2 p-1">
                    {books.map(book => (
                        <Card key={book.id} book={book} />
                    ))}
                </div>

                <Pagination currentPage={currentPage}
                    totalPages={totalPages}
                    books={books}
                    goPage={goPage}

                />
            </div>


        </div>
    );
}

export default Books;