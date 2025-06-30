// src/pages/Documents/DocumentService.ts

import { BackendDocument, BackendDocumentData } from '../models/DocumentModel'; // Import the interfaces
import { PaginationListOption } from "../../../@zenidata/models/Shared";
import apiClient, { handleAxiosError } from "../../../@zenidata/api/ApiClient";
import { ExportPayload } from '../components/DataForm/ExportPopup';

const DocumentService = {
  /**
   * Fetches documents from a specific folder with search, filtering, and pagination options.
   * (Keep the JSDoc from your original service)
   */
  getDocumentsByFolder: async (
    folderId: number,
    options: PaginationListOption = {
      search: "",
      status: "all",
      page: 1,
      limit: 10,
      orderBy: "id",
      direction: "asc",
    }
  ) => {
    const { search, status, page, limit, orderBy, direction } = options;

    try {
      const response = await apiClient.get(
        `/folders/${folderId}/documents?order_by=${orderBy}&order_direction=${direction}`,
        {
          params: { search, status, page, limit },
        }
      );

      // Use BackendDocument[] for type safety
      return {
        documents: response.data.documents as BackendDocument[], // Cast to BackendDocument[]
        pagination: response.data.pagination,
      };
    } catch (error) {
      handleAxiosError(error);
    }
  },

  /**
   * Fetches a document by its ID.
   * (Keep the JSDoc from your original service)
   */
  async getDocumentById(documentId: number): Promise<BackendDocument> {
    try {
      const response = await apiClient.get(`/documents/${documentId}`);
      return response.data as BackendDocument; // Cast to BackendDocument
    } catch (error) {
      handleAxiosError(error);
      throw error; // Important: Re-throw the error after handling it.
    }
  },

  /**
   * Creates a new document.
   * (Keep the JSDoc from your original service)
   */
    async createDocument(formData: FormData): Promise<BackendDocument> {  // Return BackendDocument
        try {
            formData.append("status", "pending");
            const response = await apiClient.post("/documents/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data.document as BackendDocument; // Cast to BackendDocument
        } catch (error) {
            handleAxiosError(error);
            throw error;
        }
    },

  /**
   * Updates an existing document.
   * (Keep the JSDoc)
   */
    async updateDocument(documentId: number, formData: FormData): Promise<BackendDocument> { // Return BackendDocument
    try {
      const response = await apiClient.put(
        `/documents/${documentId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data.document as BackendDocument; // Cast
    } catch (error) {
      handleAxiosError(error);
      throw error;
    }
  },

    /**
     * Updates the correctedData part of an existing document.
     * Now accepts BackendDocumentData instead of a string.
     */
    async updateDocumentCorrectedData(documentId: number, correctedData: BackendDocumentData): Promise<BackendDocument> {
        try {
            const response = await apiClient.patch(
                `/documents/${documentId}/correctedData`,
                {"corrected_data":correctedData} // Send the object directly
            );
            return response.data.document as BackendDocument; // Cast to BackendDocument
        } catch (error) {
            handleAxiosError(error);
            throw error; // Re-throw after handling
        }
    },

  /**
     * Updates the name of a document.
     */
    async updateDocumentName(documentId: number, name: string): Promise<BackendDocument> {
        try {
            const response = await apiClient.patch(
                `/documents/${documentId}/name`,
                { name: name }
            );
            return response.data as BackendDocument;
        } catch (error) {
            handleAxiosError(error);
            throw error;
        }
    },

  /**
   * Deletes a document by its ID.
   * (Keep the JSDoc)
   */
  async deleteDocument(documentId: number): Promise<any> { // Keep the original return type
    try {
      const response = await apiClient.delete(`/documents/${documentId}`);
      return response.data;
    } catch (error) {
      handleAxiosError(error);
      throw error;
    }
  },

  /**
   * Processes documents by generating random structuredData.
   * (Keep the JSDoc)
   */
  async processDocuments(documentIds: number[]): Promise<any> { // Keep original return type
    try {
      const response = await apiClient.post("/documents/process", {
        documentIds,
      });
      return response.data;
    } catch (error) {
      handleAxiosError(error);
      throw error;
    }
  },

  /**
   * Retrieves the status of the document processing.
   * (Keep the JSDoc)
   */
  async getProcessingStatus(documentIds: number[]): Promise<any> { // Keep original return type.
    try {
      const response = await apiClient.post(
        `/documents/process/status`,
        { documentIds },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      handleAxiosError(error);
      throw error;
    }
  },

  async getLastProcessedDocument(): Promise<any> { // Keep any if your backend type isn't defined
    try {
      const response = await apiClient.get(`/documents/last-processed`);
      return response.data;
    } catch (error) {
      handleAxiosError(error);
      throw error;
    }
  },

  async getLastProcessedCount(): Promise<any> { // Keep any
    try {
      const response = await apiClient.get(`/documents/processed-counts`);

      const {
        today,
        this_week: thisWeek,
        this_month: thisMonth,
        this_year: thisYear,
      } = response.data;
      return {
        today,
        thisWeek,
        thisMonth,
        thisYear,
      };
    } catch (error) {
      handleAxiosError(error);
      throw error;
    }
  },

  async getDocumentCountPerType(): Promise<any> { // Keep any
    try {
      const response = await apiClient.get(`/documents/counts-per-type`);
      return response.data;
    } catch (error) {
      handleAxiosError(error);
      throw error;
    }
  },
  async exportDocuments(payload: ExportPayload) {
    const response = await apiClient.post('/documents/export', payload, {
      responseType: 'blob' // Important for file downloads
    });
    return response;
  }
};



export default DocumentService;