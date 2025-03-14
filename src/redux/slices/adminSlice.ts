import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Admin {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  langue: string;
}

export interface AdminState {
  admin: Admin | null;
}

const initialState: AdminState = {
  admin: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setAdmin: (state, action: PayloadAction<Admin | null>) => {
      state.admin = action.payload;
    },
    updateLang: (state, action: PayloadAction<string>) => {
      if (state.admin) {
        state.admin.langue = action.payload;
      }
    },
  },
});

export const { setAdmin, updateLang } = adminSlice.actions;
export default adminSlice.reducer;
