import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Admin {
  admin_id: string;
  first_name: string;
  last_name: string;
  email: string;
  photo: string | null;
  active: boolean;
  super_admin: boolean;
  language: string;  
  iso_code: string; 
  language_id: string;
  roles: string[];
  otp?:boolean | false;
}

export interface AdminState {
  admin: Admin | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  admin: null,
  isLoading: false,
  error: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setAdmin: (state, action: PayloadAction<Admin | null>) => {
      state.admin = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    updateLang: (state, action: PayloadAction<string>) => {
      if (state.admin) {
        state.admin.language = action.payload;
      }
    },
    updateA2FStatus: (state, action: PayloadAction<boolean>) => {
      if (state.admin) {
        state.admin.otp = action.payload;
      }
    },
  },
});

export const { setAdmin, setLoading, setError, updateLang, updateA2FStatus } = adminSlice.actions;
export default adminSlice.reducer;
