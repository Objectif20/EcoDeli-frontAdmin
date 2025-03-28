import axiosInstance from './axiosInstance';


export interface Report {
    report_id : string;
    status : string;
    state : string;
    report_message : string;
    user : {
        user_id : string;
        email : string;
    }
    admin : [{
        admin_id : string;
        email : string;
        first_name : string;
        last_name : string;
    }] | null
}


export class ReportApi {

        static async getReports(page : number, index : number) : Promise <{data : Report[], meta: { total: number, page: number, limit: number }}> {
            const response = await axiosInstance.get("/admin/reporting", {
                params: {
                  page: page + 1,
                  limit: index,
                },
              });
            return response.data;
        }

        static async getReportDetails(id: string): Promise<Report> {
            const response = await axiosInstance.get(`/admin/reporting/${id}`);
            return response.data;
        }

        static async responseReport(id: string, message: string): Promise<Report> {
            const response = await axiosInstance.post(`/admin/reporting/${id}`, {
                message: message
            });
            return response.data;
        }

        static async attributeReport(id: string, admin_id: string): Promise<Report> {
            const response = await axiosInstance.post(`/admin/reporting/${id}/attribution`, {
                admin_attribute: admin_id
            });
            return response.data;
        }

}