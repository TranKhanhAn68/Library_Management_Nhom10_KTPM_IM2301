import { useEffect, useState } from "react";

const CATE_URL = "http://127.0.0.1:8000/categories"
export const CategoryListAPI = () => {
    const [categories, setCategories] = useState([])
    const fetchData = async () => {
        try {
            const res = await fetch(`${CATE_URL}/`);
            const data = await res.json();
            setCategories(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return [categories, setCategories];
};

export const CategoryByIDAPI = (cate_id) => {
    const [category, setCategory] = useState(null)
    const fetchData = async () => {
        try {
            const res = await fetch(`${CATE_URL}/${cate_id}/`);
            const data = await res.json();
            setCategory(data);
        } catch (err) {
            console.error(err);
        }
    }
    useEffect(() => {
        fetchData()
    }, [cate_id])

    return [category, setCategory]
}


export const PostCategory = async (name, active, token) => {
    try {
        const res = await fetch(`${CATE_URL}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            },
            body: JSON.stringify({
                name: name,
                active: active
            })
        });

        if (!res.ok) throw new Error(`Lỗi: ${res.status}`);

        console.log("Tạo mới thành công")
        const data = await res.json();
        return data;

    } catch (err) {
        console.error("Error creating category:", err);
        return null;
    }
};

export const UpdateCategory = async (category_id, name, active, token) => {
    try {
        const res = await fetch(`${CATE_URL}/${category_id}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
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

    } catch (err) {
        console.error("Error creating category:", err);
        return null;
    }
};

export const DeleteCategory = async (id, token) => {
    try {
        const res = await fetch(`${CATE_URL}/${id}/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            },
        });

        if (!res.ok) throw new Error(`Lỗi: ${res.status}`);

        console.log("Xóa thành công")
        const data = await res.json();
        return true;

    } catch (err) {
        console.error("Error creating category:", err);
        return false;
    }
}
