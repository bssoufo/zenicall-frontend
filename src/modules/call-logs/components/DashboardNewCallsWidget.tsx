import React from 'react';
import { NewCallLogsDashboard } from './NewCallLogsDashboard';
import './DashboardNewCallsWidget.css';

/**
 * Dashboard widget for displaying new call logs on the homepage.
 * This is a pre-configured version of NewCallLogsDashboard optimized for dashboard use.
 */
export const DashboardNewCallsWidget: React.FC = () => {
  return (
    <NewCallLogsDashboard
      maxItems={10}           // Limit to 10 items for dashboard
      showFilters={true}      // Show filters for dashboard use
    />
  );
};

export default DashboardNewCallsWidget;