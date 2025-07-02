import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import AnalyticsService, { CallVolumeComparison } from "../AnalyticsService";
import { ChartSkeleton } from "./SkeletonLoaders";
import "./ComparisonChart.css";

interface ComparisonChartProps {
  clinicId: string;
  currentPeriod?: string;
  granularity?: string;
  height?: number;
}

const CustomTooltip = ({ active, payload, label, granularity }: any) => {
  if (active && payload && payload.length) {
    const date = new Date(label);
    const formatDate = () => {
      switch (granularity) {
        case "hour":
          return date.toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          });
        case "day":
          return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric"
          });
        default:
          return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric"
          });
      }
    };

    return (
      <div className="comparison-chart-tooltip">
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

const ComparisonChart: React.FC<ComparisonChartProps> = ({
  clinicId,
  currentPeriod = "last_7_days",
  granularity = "day",
  height = 350
}) => {
  const [data, setData] = useState<CallVolumeComparison | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const comparison = await AnalyticsService.getCallVolumeComparison(
          clinicId, 
          currentPeriod, 
          granularity, 
          true
        );
        setData(comparison);
        setError(null);
      } catch (err) {
        setError("Failed to load comparison data");
        console.error("Error fetching comparison data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (clinicId) {
      fetchData();
    }
  }, [clinicId, currentPeriod, granularity]);

  if (loading) {
    return <ChartSkeleton height={height} />;
  }

  if (error || !data) {
    return (
      <div className="comparison-chart-error" style={{ height }}>
        <div className="comparison-chart-error-content">
          <i className="fas fa-exclamation-triangle"></i>
          <p>Unable to load comparison data</p>
          <small>{error}</small>
        </div>
      </div>
    );
  }

  if (!data.previous_period) {
    return (
      <div className="comparison-chart-empty" style={{ height }}>
        <div className="comparison-chart-empty-content">
          <i className="fas fa-chart-line"></i>
          <p>No previous period data for comparison</p>
        </div>
      </div>
    );
  }

  // Combine current and previous period data
  const combinedData = data.current_period.data.map((currentPoint, index) => {
    const previousPoint = data.previous_period?.data[index];
    return {
      period: currentPoint.period,
      date: currentPoint.period_start,
      current: currentPoint.total_calls,
      previous: previousPoint?.total_calls || 0,
      change: currentPoint.total_calls - (previousPoint?.total_calls || 0)
    };
  });

  const changeDirection = data.percentage_change >= 0 ? "increase" : "decrease";
  const changeIcon = data.percentage_change >= 0 ? "fa-arrow-up" : "fa-arrow-down";
  const changeColor = data.percentage_change >= 0 ? "#10b981" : "#ef4444";

  const title = "Period-over-Period Comparison";
  const subtitle = `${Math.abs(data.percentage_change).toFixed(1)}% ${changeDirection} vs previous period`;

  return (
    <div className="comparison-chart">
      <div className="comparison-chart-header">
        <div className="header-content">
          <h3 className="comparison-chart-title">{title}</h3>
          <p className="comparison-chart-subtitle">{subtitle}</p>
        </div>
        
        <div className="comparison-stats">
          <div className="stat-item">
            <span className="stat-label">Total Change</span>
            <span className={`stat-value ${changeDirection}`}>
              <i className={`fas ${changeIcon}`}></i>
              {Math.abs(data.total_change)}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Avg Change</span>
            <span className={`stat-value ${changeDirection}`}>
              {data.average_change >= 0 ? '+' : ''}{data.average_change.toFixed(1)}
            </span>
          </div>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={height - 120}>
        <ComposedChart
          data={combinedData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis 
            dataKey="date"
            tickFormatter={(value) => {
              const date = new Date(value);
              return granularity === "hour" 
                ? date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
                : date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
            }}
            stroke="#6b7280"
            fontSize={12}
          />
          <YAxis stroke="#6b7280" fontSize={12} />
          <Tooltip content={<CustomTooltip granularity={granularity} />} />
          <Legend />
          
          {/* Previous period as bars */}
          <Bar
            dataKey="previous"
            name="Previous Period"
            fill="#cbd5e0"
            radius={[2, 2, 0, 0]}
            opacity={0.7}
          />
          
          {/* Current period as line */}
          <Line
            type="monotone"
            dataKey="current"
            name="Current Period"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: "#1d4ed8" }}
          />
          
          {/* Change indicator as line */}
          <Line
            type="monotone"
            dataKey="change"
            name="Change"
            stroke={changeColor}
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ fill: changeColor, strokeWidth: 2, r: 3 }}
            yAxisId="right"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ComparisonChart;