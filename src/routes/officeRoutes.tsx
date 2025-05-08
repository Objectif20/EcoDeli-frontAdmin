import Dashboard from "@/pages/features/dashboard";
import React from "react";
import { Routes, Route } from "react-router-dom";
import SettingsRoute from "./office/settingsRoutes";
import ProfileRoutes from "./office/profileRoutes";
import MailRoutes from "./office/mailRoutes";
import TicketRoutes from "./office/ticketRoutes";
import ReportRoutes from "./office/reportRoutes";
import GeneralConfigRoutes from "./office/generalRoutes";
import FinanceRoutes from "./office/financeRoutes";
import ContractRoutes from "./office/contractRoutes";

const OfficeRoute: React.FC = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/settings/*" element={<SettingsRoute />} />
      <Route path="/ticket/*" element={<TicketRoutes />} />
      <Route path='/profile/*' element={<ProfileRoutes />} />
      <Route path="/mail/*" element={<MailRoutes />} />
      <Route path="/reporting/*" element={<ReportRoutes />} />
      <Route path="/general/*" element={<GeneralConfigRoutes />} />
      <Route path="/finance/*" element={<FinanceRoutes />} />
      <Route path="/contract/*" element={<ContractRoutes />} />
    </Routes>
  );
};

export default OfficeRoute;
