import Dashboard from "@/pages/features/dashboard";
import AdminSettings from "@/pages/features/settings/profile";
import React from "react";
import { Routes, Route } from "react-router-dom";

const OfficeRoute: React.FC = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/settings" element={<AdminSettings />} />
    </Routes>
  );
};

export default OfficeRoute;
