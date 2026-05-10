import { createContext, useEffect, useState } from "react";
import { LoginUserAPI, LogoutUserAPI, RegisterUserAPI } from "../services/AccountAPI";

export const AuthContent = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(null)
    const [loading, setLoading] = useState(true);
    const [reload, setReload] = useState(false)

    useEffect(() => {
        const fetchCurrentUser = async () => {
            const savedToken = localStorage.getItem("token");

            if (!savedToken) {
                setLoading(false);
                setUser(null)
                setToken(null)
                return;
            }

            try {
                const res = await fetch("http://127.0.0.1:8000/users/current_user/", {
                    headers: {
                        Authorization: `Token ${savedToken}`
                    }
                });

                if (res.ok) {
                    const data = await res.json();
                    setUser(data);
                    setToken(savedToken);
                }

            } catch {
                setUser(null)
                setToken(null)
                localStorage.removeItem("token");
            } finally {
                setLoading(false);
            }
        };

        fetchCurrentUser();
    }, [reload]);

    useEffect(() => {
        const handleStorageChange = (event) => {
            if (event.key === "logout") {
                setUser(null);
                setToken(null);
            }
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    const login = async (username, password) => {
        return await LoginUserAPI(username, password);
    };

    const register = async (firstname, lastname, email, username, password) => {
        const data = await RegisterUserAPI(firstname, lastname, email, username, password)
        return data
    }
    const logout = async () => {
        if (token) await LogoutUserAPI(token);

        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
        localStorage.setItem("logout", Date.now());
    };
    return (
        <AuthContent.Provider value={{
            user,
            token,
            setUser,
            setToken,
            login,
            register,
            logout,
            loading,
            setReload
        }}>
            {children}
        </AuthContent.Provider>
    );
};