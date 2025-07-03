// src/modules/call-logs/pages/CallLogListPage.tsx
import React from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import CallLogTable from "../components/CallLogTable";

const CallLogListPage: React.FC = () => {
  const { t } = useTranslation("call-logs");
  const { clinicId } = useParams<{ clinicId: string }>();

  return (
    <div className="iz_content-block iz_content-dasboard iz_position-relative">
      <div className="iz_content-block-container">
        <div className="iz_content-title iz_flex">
          <h2 className="iz_title-h2">
            {t("callLogList.listTitle")}
          </h2>
        </div>
        
        {/* New Call Logs Table Component */}
        <CallLogTable showFilters={true} />
      </div>
    </div>
  );
};

export default CallLogListPage;