import { useEffect, useState } from "react";

const PUBLISHER_URL = "http://127.0.0.1:8000/publishers"
export const PublisherListAPI = (token) => {
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
    }, [token]);

    return [publishers, setPublishers];
};