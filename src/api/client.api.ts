import axiosInstance from "./axiosInstance";

export interface AllClient {
    id : string;
    profile_picture : string;
    first_name : string;
    last_name : string;
    email : string;
    nbDemandeDeLivraison: number;
    nbSignalements: number;
    nomAbonnement: string;
}


export interface ClientDetails {
    info: {
      profile_picture: string | null
      first_name: string
      last_name: string
      email: string
      nbDemandeDeLivraison: number
      nomAbonnement: string
      nbSignalements: number
      nombreDePrestations: number
      profilTransporteur: boolean
      idTransporteur?: string
    }
  }


export class ClientApi {


    static async getClientList(page: number, limit: number): Promise<{ data: AllClient[], meta: { total: number, page: number, lastPage: number }, totalRows: number }> {

        try {
            const response = await axiosInstance.get("/admin/clients", {
                params: {
                    page,
                    limit
                }
            });
            return response.data;
        } catch (error) {
            console.error("Erreur lors de la récupération des clients", error);
            throw new Error("Erreur lors de la récupération des clients");
        }
    }

    static async getClientDetails(id: string): Promise<ClientDetails> {
        try {
            const response = await axiosInstance.get(`/admin/clients/${id}`);
            return response.data;
        } catch (error) {
            console.error("Erreur lors de la récupération des détails du client", error);
            throw new Error("Erreur lors de la récupération des détails du client");
        }
    }


}