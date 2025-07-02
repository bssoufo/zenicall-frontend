import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../auth/contexts/AuthContext";
import { useClinic } from "../../clinics/hooks/useClinic";

const DashboardHero: React.FC = () => {
  const { t } = useTranslation("home");
  const { user } = useContext(AuthContext);
  const { selectedClinic } = useClinic();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t("dashboard.goodMorning");
    if (hour < 17) return t("dashboard.goodAfternoon");
    return t("dashboard.goodEvening");
  };

  const formatDate = () => {
    return new Date().toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="dashboard-hero-content">
      <div className="hero-text">
        <h1 className="hero-title">
          {getGreeting()}{user?.first_name ? `, ${user.first_name}` : ''}!
        </h1>
        <p className="hero-subtitle">
          {selectedClinic ? 
            t("dashboard.welcomeWithClinic", { clinicName: selectedClinic.name }) :
            t("dashboard.welcomeMessage")
          }
        </p>
        <div className="hero-meta">
          <time className="current-date" dateTime={new Date().toISOString()}>
            <i className="fas fa-calendar-alt" aria-hidden="true"></i>
            {formatDate()}
          </time>
        </div>
      </div>
      <div className="hero-visual">
        <div className="hero-icon">
          <i className="fas fa-chart-line" aria-hidden="true"></i>
        </div>
      </div>
    </div>
  );
};

export default DashboardHero;