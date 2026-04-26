import React from 'react';

const BaseModal = ({ open, close, children }) => {
    return (
        <div className={`tw-fixed tw-inset-0 tw-flex tw-justify-center 
            tw-items-center tw-transition-all tw-duration-300 tw-z-30
            ${open ? "tw-visible tw-bg-black/20" : "invisible"}`}
            onClick={close}
        >
            <div className={`tw-bg-white tw-rounded-xl tw-shadow tw-transition-all 
                ${open ? "tw-scale-100 tw-opacity-100" : "tw-scale-125 tw-opacity-0"}`}
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
}

export default BaseModal;
