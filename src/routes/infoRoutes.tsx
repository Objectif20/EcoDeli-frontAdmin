import NewPasswordSend from "@/pages/info/new-password-send";
import React from "react";
import { Routes, Route } from "react-router-dom";


const InfoRoute: React.FC = () => {
  return (
    <Routes>
        <Route path='/newPasswordSend' element={<NewPasswordSend />} />
    </Routes>
  );
};

export default InfoRoute;
