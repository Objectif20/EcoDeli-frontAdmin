import DeliverymanContractPage from "@/pages/features/contract/deliveryman";
import MerchantContractPage from "@/pages/features/contract/merchant";
import ProviderContractPage from "@/pages/features/contract/provider";
import React from "react";
import { Routes, Route } from "react-router-dom";


const ContractRoutes: React.FC = () => {
  return (
    <Routes>
        <Route path="/deliveryman" element={<DeliverymanContractPage />} />
        <Route path="/provider" element={<ProviderContractPage />} />
        <Route path="/merchant" element={<MerchantContractPage />} />
    </Routes>
  );
};

export default ContractRoutes;
