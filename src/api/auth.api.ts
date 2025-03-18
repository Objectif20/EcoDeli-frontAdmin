import axiosInstance from "./axiosInstance";
import { store } from "../redux/store";
import { login, logout } from "../redux/slices/authSlice";

interface LoginResponse {
  access_token: string | null;
  two_factor_required?: boolean;
}

export const getAccessToken = async () => {
  const currentAccessToken = store.getState().auth.accessToken;

  if (currentAccessToken) {
    return { accessToken: currentAccessToken };
  }

  try {
    const response = await axiosInstance.post<LoginResponse>(
      "/admin/auth/refresh", 
      {}, 
      { withCredentials: true } 
    );

    if (response.data.access_token) {
      store.dispatch(login({ accessToken: response.data.access_token, twoFactorRequired: false }));
      return { accessToken: response.data.access_token };
    }

    throw new Error("Échec du rafraîchissement du token");
  } catch (error) {
    store.dispatch(logout()); 
    console.error("Erreur lors du rafraîchissement du token:", error);
    return { error: "Session expirée, veuillez vous reconnecter." };
  }
};

export const loginAdmin = async (email: string, password: string) => {
  try {
    const response = await axiosInstance.post<LoginResponse>("/admin/auth/login", { email, password });

    if (response.data.two_factor_required) {
      store.dispatch(login({ accessToken: null, twoFactorRequired: true }));
      return { twoFactorRequired: true };  
    } else {
      const { access_token } = response.data;  
      store.dispatch(login({ accessToken: access_token, twoFactorRequired: false }));
      return { accessToken: access_token }; 
    }
  } catch (error) {
    console.error("Erreur de connexion:", error);
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
    const currentAccessToken = store.getState().auth.accessToken;

    if (!currentAccessToken) {
      throw new Error("Aucun token d'accès disponible");
    }

    const response = await axiosInstance.post<LoginResponse>("/admin/auth/refresh", {
      token: currentAccessToken,
    });

    if (response.data.access_token) {
      store.dispatch(login({ accessToken: response.data.access_token, twoFactorRequired: false }));
      return { accessToken: response.data.access_token };
    }

    throw new Error("Échec du rafraîchissement du token");
  } catch (error) {
    store.dispatch(logout());
    console.error("Erreur lors du rafraîchissement du token:", error);
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
    console.error("Erreur lors de l'activation de la double authentification", error);
    throw new Error("Erreur lors de l'activation de la double authentification");
  }
};

export const disableA2F = async (adminId: string, code: string) => {
  try {
    const response = await axiosInstance.post("/admin/auth/2fa/disable", { adminId, code });
    return response.data;  
  } catch (error) {
    console.error("Erreur lors de la désactivation de la double authentification", error);
    throw new Error("Erreur lors de la désactivation de la double authentification");
  }
};

export const validateA2F = async (adminId: string, code: string) => {
  try {
    const response = await axiosInstance.post("/admin/auth/2fa/validate", { adminId, code });
    return response.data; 
  } catch (error) {
    console.error("Erreur lors de la validation 2FA", error);
    throw new Error("Erreur lors de la validation 2FA");
  }
};

export const requestPasswordReset = async (email: string) => {
  try {
    const response = await axiosInstance.post("/admin/auth/forgotPassword", { email });
    return response.data; 
  } catch (error) {
    console.error("Erreur lors de la demande de réinitialisation de mot de passe", error);
    throw new Error("Erreur lors de la demande de réinitialisation de mot de passe");
  }
};


export const newPassword = async (password: string, secretCode : string) => {

  try {
    const response = await axiosInstance.patch("/admin/auth/password", { password, secretCode });
    return response.data; 
  } catch (error) {
    console.error("Erreur lors de la réinitialisation du mot de passe", error);
    throw new Error("Erreur lors de la réinitialisation du mot de passe");
  }
}


export const newPasswordA2F = async (password: string, code: string, secretCode: string) => {
  try {
    const response = await axiosInstance.patch("/admin/auth/2fa/password", { password, code, secretCode });
    return response.data; 
  } catch (error) {
    console.error("Erreur lors de la réinitialisation du mot de passe avec 2FA", error);
    throw new Error("Erreur lors de la réinitialisation du mot de passe avec 2FA");
  }
}
