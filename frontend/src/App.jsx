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
import BookData from './data/BookData'
import CartData from './data/CartData'
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
function App() {

  const { user } = useContext(AuthContent)
  const [categories, setCategories] = useState(CategoryData || [])

  const handleAdd = (addCate) => {
    setCategories([...categories, addCate])
  }
  const handleEdit = (updateCate) => {
    setCategories(categories.map(c => c.id === updateCate.id ? updateCate : c))
  }

  const handleDelete = (deleteCate) => {
    const confirmDelete = window.confirm("Are you sure you want to delete?");
    if (confirmDelete)
      setCategories(categories.filter(c => c.id !== deleteCate.id))
  }


  // User Login
  const [users, setUsers] = useState(UserData || [])
  useEffect(() => {
    if (!localStorage.getItem("users")) {
      localStorage.setItem("users", JSON.stringify(users))
    }
  }, [])

  const IsSuperUser = () => {
    return user.is_superuser
  }

  const IsStaff = () => {
    return user.is_staff && !user.is_superuser
  }


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
            { path: "notification", element: <Notification /> },
          ]
        },
        { path: "shopping-cart", element: <CartPage /> },
        { path: "detail-book/:id/", element: <DetailBook books={BookData} /> }
      ]
    },

    {
      path: '/dashboard',
      element: (
        <ProtectedRoute allowRoles={IsSuperUser}>
          <DashboardLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          index: true,
          element: (
            <ProtectedRoute allowRoles={IsSuperUser}>
              <Dashboard />
            </ProtectedRoute>
          )
        },

        {
          path: 'categories',
          element: (
            <ProtectedRoute allowRoles={IsSuperUser}>
              <Category categories={categories} onDelete={handleDelete} />
            </ProtectedRoute>
          )
        },
        {
          path: 'categories/add-category',
          element: (
            <ProtectedRoute allowRoles={IsSuperUser}>
              <AddCategory onAdd={handleAdd} categoryID={categories.length} />
            </ProtectedRoute>
          )
        },
        {
          path: 'categories/edit-category/:id',
          element: (
            <ProtectedRoute allowRoles={IsSuperUser}>
              <EditCategory categories={categories} />
            </ProtectedRoute>
          )
        },

        {
          path: 'books',
          element: (
            <ProtectedRoute allowRoles={IsSuperUser}>
              <Book />
            </ProtectedRoute>
          )
        },
        {
          path: 'books/add-book',
          element: (
            <ProtectedRoute allowRoles={IsSuperUser}>
              <AddBook />
            </ProtectedRoute>
          )
        },
        {
          path: 'books/edit-book/:id',
          element: (
            <ProtectedRoute allowRoles={IsSuperUser}>
              <EditBook books={BookData} />
            </ProtectedRoute>
          )
        },

        {
          path: 'settings',
          element: (
            <ProtectedRoute allowRoles={IsSuperUser}>
              <SettingDashboard />
            </ProtectedRoute>
          )
        },

        {
          path: 'employee/transactions',
          element: (
            <ProtectedRoute allowRoles={IsStaff}>
              <Transaction />
            </ProtectedRoute>
          )
        },
        {
          path: 'employee/orders',
          element: (
            <ProtectedRoute allowRoles={IsStaff}>
              <Order />
            </ProtectedRoute>
          )
        }
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
