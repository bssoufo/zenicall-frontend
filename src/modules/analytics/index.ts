import React from "react";

export { default as AnalyticsService } from "./AnalyticsService";
export { AnalyticsDashboard } from "./components/AnalyticsDashboard";
export { KPICards } from "./components/KPICards";
export { CallVolumeChart } from "./components/CallVolumeChart";
export { CallStatusChart } from "./components/CallStatusChart";
export { 
  KPICardSkeleton, 
  ChartSkeleton, 
  PieChartSkeleton, 
  TableSkeleton, 
  DashboardSkeleton 
} from "./components/SkeletonLoaders";

// Lazy components
export const CallReasonChart = React.lazy(() => import("./components/CallReasonChart"));
export const HourlyPatternsChart = React.lazy(() => import("./components/HourlyPatternsChart"));
export const ComparisonChart = React.lazy(() => import("./components/ComparisonChart"));

// Re-export types
export type {
  CallVolumeResponse,
  CallVolumeDataPoint,
  CallVolumeSummary,
  CallStatusDistributionResponse,
  CallStatusDistributionItem,
  CallVolumeComparison,
  CallVolumeByReason,
  CallVolumeByHour
} from "./AnalyticsService";