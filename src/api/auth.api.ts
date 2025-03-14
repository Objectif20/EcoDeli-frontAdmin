// src/api/auth.api.ts
import axiosInstance from "./axiosInstance";
import { store } from "../redux/store";
import { login, logout } from "../redux/slices/authSlice";

interface LoginResponse {
    accessToken: string | null;
    two_factor_required?: boolean;
  }

export const loginAdmin = async (email: string, password: string) => {
  try {
    const response = await axiosInstance.post<LoginResponse>("/admin/auth/login", { email, password });

    if (response.data.two_factor_required) {
      store.dispatch(login({ accessToken: null, twoFactorRequired: true }));
      return { twoFactorRequired: true };
    } else {
      const { accessToken } = response.data;
      store.dispatch(login({ accessToken, twoFactorRequired: false }));
      return { accessToken };
    }
  } catch (error) {
    throw new Error("Erreur de connexion");
  }
};

export const loginAdminA2F = async (email: string, password: string, code: string) => {
  try {
    const response = await axiosInstance.post("/admin/auth/2fa/login", { email, password, code });
    
    if (response && response.data && response.data.access_token) {
      return { accessToken: response.data.access_token }; 
    } else {
      throw new Error("Access token manquant dans la réponse de l'API");
    }
  } catch (error: any) {
    console.error("Erreur dans la requête 2FA:", error);
    throw new Error(error.response?.data?.message || "Erreur inconnue lors de la 2FA");
  }
};

export const refreshAccessToken = async () => {
  try {
    const response = await axiosInstance.post<LoginResponse>("/admin/auth/refresh", {
      token: store.getState().auth.accessToken,
    });

    if (response.data.accessToken) {
      store.dispatch(login({ accessToken: response.data.accessToken, twoFactorRequired: false }));
      return { accessToken: response.data.accessToken };
    }

    throw new Error("Échec du rafraîchissement du token");
  } catch (error) {
    store.dispatch(logout());
    return { error: "Session expirée, veuillez vous reconnecter." };
  }
};

export const logoutAdmin = async () => {
  try {
    await axiosInstance.post("/admin/auth/logout");
    store.dispatch(logout());
  } catch (error) {
    console.error("Erreur lors de la déconnexion", error);
  }
};

export const enableA2F = async (adminId: string) => {
  try {
    const response = await axiosInstance.post("/admin/auth/2fa/enable", { adminId });
    return response.data; 
  } catch (error) {
    throw new Error("Erreur lors de l'activation de la double authentification");
  }
};

export const disableA2F = async (adminId: string, code: string) => {
  try {
    const response = await axiosInstance.post("/admin/auth/2fa/disable", { adminId, code });
    return response.data; 
  } catch (error) {
    throw new Error("Erreur lors de la désactivation de la double authentification");
  }
};

export const validateA2F = async (adminId: string, code: string) => {
  try {
    const response = await axiosInstance.post("/admin/auth/2fa/validate", { adminId, code });
    return response.data; 
  } catch (error) {
    throw new Error("Erreur lors de la validation 2FA");
  }
};
