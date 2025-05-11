import axiosInstance from "./axiosInstance";

export type TransactionType = "sub" | "in" | "out"
export type TransactionCategory = "sub" | "delivery" | "service"

export type Transaction = {
  id: string
  name: string
  type: TransactionType
  category: TransactionCategory
  date: string
  invoiceUrl?: string
}

export interface StripeStats {
  revenue: RevenueStats;
  customers: CustomerStats;
  payments: PaymentStats;
  transactions: TransactionStripe[];
}

export interface RevenueStats {
  total: number;
  previousPeriod: number;
  percentChange: number;
  byPeriod: PeriodData[];
}

export interface CustomerStats {
  total: number;
  new: number;
  percentChange: number;
  activeSubscribers: number;
}

export interface PaymentStats {
  successRate: number;
  averageValue: number;
  refundRate: number;
  byMethod: PaymentMethod[];
}

export interface PaymentMethod {
  method: string;
  count: number;
  value: number;
}

export interface PeriodData {
  date: string;
  revenue: number;
  profit: number;
  margin: number;
}


export interface TransactionStripe {
  method: string;
  number: number;
}

export interface DashboardStats {
  plan: PlanChartData[];
  parcels: ParcelsChartData[];
  area: AreaChartData[];
  subscription: SubscriptionChartData[];
}

export interface AreaChartData {
  date: string;
  provider: number;
  delivery: number;
}

export interface SubscriptionChartData {
  month: string;
  subscription: number;
}

export interface PlanChartData {
  plan: string;
  number: number;
  fill: string;
}

export interface ParcelsChartData {
  taille: string;
  nombre: number;
}

export class FinanceApi {

    static async getTransactions(params: {
        name?: string;
        type?: TransactionType;
        year?: string;
        month?: string;
        pageIndex: number;
        pageSize: number;
      }) {
        try {
          const queryParams = new URLSearchParams();
    
          if (params.name) {
            queryParams.append("name", params.name);
          }
    
          if (params.type) {
            queryParams.append("type", params.type);
          }
    
          if (params.year) {
            queryParams.append("year", params.year);
          }
    
          if (params.month) {
            queryParams.append("month", params.month);
          }
    
          queryParams.append("pageIndex", params.pageIndex.toString());
          queryParams.append("pageSize", params.pageSize.toString());
    
          const response = await axiosInstance.get("/client/finance/transactions", {
            params: queryParams,
          });
    
          return response.data;
        } catch (error) {
          console.error("Error fetching transactions:", error);
          throw error;
        }
      }
    
    static async getTransactionInCsv(params?: {
    startMonth?: string
    startYear?: string
    endMonth?: string
    endYear?: string
    categories?: TransactionCategory[]
    }) {
    try {
        const queryParams = new URLSearchParams();
    
        if (params?.startMonth) queryParams.append("startMonth", params.startMonth);
        if (params?.startYear) queryParams.append("startYear", params.startYear);
        if (params?.endMonth) queryParams.append("endMonth", params.endMonth);
        if (params?.endYear) queryParams.append("endYear", params.endYear);
        if (params?.categories && params.categories.length > 0) {
        for (const category of params.categories) {
            queryParams.append("categories", category);
        }
        }
    
        const response = await axiosInstance.get("/client/finance/transactions/csv", {
        params: queryParams,
        responseType: "blob",
        });
    
        return response.data;
    } catch (error) {
        console.error("Error fetching transactions in CSV:", error);
        throw error;
    }
    }

    static async getStripeStats(): Promise<StripeStats> {
        try {
            const response = await axiosInstance.get("/client/finance/stripe");
            return response.data;
        } catch (error) {
            console.error("Error fetching Stripe stats:", error);
            throw error;
        }
    }


    static async getDashboardStats(): Promise<DashboardStats> {
        try {
            const response = await axiosInstance.get("/client/finance/dashboard");
            return response.data;
        } catch (error) {
            console.error("Error fetching dashboard stats:", error);
            throw error;
        }
    }

}