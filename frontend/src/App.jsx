import { useState } from 'react'
import Login from "./pages/login/Login"
import Register from "./pages/register/Register"
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import MainPage from './pages/home/MainPage'
import Notification from './components/notification/Notification'
import HomeLayout from "./layout/HomeLayout"
import Dashboard from "./pages/admin/Dashboard"
import DashboardLayout from "./layout/DashBoardLayout"
import Category from "./pages/admin/category/Category"
import AddCategory from "./pages/admin/category/AddCategory"
import EditCategory from "./pages/admin/category/EditCategory"
function App() {
  const data = [
    {
      id: 1,
      created_at: new Date(),
      updated_at: "",
      active: 0,
      name: "Hài hước"
    },
    {
      id: 2,
      created_at: new Date(),
      updated_at: "",
      active: 1,
      name: "Tâm lý tình cảm"
    }
  ];

  const [categories, setCategories] = useState(data)

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
  const router = createBrowserRouter([
    {
      path: "/login",
      element: <Login />
    },

    {
      path: "/register",
      element: <Register />
    },

    {
      path: '/',
      element: <HomeLayout />,
      children: [
        { index: true, element: <MainPage /> },
        { path: "notification", element: <Notification /> }
      ]
    },

    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { index: true, element: <Dashboard /> },
        { path: '/dashboard/categories', element: <Category categories={categories} onDelete={handleDelete} /> },
        { path: '/dashboard/categories/add-category', element: <AddCategory onAdd={handleAdd} categoryID={categories.length} /> },
        { path: '/dashboard/categories/edit-category/:id', element: <EditCategory categories={categories} onEdit={handleEdit} /> }
      ]
    }
  ])

  return <RouterProvider router={router} />

}

export default App
