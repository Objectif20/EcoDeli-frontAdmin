import ForgotPasswordPage from "@/pages/auth/forgot-password";
import LoginPage from "@/pages/auth/login";
import NewPasswordPage from "@/pages/auth/new-password";
import NotFoundPage from "@/pages/error/404";
import React from "react";
import { Routes, Route } from "react-router-dom";

const AuthRoute: React.FC = () => {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route path="forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/new-password/:secretCode" element={<NewPasswordPage />} />
      <Route path="/*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AuthRoute;
