import NotFoundPage from "@/pages/error/404";
import AdminPage from "@/pages/features/general/admin/admin";
import VehicleCategoriesPage from "@/pages/features/general/categories/vehicles-category";
import AddLanguage from "@/pages/features/general/languages/addLanguages";
import LanguagePage from "@/pages/features/general/languages/languages";
import UpdateLanguage from "@/pages/features/general/languages/updateLanguages";
import React from "react";
import { Routes, Route } from "react-router-dom";


const GeneralConfigRoutes: React.FC = () => {
  return (
    <Routes>
        <Route path='/languages' element={<LanguagePage />} />
        <Route path='/languages/:id' element={<UpdateLanguage />} />
        <Route path="/languages/add" element={<AddLanguage />} />
        <Route path='/categories' element={<VehicleCategoriesPage />} />
        <Route path='/admin' element={<AdminPage />} />
        <Route path='/*' element={<NotFoundPage />} />
    </Routes>
  );
};

export default GeneralConfigRoutes;
