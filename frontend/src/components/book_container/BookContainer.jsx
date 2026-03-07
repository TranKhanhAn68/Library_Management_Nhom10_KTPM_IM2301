import React from 'react';
import Card from '../card/Card'
import './book_container.scss'
const BookContainer = () => {
    return (
        <div className='book-container '>
            <div className='d-flex justify-content-center gap-4  book-container-header p-3'>
                <div className="dropdown">
                    <button type="button" className="btn dropdown-toggle" data-bs-toggle="dropdown">
                        Tìm kiếm theo thể loại sách
                    </button>
                    <ul className="dropdown-menu">
                        <li><a className="dropdown-item" href="#">Link 1</a></li>
                        <li><a className="dropdown-item" href="#">Link 2</a></li>
                        <li><a className="dropdown-item" href="#">Link 3</a></li>
                    </ul>
                </div>

                <div className="dropdown">
                    <button type="button" class="btn dropdown-toggle" data-bs-toggle="dropdown">
                        Tìm kiếm theo tác giả
                    </button>
                    <ul className="dropdown-menu">
                        <li><a className="dropdown-item" href="#">Link 1</a></li>
                        <li><a className="dropdown-item" href="#">Link 2</a></li>
                        <li><a className="dropdown-item" href="#">Link 3</a></li>
                    </ul>
                </div>
            </div>

            <div className='d-flex gap-3 flex-wrap p-3 justify-content-center'>
                <Card />
                <Card />
                <Card />
                <Card />
                <Card />
                <Card />
            </div>

        </div>

    );
}

export default BookContainer;
