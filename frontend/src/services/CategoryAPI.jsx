import { useEffect, useState } from "react";

const CATE_URL = "http://127.0.0.1:8000/categories"
export const CategoryListAPI = (token, reload) => {
    const [categories, setCategories] = useState([])
    const fetchData = async () => {
        try {
            const res = await fetch(`${CATE_URL}/`, {
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
            setCategories(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, [token, reload]);

    return [categories, setCategories];
};

export const CategoryByIDAPI = (cate_id, token) => {
    const [category, setCategory] = useState(null)
    const fetchData = async () => {
        try {
            const res = await fetch(`${CATE_URL}/${cate_id}/`, {
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
            setCategory(data);
        } catch (err) {
            console.error(err);
        }
    }
    useEffect(() => {
        fetchData()
    }, [cate_id, token])

    return [category, setCategory]
}


export const PostCategory = async (name, active, token) => {
    const res = await fetch(`${CATE_URL}/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Token ${token}` })
        },
        body: JSON.stringify({
            name: name,
            active: active
        })
    });
    const data = await res.json();
    console.log(data)
    if (!res.ok) throw data;

    return data;
};

export const UpdateCategory = async (category_id, name, active, token) => {
    const res = await fetch(`${CATE_URL}/${category_id}/`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Token ${token}` })
        },
        body: JSON.stringify({
            name: name,
            active: active
        })
    });

    if (!res.ok) throw new Error(`Lỗi: ${res.status}`);

    console.log("Cập nhật thành công")
    const data = await res.json();
    return data;
};

export const DeleteCategory = async (id, token) => {
    const res = await fetch(`${CATE_URL}/${id}/`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Token ${token}` })
        },
    });

    if (!res.ok) throw new Error(`Lỗi: ${res.status}`);

    const data = await res.json();
    return data;
}
