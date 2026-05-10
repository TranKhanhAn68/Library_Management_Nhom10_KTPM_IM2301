import { useEffect, useState } from "react"
const USER_URL = 'http://127.0.0.1:8000/users'

export const UserListAPI = (page, search = "", token, reload) => {
    const [data, setData] = useState([])
    const fetchData = async () => {
        try {
            const params = new URLSearchParams()
            params.append("page", page)

            if (search)
                params.append("search", search)
            const res = await fetch(`${USER_URL}/?${params.toString()}`, {

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
    }, [page, token, reload])

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
    const res = await fetch(`${USER_URL}/`, {
        method: 'POST',
        headers: {
            ...(token && { Authorization: `Token ${token}` })
        },
        body: formData
    })
    const data = await res.json()
    if (!res.ok) {
        console.log(data)
        throw data
    }
    return data
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
    if (!res.ok) {
        const data = await res.json()
        throw data
    }
    return true;
}


export const BorrowingListByUser = (token, status, page) => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const fetchData = async () => {
        try {
            setLoading(true)
            const params = new URLSearchParams()
            params.append("page", page)
            if (status)
                params.append("status", status)
            const res = await fetch(`${USER_URL}/current_user/borrowing_list/?${params.toString()}`, {
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
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [page, token, status])

    return { data, loading }
}


export const OrderListByUser = (token, page) => {
    const [data, setData] = useState([])
    const fetchData = async () => {
        try {
            const res = await fetch(`${USER_URL}/current_user/orders/?page=${page}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { Authorization: `Token ${token}` })
                },
            })
            if (!res.ok)
                throw new Error('Fetch failed');
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


