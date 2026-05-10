import { useEffect, useState } from "react";
import { getError } from "../utils/GetError";

const PUBLISHER_URL = "http://127.0.0.1:8000/publishers"
export const PublisherListAPI = (token, reload) => {
    const [publishers, setPublishers] = useState([])
    const fetchData = async () => {
        try {
            const res = await fetch(`${PUBLISHER_URL}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { Authorization: `Token ${token}` })
                },
            });

            if (!res.ok) {
                throw new Error('Fetch failed');
            }
            const data = await res.json();
            setPublishers(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, [token, reload]);

    return [publishers, setPublishers];
};

export const PostPublisher = async (token, name) => {
    const res = await fetch(`${PUBLISHER_URL}/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(token && {
                Authorization: `Token ${token}`,
            }),
        },
        body: JSON.stringify({
            name,
        }),
    });

    const data = await res.json();

    if (!res.ok) {
        throw getError(data);
    }

    return data.message;
};

export const DeletePublisher = async (token, id) => {
    const res = await fetch(`${PUBLISHER_URL}/${id}/`, {
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
