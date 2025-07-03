// src/modules/call-logs/InternalNotesService.ts
// Service for Internal Notes API interactions, based on OpenAPI schema.

import apiClient, { handleAxiosError } from "../../@zenidata/api/ApiClient";
import { UserInClinicRead } from "./CallLogModel";

// Internal Note interfaces (matching OpenAPI)
export interface InternalNoteCreate {
  content: string;
  call_log_id: string;
}

export interface InternalNoteUpdate {
  content: string;
}

export interface InternalNoteRead {
  id: string;
  content: string;
  call_log_id: string;
  created_by_user_id: number;
  created_by?: UserInClinicRead | null;
  created_at: string;
  updated_at?: string | null;
}

export interface InternalNoteListView {
  id: string;
  content: string;
  created_by?: UserInClinicRead | null;
  created_at: string;
  updated_at?: string | null;
}

export interface InternalNotePage {
  items: InternalNoteListView[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

// Pagination options for notes
interface NotePaginationOptions {
  page?: number;
  limit?: number;
}

const InternalNotesService = {
  /**
   * Create a new internal note for a call log.
   * POST /api/v1/internal-notes/
   */
  async createNote(noteData: InternalNoteCreate): Promise<InternalNoteRead> {
    try {
      const response = await apiClient.post('/internal-notes/', noteData);
      return response.data as InternalNoteRead;
    } catch (error) {
      handleAxiosError(error);
      throw error;
    }
  },

  /**
   * Get internal note by ID.
   * GET /api/v1/internal-notes/{note_id}
   */
  async getNoteById(noteId: string): Promise<InternalNoteRead> {
    try {
      const response = await apiClient.get(`/internal-notes/${noteId}`);
      return response.data as InternalNoteRead;
    } catch (error) {
      handleAxiosError(error);
      throw error;
    }
  },

  /**
   * Update internal note (only the creator can modify it).
   * PUT /api/v1/internal-notes/{note_id}
   */
  async updateNote(noteId: string, noteData: InternalNoteUpdate): Promise<InternalNoteRead> {
    try {
      const response = await apiClient.put(`/internal-notes/${noteId}`, noteData);
      return response.data as InternalNoteRead;
    } catch (error) {
      handleAxiosError(error);
      throw error;
    }
  },

  /**
   * Delete internal note (only the creator can delete it).
   * DELETE /api/v1/internal-notes/{note_id}
   */
  async deleteNote(noteId: string): Promise<InternalNoteRead> {
    try {
      const response = await apiClient.delete(`/internal-notes/${noteId}`);
      return response.data as InternalNoteRead;
    } catch (error) {
      handleAxiosError(error);
      throw error;
    }
  },

  /**
   * List internal notes for a specific call log with pagination.
   * GET /api/v1/internal-notes/call-log/{call_log_id}
   */
  async getNotesForCallLog(
    callLogId: string, 
    options: NotePaginationOptions = {}
  ): Promise<InternalNotePage> {
    try {
      const params = {
        page: options.page || 1,
        limit: options.limit || 20,
      };
      
      const response = await apiClient.get(
        `/internal-notes/call-log/${callLogId}`,
        { params }
      );
      return response.data as InternalNotePage;
    } catch (error) {
      handleAxiosError(error);
      throw error;
    }
  },

  /**
   * List my internal notes (notes created by current user) with pagination.
   * GET /api/v1/internal-notes/my-notes
   */
  async getMyNotes(options: NotePaginationOptions = {}): Promise<InternalNotePage> {
    try {
      const params = {
        page: options.page || 1,
        limit: options.limit || 20,
      };
      
      const response = await apiClient.get('/internal-notes/my-notes', { params });
      return response.data as InternalNotePage;
    } catch (error) {
      handleAxiosError(error);
      throw error;
    }
  },
};

export default InternalNotesService;