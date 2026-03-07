import Login from "./pages/login/Login"
import Register from "./pages/register/Register"
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import MainPage from './pages/home/MainPage'
import BookContainer from './components/book_container/BookContainer'
import Notification from './components/notification/Notification'
function App() {
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
      element: <MainPage />,
      children: [
        { index: true, element: <BookContainer /> },
        { path: "notification", element: <Notification /> }
      ]
    }
  ])

  return <RouterProvider router={router} />

}

export default App
