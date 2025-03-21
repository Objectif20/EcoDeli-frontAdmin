import NotFoundPage from "@/pages/error/404";
import ReportPage from "@/pages/features/report/report";
import React from "react";
import { Routes, Route } from "react-router-dom";


const ReportRoutes: React.FC = () => {
  return (
    <Routes>
        <Route path='/' element={<ReportPage />} />
        <Route path='/*' element={<NotFoundPage />} />
    </Routes>
  );
};

export default ReportRoutes;
