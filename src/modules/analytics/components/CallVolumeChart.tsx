import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar
} from "recharts";
import AnalyticsService, { CallVolumeResponse } from "../AnalyticsService";
import { ChartSkeleton } from "./SkeletonLoaders";
import "./CallVolumeChart.css";

interface CallVolumeChartProps {
  clinicId: string;
  period?: string;
  granularity?: string;
  chartType?: "area" | "bar";
  height?: number;
}

const formatXAxisLabel = (tickItem: string, granularity: string) => {
  const date = new Date(tickItem);
  
  switch (granularity) {
    case "hour":
      return date.toLocaleTimeString("en-US", { 
        hour: "2-digit", 
        minute: "2-digit" 
      });
    case "day":
      return date.toLocaleDateString("en-US", { 
        month: "short", 
        day: "numeric" 
      });
    case "week":
      return `Week ${Math.ceil(date.getDate() / 7)}`;
    case "month":
      return date.toLocaleDateString("en-US", { 
        month: "short", 
        year: "2-digit" 
      });
    default:
      return date.toLocaleDateString("en-US", { 
        month: "short", 
        day: "numeric" 
      });
  }
};

const CustomTooltip = ({ active, payload, label, granularity }: any) => {
  if (active && payload && payload.length) {
    const date = new Date(label);
    const formatDate = () => {
      switch (granularity) {
        case "hour":
          return date.toLocaleString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          });
        case "day":
          return date.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
          });
        default:
          return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
          });
      }
    };

    return (
      <div className="chart-tooltip">
        <p className="tooltip-label">{formatDate()}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="tooltip-item" style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const CallVolumeChart: React.FC<CallVolumeChartProps> = ({
  clinicId,
  period = "last_7_days",
  granularity = "day",
  chartType = "area",
  height = 400
}) => {
  const { t } = useTranslation(["analytics"]);
  const [data, setData] = useState<CallVolumeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let response: CallVolumeResponse;
        
        // Use quick endpoints for better performance
        if (period === "last_7_days" && granularity === "day") {
          response = await AnalyticsService.getDailyCalls(clinicId);
        } else if (period === "last_24_hours" && granularity === "hour") {
          response = await AnalyticsService.getHourlyCalls(clinicId);
        } else if (period === "last_90_days") {
          response = await AnalyticsService.getMonthlyCalls(clinicId);
        } else {
          response = await AnalyticsService.getCallVolumeTrend(clinicId, period, granularity);
        }
        
        setData(response);
        setError(null);
      } catch (err) {
        setError(t("analytics:charts.errorLoading"));
        console.error("Error fetching call volume data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (clinicId) {
      fetchData();
    }
  }, [clinicId, period, granularity]);

  if (loading) {
    return <ChartSkeleton height={height} />;
  }

  if (error || !data) {
    return (
      <div className="chart-error" style={{ height }}>
        <div className="chart-error-content">
          <i className="fas fa-exclamation-triangle"></i>
          <p>{t("analytics:charts.errorLoading")}</p>
          <small>{error}</small>
        </div>
      </div>
    );
  }

  const chartData = data.data.map(point => ({
    period: point.period,
    date: point.period_start,
    [t("analytics:kpi.totalCalls")]: point.total_calls,
    [t("analytics:status.new")]: point.new_calls,
    [t("analytics:status.inProgress")]: point.in_progress_calls,
    [t("analytics:status.done")]: point.completed_calls,
  }));

  const title = t("analytics:charts.callVolume.title");
  const subtitle = t("analytics:charts.callVolume.subtitle");

  const commonProps = {
    width: "100%",
    height: height - 100, // Account for header
    data: chartData,
    margin: { top: 20, right: 30, left: 20, bottom: 20 }
  };

  return (
    <div className="call-volume-chart">
      <div className="chart-header">
        <h3 className="chart-title">{title}</h3>
        <p className="chart-subtitle">{subtitle}</p>
      </div>
      
      <ResponsiveContainer {...commonProps}>
        {chartType === "area" ? (
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
              </linearGradient>
              <linearGradient id="newGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.05}/>
              </linearGradient>
              <linearGradient id="completedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="date"
              tickFormatter={(value) => formatXAxisLabel(value, granularity)}
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis stroke="#6b7280" fontSize={12} />
            <Tooltip content={<CustomTooltip granularity={granularity} />} />
            <Legend />
            <Area
              type="monotone"
              dataKey={t("analytics:kpi.totalCalls")}
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#totalGradient)"
            />
            <Area
              type="monotone"
              dataKey={t("analytics:status.new")}
              stroke="#f59e0b"
              strokeWidth={2}
              fill="url(#newGradient)"
            />
            <Area
              type="monotone"
              dataKey={t("analytics:status.done")}
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#completedGradient)"
            />
          </AreaChart>
        ) : (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="date"
              tickFormatter={(value) => formatXAxisLabel(value, granularity)}
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis stroke="#6b7280" fontSize={12} />
            <Tooltip content={<CustomTooltip granularity={granularity} />} />
            <Legend />
            <Bar dataKey={t("analytics:status.new")} fill="#f59e0b" radius={[2, 2, 0, 0]} />
            <Bar dataKey={t("analytics:status.inProgress")} fill="#8b5cf6" radius={[2, 2, 0, 0]} />
            <Bar dataKey={t("analytics:status.done")} fill="#10b981" radius={[2, 2, 0, 0]} />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};