import React from 'react';
import { Link } from 'react-router-dom';
import MenuHoverDropdown from '../MenuHoverDropdown';

const Menu = ({ openMenuHover, setOpenMenuHover, authors }) => {
    return (
        <ul className="dropdown-menu dropdown-menu-dark p-0 rounded-0 " style={{ minWidth: "200px" }}>
            <li>
                <div className='position-relative'
                    onMouseEnter={() => setOpenMenuHover(true)}
                    onMouseLeave={() => setOpenMenuHover(false)}
                >
                    <Link to='authors' className="dropdown-item px-3 py-2">
                        Tác giả
                    </Link>
                    {openMenuHover &&
                        <MenuHoverDropdown MenuHoverDropdown open={MenuHoverDropdown} >
                            <h1 className='px-3 py-1 fs-1'>DANH SÁCH TÁC GIẢ</h1>
                            <div className="row g-2">
                                {authors.map(author => (
                                    <div className="col-4 px-3 py-1 text-nowrap hover:tw-bg-gray-700" key={author.id}>
                                        <Link
                                            to={`/authors/${author.id}/${encodeURIComponent(author.name)}`}
                                            className="d-block text-white px-2 py-1 "
                                        >
                                            {author.name}
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </MenuHoverDropdown>
                    }
                </div>

            </li>
            <li>
                <Link className="dropdown-item px-3 py-2" to="/featured">
                    Sách nổi bật
                </Link>
            </li>
            <li>
                <Link className="dropdown-item px-3 py-2" to="/new">
                    Sách mới
                </Link>
            </li>
        </ul>
    );
}

export default Menu;
