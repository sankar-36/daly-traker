import { Navigate, Outlet } from "react-router-dom";
import React from "react";

export default function ProtectedRoute() {
  
  const token = localStorage.getItem("token");

  if (!token) {
   
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}