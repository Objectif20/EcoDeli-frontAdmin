import LoginPage from "@/pages/auth/login";
import React from "react";
import { Routes, Route } from "react-router-dom";

const AuthRoute: React.FC = () => {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route path="forgotPassword" element={<h1>Mot de passe oublié</h1>} />
    </Routes>
  );
};

export default AuthRoute;
