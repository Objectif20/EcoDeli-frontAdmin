import axiosInstance from "./axiosInstance";



export interface Mail{
    id: string;
    subject : string;
    sentDate : string;
    isSent : boolean;
    author : string;
    profiles : string[];
    content : string;
    isNewsletter : boolean;
}


export class Mail {


    static async getAllMail(pageIndex : number, pageSize : number) : Promise<{data : Mail[], meta: { total: number, page: number, limit: number }, totalRows: number}> {

        const response = await axiosInstance.get("/admin/mails", {
            params: {
              page: pageIndex + 1,
              limit: pageSize,
            },
          });
        return response.data;
    }

    static async getMail(id: string) : Promise <Mail> {

        const response = await axiosInstance.get(`/admin/mails/${id}`);
        return response.data;

    }

    static async createMail(mail : Mail) : Promise<{message : string}> {

        const response = await axiosInstance.post("/admin/mails", mail)

        if (response) {
            return response.data;
        }

        return { message: "Failed to create mail" };
    }


}


