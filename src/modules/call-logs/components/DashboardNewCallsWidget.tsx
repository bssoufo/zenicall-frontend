import React from 'react';
import { NewCallLogsDashboard } from './NewCallLogsDashboard';

/**
 * Dashboard widget for displaying new call logs on the homepage.
 * This is a pre-configured version of NewCallLogsDashboard optimized for dashboard use.
 */
export const DashboardNewCallsWidget: React.FC = () => {
  return (
    <div className="dashboard-widget">
      <NewCallLogsDashboard
        maxItems={10}           // Limit to 10 items for dashboard
        showFilters={true}      // Show filters for dashboard use
      />
    </div>
  );
};

export default DashboardNewCallsWidget;