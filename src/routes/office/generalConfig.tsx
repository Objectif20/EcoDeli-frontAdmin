import NotFoundPage from "@/pages/error/404";
import AdminPage from "@/pages/features/general/admin/admin";
import LanguagePage from "@/pages/features/general/languages/languages";
import React from "react";
import { Routes, Route } from "react-router-dom";


const GeneralConfigRoutes: React.FC = () => {
  return (
    <Routes>
        <Route path='/languages' element={<LanguagePage />} />
        <Route path='/categories' element={<h1>Test</h1>} />
        <Route path='/admin' element={<AdminPage />} />
        <Route path='/*' element={<NotFoundPage />} />
    </Routes>
  );
};

export default GeneralConfigRoutes;
