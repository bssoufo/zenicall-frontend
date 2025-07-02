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
  start_date?: string;
  end_date?: string;
  page?: number;
  limit?: number;
}

const CallLogService = {
  /**
   * Fetch new call logs for dashboard (optimal endpoint for 'New' status).
   * Uses the dedicated /call-logs/new endpoint for performance.
   */
  async getNewCallLogs(
    clinicId: string,
    limit: number = 10
  ): Promise<CallLogListView[]> {
    try {
      const response = await apiClient.get('/call-logs/new', {
        params: { clinic_id: clinicId, limit }
      });
      return response.data as CallLogListView[];
    } catch (error) {
      handleAxiosError(error);
      throw error;
    }
  },

  /**
   * Advanced search for call logs with filtering capabilities.
   * Optimal for complex filtering with first name, last name, and date ranges.
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
      const response = await apiClient.get(
        `/call-logs/by-clinic/${clinicId}`,
        { params: options }
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

  /**
   * Fetch a summary of call logs for a specific clinic.
   */
  async getCallLogSummary(clinicId: string): Promise<any> {
    try {
      const response = await apiClient.get(
        `/analytics/call-volume/summary/${clinicId}`
      );
      return response.data;
    } catch (error) {
      handleAxiosError(error);
      throw error;
    }
  },
};

export default CallLogService;