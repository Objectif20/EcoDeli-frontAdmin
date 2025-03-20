import ReportPage from "@/pages/features/report/report";
import React from "react";
import { Routes, Route } from "react-router-dom";


const ReportRoutes: React.FC = () => {
  return (
    <Routes>
        <Route path='/' element={<ReportPage />} />
    </Routes>
  );
};

export default ReportRoutes;
