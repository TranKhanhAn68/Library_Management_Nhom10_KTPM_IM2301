import React from 'react';
import FastLink from '../../components/fast_link/FastLink';
import { Outlet, useOutletContext } from 'react-router-dom';
import Carousel from '../../components/Carousel/Carousel';
import Header from '../../components/header/Header';
const MainPage = () => {
    const {
        books,
        authors,
        currentPage,
        dataBooks,
        goSearch,
        goPage,
        goSearchToCategory,
        goSearchToAuthor,
        setCart
    } = useOutletContext();
    return (
        <div className='container mx-auto'>
            <Carousel />
            <div className='container d-md-flex gap-4 justify-content-between'>
                <FastLink />
                <Outlet context={{
                    books,
                    authors,
                    currentPage,
                    dataBooks,
                    goSearch,
                    goPage,
                    goSearchToCategory,
                    goSearchToAuthor,
                    setCart
                }} />
            </div>
        </div>
    );
}

export default MainPage;