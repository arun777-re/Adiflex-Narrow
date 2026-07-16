import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {

  const isLogin = true;

  return isLogin ? children : <Navigate to="/" />;
};

export default ProtectedRoute;