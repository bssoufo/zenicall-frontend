import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine
} from "recharts";
import AnalyticsService, { CallVolumeSummary } from "../AnalyticsService";
import { ChartSkeleton } from "./SkeletonLoaders";
import "./HourlyPatternsChart.css";

interface HourlyPatternsChartProps {
  clinicId: string;
  period?: string;
  height?: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const hour = parseInt(label);
    const timeLabel = hour === 0 ? "12:00 AM" : 
                     hour < 12 ? `${hour}:00 AM` :
                     hour === 12 ? "12:00 PM" :
                     `${hour - 12}:00 PM`;
    
    return (
      <div className="hourly-chart-tooltip">
        <p className="tooltip-label">{timeLabel}</p>
        <p className="tooltip-value">
          {data.count} calls (Avg: {data.average_count.toFixed(1)})
        </p>
      </div>
    );
  }
  return null;
};

const formatHour = (hour: number) => {
  if (hour === 0) return "12a";
  if (hour < 12) return `${hour}a`;
  if (hour === 12) return "12p";
  return `${hour - 12}p`;
};

const HourlyPatternsChart: React.FC<HourlyPatternsChartProps> = ({
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
        setError("Failed to load hourly patterns");
        console.error("Error fetching hourly patterns:", err);
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
      <div className="hourly-chart-error" style={{ height }}>
        <div className="hourly-chart-error-content">
          <i className="fas fa-exclamation-triangle"></i>
          <p>Unable to load hourly patterns</p>
          <small>{error}</small>
        </div>
      </div>
    );
  }

  // Fill in missing hours with 0 values
  const completeHourlyData = Array.from({ length: 24 }, (_, hour) => {
    const existingData = data.calls_by_hour.find(item => item.hour === hour);
    return existingData || {
      hour,
      count: 0,
      average_count: 0
    };
  });

  if (completeHourlyData.every(item => item.count === 0)) {
    return (
      <div className="hourly-chart-empty" style={{ height }}>
        <div className="hourly-chart-empty-content">
          <i className="fas fa-clock"></i>
          <p>No hourly pattern data</p>
        </div>
      </div>
    );
  }

  const maxCount = Math.max(...completeHourlyData.map(item => item.count));
  const avgCount = completeHourlyData.reduce((sum, item) => sum + item.count, 0) / 24;
  const busiestHour = data.busiest_hour;

  const title = "Call Volume by Hour";
  const subtitle = `Peak activity at ${busiestHour !== null ? formatHour(busiestHour) : 'N/A'} | Avg: ${avgCount.toFixed(1)} calls/hour`;

  return (
    <div className="hourly-patterns-chart">
      <div className="hourly-chart-header">
        <h3 className="hourly-chart-title">{title}</h3>
        <p className="hourly-chart-subtitle">{subtitle}</p>
      </div>
      
      <ResponsiveContainer width="100%" height={height - 80}>
        <LineChart
          data={completeHourlyData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis 
            dataKey="hour"
            tickFormatter={formatHour}
            stroke="#6b7280"
            fontSize={11}
            interval={1}
          />
          <YAxis 
            stroke="#6b7280" 
            fontSize={12}
            domain={[0, maxCount + 1]}
          />
          <Tooltip content={<CustomTooltip />} />
          
          {/* Average line */}
          <ReferenceLine 
            y={avgCount} 
            stroke="#94a3b8" 
            strokeDasharray="5 5"
            label="Average"
          />
          
          {/* Peak hour indicator */}
          {busiestHour !== null && (
            <ReferenceLine 
              x={busiestHour} 
              stroke="#f59e0b" 
              strokeDasharray="3 3"
              label="Peak"
            />
          )}
          
          <Line
            type="monotone"
            dataKey="count"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ fill: "#3b82f6", strokeWidth: 2, r: 3 }}
            activeDot={{ r: 5, fill: "#1d4ed8" }}
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HourlyPatternsChart;