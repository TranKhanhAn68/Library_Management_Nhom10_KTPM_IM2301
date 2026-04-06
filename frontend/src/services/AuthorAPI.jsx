import { useEffect, useState } from "react";
const CATE_URL = "http://127.0.0.1:8000/authors"
export const AuthorListAPI = () => {
    const [authors, setauthors] = useState([])
    const fetchData = async () => {
        try {
            const res = await fetch(`${CATE_URL}/`);
            const data = await res.json();
            setauthors(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return [authors, setauthors];
};

export const AuthorByIDAPI = (author_id) => {
    const [Author, setAuthor] = useState(null)
    const fetchData = async () => {
        try {
            const res = await fetch(`${CATE_URL}/${cate_id}/`);
            const data = await res.json();
            setAuthor(data);
        } catch (err) {
            console.error(err);
        }
    }
    useEffect(() => {
        fetchData()
    }, [author_id])

    return [category, setCategory]
}
