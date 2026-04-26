import { useContext, useEffect, useState } from 'react'
import Login from "./pages/login/Login"
import Register from "./pages/register/Register"
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import MainPage from './pages/home/MainPage'
import Notification from './components/notification/Notification'
import HomeLayout from "./layout/HomeLayout"
import Dashboard from "./pages/admin/Dashboard"
import DashboardLayout from "./layout/DashboardLayout"
import Category from "./pages/admin/category/CategoryDashboard"
import AddCategory from "./pages/admin/category/AddCategory"
import EditCategory from "./pages/admin/category/EditCategory"
import DetailBook from './pages/home/DetailBook'
import Books from './components/books/Books'
import CartPage from './pages/home/CartPage'
import PublicRoute from './utils/PublicRoute'
import ProtectedRoute from './utils/ProtectedRoute'
import Book from './pages/admin/book/BookDashboard'
import AddBook from './pages/admin/book/AddBook'
import EditBook from './pages/admin/book/EditBook'
import AdminLogin from './pages/admin/AdminLogin'
import UserData from './data/UserData'
import CategoryData from './data/CategoryData'
import SettingDashboard from './pages/admin/setting/SettingDashboard'
import Page403 from './components/Page403'
import Transaction from './pages/admin/transaction/Transaction'
import Order from './pages/admin/order/Order'
import { AuthContent } from './utils/AuthContext'
import AuthorsPage from './pages/home/AuthorsPage'
import DetailAuthorPage from './pages/home/DetailAuthorPage'
import { PERMISSIONS } from './config'
import UserDashboard from './pages/admin/user/UserDashBoard'
import EditUser from './pages/admin/user/EditUser'
import AddUser from './pages/admin/user/AddUser'
import AddSetting from './pages/admin/setting/AddSetting'
import InformationUserPage from './pages/home/InformationUserPage'
import BorrowingHistory from './components/books/BorrowingHistory'
import LibraryRules from './components/LibraryRules'
import OrderListBook from './components/books/OrderListBook'
function App() {
  const { user } = useContext(AuthContent)
  const router = createBrowserRouter([
    {
      path: "/login",
      element: (
        <PublicRoute>
          <Login />
        </PublicRoute>
      )
    },

    {
      path: "/register",
      element: <Register />
    },

    {
      element: <HomeLayout />,
      children: [
        {
          path: "/",
          element: <MainPage />,
          children: [
            { index: true, element: <Books /> },
            { path: "current_user/borrowing-history", element: <BorrowingHistory /> },
            { path: "current_user/orders", element: <OrderListBook /> },
            { path: "library_rules", element: <LibraryRules /> }
          ]
        },
        { path: "shopping-cart", element: <CartPage /> },
        { path: "detail-book/:id/", element: <DetailBook /> },
        { path: "authors", element: <AuthorsPage /> },
        { path: "authors/:id/:name", element: <DetailAuthorPage /> },
        {
          path: "current_user/information",
          element: <InformationUserPage />,
        }
      ]
    },

    {
      path: '/dashboard',
      element: (
        <ProtectedRoute allowRoles={PERMISSIONS.CAN_VIEW_DASHBOARD}>
          <DashboardLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          index: true,
          element: (
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          )
        },

        {
          path: 'categories',
          element: (
            <ProtectedRoute allowRoles={PERMISSIONS.CAN_MANAGE_ALL}>
              <Category />
            </ProtectedRoute>
          )
        },
        {
          path: 'categories/add-category',
          element: (
            <ProtectedRoute allowRoles={PERMISSIONS.CAN_MANAGE_ALL}>
              <AddCategory />
            </ProtectedRoute>
          )
        },
        {
          path: 'categories/edit-category/:id',
          element: (
            <ProtectedRoute allowRoles={PERMISSIONS.CAN_MANAGE_ALL}>
              <EditCategory />
            </ProtectedRoute>
          )
        },

        {
          path: 'books',
          element: (
            <ProtectedRoute allowRoles={PERMISSIONS.CAN_MANAGE_ALL}>
              <Book />
            </ProtectedRoute>
          )
        },
        {
          path: 'books/add-book',
          element: (
            <ProtectedRoute allowRoles={PERMISSIONS.CAN_MANAGE_ALL}>
              <AddBook />
            </ProtectedRoute>
          )
        },
        {
          path: 'books/edit-book/:id',
          element: (
            <ProtectedRoute allowRoles={PERMISSIONS.CAN_MANAGE_ALL}>
              <EditBook />
            </ProtectedRoute>
          )
        },

        {
          path: 'settings',
          element: (
            <ProtectedRoute allowRoles={PERMISSIONS.CAN_MANAGE_ALL}>
              <SettingDashboard />
            </ProtectedRoute>
          )
        },

        {
          path: 'settings/add-setting',
          element: (
            <ProtectedRoute allowRoles={PERMISSIONS.CAN_MANAGE_ALL}>
              <AddSetting />
            </ProtectedRoute>
          )
        },

        {
          path: 'users',
          element: (
            <ProtectedRoute allowRoles={PERMISSIONS.CAN_MANAGE_ALL}>
              <UserDashboard />
            </ProtectedRoute>
          )
        },

        {
          path: 'users/edit-user/:id',
          element: (
            <ProtectedRoute allowRoles={PERMISSIONS.CAN_MANAGE_ALL}>
              <EditUser />
            </ProtectedRoute>
          )
        },

        {
          path: 'users/add-user',
          element: (
            <ProtectedRoute allowRoles={PERMISSIONS.CAN_MANAGE_ALL}>
              <AddUser />
            </ProtectedRoute>
          )
        },

        {
          path: 'employee/transactions',
          element: (
            <ProtectedRoute allowRoles={PERMISSIONS.CAN_HANDLE_ORDERS}>
              <Transaction />
            </ProtectedRoute>
          )
        },


        {
          path: 'employee/orders',
          element: (
            <ProtectedRoute allowRoles={PERMISSIONS.CAN_HANDLE_ORDERS}>
              <Order />
            </ProtectedRoute>
          )
        },



      ]
    },


    {
      path: "/admin/login",
      element: <AdminLogin />
    },

    { path: "/403", element: <Page403 /> }
  ])

  return <RouterProvider router={router} />

}

export default App
