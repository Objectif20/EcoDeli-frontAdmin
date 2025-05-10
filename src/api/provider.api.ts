import axiosInstance from "./axiosInstance";

export interface Provider {
    id : string;
    email : string;
    name : string;
    rate : number;
    service_number: number;
    company : string;
    profile_picture: string | null;
    status : string;
    phone_number: string;
}


export interface ProviderDetails {
  info : {
    id: string;
    email: string;
    name: string;
    company: string;
    siret: string;
    address: string;
    phone: string;
    description: string;
    postal_code: string;
    city: string;
    country: string;
    validated: boolean;
    service_type: string;
    admin: {
      id: string;
      name: string;
      photo: string;
    };
    profile_picture: string | null;
  }
  
  documents?: Document[];
  services?: Service[];
  contracts?: Contract[];
}

interface Document {
  id: string;
  name: string;
  description: string;
  submission_date: string;
  url: string;
}

interface Service {
  id: string;
  name: string;
  description: string;
  status: string;
  price: number;
  price_admin: number;
  duration_minute: number;
  available: boolean;
  keywords?: Keyword[];
  images?: Image[];
  validated: boolean;
}

interface Keyword {
  id: string;
  keyword: string;
}

interface Image {
  id: string;
  url: string;
}

interface Contract {
  id: string;
  company_name: string;
  siret: string;
  address: string;
}

export interface ServiceDTO {
  id : string;
  validated : boolean;
  price_admin ?: number;
}

export class Provider {

    static async getAllProviders(pageIndex : number, pageSize : number): Promise<{data : Provider[], meta: { total: number, page: number, limit: number }, totalRows: number}> {
        const response = await axiosInstance.get("/admin/providers", {
            params: {
              page: pageIndex + 1,
              limit: pageSize,
            },
          });
        return response.data;
    }      
    
    static async getProviderDetails(id: string): Promise<ProviderDetails> {
      const response = await axiosInstance.get(`/admin/providers/${id}`);
      return response.data;
    }

    static async updateProviderStatus(id: string, validated: boolean): Promise<void> {
      await axiosInstance.post(`/admin/providers/${id}/validate`, { validated });
    }

    static async updateServiceStatus(providerId: string, serviceId: string, validated: boolean, price_admin ?: number): Promise<void> {
      await axiosInstance.post(`/admin/providers/${providerId}/services/${serviceId}/validate`, { validated, price_admin });
    }

    static async validateService(providerId: string, serviceId: string, price_admin : number) : Promise<void> {
      await axiosInstance.post(`/admin/providers/${providerId}/service/${serviceId}/validate`, { price_admin });
    }

}