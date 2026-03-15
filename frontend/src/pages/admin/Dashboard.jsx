import React from 'react';
import DashboardCard from '../../components/components-admin/DashboardCard';
import { PieChart, ResponsiveContainer, Cell, Pie, BarChart, CartesianGrid, Tooltip, XAxis, YAxis, Legend, Bar } from 'recharts';
const Dashboard = () => {

    const pieData = [
        { name: "Delivered", value: 64 },
        { name: "processing", value: 25 },
        { name: "Canceled", value: 10 }
    ];

    const COLORS = ['#4ade80', '#60a5fa', '#f78171']
    const barData = [
        { name: 'Jan', revenue: 4500 },
        { name: 'March', revenue: 5580 },
        { name: 'April', revenue: 6784 },
        { name: 'May', revenue: 7842 },
        { name: 'Jane', revenue: 8450 },
        { name: 'July', revenue: 9654 },
    ];
    return (
        <div>
            <h1 className='tw-text-3xl tw-font-bold tw-mb-6'>
                <i className="fa-solid fa-chart-area"></i>
                Total Dashboard
            </h1>
            <DashboardCard />
            <div className='tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-6'>
                {/* Biểu đồ tròn */}
                <div className='tw-bg-white tw-p-4 tw-rounded-xl tw-shadow-sm'>
                    <h2 className='tw-text-lg tw-font-semibold tw-mb-4'>
                        Order status rate
                    </h2>

                    <ResponsiveContainer width='100%' height={300}>
                        <PieChart>
                            <Pie data={pieData} dataKey='value' cx='50%' cy='50%' outerRadius={100} label>
                                {pieData.map((data, index) => {
                                    return (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index]}
                                        />
                                    )
                                })}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Biều đồ cột */}
                <div className='tw-bg-white tw-p-4 rounded-xl shadow-sm'>
                    <h2 className='tw-text-lg tw-font-semibold tw-mb-4'>
                        Monthly revenue
                    </h2>
                    <ResponsiveContainer width='100%' height={300}>
                        <BarChart data={barData}>
                            <CartesianGrid strokeDasharray='3 3' />
                            <XAxis dataKey='name' />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey='revenue' fill='#60a5fa' />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
