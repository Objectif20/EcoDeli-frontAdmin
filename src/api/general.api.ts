import axiosInstance from "./axiosInstance";

export interface Contracts {
    id: string
    nom: string
    prenom: string
    contratUrl: string
    dateContrat: string
    photoUrl: string
  }

export type VehicleCategory = {
    id: string
    name: string
    max_weight: number
    max_dimension: number
}

export class GeneralApi {

    static async getContracts(page: number = 1, type: string, q: string = ''): Promise<{ data : Contracts[], total : number}> {
        const response = await axiosInstance.get("/admin/general/contracts", {
            params: {
                page,
                type,
                q
            }
        });
        return response.data;
    }

    static async getVehiclesCategories(): Promise<{ data: VehicleCategory[], total: number }> {
        const response = await axiosInstance.get("/admin/general/vehicles-categories");
        return response.data;
    }

    static async addVehicleCategory(category: Omit<VehicleCategory, "id">): Promise<VehicleCategory> {
        const response = await axiosInstance.post("/admin/general/vehicles-categories", category);
        return response.data;
    }

    static async updateVehicleCategory(category: VehicleCategory): Promise<VehicleCategory> {
        const response = await axiosInstance.put(`/admin/general/vehicles-categories/${category.id}`, category);
        return response.data;
    }


}