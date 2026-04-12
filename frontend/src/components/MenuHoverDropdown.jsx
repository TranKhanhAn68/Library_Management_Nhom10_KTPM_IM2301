import React from 'react';

const MenuHoverDropdown = ({ open, children }) => {
    return (
        <div>
            {open && (
                <div className="dropdown-menu dropdown-menu-dark show position-absolute rounded-0 overflow-hidden top-0 start-100 "
                    style={{ minWidth: "500px" }}
                >
                    {children}
                </div>
            )}
        </div>
    );
}

export default MenuHoverDropdown;
