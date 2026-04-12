import React, { useContext } from 'react';
import { Link, useOutletContext } from 'react-router-dom';

const AuthorsPage = () => {
    const { authors } = useOutletContext()
    return (
        <div className='container my-4'>
            {authors.map(author => (
                <div className='px-4 py-2 border rounded'>

                    <div className="d-flex align-items-start  p-3 gap-3 " >
                        <img
                            src="https://res.cloudinary.com/dm68sunrv/image/upload/v1775370399/users/msoppddmcqs3nt7roh38.png"
                            alt={author.name}
                            className="rounded-circle flex-shrink-0"
                            width="200px"
                        />

                        <div className="flex-grow-1" style={{ minWidth: 0 }}>
                            <div className="fw-bold mb-1 fs-1">{author.name}</div>
                            <div className="text-truncate mb-0">
                                {author.biography}
                            </div>
                        </div>
                    </div>

                    <Link
                        to={`/authors/${author.id}/${encodeURIComponent(author.name)}`}
                        className='text-end tw-text-blue-500 d-block text-decoration-underline hover:tw-text-blue-700'>Xem thêm...</Link>
                </div>
            ))}

        </div>
    );
}

export default AuthorsPage;