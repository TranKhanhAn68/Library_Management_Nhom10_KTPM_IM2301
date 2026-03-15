import React from 'react';

const DashboardFooter = () => {
    return (
        <div className='tw-bg-white tw-border-t tw-py-4 tw-text-center tw-text-gray-500 tw-text-sm tw-shadow-inner'>
            @{new Date().getFullYear()} Admin Library Management
        </div>
    );
}

export default DashboardFooter;
