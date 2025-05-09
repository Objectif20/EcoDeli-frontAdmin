import NotFoundPage from "@/pages/error/404";
import ClientPage from "@/pages/features/client/client";
import ClientProfilePage from "@/pages/features/client/client-details";
import DeliverymanPage from "@/pages/features/deliveryman/deliveryman";
import DeliverymanProfilePage from "@/pages/features/deliveryman/deliveryman-details";
import MerchantPage from "@/pages/features/merchant/merchant";
import MerchantProfilePage from "@/pages/features/merchant/merchant-details";
import ProviderPage from "@/pages/features/provider/provider";
import ProviderProfilePage from "@/pages/features/provider/provider-details";
import React from "react";
import { Routes, Route } from "react-router-dom";


const ProfileRoutes: React.FC = () => {
  return (
    <Routes>
        <Route path='/providers' element={<ProviderPage />} />
        <Route path='/providers/:id' element={<ProviderProfilePage />} />
        <Route path="/merchants" element={<MerchantPage />} />
        <Route path="/merchants/:id" element={<MerchantProfilePage />} />
        <Route path="/deliverymen" element={<DeliverymanPage />} />
        <Route path="/deliverymen/:id" element={<DeliverymanProfilePage />} />
        <Route path="/clients" element={<ClientPage />} />
        <Route path="/clients/:id" element={<ClientProfilePage />} />
        <Route path='/*' element={<NotFoundPage />} />
    </Routes>
  );
};

export default ProfileRoutes;
