import NotFoundPage from "@/pages/error/404";
import ProviderPage from "@/pages/features/provider/provider";
import React from "react";
import { Routes, Route } from "react-router-dom";


const ProfileRoutes: React.FC = () => {
  return (
    <Routes>
        <Route path='/providers' element={<ProviderPage />} />
        <Route path='/*' element={<NotFoundPage />} />
        
    </Routes>
  );
};

export default ProfileRoutes;
