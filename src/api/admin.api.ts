import { AppDispatch } from "../redux/store";  
import { setAdmin, setLoading, setError } from "./../redux/slices/adminSlice";
import axiosInstance from "./axiosInstance";  

export const getAdminData = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true)); 

  try {
    const response = await axiosInstance.get(`/admin/profile/me`);

    const adminData = response.data;
    dispatch(setAdmin({
      admin_id: adminData.admin_id,
      first_name: adminData.first_name,
      last_name: adminData.last_name,
      email: adminData.email,
      photo: adminData.photo,
      active: adminData.active,
      super_admin: adminData.super_admin,
      language: adminData.language,  
      iso_code: adminData.iso_code,
      roles: adminData.roles,
    }));

    dispatch(setLoading(false)); 

  } catch (error) {
    dispatch(setError("Erreur lors de la récupération des données de l'admin"));
    dispatch(setLoading(false));
  }
};
