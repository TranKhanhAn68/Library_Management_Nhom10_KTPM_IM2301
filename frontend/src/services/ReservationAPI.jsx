import { useEffect, useState } from "react";

const RESERVATION_URL = 'http://127.0.0.1:8000/reservations'

export const ReservationListAPI = (page, token, reload, searchName, searchBookName) => {
    const [data, setData] = useState({})
    const fetchData = async () => {
        try {
            const params = new URLSearchParams()
            params.append('page', page)
            params.append("search", searchName || "")
            params.append("book", searchBookName || "")

            const res = await fetch(`${RESERVATION_URL}/?${params.toString()}`, {
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


export const OrderBookAPI = async (token, orderData) => {
    const res = await fetch(`${RESERVATION_URL}/order/`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Token ${token}` })
        },
        body: JSON.stringify(orderData)
    })
    const data = await res.json();
    if (!res.ok)
        throw data.message
    return data.message
}

export const OrderChangeStatus = async (newStatus, id, token) => {
    const res = await fetch(`${RESERVATION_URL}/${id}/update_status/`, {
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