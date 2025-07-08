// src/modules/call-logs/CallLogService.ts
// Service for Call Logs API interactions, based on spec-call.md endpoints.

import apiClient, { handleAxiosError } from "../../@zenidata/api/ApiClient";
import {
  CallLogListView,
  CallLogDetailView,
} from "./CallLogModel";
import { PaginationListOption } from "../../@zenidata/models/Shared";

// Response shape for listing call logs
interface CallLogPage {
  items: CallLogListView[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

// Search options for advanced filtering
interface CallLogSearchOptions {
  caller_first_name?: string;
  caller_last_name?: string;
  caller_phone_number?: string;
  start_date?: string;
  end_date?: string;
  status?: string[];  // Changed to array for multiple status filtering
  reason_for_call?: string[];  // Also changed to array for consistency
  page?: number;
  limit?: number;
}

const CallLogService = {
  /**
   * Fetch new call logs for dashboard (optimal endpoint for 'NEW' status).
   * Uses the dedicated /call-logs/new endpoint for performance.
   */
  async getNewCallLogs(
    clinicId: string,
    options: Partial<PaginationListOption> = {}
  ): Promise<CallLogPage> {
    try {
      const response = await apiClient.get(
        `/call-logs/by-clinic/${clinicId}`,
        { params: { ...options, status: 'NEW' } }
      );
      const data = response.data;
      return {
        items: data.items as CallLogListView[],
        total: data.total,
        page: data.page,
        limit: data.limit,
        pages: data.pages,
      };
    } catch (error) {
      handleAxiosError(error);
      throw error;
    }
  },

  /**
   * Advanced search for call logs with filtering capabilities.
   * Optimal for complex filtering with first name, last name, and date ranges.
   * 
   * Example API payload:
   * {
   *   "clinic_id": "uuid",
   *   "caller_first_name": "John",
   *   "status": ["IN_PROGRESS", "NEW"],
   *   "reason_for_call": ["NEW_APPOINTMENT"]
   * }
   */
  async searchCallLogs(
    clinicId: string,
    options: CallLogSearchOptions = {}
  ): Promise<CallLogPage> {
    try {
      const searchPayload = {
        clinic_id: clinicId,
        ...options
      };
      
      const queryParams = {
        page: options.page || 1,
        limit: options.limit || 20,
        order_by: 'call_started_at',
        order_direction: 'desc'
      };

      const response = await apiClient.post('/call-logs/search', searchPayload, {
        params: queryParams
      });
      
      const data = response.data;
      return {
        items: data.items as CallLogListView[],
        total: data.total,
        page: data.page,
        limit: data.limit,
        pages: data.pages,
      };
    } catch (error) {
      handleAxiosError(error);
      throw error;
    }
  },

  /**
   * Fetch a paginated list of call logs for a specific clinic.
   */
  async getCallLogsByClinic(
    clinicId: string,
    options: PaginationListOption
  ): Promise<CallLogPage> {
    try {
      // Filter out empty parameters to keep URLs clean
      const cleanParams: Record<string, any> = {};
      Object.entries(options).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          cleanParams[key] = value;
        }
      });

      const response = await apiClient.get(
        `/call-logs/by-clinic/${clinicId}`,
        { params: cleanParams }
      );
      const data = response.data;
      return {
        items: data.items as CallLogListView[],
        total: data.total,
        page: data.page,
        limit: data.limit,
        pages: data.pages,
      };
    } catch (error) {
      handleAxiosError(error);
      throw error;
    }
  },

  /**
   * Retrieve detailed information for a single call log.
   */
  async getCallLogById(callLogId: string): Promise<CallLogDetailView> {
    try {
      const response = await apiClient.get(
        `/call-logs/${callLogId}`
      );
      return response.data as CallLogDetailView;
    } catch (error) {
      handleAxiosError(error);
      throw error;
    }
  },

  /**
   * Update fields of an existing call log (status, summary).
   */
  async updateCallLog(
    callLogId: string,
    data: Partial<Pick<CallLogDetailView, 'status' | 'summary'>>
  ): Promise<CallLogDetailView> {
    try {
      const response = await apiClient.patch(
        `/call-logs/${callLogId}`,
        data
      );
      return response.data as CallLogDetailView;
    } catch (error) {
      handleAxiosError(error);
      throw error;
    }
  },

};

export default CallLogService;