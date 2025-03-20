import CreateTicket from "@/pages/features/ticket/createTicket";
import Ticket from "@/pages/features/ticket/ticket";
import TicketUnique from "@/pages/features/ticket/ticketUnique";
import React from "react";
import { Routes, Route } from "react-router-dom";


const TicketRoutes: React.FC = () => {
  return (
    <Routes>
        <Route path='/' element={<Ticket />} />
        <Route path=":id" element={<TicketUnique />} />
        <Route path="create" element={<CreateTicket />} />
    </Routes>
  );
};

export default TicketRoutes;
