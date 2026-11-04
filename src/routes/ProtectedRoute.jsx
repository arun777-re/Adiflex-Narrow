import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import React from 'react';

const ProtectedRoute = ({ children }) => {

  const {user} = useSelector((state)=> state.auth);
  const isLogin = Boolean(user?.data?.token || user?.token);

  return isLogin ? children : <Navigate to="/" />;
};

export default ProtectedRoute;