import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './components/login/Login.jsx'
import Home from './pages/home/home.jsx'
import Forget from './components/login/Forget.jsx'
const router=createBrowserRouter([
  {
    path:"/",
    element:<Login/>
  },
  {
    path:'/login',
    element:"https://www.google.com"
  },
  {
    path:'/home',
    element:<Home />
  },
  {
    path:'/forget',
    element:<Forget />
  }
]
)
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
  <RouterProvider router={router}></RouterProvider> 
  </React.StrictMode>,
)
