import apiClient, { handleAxiosError } from "../../@zenidata/api/ApiClient";

export interface CallVolumeResponse {
  clinic_id: string;
  period: string;
  granularity: string;
  start_date: string;
  end_date: string;
  timezone: string;
  data: CallVolumeDataPoint[];
  total_calls: number;
  average_calls_per_period: number;
  peak_period: string | null;
  peak_calls: number;
  generated_at: string;
  cache_ttl_seconds: number;
}

export interface CallVolumeDataPoint {
  period: string;
  total_calls: number;
  new_calls: number;
  in_progress_calls: number;
  completed_calls: number;
  period_start: string;
  period_end: string;
}

export interface CallVolumeSummary {
  clinic_id: string;
  period: string;
  start_date: string;
  end_date: string;
  total_calls: number;
  average_daily_calls: number;
  growth_rate_percentage: number | null;
  calls_by_status: Record<string, number>;
  calls_by_reason: CallVolumeByReason[];
  calls_by_hour: CallVolumeByHour[];
  busiest_day: string | null;
  busiest_hour: number | null;
  generated_at: string;
}

export interface CallVolumeByReason {
  reason: string;
  count: number;
  percentage: number;
}

export interface CallVolumeByHour {
  hour: number;
  count: number;
  average_count: number;
}

export interface CallStatusDistributionResponse {
  clinic_id: string;
  period: string;
  start_date: string;
  end_date: string;
  distribution: CallStatusDistributionItem[];
  total_calls: number;
  status_count: number;
  dominant_status: string | null;
  dominant_percentage: number;
  chart_title: string;
  chart_subtitle: string | null;
  generated_at: string;
  cache_ttl_seconds: number;
}

export interface CallStatusDistributionItem {
  status: string;
  count: number;
  percentage: number;
  color?: string;
}

export interface CallVolumeComparison {
  clinic_id: string;
  granularity: string;
  current_period: CallVolumeResponse;
  previous_period: CallVolumeResponse | null;
  total_change: number;
  percentage_change: number;
  average_change: number;
  generated_at: string;
}

class AnalyticsService {
  // Quick endpoints for fast loading
  async getDailyCalls(clinicId: string): Promise<CallVolumeResponse> {
    try {
      const response = await apiClient.get(`/analytics/quick/daily-calls/${clinicId}`);
      return response.data;
    } catch (error) {
      handleAxiosError(error);
      throw error;
    }
  }

  async getHourlyCalls(clinicId: string): Promise<CallVolumeResponse> {
    try {
      const response = await apiClient.get(`/analytics/quick/hourly-calls/${clinicId}`);
      return response.data;
    } catch (error) {
      handleAxiosError(error);
      throw error;
    }
  }

  async getMonthlyCalls(clinicId: string): Promise<CallVolumeResponse> {
    try {
      const response = await apiClient.get(`/analytics/quick/monthly-calls/${clinicId}`);
      return response.data;
    } catch (error) {
      handleAxiosError(error);
      throw error;
    }
  }

  async getStatusPie(clinicId: string): Promise<CallStatusDistributionResponse> {
    try {
      const response = await apiClient.get(`/analytics/quick/status-pie/${clinicId}`);
      return response.data;
    } catch (error) {
      handleAxiosError(error);
      throw error;
    }
  }

  async getStatusDonut(clinicId: string): Promise<CallStatusDistributionResponse> {
    try {
      const response = await apiClient.get(`/analytics/quick/status-donut/${clinicId}`);
      return response.data;
    } catch (error) {
      handleAxiosError(error);
      throw error;
    }
  }

  // Comprehensive summary for KPIs
  async getCallVolumeSummary(
    clinicId: string, 
    period: string = "last_7_days",
    timezone: string = "UTC"
  ): Promise<CallVolumeSummary> {
    try {
      const response = await apiClient.get(`/analytics/call-volume/summary/${clinicId}`, {
        params: { period, timezone }
      });
      return response.data;
    } catch (error) {
      handleAxiosError(error);
      throw error;
    }
  }

  // Period-over-period comparison
  async getCallVolumeComparison(
    clinicId: string,
    currentPeriod: string = "last_7_days",
    granularity: string = "day",
    compareWithPrevious: boolean = true
  ): Promise<CallVolumeComparison> {
    try {
      const response = await apiClient.get(`/analytics/call-volume/comparison/${clinicId}`, {
        params: { 
          current_period: currentPeriod, 
          granularity, 
          compare_with_previous: compareWithPrevious 
        }
      });
      return response.data;
    } catch (error) {
      handleAxiosError(error);
      throw error;
    }
  }

  // Custom trend analysis
  async getCallVolumeTrend(
    clinicId: string,
    period: string = "last_7_days",
    granularity: string = "day",
    timezone: string = "UTC"
  ): Promise<CallVolumeResponse> {
    try {
      const response = await apiClient.get("/analytics/call-volume/trend", {
        params: { clinic_id: clinicId, period, granularity, timezone }
      });
      return response.data;
    } catch (error) {
      handleAxiosError(error);
      throw error;
    }
  }

  // Status distribution with comparison
  async getStatusDistribution(
    clinicId: string,
    period: string = "last_7_days",
    excludeZeroCounts: boolean = true,
    includeColors: boolean = true
  ): Promise<CallStatusDistributionResponse> {
    try {
      const response = await apiClient.get(`/analytics/call-status/distribution/${clinicId}`, {
        params: { 
          period, 
          exclude_zero_counts: excludeZeroCounts,
          include_colors: includeColors
        }
      });
      return response.data;
    } catch (error) {
      handleAxiosError(error);
      throw error;
    }
  }
}

export default new AnalyticsService();