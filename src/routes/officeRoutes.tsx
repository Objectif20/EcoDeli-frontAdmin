import Dashboard from "@/pages/features/dashboard";
import React from "react";
import { Routes, Route } from "react-router-dom";

const OfficeRoute: React.FC = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
};

export default OfficeRoute;
