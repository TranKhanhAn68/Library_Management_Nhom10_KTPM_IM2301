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
    if (!res.ok)
        throw data.message

    return data
}