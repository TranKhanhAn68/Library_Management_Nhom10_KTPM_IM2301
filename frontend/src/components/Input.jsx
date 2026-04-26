import React from "react";

const Input = ({
    type = "text",
    value,
    onChange,
    placeholder,
    className,
}) => {
    return (
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`tw-border tw-rounded-lg tw-px-3 tw-py-2 
                ${className ? className : " tw-border-gray-300 tw-outline-none focus:tw-ring-2 focus:tw-ring-gray-400"}`}
        />
    );
};

export default Input;