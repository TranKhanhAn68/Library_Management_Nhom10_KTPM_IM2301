import React, { createContext, useEffect, useState } from 'react';
import { LoginUserAPI, RegisterUserAPI } from '../services/AccountAPI';

export const AuthContent = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [status, setStatus] = useState(false)
    const [token, setToken] = useState(null)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);

                const res = await fetch("http://127.0.0.1:8000/users/current_user/", {
                    method: "GET",
                    headers: {
                        Authorization: `Token ${token}`
                    }
                });

                if (!res.ok) {
                    throw new Error("Failed to fetch user");
                }

                const data = await res.json();

                setUser(data);
                setStatus(true);
            } catch (err) {
                console.error(err);
                setUser(null);
                setStatus(false);
            } finally {
                setLoading(false);
            }
        };

        fetchCurrentUser();
    }, [token]);

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (token) {
            const parsed = JSON.parse(token)
            setToken(parsed)
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

    const register = async (firstname, lastname, email, username, password) => {
        const data = await RegisterUserAPI(firstname, lastname, email, username, password)
        return data
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
                user, setUser, status, setStatus, token, setToken, login, register, logout, loading
            }}
        >
            {children}
        </AuthContent.Provider>
    )

}
