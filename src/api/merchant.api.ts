import  axiosInstance  from "./axiosInstance";


export interface AllMerchant {
    id : string;
    companyName: string;
    siret : string;
    city : string;
    address : string;
    postalCode : string;
    country : string;
    phone : string;
    description : string;
    profilePicture : string | null;
    firstName : string;
    lastName : string;
}

interface MerchantDetails {
    info: {
      profile_picture: string | null
      first_name: string
      last_name: string
      description: string
      email: string
      phone: string
      nbDemandeDeLivraison: number
      nomAbonnement: string
      nbSignalements: number
      entreprise: string
      siret: string
      pays: string
    }
  }

export class MerchantAPI{

    static async getAllMerchants(pageIndex: number, pageSize: number): Promise<{ data: AllMerchant[], meta: { total: number, page: number, limit: number } }> {

        const response = await axiosInstance.get("/admin/merchants", {
            params: {
                page: pageIndex + 1,
                limit: pageSize,
            },
        });

        return response.data;

    }

    static async getMerchantDetails(id: string): Promise<MerchantDetails> {
        const response = await axiosInstance.get(`/admin/merchants/${id}`);
        return response.data;
    }


}