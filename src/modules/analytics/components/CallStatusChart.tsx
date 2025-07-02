import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  DonutChart
} from "recharts";
import AnalyticsService, { CallStatusDistributionResponse } from "../AnalyticsService";
import { PieChartSkeleton } from "./SkeletonLoaders";
import "./CallStatusChart.css";

interface CallStatusChartProps {
  clinicId: string;
  period?: string;
  chartType?: "pie" | "donut";
  size?: number;
}

// Default colors for call statuses
const STATUS_COLORS = {
  "New": "#f59e0b",           // Orange
  "In Progress": "#8b5cf6",   // Purple  
  "Done": "#10b981",          // Green
  "Archived": "#6b7280"       // Gray
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="status-chart-tooltip">
        <p className="tooltip-label">{data.status}</p>
        <p className="tooltip-value">
          {data.count} calls ({data.percentage.toFixed(1)}%)
        </p>
      </div>
    );
  }
  return null;
};

const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  if (percent < 0.05) return null; // Don't show labels for slices < 5%
  
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      fontSize={12}
      fontWeight={600}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const StatusLegend = ({ data }: { data: any[] }) => (
  <div className="status-legend">
    {data.map((entry, index) => (
      <div key={index} className="legend-item">
        <div 
          className="legend-color" 
          style={{ backgroundColor: entry.color || STATUS_COLORS[entry.status as keyof typeof STATUS_COLORS] }}
        />
        <div className="legend-content">
          <span className="legend-label">{entry.status}</span>
          <span className="legend-value">
            {entry.count} ({entry.percentage.toFixed(1)}%)
          </span>
        </div>
      </div>
    ))}
  </div>
);

export const CallStatusChart: React.FC<CallStatusChartProps> = ({
  clinicId,
  period = "last_7_days",
  chartType = "pie",
  size = 300
}) => {
  const { t } = useTranslation(["analytics"]);
  const [data, setData] = useState<CallStatusDistributionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let response: CallStatusDistributionResponse;
        
        // Use quick endpoints for better performance
        if (period === "last_7_days") {
          response = await AnalyticsService.getStatusPie(clinicId);
        } else if (period === "last_30_days") {
          response = await AnalyticsService.getStatusDonut(clinicId);
        } else {
          response = await AnalyticsService.getStatusDistribution(clinicId, period);
        }
        
        setData(response);
        setError(null);
      } catch (err) {
        setError(t("analytics:charts.errorLoading"));
        console.error("Error fetching call status data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (clinicId) {
      fetchData();
    }
  }, [clinicId, period]);

  if (loading) {
    return <PieChartSkeleton size={size} />;
  }

  if (error || !data) {
    return (
      <div className="status-chart-error" style={{ height: size }}>
        <div className="status-chart-error-content">
          <i className="fas fa-exclamation-triangle"></i>
          <p>{t("analytics:charts.callStatus.noData")}</p>
          <small>{error}</small>
        </div>
      </div>
    );
  }

  if (data.total_calls === 0) {
    return (
      <div className="status-chart-empty" style={{ height: size }}>
        <div className="status-chart-empty-content">
          <i className="fas fa-phone-slash"></i>
          <p>{t("analytics:charts.callStatus.noData")}</p>
        </div>
      </div>
    );
  }

  const chartData = data.distribution.map(item => ({
    ...item,
    color: item.color || STATUS_COLORS[item.status as keyof typeof STATUS_COLORS]
  }));

  const innerRadius = chartType === "donut" ? size * 0.15 : 0;
  const outerRadius = size * 0.35;

  return (
    <div className="call-status-chart">
      <div className="status-chart-header">
        <h3 className="status-chart-title">{t("analytics:charts.callStatus.title")}</h3>
        {data.chart_subtitle && (
          <p className="status-chart-subtitle">{t("analytics:charts.callStatus.subtitle")}</p>
        )}
        <div className="status-chart-summary">
          <span className="total-calls">{data.total_calls} {t("analytics:kpi.totalCalls").toLowerCase()}</span>
          {data.dominant_status && (
            <span className="dominant-status">
              Mostly {data.dominant_status.toLowerCase()} ({data.dominant_percentage.toFixed(0)}%)
            </span>
          )}
        </div>
      </div>

      <div className="status-chart-container">
        <ResponsiveContainer width="100%" height={size}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={CustomLabel}
              outerRadius={outerRadius}
              innerRadius={innerRadius}
              fill="#8884d8"
              dataKey="count"
              animationBegin={0}
              animationDuration={800}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {chartType === "donut" && data.dominant_status && (
          <div className="donut-center">
            <div className="center-value">{data.dominant_percentage.toFixed(0)}%</div>
            <div className="center-label">{data.dominant_status}</div>
          </div>
        )}
      </div>

      <StatusLegend data={chartData} />
    </div>
  );
};