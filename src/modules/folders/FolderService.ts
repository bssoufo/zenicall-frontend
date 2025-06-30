// src/services/FolderService.js

// import axios, { AxiosInstance } from "axios";
import apiClient, { handleAxiosError } from "../../@zenidata/api/ApiClient";
import { PaginationListOption } from "../../@zenidata/models/Shared";
import Folder, { FolderCreateDto } from "./FolderModel";
// import { AppEnv } from "../config/AppEnv";

class FolderService {
  // API_BASE_URL: string;
  // axiosInstance: AxiosInstance;

  constructor() {
    // this.API_BASE_URL = AppEnv.API_BASE_URL;
    // apiClient = axios.create({
    //   baseURL: this.API_BASE_URL,
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // });
    // apiClient.interceptors.request.use((config) => {
    //   const token = localStorage.getItem("token"); // Assurez-vous que le token est stocké correctement
    //   if (token) {
    //     config.headers.Authorization = `Bearer ${token}`;
    //   }
    //   return config;
    // });
  }

  /**
   * Récupère la liste des dossiers avec options de recherche, filtrage et pagination.
   * @param {Object} params - Paramètres de requête.
   * @param {string} params.search - Terme de recherche.
   * @param {string} params.status - Filtre de statut.
   * @param {number} params.page - Numéro de la page.
   * @param {number} params.limit - Nombre d'items par page.
   * @returns {Promise<Object>} - Retourne les dossiers et les informations de pagination.
   */
  async getFolders(
    options: PaginationListOption = {
      search: "",
      status: "all",
      page: 1,
      limit: 10,
      orderBy: "id",
      direction: "asc",
    }
  ) {
    const { search, status, page, limit, orderBy, direction } = options;
    try {
      const response = await apiClient.get("/folders/", {
        params: {
          search,
          status,
          page,
          limit,
          order_by: orderBy,
          order_direction: direction,
        },
      });
      return {
        ...response.data,
        folders: response.data.folders.map(
          (folder: Folder) => folder // new Folder(folder)
        ),
      };
    } catch (error) {
      handleAxiosError(error);
    }
  }

  /**
   * Supprime un dossier par son identifiant.
   * @param {string} id - Identifiant du dossier à supprimer.
   * @returns {Promise<Object>} Réponse de l'API.
   */
  async deleteFolder(id: number) {
    try {
      const response = await apiClient.delete(`/folders/${id}`);
      return response.data;
    } catch (error) {
      handleAxiosError(error);
    }
  }

  /**
   * Ajoute un nouveau dossier.
   * @param {Object} folderData - Données du dossier à ajouter.
   * @returns {Promise<Object>} Réponse de l'API.
   */
  async addFolder(folderData: FolderCreateDto) {
    try {
      const response = await apiClient.post("/folders/", {
        name: folderData.name,
        reception_email: folderData.receptionEmail,
        document_type: folderData.documentType,
        retention_duration: folderData.retentionDuration,
        status: folderData.status,
      });
      return {
        ...response.data,
        folder: response.data.folder, //new Folder(response.data.folder),
      };
    } catch (error) {
      handleAxiosError(error);
    }
  }

  /**
   * Modifie un dossier existant.
   * @param {string} id - Identifiant du dossier à modifier.
   * @param {Object} folderData - Nouvelles données du dossier.
   * @returns {Promise<Object>} Réponse de l'API.
   */
  async updateFolder(id: number, folderData: FolderCreateDto) {
    try {
      const response = await apiClient.post("/folders/", {
        id,
        name: folderData.name,
        reception_email: folderData.receptionEmail,
        document_type: folderData.documentType,
        retention_duration: folderData.retentionDuration,
        status: folderData.status,
      });
      return {
        ...response.data,
        folder: response.data.folder, //new Folder(response.data.folder),
      };
    } catch (error) {
      handleAxiosError(error);
    }
  }

  /**
   * Récupère un dossier par son identifiant.
   * @param {string} id - Identifiant du dossier.
   * @returns {Promise<Object>} Détails du dossier.
   */
  async getFolderById(id: number) {
    try {
      const response = await apiClient.get(`/folders/${id}`);
      return response.data; //new Folder(response.data.folder);
    } catch (error) {
      handleAxiosError(error);
    }
  }

  /**
   * Récupère la liste des types de documents autorisés.
   * @returns {Promise<Array>} Liste des types de documents.
   */
  async getAllowedDocumentTypes() {
    try {
      const response = await apiClient.get("/folders/allowedDocumentTypes");
      return response.data.allowedDocumentTypes;
    } catch (error) {
      handleAxiosError(error);
    }
  }

  /**
   * Ajoute un nouveau type de document autorisé.
   * @param {string} documentType - Type de document à ajouter.
   * @returns {Promise<Object>} Réponse de l'API.
   */
  async addDocumentType(documentType: string) {
    try {
      const response = await apiClient.post("/folders/allowedDocumentTypes", {
        documentType,
      });
      return response.data;
    } catch (error) {
      handleAxiosError(error);
    }
  }

  async getMostUsedFolders() {
    const response = await apiClient.get("/folders/most-used");
    return response.data;
  }

  async getUsersTotalFolder() {
    const response = await apiClient.get("/folders/count");
    return response.data.folder_count;
  }
}

export default new FolderService();
