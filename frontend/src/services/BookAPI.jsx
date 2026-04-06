import { useEffect, useState } from "react";
const BOOK_URL = "http://127.0.0.1:8000/books"
export const BookListAPI = (page, q = "", category_id = "", author_id = "") => {

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

            const res = await fetch(`${BOOK_URL}/?${params.toString()}`);

            if (!res.ok) throw new Error("Backend response was not OK!")

            const result = await res.json();
            setData(result);
        } catch (err) {
            console.error("fetch err: ", err);
        }
    };

    useEffect(() => {
        fetchData();
    }, [page, q, category_id, author_id]);

    return data;
};


export const BookIDAPI = (id) => {
    const [book, setBook] = useState(null)
    const fetchData = async () => {
        try {
            const res = await fetch(`${BOOK_URL}/${id}/`)
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
