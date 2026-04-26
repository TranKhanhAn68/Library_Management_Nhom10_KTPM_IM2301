import React from "react";
import { STATUS_CONFIG } from "../config";

const StatusSelect = ({ value, onChange, className }) => {
    const options = Object.values(STATUS_CONFIG);

    return (
        <select
            value={value}
            onChange={onChange}
            className={`tw-border tw-rounded tw-px-3 tw-py-2 tw-bg-white ${className} `}
        >

            <option value="">
                Tất cả
            </option>

            {options.map((item) => (
                <option key={item.value} value={item.value}>
                    {item.label}
                </option>
            ))}
        </select>
    );
};

export default StatusSelect;
