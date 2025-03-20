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




}