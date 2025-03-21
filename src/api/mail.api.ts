import axiosInstance from "./axiosInstance";

export interface Mail {
    id: string;
    subject: string;
    sentDate: string;
    isSent: boolean;
    author: string;
    profiles: string[];
    content: string;
    isNewsletter: boolean;
}

export interface MailSchedule {
    subject : string;
    htmlContent : string;
    day : string;
    hour : string;
    profiles : string[] | null;
}

export interface SendMail {
    subject : string;
    htmlContent : string;
}

export interface SendEmailToProfiles {
    subject : string;
    htmlContent : string;
    profiles : string[];
}

export class MailService {
    static async getAllMail(pageIndex: number, pageSize: number): Promise<{ data: Mail[], meta: { total: number, page: number, limit: number }, totalRows: number }> {
        const response = await axiosInstance.get("/admin/mails", {
            params: {
                page: pageIndex + 1,
                limit: pageSize,
            },
        });

        return {
            data: response.data.results.map((mail: any) => ({
                id: mail._id,
                subject: mail.subject,
                sentDate: mail.date,
                isSent: mail.send,
                author: mail.admin_id,
                profiles: mail.profile,
                content: mail.message,
                isNewsletter: mail.newsletter,
            })),
            meta: {
                total: response.data.total,
                page: pageIndex + 1,
                limit: pageSize,
            },
            totalRows: response.data.total
        };
    }

    static async getMail(id: string): Promise<Mail> {
        const response = await axiosInstance.get(`/admin/mails/${id}`);
        return {
            id: response.data._id,
            subject: response.data.subject,
            sentDate: response.data.date,
            isSent: response.data.send,
            author: response.data.admin_id,
            profiles: response.data.profile,
            content: response.data.message,
            isNewsletter: response.data.newsletter,
        };
    }

    static async createScheduleMail(mailSchedule: MailSchedule): Promise<{message : string}> {
        const response = await axiosInstance.post("/admin/mails/schedule", mailSchedule);

        if (response) {
            return {
                message: "Mail scheduled successfully"
            };
        }

        return {
            message: "Mail failed to schedule"
        };
    }

    static async sendMail(sendMail: SendEmailToProfiles): Promise<{message : string}> {
        const response = await axiosInstance.post("/admin/mails/profiles", sendMail);

        if (response) {
            return {
                message: "Mail sent successfully"
            };
        }

        return {
            message: "Mail failed to send"
        };
    }

    static async sendMailtoEveryone(sendMail: SendMail): Promise<{message : string}> {
        const response = await axiosInstance.post("/admin/mails/", sendMail);

        if (response) {
            return {
                message: "Mail sent successfully"
            };
        }

        return {
            message: "Mail failed to send"
        };
    }


}
