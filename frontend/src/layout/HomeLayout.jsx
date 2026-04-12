import React, { useContext, useEffect, useState } from 'react';
import Header from '../components/header/Header';
import Carousel from '../components/Carousel/Carousel';
import FastLink from '../components/fast_link/FastLink';
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom';
import { BookListAPI } from '../services/BookAPI';
import { AuthContent } from '../utils/AuthContext';
import { AuthorListAPI } from '../services/AuthorAPI';
const HomeLayout = () => {
    const { token } = useContext(AuthContent)
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = Number(searchParams.get('page') || 1);
    const searchBook = searchParams.get("q") || ""
    const searchCategory = searchParams.get("category_id") || ""
    const searchAuthor = searchParams.get("author_id") || ""
    const dataBooks = BookListAPI(currentPage, searchBook, searchCategory, searchAuthor, token)
    const books = dataBooks?.results || []
    const [authors] = AuthorListAPI(token)
    const [loading, setLoading] = useState(false)
    const [cart, setCart] = useState(() => {
        const cartData = localStorage.getItem("cart")
        if (!cartData)
            return []
        return JSON.parse(cartData)
    });


    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
        console.log("Cart updated:", cart);
    }, [cart]);

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
        if (searchBook.trim().length > 0)
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
            <Header handleSearch={goSearch} searchParams={searchParams} cart={cart} authors={authors} />
            <Outlet context={{
                books,
                authors,
                currentPage,
                dataBooks,
                searchBook,
                cart,
                loading,
                setCart,
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
