import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import MainApp from "./pages/MainApp";
import Recipe from "./pages/Recipe";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/app",
    element: <MainApp />
  },
  {
    path: "/recipe",
    element: <Recipe />
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} /> 
  </React.StrictMode>,
)
