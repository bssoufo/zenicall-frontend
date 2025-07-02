import React from "react";
import "./SkeletonLoaders.css";

// KPI Card Skeleton
export const KPICardSkeleton: React.FC = () => (
  <div className="kpi-card-skeleton">
    <div className="skeleton-line skeleton-title"></div>
    <div className="skeleton-line skeleton-value"></div>
    <div className="skeleton-line skeleton-subtitle"></div>
  </div>
);

// Chart Skeleton
export const ChartSkeleton: React.FC<{ height?: number }> = ({ height = 300 }) => (
  <div className="chart-skeleton" style={{ height: `${height}px` }}>
    <div className="skeleton-chart-header">
      <div className="skeleton-line skeleton-chart-title"></div>
      <div className="skeleton-line skeleton-chart-subtitle"></div>
    </div>
    <div className="skeleton-chart-body">
      <div className="skeleton-chart-bars">
        {Array.from({ length: 7 }).map((_, i) => (
          <div 
            key={i} 
            className="skeleton-bar" 
            style={{ height: `${Math.random() * 80 + 20}%` }}
          />
        ))}
      </div>
    </div>
  </div>
);

// Pie Chart Skeleton
export const PieChartSkeleton: React.FC<{ size?: number }> = ({ size = 200 }) => (
  <div className="pie-chart-skeleton" style={{ width: size, height: size }}>
    <div className="skeleton-pie-circle">
      <div className="skeleton-pie-center"></div>
    </div>
    <div className="skeleton-pie-legend">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="skeleton-legend-item">
          <div className="skeleton-legend-color"></div>
          <div className="skeleton-legend-text"></div>
        </div>
      ))}
    </div>
  </div>
);

// Table Skeleton
export const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = ({ 
  rows = 5, 
  cols = 3 
}) => (
  <div className="table-skeleton">
    <div className="skeleton-table-header">
      {Array.from({ length: cols }).map((_, i) => (
        <div key={i} className="skeleton-line skeleton-table-header-cell"></div>
      ))}
    </div>
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="skeleton-table-row">
        {Array.from({ length: cols }).map((_, colIndex) => (
          <div key={colIndex} className="skeleton-line skeleton-table-cell"></div>
        ))}
      </div>
    ))}
  </div>
);

// Dashboard Grid Skeleton
export const DashboardSkeleton: React.FC = () => (
  <div className="dashboard-skeleton">
    {/* KPI Row */}
    <div className="dashboard-skeleton-row kpi-row">
      {Array.from({ length: 4 }).map((_, i) => (
        <KPICardSkeleton key={i} />
      ))}
    </div>
    
    {/* Charts Row */}
    <div className="dashboard-skeleton-row charts-row">
      <div className="dashboard-skeleton-col-8">
        <ChartSkeleton height={400} />
      </div>
      <div className="dashboard-skeleton-col-4">
        <PieChartSkeleton size={300} />
      </div>
    </div>
    
    {/* Secondary Charts Row */}
    <div className="dashboard-skeleton-row secondary-row">
      <div className="dashboard-skeleton-col-6">
        <ChartSkeleton height={300} />
      </div>
      <div className="dashboard-skeleton-col-6">
        <TableSkeleton rows={6} cols={3} />
      </div>
    </div>
  </div>
);