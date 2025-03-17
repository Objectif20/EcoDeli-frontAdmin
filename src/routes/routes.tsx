import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthRoute from "./authRoutes";
import NotFoundPage from "@/pages/error/404";
import PrivateRoute from "@/components/privateRoutes";
import OfficeRoute from "./officeRoutes";

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth/*" element={<AuthRoute />} />

        <Route path="/" element={<Navigate to="/auth/login" />} />

        <Route element={<PrivateRoute />}>
          <Route path="/office/*" element={<OfficeRoute />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;