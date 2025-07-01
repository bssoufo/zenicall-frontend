import apiClient, { handleAxiosError } from "../../@zenidata/api/ApiClient";
import Clinic, { ClinicCreateDto } from "./ClinicModel";

class ClinicService {
  async getClinics(): Promise<Clinic[]> {
    try {
      const response = await apiClient.get("/clinics/");
      return response.data.map(
        (item: any) => new Clinic(item.id, item.name, item.created_at, item.updated_at)
      );
    } catch (error) {
      handleAxiosError(error);
      return []; // Return empty array on error
    }
  }

  async getClinicById(id: string): Promise<Clinic> {
    try {
      const response = await apiClient.get(`/clinics/${id}`);
      const item = response.data;
      return new Clinic(item.id, item.name, item.created_at, item.updated_at);
    } catch (error) {
      handleAxiosError(error);
      throw error; // Re-throw for individual clinic errors
    }
  }

  async addClinic(dto: ClinicCreateDto): Promise<Clinic> {
    try {
      const response = await apiClient.post("/clinics/", {
        name: dto.name,
      });
      const item = response.data;
      return new Clinic(item.id, item.name, item.created_at, item.updated_at);
    } catch (error) {
      handleAxiosError(error);
    }
  }

  async getClinicsByUserEmail(userEmail: string): Promise<Clinic[]> {
    try {
      const response = await apiClient.get("/clinics/by-user-email", {
        params: { user_email: userEmail }
      });
      return response.data.map(
        (item: any) => new Clinic(item.id, item.name, item.created_at, item.updated_at)
      );
    } catch (error) {
      handleAxiosError(error);
      return []; // Return empty array on error
    }
  }
}

export default new ClinicService();