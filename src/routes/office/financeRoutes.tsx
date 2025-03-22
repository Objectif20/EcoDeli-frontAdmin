import NotFoundPage from "@/pages/error/404";
import SubscriberPage from "@/pages/features/general/subscriptions/subscribers";
import React from "react";
import { Routes, Route } from "react-router-dom";


const FinanceRoutes: React.FC = () => {
  return (
    <Routes>
        <Route path='/subscribers' element={<SubscriberPage />} />
        <Route path='/plans' element={<h1>Test</h1>} />
        <Route path='/*' element={<NotFoundPage />} />
    </Routes>
  );
};

export default FinanceRoutes;
