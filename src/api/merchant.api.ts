import  axiosInstance  from "./axiosInstance";


export interface Merchant {
    id : string;
    companyName: string;
    siret : string;
    city : string;
    address : string;
    postalCode : string;
    country : string;
    phone : string;
    stripeCustomerId : string;
    description : string;
    merchantContracts : string[];
}

export class MerchantAPI{

    static async getAllMerchants(pageIndex: number, pageSize: number): Promise<{ data: Merchant[], meta: { total: number, page: number, limit: number } }> {

        const response = await axiosInstance.get("/admin/merchants", {
            params: {
                page: pageIndex + 1,
                limit: pageSize,
            },
        });

        return response.data;

    }


}