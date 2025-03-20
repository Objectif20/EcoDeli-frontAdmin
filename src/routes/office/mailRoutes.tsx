import EmailPage from "@/pages/features/mail/mail";
import React from "react";
import { Routes, Route } from "react-router-dom";


const MailRoutes: React.FC = () => {
  return (
    <Routes>
        <Route path='' element={<EmailPage />} />
    </Routes>
  );
};

export default MailRoutes;
