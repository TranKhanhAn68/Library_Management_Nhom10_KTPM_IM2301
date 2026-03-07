import React from 'react';
import logo from '../../assets/logo.png'
const Carousel = () => {
    return (
        <div id="demo" class="carousel slide container rounded-2" data-bs-ride="carousel">

            <div class="carousel-indicators">
                <button type="button" data-bs-target="#demo" data-bs-slide-to="0" class="active"></button>
                <button type="button" data-bs-target="#demo" data-bs-slide-to="1"></button>
                <button type="button" data-bs-target="#demo" data-bs-slide-to="2"></button>
            </div>

            <div class="carousel-inner">
                <div class="carousel-item active">
                    <img src={logo} alt="Los Angeles" class="d-block w-50" />
                </div>
                <div class="carousel-item">
                    <img src={logo} alt="Chicago" class="d-block w-50" />
                </div>
                <div class="carousel-item">
                    <img src={logo} alt="New York" class="d-block w-50" />
                </div>
            </div>

            <button class="carousel-control-prev" type="button" data-bs-target="#demo" data-bs-slide="prev">
                <span class="carousel-control-prev-icon"></span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#demo" data-bs-slide="next">
                <span class="carousel-control-next-icon"></span>
            </button>
        </div>
    );
}

export default Carousel;
