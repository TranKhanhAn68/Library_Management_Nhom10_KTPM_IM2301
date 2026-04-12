import { useEffect, useState } from "react";
const BOOK_URL = "http://127.0.0.1:8000/books"
export const BookListAPI = (page, q = "", category_id = "", author_id = "", token, reload) => {

    const [data, setData] = useState({})
    const fetchData = async () => {
        try {
            const params = new URLSearchParams()

            if (page)
                params.append("page", page)

            if (author_id) {
                params.append("author_id", author_id)
            } else {

                if (q)
                    params.append("q", q)

                if (category_id)
                    params.append("category_id", category_id)
            }

            const res = await fetch(`${BOOK_URL}/?${params.toString()}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { Authorization: `Token ${token}` })
                },
            });

            if (!res.ok) throw new Error('Fetch failed')

            const data = await res.json();
            setData(data);
        } catch (err) {
            console.error("fetch err: ", err);
        }
    };

    useEffect(() => {
        fetchData();
    }, [page, q, category_id, author_id, token, reload]);

    return data;
};


export const BookIDAPI = (id, token) => {
    const [book, setBook] = useState(null)
    const fetchData = async () => {
        try {
            const res = await fetch(`${BOOK_URL}/${id}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',

                    ...(token && { Authorization: `Token ${token}` })
                }
            })

            if (!res.ok) throw new Error("Backend response was not OK!")
            const result = await res.json()
            setBook(result)
        } catch (err) {
            console.error("fetch err: ", err);
        }
    }
    useEffect(() => {
        fetchData();
    }, [id]);

    return book;
}

export const UpdateBook = async (token, id, formData) => {
    const res = await fetch(`${BOOK_URL}/${id}/`, {
        method: 'PATCH',
        headers: {
            ...(token && { Authorization: `Token ${token}` })
        },
        body: formData
    })
    const data = await res.json()
    console.log("DATA:", data);

    if (!res.ok) {
        throw data
    }
    return data
}

export const PostBook = async (token, formData) => {
    const res = await fetch(`${BOOK_URL}/`, {
        method: 'POST',
        headers: {
            ...(token && { Authorization: `Token ${token}` })
        },
        body: formData
    })
    const data = await res.json()
    if (!res.ok) {
        throw data
    }
    return data
}

export const DeleteBook = async (id, token) => {
    const res = await fetch(`${BOOK_URL}/${id}/`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Token ${token}` })
        },
    })
    const data = await res.json();
    if (!res.ok) throw data

    return data;
}