import ProviderPage from "@/pages/features/provider/provider";
import React from "react";
import { Routes, Route } from "react-router-dom";


const ProfileRoutes: React.FC = () => {
  return (
    <Routes>
        <Route path='/providers' element={<ProviderPage />} />
    </Routes>
  );
};

export default ProfileRoutes;
