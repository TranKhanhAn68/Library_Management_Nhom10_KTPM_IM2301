import React from 'react';

const DashboardCard = () => {
    const stats = [
        { title: 'Total Books', value: '1250 books', color: 'tw-bg-blue-500', icon: <i className="fa-solid fa-cart-arrow-down"></i> },
        { title: 'Total Revenue', value: '$89654', color: 'tw-bg-sky-500', icon: <i className="fa-solid fa-money-bill"></i> },
        { title: 'Borrowed Boooks', value: '250 books', color: 'tw-bg-yellow-500', icon: <i className="fa-solid fa-boxes-stacked"></i> },
        { title: 'Overdue Books', value: '50 books', color: 'tw-bg-pink-500', icon: <i className="fa-solid fa-truck-fast"></i> }
    ];

    return (
        <div className='tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-4 tw-gap-4 tw-mb-6'>
            {stats.map((item, index) => (
                <div
                    key={index}
                    className={`tw-p-4 tw-rounded-xl tw-shadow-sm tw-flex tw-items-center tw-justify-between ${item.color}`}
                >
                    <div>
                        <p className='tw-text-sm tw-text-gray-600'>{item.title}</p>
                        <h3 className='tw-text-2xl tw-font-bold'>{item.value}</h3>
                    </div>

                    <span className="tw-text-2xl">
                        {item.icon}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default DashboardCard;