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

export const BorrowListAPI = (page, token, reload, searchName, searchBookName) => {
    const [data, setData] = useState({})
    const fetchData = async () => {
        try {
            const params = new URLSearchParams()
            params.append('page', page)
            params.append("search", searchName || "")
            params.append("book", searchBookName || "")

            const res = await fetch(`${BORROWING_URL}/?${params.toString()}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { Authorization: `Token ${token}` })
                },
            });
            console.log(params.toString())

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


export const BorrowChangeStatus = async (newStatus, id, token) => {
    const res = await fetch(`${BORROWING_URL}/${id}/update_status/`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Token ${token}` })
        },

        body: JSON.stringify({
            status: newStatus
        })
    })

    const data = await res.json();
    return {
        status: res.status,
        data
    }
};

export const BorrowChange = async (newNote, id, token) => {
    const res = await fetch(`${BORROWING_URL}/${id}/`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Token ${token}` })
        },

        body: JSON.stringify({
            note: newNote
        })
    })

    const data = await res.json()
    if (!res.ok) {
        throw data
    }
    return {
        status: res.status,
        data
    }
};
