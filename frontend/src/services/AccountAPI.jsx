import { useEffect, useState } from "react";
const ACCOUNT_URL = "http://127.0.0.1:8000/account"

export const LoginUserAPI = async (username, password) => {
    const res = await fetch(`${ACCOUNT_URL}/login/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },

        body: JSON.stringify({
            username: username,
            password: password
        })
    });

    const data = await res.json();

    if (!res.ok)
        throw data.message

    return data
}

export const RegisterUserAPI = async (firstname, lastname, email, username, password) => {
    const res = await fetch(`${ACCOUNT_URL}/register/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },

        body: JSON.stringify({
            first_name: firstname,
            last_name: lastname,
            email: email,
            username: username,
            password: password
        })
    })
    const data = await res.json();
    if (!res.ok) {
        const errors = []

        // case DRF field errors
        if (typeof data === "object" && data !== null) {
            Object.values(data).forEach(err => {
                if (Array.isArray(err)) {
                    errors.push(...err)
                } else {
                    errors.push(err)
                }
            })
        }

        throw errors
    }
    return data
}


export const LogoutUserAPI = async (token) => {
    const res = await fetch(`${ACCOUNT_URL}/logout/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Token ${token}` })
        },
    });

    if (!res.ok) {
        throw new Error("Logout failed");
    }

    return true;
};