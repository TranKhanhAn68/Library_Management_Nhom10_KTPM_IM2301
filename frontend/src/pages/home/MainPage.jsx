import React from 'react';
import Navbar from '../../components/header/Header';
import Carousel from '../../components/Carousel/Carousel';
import FastLink from '../../components/fast_link/FastLink';
import { Outlet } from 'react-router-dom';
const MainPage = () => {
    return (
        <>
            <Navbar />
            <Carousel />
            <div className='container-fluid d-md-flex d-block justify-content-around'>
                <FastLink />
                <Outlet />
            </div>
            {/* <Footer /> */}
        </>

    );
}

export default MainPage;