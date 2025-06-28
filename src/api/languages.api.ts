import axiosInstance from "./axiosInstance";

export interface Language {
    language_id: string;
    language_name: string;
    iso_code: string;
    active : boolean;
    fileUrl?: string;
}

export interface CreateLanguage {
    language_name: string;
    iso_code: string;
    active : boolean;
}

export interface UpdateLanguage {
    language_name?: string;
    iso_code?: string;
    active?: boolean;
}


export class LanguageApi {

  static async getLanguages(page : number, limit : number) : Promise<{data: Language[], meta : {total: number, page: number, lastPage: number}}> {
    try {
      const response = await axiosInstance.get("/admin/languages",{
          params : {
              page,
              limit
          }
      } );
      return response.data; 
    } catch (error) {
      console.error("Erreur lors de la récupération des langues", error);
      throw new Error("Erreur lors de la récupération des langues");
    }
  }

  static async getLanguageById(id: string): Promise<Language> {
    try {
      const response = await axiosInstance.get(`/admin/languages/${id}/details`)
      return response.data
    } catch (error) {
      console.error("Erreur lors de la récupération de la langue", error)
      throw new Error("Erreur lors de la récupération de la langue")
    }
  }

  static async addLanguage(data : CreateLanguage, languages : File) : Promise<Language | {message : string}> {
    try {
      const formData = new FormData();
      formData.append("language_name", data.language_name);
      formData.append("iso_code", data.iso_code);
      formData.append("active", data.active.toString());
      formData.append("languages", languages);
      const response = await axiosInstance.post("/admin/languages", formData);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de l'ajout de la langue", error);
      throw new Error("Erreur lors de l'ajout de la langue");
    }
  
  }

  static async updateLanguage(id : string, data ?: UpdateLanguage, languages ?: File) : Promise<Language | {message : string}> {
    try {
      const formData = new FormData();
      if (data) {
          if(data.language_name) formData.append("language_name", data.language_name);
          if(data.iso_code) formData.append("iso_code", data.iso_code);
          if(data.active) { formData.append("active", data.active.toString())}
          else {
              formData.append("active", "false");
          };
          if (data.active !== undefined) {
              console.log(data.active.toString());
          }
      }
      if(languages) formData.append("languages", languages);
      const response = await axiosInstance.put(`/admin/languages/${id}`, formData);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la langue", error);
      throw new Error("Erreur lors de la mise à jour de la langue");
    }
  
  }

  static async getDefaultLanguage(id: string) : Promise<any> {
    try {
      const response = await axiosInstance.get(`/admin/languages/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération de la langue par défaut", error);
      throw new Error("Erreur lors de la récupération de la langue par défaut");
    }
  }

  static async getFrenchLanguage() : Promise<any> {
    try {
      const response = await axiosInstance.get("/admin/languages/french");
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération de la langue française", error);
      throw new Error("Erreur lors de la récupération de la langue française");
    }
  }

  static async getAlllanguage(): Promise<Language[]> {
    try {
        const response = await axiosInstance.get("/client/register/language");
        return response.data;
    } catch (error) {
        console.error("Error fetching languages:", error);
        return [];
    }
}

}







