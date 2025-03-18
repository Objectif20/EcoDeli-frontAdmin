import Dashboard from "@/pages/features/dashboard";
import CreateTicket from "@/pages/features/ticket/createTicket";
import Ticket from "@/pages/features/ticket/ticket";
import TicketUnique from "@/pages/features/ticket/ticketUnique";
import React from "react";
import { Routes, Route } from "react-router-dom";
import SettingsRoute from "./settingsRoutes";

const OfficeRoute: React.FC = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/settings/*" element={<SettingsRoute />} />
      <Route path="/ticket" element={<Ticket />} />
      <Route path="/ticket/:id" element={<TicketUnique />} />
      <Route path="/ticket/create" element={<CreateTicket />} />
    </Routes>
  );
};

export default OfficeRoute;
