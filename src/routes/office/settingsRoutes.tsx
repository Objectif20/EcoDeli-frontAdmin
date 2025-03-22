
import NotFoundPage from "@/pages/error/404";
import A2FSettings from "@/pages/features/settings/2faSettings";
import AdminSettings from "@/pages/features/settings/profile";
import React from "react";
import { Routes, Route } from "react-router-dom";

const SettingsRoute: React.FC = () => {
  return (
    <Routes>
        <Route path="" element={<AdminSettings />} />
        <Route path="a2f" element={<A2FSettings />} />
        <Route path='/*' element={<NotFoundPage />} />
    </Routes>
  );
};

export default SettingsRoute;
