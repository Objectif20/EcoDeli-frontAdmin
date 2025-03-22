import NotFoundPage from "@/pages/error/404";
import CreateMail from "@/pages/features/mail/createMail";
import EmailPage from "@/pages/features/mail/mail";
import React from "react";
import { Routes, Route } from "react-router-dom";


const MailRoutes: React.FC = () => {
  return (
    <Routes>
        <Route path='' element={<EmailPage />} />
        <Route path="/create" element={<CreateMail />} />
        <Route path='/*' element={<NotFoundPage />} />
    </Routes>
  );
};

export default MailRoutes;
