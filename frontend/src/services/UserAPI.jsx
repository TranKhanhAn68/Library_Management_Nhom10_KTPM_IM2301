import { useEffect, useState } from "react"
const USER_URL = 'http://127.0.0.1:8000/users'

export const UserListAPI = (page, token) => {
    const [data, setData] = useState([])
    const fetchData = async () => {
        try {
            const res = await fetch(`${USER_URL}/?page=${page}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { Authorization: `Token ${token}` })
                },
            })
            if (!res.ok) {
                throw new Error('Fetch failed');
            }
            const data = await res.json()
            setData(data)

        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        fetchData()
    }, [page, token])

    return data
}


export const UserListByIDAPI = (id, token) => {
    const [user, setUser] = useState(null)
    const fetchData = async () => {
        try {
            const res = await fetch(`${USER_URL}/${id}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { Authorization: `Token ${token}` })
                },
            })
            if (!res.ok) {
                throw new Error('Fetch failed');
            }
            const data = await res.json()
            setUser(data)

        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        fetchData()
    }, [id, token])

    return [user, setUser]
}

export const PostUser = async (token, formData) => {
    const res = await fetch(`${USER_URL}/users/`, {
        method: 'POST',
        headers: {
            ...(token && { Authorization: `Token ${token}` })
        },
        body: formData
    })
    if (!res.ok) {
        throw data
    }
    const data = await res.json()
    setUsers(data)
}

export const UpdateUser = async (token, id, formData) => {
    const res = await fetch(`${USER_URL}/${id}/`, {
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

export const DeleteUser = async (id, token) => {
    const res = await fetch(`${USER_URL}/${id}/`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Token ${token}` })
        },
    })
    if (!res.ok) throw new Error(`Lỗi: ${res.status}`);

    const data = await res.json();
    return data;
}


