import NotFoundPage from "@/pages/error/404";
import TransactionsPage from "@/pages/features/finance/transaction";
import AddPlanPage from "@/pages/features/subscriptions/create";
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
        <Route path='/plans/create' element={<AddPlanPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path='/*' element={<NotFoundPage />} />
    </Routes>
  );
};

export default FinanceRoutes;
