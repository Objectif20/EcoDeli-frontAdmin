// src/components/PrivateRoute.tsx
import React from "react";
import { Navigate, Route } from "react-router-dom"; 
import { useSelector } from "react-redux";
import { RootState } from "../redux/store"; 

interface PrivateRouteProps {
  element: React.ReactNode;
  path: string;
  exact?: boolean;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element, ...rest }) => {
  const { accessToken } = useSelector((state: RootState) => state.auth); 
  return (
    <Route
      {...rest}
      element={accessToken ? element : <Navigate to="/login" />}
    />
  );
};

export default PrivateRoute;
