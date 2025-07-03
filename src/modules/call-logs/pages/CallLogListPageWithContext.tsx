// src/modules/call-logs/pages/CallLogListPageWithContext.tsx
import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useClinic } from "../../clinics/hooks/useClinic";
import CallLogTable from "../components/CallLogTable";

const CallLogListPageWithContext: React.FC = () => {
  const { t } = useTranslation("call-logs");
  const { selectedClinic, clinics } = useClinic();

  // No clinic selected state
  if (!selectedClinic) {
    return (
      <div className="iz_content-block iz_content-dasboard iz_position-relative">
        <div className="iz_content-block-container">
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "400px",
            textAlign: "center",
            background: "#f8fafc",
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
            margin: "2rem 0"
          }}>
            <i className="fas fa-phone-alt" style={{ 
              fontSize: "48px", 
              color: "#6b7280", 
              marginBottom: "16px" 
            }}></i>
            <h3 style={{ 
              margin: "0 0 8px 0", 
              color: "#374151",
              fontSize: "20px"
            }}>
              Aucune Clinique Sélectionnée
            </h3>
            <p style={{ 
              margin: "0 0 16px 0", 
              color: "#6b7280",
              fontSize: "16px"
            }}>
              Veuillez sélectionner une clinique dans l'en-tête pour voir les journaux d'appels.
            </p>
            {clinics.length === 0 && (
              <Link 
                to="/clinics/create"
                style={{
                  color: "#3b82f6",
                  textDecoration: "none",
                  padding: "8px 16px",
                  border: "1px solid #3b82f6",
                  borderRadius: "6px",
                  fontSize: "14px"
                }}
              >
                Créer Votre Première Clinique
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="iz_content-block iz_content-dasboard iz_position-relative">
      <div className="iz_content-block-container">
        <div className="iz_content-title iz_flex">
          <h2 className="iz_title-h2">
            {t("callLogList.listTitle")} - {selectedClinic.name}
          </h2>
        </div>
        
        {/* New Call Logs Table Component */}
        <CallLogTable showFilters={true} clinicId={selectedClinic.id} />
      </div>
    </div>
  );
};

export default CallLogListPageWithContext;