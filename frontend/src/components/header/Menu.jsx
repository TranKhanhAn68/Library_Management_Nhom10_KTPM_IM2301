import React from 'react';
import { Link } from 'react-router-dom';
import MenuHoverDropdown from '../MenuHoverDropdown';

const Menu = ({ openMenuAuthorHover, setOpenMenuAuthorHover, openMenuCategoryHover, setOpenMenuCategoryHover, authors, categories }) => {
    return (
        <ul className="dropdown-menu dropdown-menu-dark p-0 rounded " style={{ minWidth: "250px" }}>
            <li className='dropdown-item position-relative py-2 '
                onMouseEnter={() => setOpenMenuAuthorHover(true)}
                onMouseLeave={() => setOpenMenuAuthorHover(false)}
            >

                <Link to='authors'
                    className=" py-2 fw-semibold d-flex justify-content-between align-items-center">
                    <span>Tác giả</span>
                    <i class="fa-solid fa-angle-right py-2"></i>

                </Link>
                {openMenuAuthorHover &&
                    <MenuHoverDropdown open={openMenuAuthorHover} >
                        <h1 className='px-3 py-1 fs-1'>DANH SÁCH TÁC GIẢ</h1>
                        <div className="row g-2">
                            {authors?.map((author) => (
                                <div
                                    className="col-6"
                                    key={author.id}
                                >
                                    <Link
                                        to={`/authors/${author.id}/${encodeURIComponent(author.name)}`}
                                        className="d-block px-2 py-1 rounded text-white text-decoration-none hover-bg-secondary"
                                        style={{
                                            transition: "0.2s",
                                        }}
                                    >
                                        {author.name}
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </MenuHoverDropdown>
                }
            </li>
            <li className='dropdown-item py-2'>
                <Link className="py-2 fw-semibold d-flex justify-content-between align-items-center"
                    to="/featured">
                    Sách nổi bật
                </Link>
            </li>

            <li className='dropdown-item position-relative py-2 '
                onMouseEnter={() => setOpenMenuCategoryHover(true)}
                onMouseLeave={() => setOpenMenuCategoryHover(false)}
            >
                <Link className="py-2 fw-semibold d-flex justify-content-between align-items-center" to="#">
                    <span>Thể loại</span>
                    <i className="fa-solid fa-angle-right"></i>
                </Link>

                {openMenuCategoryHover && (
                    <MenuHoverDropdown open={openMenuCategoryHover}>
                        <h6 className="px-3 py-2 fw-bold">DANH SÁCH THỂ LOẠI</h6>

                        <div className="row g-2 px-2 pb-2">
                            {categories?.map((category) => (
                                <div className="col-6" key={category.id}>
                                    <Link
                                        to={`?category_id=${category.id}`}
                                        className="d-block px-2 py-1 rounded text-white text-decoration-none hover-bg-secondary"
                                    >
                                        {category.name}
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </MenuHoverDropdown>
                )}
            </li>

        </ul >
    );
}

export default Menu;
