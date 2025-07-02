import React from "react";
import { AnalyticsDashboard } from "../components/AnalyticsDashboard";

const AnalyticsDashboardPage: React.FC = () => {
  return (
    <div className="iz_content-block iz_content-dasboard iz_position-relative">
      <div className="iz_content-block-container">
        <AnalyticsDashboard />
      </div>
    </div>
  );
};

export default AnalyticsDashboardPage;