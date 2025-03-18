import { useEffect } from "react";
import { logout } from "@/redux/slices/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutAdmin } from "@/api/auth.api";

export default function LogoutPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(logout());
    logoutAdmin();
    navigate("/auth/login");
  }, [dispatch, navigate]); 

  return null;
}
