import Dashboard from "@/pages/features/dashboard";
import AdminSettings from "@/pages/features/settings/profile";
import Ticket from "@/pages/features/ticket/ticket";
import TicketUnique from "@/pages/features/ticket/ticketUnique";
import React from "react";
import { Routes, Route } from "react-router-dom";

const OfficeRoute: React.FC = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/settings" element={<AdminSettings />} />
      <Route path="/ticket" element={<Ticket />} />
      <Route path="/ticket/:id" element={<TicketUnique />} />
    </Routes>
  );
};

export default OfficeRoute;
