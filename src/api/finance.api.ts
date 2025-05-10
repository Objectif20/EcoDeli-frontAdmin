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
    
          const response = await axiosInstance.get("/transactions", {
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
      
          const response = await axiosInstance.get("/transactions/csv", {
            params: queryParams,
            responseType: "blob",
          });
      
          return response.data;
        } catch (error) {
          console.error("Error fetching transactions in CSV:", error);
          throw error;
        }
      }

}