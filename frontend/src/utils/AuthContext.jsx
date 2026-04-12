import React, { createContext, useEffect, useState } from 'react';
import { LoginUserAPI } from '../services/AccountAPI';

export const AuthContent = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [status, setStatus] = useState(false)
    const [token, setToken] = useState(null)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const saveUser = localStorage.getItem("authUser")
        if (saveUser) {
            const parsed = JSON.parse(saveUser)
            setToken(parsed.token)
            setUser(parsed.user)
            setStatus(parsed.status)
        }
        setLoading(false);

    }, [])

    useEffect(() => {


        window.addEventListener("storage", (e) => {
            if (e.key === "authUser" && e.newValue === null) {
                logout();
            }
        });

        return () => window.removeEventListener("storage", logout);
    }, []);

    const login = async (username, password) => {
        const data = await LoginUserAPI(username, password)
        return data;
    }

    const logout = () => {
        setUser(null)
        setStatus(false)
        setToken("")
        localStorage.removeItem('authUser')
    }
    return (
        <AuthContent.Provider
            value={{
                user, setUser, status, setStatus, token, setToken, login, logout, loading
            }}
        >
            {children}
        </AuthContent.Provider>
    )

}
