import React from "react";
import { CookiesProvider } from "react-cookie";
import ReactDOM from "react-dom/client";
import {
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import "./index.css";
import Home from "./routes/Home.tsx";
import Login from "./routes/Login.tsx";
import Navbar from "./Navbar.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <CookiesProvider>
      <div className="min-h-screen w-screen flex flex-col">
        <Navbar />
        <RouterProvider router={router} />
      </div>
    </CookiesProvider>
  </React.StrictMode>
);
