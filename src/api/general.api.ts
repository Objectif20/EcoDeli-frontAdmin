import axiosInstance from "./axiosInstance";

export interface Contracts {
    id: string
    nom: string
    prenom: string
    contratUrl: string
    dateContrat: string
    photoUrl: string
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


}