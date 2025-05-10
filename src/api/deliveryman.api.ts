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

export interface DeliverymanDetails {
    info: {
      profile_picture: string | null
      first_name: string
      last_name: string
      validated: boolean | null
      description: string
      email: string
      phone: string
      document?: string
    },
    vehicles: Vehicle[]
  }
  
  export  interface Vehicle {
    id: string
    name: string
    matricule: string
    co2: number
    allow: boolean
    image: string
    justification_file: string
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

    static async getDeliverymanDetails(id: string): Promise<DeliverymanDetails> {
        try {
            const response = await axiosInstance.get(`/admin/deliveryPerson/${id}`);
            return response.data;
        } catch (error) {
            console.error("Erreur lors de la récupération des détails du livreur", error);
            throw new Error("Erreur lors de la récupération des détails du livreur");
        }
    }

    static async validateDeliveryman(id: string): Promise<void> {
        try {
            await axiosInstance.post(`/admin/deliveryPerson/${id}/validate`);
        } catch (error) {
            console.error("Erreur lors de la validation du livreur", error);
            throw new Error("Erreur lors de la validation du livreur");
        }
    }

    static async validateVehicle(id: string, deliveryPersonId : string): Promise<void> {
        try {
            await axiosInstance.post(`/admin/deliveryPerson/${deliveryPersonId}/vehicle/${id}/validate`);
        } catch (error) {
            console.error("Erreur lors de la validation du véhicule", error);
            throw new Error("Erreur lors de la validation du véhicule");
        }
    }



}