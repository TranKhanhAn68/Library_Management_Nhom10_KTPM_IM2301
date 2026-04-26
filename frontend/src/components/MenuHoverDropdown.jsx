import React from 'react';

const MenuHoverDropdown = ({ open, children }) => {
    return (
        open && (
            <div
                className="py-2 dropdown-menu show position-absolute rounded overflow-hidden top-0 start-100
                 tw-bg-gray-800 tw-text-white tw-border tw-border-gray-700"
                style={{ minWidth: "500px" }}
            >
                {children}
            </div>
        )
    );
}

export default MenuHoverDropdown;
