import { useEffect, useState } from "react";

const BORROWING_URL = 'http://127.0.0.1:8000/borrowing'
export const BorrowingBookAPI = async (cart, token) => {
    try {
        const res = await fetch(`${BORROWING_URL}/cart/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Token ${token}` })
            },

            body: JSON.stringify({ cart })
        });

        const data = await res.json();
        return data
    } catch (error) {
        console.log("Lỗi kết nối", error)
        return error
    }
}

export const BorrowListAPI = (page, token, reload) => {
    const [data, setData] = useState({})
    const fetchData = async () => {
        try {
            const res = await fetch(`${BORROWING_URL}/`, {
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
    }, [page, token, reload]);

    return data;
}