import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Clinic from "../ClinicModel";
import ClinicService from "../ClinicService";
import Datatable, { DatatableColumn } from "../../../@zenidata/components/datatable/Datatable";
import { LoadingScreen } from "../../../@zenidata/components/UI/Loader";
import NoDataScreen from "../../../@zenidata/components/UI/NoDataScreen";
import UserHello from "../../auth/components/UserHello";
import { formatDate } from "../../../@zenidata/utils";

const ClinicListPage: React.FC = () => {
  const { t } = useTranslation("clinics");
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchClinics = async () => {
    setLoading(true);
    try {
      const data = await ClinicService.getClinics();
      setClinics(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClinics();
  }, []);

  const columns: DatatableColumn<Clinic>[] = [
    { header: t("datatable.id"), accessor: "id" as const },
    { header: t("datatable.name"), accessor: "name" as const },
    {
      header: t("datatable.createdAt"),
      accessor: "created_at" as const,
      renderCell: (row) => <>{formatDate(row.created_at)}</>,
    },
    {
      header: t("datatable.updatedAt"),
      accessor: "updated_at" as const,
      renderCell: (row) => <>{formatDate(row.updated_at)}</>,
    },
    {
      header: t("datatable.action"),
      accessor: undefined,
      renderCell: (row) => (
        <div className="iz_btns-action">
          <Link
            to={`/clinics/${row.id}`}
            className="iz_btn-view-document iz_btn-view-item"
            title={t("datatable.viewClinic")}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="iz_content-block iz_content-dasboard iz_position-relative">
      <div className="iz_content-block-container">
        <UserHello />

        <div className="iz_folders-block">
          <div className="iz_content-title iz_flex">
            <h2 className="iz_title-h2">
              {t("clinicsList.clinics")} {!loading && `(${clinics.length})`}
            </h2>
            <div className="iz_flex iz_content-links">
              <Link
                to="/clinics/create"
                className="iz_btn iz_btn-primary iz_hidden-mobile"
              >
                {t("clinicsList.addClinic")}
              </Link>
            </div>
          </div>
          <div className="iz-listing-docs iz_listing-table">
            {loading ? (
              <LoadingScreen />
            ) : clinics.length === 0 ? (
              <NoDataScreen />
            ) : (
              <Datatable data={clinics} columns={columns} loading={loading} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicListPage;