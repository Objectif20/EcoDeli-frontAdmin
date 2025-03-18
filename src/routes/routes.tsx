import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthRoute from "./authRoutes";
import NotFoundPage from "@/pages/error/404";
import PrivateRoute from "@/components/privateRoutes";
import OfficeRoute from "./officeRoutes";
import LogoutPage from "@/pages/auth/logout";
import InfoRoute from "./infoRoutes";

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth/*" element={<AuthRoute />} />
        <Route path="/" element={<Navigate to="/auth/login" />} />
        <Route element={<PrivateRoute />}>
          <Route path="/office/*" element={<OfficeRoute />} />
        </Route>
        <Route path='/info/*' element={<InfoRoute />} />
        <Route path="/logout" element={<LogoutPage />}/>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;