import axiosInstance from "./axiosInstance";


export interface AllDeliveryPerson {
    id : string;
    profile_picture : string;
    first_name : string;
    last_name : string;
    status : boolean;
    email : string;
    rate : number;
}


export class DeliverymanApi {

    static async getDeliverymanList(page: number, limit: number): Promise<{ data: AllDeliveryPerson[], meta: { total: number, page: number, lastPage: number } }> {

        try {
            const response = await axiosInstance.get("/admin/deliveryPerson", {
                params: {
                    page,
                    limit
                }
            });
            return response.data;
        } catch (error) {
            console.error("Erreur lors de la récupération des livreurs", error);
            throw new Error("Erreur lors de la récupération des livreurs");
        }
    }



}