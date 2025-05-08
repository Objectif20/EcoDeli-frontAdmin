import DeliverymanContractPage from "@/pages/features/contract/deliveryman";
import ProviderContractPage from "@/pages/features/contract/provider";
import React from "react";
import { Routes, Route } from "react-router-dom";


const ContractRoutes: React.FC = () => {
  return (
    <Routes>
        <Route path="/deliveryman" element={<ProviderContractPage />} />
        <Route path="/provider" element={<DeliverymanContractPage />} />
        <Route path="/merchant" element={<ProviderContractPage />} />
    </Routes>
  );
};

export default ContractRoutes;
