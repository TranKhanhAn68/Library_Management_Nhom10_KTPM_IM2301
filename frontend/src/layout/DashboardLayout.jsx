import React from 'react';
import SideBar from '../components/components-admin/SideBar';
import Navbar from '../components/components-admin/Navbar';
import { Outlet } from 'react-router-dom';
import DashboardFooter from '../components/components-admin/DashboardFooter';
const DashBoardLayout = () => {
    return (
        <div className='tw-flex tw-min-h-screen tw-flex-col'>
            <div>
                <SideBar />
                <div className='tw-ml-64 tw-flex-1 bg-gray-50 min-h-screen '>
                    <Navbar />
                    <div className='tw-p-6 tw-pt-24'>
                        <Outlet />
                    </div>
                </div>

            </div>
            <DashboardFooter />
        </div>

    );
}

export default DashBoardLayout;
