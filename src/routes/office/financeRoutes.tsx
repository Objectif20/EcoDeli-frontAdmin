import NotFoundPage from "@/pages/error/404";
import PlansPage from "@/pages/features/subscriptions/plans";
import EditPlanPage from "@/pages/features/subscriptions/plans-update";
import SubscriberPage from "@/pages/features/subscriptions/subscribers";
import React from "react";
import { Routes, Route } from "react-router-dom";


const FinanceRoutes: React.FC = () => {
  return (
    <Routes>
        <Route path='/subscribers' element={<SubscriberPage />} />
        <Route path='/plans' element={<PlansPage />} />
        <Route path='/plans/:id' element={<EditPlanPage />} />
        <Route path='/*' element={<NotFoundPage />} />
    </Routes>
  );
};

export default FinanceRoutes;
