import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell
} from "recharts";
import AnalyticsService, { CallVolumeSummary } from "../AnalyticsService";
import { ChartSkeleton } from "./SkeletonLoaders";
import "./CallReasonChart.css";

interface CallReasonChartProps {
  clinicId: string;
  period?: string;
  height?: number;
}

const REASON_COLORS = [
  "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="reason-chart-tooltip">
        <p className="tooltip-label">{label}</p>
        <p className="tooltip-value">
          {data.count} calls ({data.percentage.toFixed(1)}%)
        </p>
      </div>
    );
  }
  return null;
};

const CallReasonChart: React.FC<CallReasonChartProps> = ({
  clinicId,
  period = "last_7_days",
  height = 300
}) => {
  const [data, setData] = useState<CallVolumeSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const summary = await AnalyticsService.getCallVolumeSummary(clinicId, period);
        setData(summary);
        setError(null);
      } catch (err) {
        setError("Failed to load call reason data");
        console.error("Error fetching call reason data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (clinicId) {
      fetchData();
    }
  }, [clinicId, period]);

  if (loading) {
    return <ChartSkeleton height={height} />;
  }

  if (error || !data) {
    return (
      <div className="reason-chart-error" style={{ height }}>
        <div className="reason-chart-error-content">
          <i className="fas fa-exclamation-triangle"></i>
          <p>Unable to load call reasons</p>
          <small>{error}</small>
        </div>
      </div>
    );
  }

  const chartData = data.calls_by_reason
    .sort((a, b) => b.count - a.count) // Sort by count descending
    .slice(0, 6) // Show top 6 reasons
    .map((item, index) => ({
      ...item,
      color: REASON_COLORS[index % REASON_COLORS.length],
      shortReason: item.reason.length > 15 ? `${item.reason.substring(0, 15)}...` : item.reason
    }));

  if (chartData.length === 0) {
    return (
      <div className="reason-chart-empty" style={{ height }}>
        <div className="reason-chart-empty-content">
          <i className="fas fa-question-circle"></i>
          <p>No call reasons data</p>
        </div>
      </div>
    );
  }

  const title = "Call Reasons Distribution";
  const subtitle = `Top reasons for ${data.total_calls} calls`;

  return (
    <div className="call-reason-chart">
      <div className="reason-chart-header">
        <h3 className="reason-chart-title">{title}</h3>
        <p className="reason-chart-subtitle">{subtitle}</p>
      </div>
      
      <ResponsiveContainer width="100%" height={height - 80}>
        <BarChart
          data={chartData}
          layout="horizontal"
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis 
            type="number" 
            stroke="#6b7280" 
            fontSize={12}
            tickFormatter={(value) => `${value}`}
          />
          <YAxis 
            type="category" 
            dataKey="shortReason" 
            stroke="#6b7280" 
            fontSize={12}
            width={100}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="count" radius={[0, 4, 4, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CallReasonChart;