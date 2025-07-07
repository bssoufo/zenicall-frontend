import React from 'react';
import { CallLogsDashboard } from './CallLogsDashboard';
import './DashboardNewCallsWidget.css';

/**
 * Dashboard widget for displaying all call logs on the homepage.
 * This is a pre-configured version of CallLogsDashboard optimized for dashboard use.
 * Shows all calls with status-based color coding for quick workflow management.
 */
export const DashboardNewCallsWidget: React.FC = () => {
  return (
    <CallLogsDashboard
      maxItems={20}           // Show 20 calls per page for optimal dashboard performance
      showFilters={true}      // Show filters for dashboard use
    />
  );
};

export default DashboardNewCallsWidget;