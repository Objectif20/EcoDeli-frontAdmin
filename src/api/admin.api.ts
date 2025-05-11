import { AppDispatch } from "../redux/store";  
import { setAdmin, setLoading, setError, Admin } from "./../redux/slices/adminSlice";
import axiosInstance from "./axiosInstance";  

interface AdminData {
  admin_id : string;
  first_name: string;
  last_name: string;
  email: string;
  photo: string | "";
  active: boolean;
  roles: string[];
}

interface createAdminData {
  first_name: string;
  last_name: string;
  email: string;
  roles: string[];
}


export const getAdminData = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true)); 

  try {
    const response = await axiosInstance.get(`/admin/profile/me`);
    const adminData: Admin = response.data;

    dispatch(setAdmin(adminData));
    dispatch(setLoading(false)); 

  } catch (error) {
    dispatch(setError("Erreur lors de la récupération des données de l'admin"));
    dispatch(setLoading(false));
  }
};

export const updateAdminData = (data: Partial<Admin>, admin_id : string, file?: File,) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  const adminId = admin_id;

  try {
    const formData = new FormData();

    if (file) {
      formData.append("photo", file);
    }

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    const response = await axiosInstance.patch(`/admin/profile/${adminId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    dispatch(setAdmin(response.data));
    dispatch(setLoading(false));

  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'admin:", error);
    dispatch(setError("Erreur lors de la mise à jour des données de l'admin"));
    dispatch(setLoading(false));
  }
};

export const getAllAdmins = async (): Promise<AdminData[] | null> => {
  try {
    const response = await axiosInstance.get(`/admin/profile`);
    return response.data as AdminData[];
  } catch (error) {
    console.error("Erreur lors de la récupération des admins:", error);
    return null;
  }
};

export const newPassword = () => async () => {
  try {
    await axiosInstance.post(`/admin/profile/newPassword`);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du mot de passe:", error);
  }

  try {
    await axiosInstance.post(`/admin/auth/logout`);
  }
  catch (error) {
    console.error("Erreur lors de la déconnexion:", error);
  }
}


export const createAdmin = (data : createAdminData) => async () => {

    console.log(data);
    try {
      await axiosInstance.post(`/admin/profile`, data);
    } catch (error) {
      console.error("Erreur lors de la création de l'admin:", error);
    }

}

export const updateAdminRoles = async (admin_id: string, roles: string[]) => {
  console.log(admin_id, roles);

  const rolesUpperCase = roles.map(role => role.toUpperCase());

  try {
    await axiosInstance.patch(`/admin/profile/${admin_id}/role`, { roles: rolesUpperCase });
  } catch (error) {
    console.error("Erreur lors de la mise à jour des rôles de l'admin:", error);
  }
};
 
