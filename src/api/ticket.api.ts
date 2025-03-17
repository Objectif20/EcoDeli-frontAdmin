import axiosInstance from '@/api/axiosInstance';

export interface Admin {
    last_name: string;
    first_name: string;
    photo: string;
}

export interface Ticket {
    ticket_id?: string;
    status: string;
    assignment?: string;
    state?: string;
    description: string;
    title: string;
    creation_date?: string;
    resolution_date?: string | null;
    priority: string;
    admin_id_attribute?: string;
    admin_id_get?: string;
    adminAttribute?: Admin;
    adminGet?: Admin;
}

export class TicketService {
    static async getTickets(): Promise<Ticket[]> {
        const response = await axiosInstance.get('/admin/ticket');
        return response.data;
    }

    static async getStoredTickets(): Promise<Ticket[]> {
        const response = await axiosInstance.get('/admin/ticket/stored');
        return response.data;
    }

    static async getTicketById(id: string): Promise<Ticket> {
        const response = await axiosInstance.get(`/admin/ticket/${id}`);
        return response.data;
    }

    static async createTicket(ticketData: Ticket): Promise<Ticket> {
        const response = await axiosInstance.post('/admin/ticket', ticketData);
        return response.data;
    }

    static async updateTicket(id: string, updateData: Partial<Ticket>): Promise<Ticket> {
        const response = await axiosInstance.patch(`/admin/ticket/${id}`, updateData);
        return response.data;
    }

    static async deleteTicket(id: string): Promise<{ message: string }> {
        const response = await axiosInstance.delete(`/admin/ticket/${id}`);
        return response.data;
    }
}