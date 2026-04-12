import { useEffect, useState } from "react";
const AUTHOR_URL = "http://127.0.0.1:8000/authors"
export const AuthorListAPI = (token) => {
    const [authors, setAuthors] = useState([])
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

    useEffect(() => {
        fetchData();
    }, [token]);

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
