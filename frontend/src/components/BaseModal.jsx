import React from 'react';

const BaseModal = ({ open, close, children }) => {
    return (
        <div
            className={`tw-fixed tw-inset-0 tw-flex tw-justify-center tw-items-center tw-z-30 tw-transition-all
            ${open ? "tw-visible tw-bg-black/40" : "tw-invisible"}`}
            onClick={close}
        >
            <div
                className={`
                    tw-bg-white tw-rounded-xl tw-shadow-lg tw-transition-all
                    tw-min-w-[320px]
                    tw-max-w-[900px]
                    tw-max-h-[90vh] tw-overflow-y-auto
                    ${open ? "tw-scale-100 tw-opacity-100" : "tw-scale-125 tw-opacity-0"}
                `}
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
};

export default BaseModal;