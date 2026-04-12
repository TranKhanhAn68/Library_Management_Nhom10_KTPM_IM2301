import { useEffect, useState } from "react";
const ACCOUNT_URL = "http://127.0.0.1:8000/account"

export const LoginUserAPI = async (username, password) => {
    try {
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

        if (res.ok) {
            console.log("Login thành công")
            return data
        }

        else {
            console.error("Login thất bại: ", data.message)
        }
    } catch (error) {
        console.log("Lỗi kết nối", error)
        return null
    }
}