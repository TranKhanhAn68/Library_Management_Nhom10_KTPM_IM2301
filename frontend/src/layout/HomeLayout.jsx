import React, { useContext, useEffect, useMemo, useState } from 'react';
import Header from '../components/header/Header';
import Carousel from '../components/Carousel/Carousel';
import FastLink from '../components/fast_link/FastLink';
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom';
import { BookListAPI } from '../services/BookAPI';
import { AuthContent } from '../utils/AuthContext';
const HomeLayout = () => {
    const { user } = useContext(AuthContent)
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = Number(searchParams.get('page') || 1);
    const searchBook = searchParams.get("q") || ""
    const searchCategory = searchParams.get("category_id") || ""
    const searchAuthor = searchParams.get("author_id") || ""
    const dataBooks = BookListAPI(currentPage, searchBook, searchCategory, searchAuthor)
    const books = dataBooks?.results || []


    const goPage = (page) => {
        let params = { page: page }
        if (searchBook.trim().length > 0)
            params = { ...params, q: searchBook }

        if (searchCategory)
            params = { ...params, category_id: searchCategory }

        if (searchAuthor)
            params = { page: page, author_id: searchAuthor }

        setSearchParams(params)
    }

    const goSearch = (value) => {
        setSearchParams({ page: 1, q: value })
    }

    const goSearchToCategory = (id) => {
        let params = { page: 1, category_id: id }
        if (searchBook.trim.length > 0)
            params = { ...params, q: searchBook }
        setSearchParams(params)
    }

    const goSearchToAuthor = (id) => {
        setSearchParams({
            page: 1,
            author_id: id
        })
    }

    return (
        <div>
            <Header handleSearch={goSearch} searchParams={searchParams} />
            <Outlet context={{
                books,
                currentPage,
                dataBooks,
                searchBook,
                goSearch,
                goPage,
                goSearchToCategory,
                goSearchToAuthor
            }} />
            {/* <Footer /> */}
        </div>
    );
}

export default HomeLayout;
