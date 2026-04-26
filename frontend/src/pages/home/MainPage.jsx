import React from 'react';
import FastLink from '../../components/fast_link/FastLink';
import { Outlet, useOutletContext } from 'react-router-dom';
import Carousel from '../../components/Carousel/Carousel';
import Header from '../../components/header/Header';
const MainPage = () => {
    const {
        books,
        authors,
        categories,
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
            <div className="container">
                <div className="row g-4">

                    {/* Sidebar */}
                    <div className="col-12 col-md-3">
                        <FastLink />
                    </div>

                    {/* Content */}
                    <div className="col-12 col-md-9">
                        <Outlet
                            context={{
                                books,
                                authors,
                                categories,
                                currentPage,
                                dataBooks,
                                goSearch,
                                goPage,
                                goSearchToCategory,
                                goSearchToAuthor,
                                setCart
                            }}
                        />
                    </div>

                </div>
            </div>
        </div>
    );
}

export default MainPage;