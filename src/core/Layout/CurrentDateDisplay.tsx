import React from "react";
import { useTranslation } from "react-i18next";

const CurrentDateDisplay: React.FC = () => {
  const { t } = useTranslation("home");

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
    <div className="current-date-display">
   
      <time className="current-date" dateTime={new Date().toISOString()}>
        <i className="fas fa-calendar-alt" aria-hidden="true"></i>
        {formatDate()}
      </time>
    </div>
  );
};

export default CurrentDateDisplay;