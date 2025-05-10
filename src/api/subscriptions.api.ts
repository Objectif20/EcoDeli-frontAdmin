import axiosInstance from "./axiosInstance";


export interface Subscribers {
    subscription_id: string;
    user_id: string;
    email: string;
    plan_id: string;
    plan_name: string;
    start_date: string;
    end_date: string;
    is_merchant: boolean;
}

export interface Subscriptions {
    plan_id?: string;
    name?: string;
    price?: number;
    priority_shipping_percentage?: string;
    priority_months_offered?: number;
    max_insurance_coverage?: string;
    extra_insurance_price?: string;
    shipping_discount?: string;
    permanent_discount?: string;
    permanent_discount_percentage?: string;
    small_package_permanent_discount?: string;
    first_shipping_free?: boolean;
    first_shipping_free_threshold?: string;
    is_pro?: boolean;
}


export class SubscriptionsApi {

    static async GetSubscribersList(page : number, limit : number) : Promise <{data: Subscribers[], meta : {total: number, page: number, lastPage: number}}> {
        try {
            const response = await axiosInstance.get("/admin/subscriptions/list",{
                params : {
                    page,
                    limit
                }
            });
            return response.data;
        } catch (error) {
            console.error("Erreur lors de la récupération des abonnements", error);
            throw new Error("Erreur lors de la récupération des abonnements");
        }
    }
    
    static async GetSubscriptions(): Promise<Subscriptions[]> {
        try {
            const response = await axiosInstance.get("/admin/subscriptions");
            return response.data;
        } catch (error) {
            console.error("Erreur lors de la récupération des abonnements", error);
            throw new Error("Erreur lors de la récupération des abonnements");
        }
    }
    
    static async GetSubscriptionById(id: string): Promise<Subscriptions> {
        try {
            const response = await axiosInstance.get(`/admin/subscriptions/${id}`);
            return response.data;
        } catch (error) {
            console.error("Erreur lors de la récupération de l'abonnement", error);
            throw new Error("Erreur lors de la récupération de l'abonnement");
        }
    }
    
    
    static async updateSubscription(id: string, data: Subscriptions): Promise<Subscriptions | { message: string }> {
        try {
            const response = await axiosInstance.patch(`/admin/subscriptions/${id}`, data);
            return response.data;
        } catch (error) {
            console.error("Erreur lors de la modification de l'abonnement", error);
            throw new Error("Erreur lors de la modification de l'abonnement");
        }
    
    }

    static async addSubscription(data: Subscriptions): Promise<Subscriptions | { message: string }> {
        try {
            const response = await axiosInstance.post("/admin/subscriptions", data);
            return response.data;
        } catch (error) {
            console.error("Erreur lors de l'ajout de l'abonnement", error);
            throw new Error("Erreur lors de l'ajout de l'abonnement");
        }
    }

}




