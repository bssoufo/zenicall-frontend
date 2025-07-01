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

const CallLogService = {
  /**
   * Fetch a paginated list of call logs for a specific clinic.
   */
  async getCallLogsByClinic(
    clinicId: number,
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
  async getCallLogById(callLogId: number): Promise<CallLogDetailView> {
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
    callLogId: number,
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