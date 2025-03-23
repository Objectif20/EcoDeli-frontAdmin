import NotFoundPage from "@/pages/error/404";
import ProviderPage from "@/pages/features/provider/provider";
import ProviderProfilePage from "@/pages/features/provider/provider-details";
import React from "react";
import { Routes, Route } from "react-router-dom";


const ProfileRoutes: React.FC = () => {
  return (
    <Routes>
        <Route path='/providers' element={<ProviderPage />} />
        <Route path='/providers/:id' element={<ProviderProfilePage />} />
        <Route path='/*' element={<NotFoundPage />} />
        
    </Routes>
  );
};

export default ProfileRoutes;
