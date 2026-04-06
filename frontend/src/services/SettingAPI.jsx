import { useEffect, useState } from "react";

const SETTING_URL = "http://127.0.0.1:8000/settings"
export const SettingListAPI = () => {
    const [settings, setSettings] = useState([])
    const fetchData = async () => {
        try {
            const res = await fetch(`${SETTING_URL}/`);
            const data = await res.json();
            setSettings(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return [settings]
};

export const SettingByIDAPI = (setting_id) => {
    const [setting, setSetting] = useState(null)
    const fetchData = async () => {
        try {
            const res = await fetch(`${SETTING_URL}/${setting_id}/`);
            const data = await res.json();
            setSetting(data);
        } catch (err) {
            console.error(err);
        }
    }
    useEffect(() => {
        fetchData()
    }, [setting_id])

    return [setting]
}


export const PostSetting = async (borrowing_days, borrowing_fee, borrowing_overdue_fine, active, token) => {
    try {
        const res = await fetch(`${SETTING_URL}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            },
            body: JSON.stringify({
                borrowing_days: borrowing_days,
                borrowing_fee: borrowing_fee,
                borrowing_overdue_fine: borrowing_overdue_fine,
                active: active
            })
        });

        if (!res.ok) throw new Error(`Lỗi: ${res.status}`);

        console.log("Tạo mới thành công")
        const data = await res.json();
        return data;

    } catch (err) {
        console.error("Error creating setting:", err);
        return null;
    }
};

export const UpdateSetting = async (setting_id, active, token) => {
    try {
        const res = await fetch(`${SETTING_URL}/${setting_id}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            },
            body: JSON.stringify({
                active: active
            })
        });

        if (!res.ok) throw new Error(`Lỗi: ${res.status}`);

        console.log("Cập nhật thành công")
        const data = await res.json();
        return data;

    } catch (err) {
        console.error("Error creating setting:", err);
        return null;
    }
};

export const DeleteSetting = async (id, token) => {
    try {
        const res = await fetch(`${SETTING_URL}/${id}/`, {
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
        console.error("Error creating setting:", err);
        return false;
    }
}
