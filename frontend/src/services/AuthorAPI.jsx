import { useEffect, useState } from "react";
import { getError } from "../utils/GetError";
const AUTHOR_URL = "http://127.0.0.1:8000/authors"

export const AuthorListAPI = (token, reload) => {
    const [authors, setAuthors] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`${AUTHOR_URL}/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token && { Authorization: `Token ${token}` })
                    },
                });

                const data = await res.json();
                setAuthors(data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchData();
    }, [token, reload]);

    return [authors, setAuthors];
};

export const AuthorByIDAPI = (author_id, token) => {
    const [author, setAuthor] = useState(null)
    const fetchData = async () => {
        try {
            const res = await fetch(`${AUTHOR_URL}/${author_id}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { Authorization: `Token ${token}` })
                },
            })
            const data = await res.json();
            setAuthor(data);
        } catch (err) {
            console.error(err);
        }
    }
    useEffect(() => {
        fetchData()
    }, [author_id, token])

    return [author, setAuthor]
}


export const PostAuthor = async (token, form) => {
    const res = await fetch(`${AUTHOR_URL}/`, {
        method: 'POST',
        headers: {
            ...(token && { Authorization: `Token ${token}` })
        },
        body: form
    })
    const data = await res.json();
    if (!res.ok) {
        const message = getError(data)
        throw message
    }
    return data.message
}

export const DeleteAuthor = async (token, id) => {
    const res = await fetch(`${AUTHOR_URL}/${id}/`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Token ${token}` })
        },
    });

    if (!res.ok) {
        const data = await res.json()
        const error = getError(data)
        throw error
    }
    return true;
}
