// src/modules/call-logs/pages/CallLogListPage.tsx
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Datatable, { DatatableColumn } from "../../../@zenidata/components/datatable/Datatable";
import { useTableParams } from "../../../@zenidata/components/datatable/useTableParams";
import { LoadingScreen } from "../../../@zenidata/components/UI/Loader";
import NoDataScreen from "../../../@zenidata/components/UI/NoDataScreen";
import { handleAxiosError } from "../../../@zenidata/api/ApiClient";
import CallLogService from "../CallLogService";
import { CallLogListView, CallLogStatus } from "../CallLogModel";
import { toast } from "react-hot-toast";

const CallLogListPage: React.FC = () => {
  const { t } = useTranslation("call-logs");
  const { clinicId } = useParams<{ clinicId: string }>();
  const { params, updateParams } = useTableParams<CallLogListView>();

  const [callLogs, setCallLogs] = useState<CallLogListView[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 0,
    currentPage: params.currentPage,
    pageSize: params.pageSize,
    hasNextPage: false,
    hasPrevPage: false,
  });

  useEffect(() => {
    if (!clinicId) return;
    setLoading(true);
    CallLogService.getCallLogsByClinic(+clinicId, {
      search: params.search,
      status: params.status,
      page: params.currentPage,
      limit: params.pageSize,
      orderBy: params.orderBy,
      direction: params.orderDirection,
    })
      .then((data) => {
        setCallLogs(data.items);
        setPagination({
          totalItems: data.total,
          totalPages: data.pages,
          currentPage: data.page,
          pageSize: data.limit,
          hasNextPage: data.page < data.pages,
          hasPrevPage: data.page > 1,
        });
      })
      .catch((error) => {
        handleAxiosError(error);
        toast.error(t("api_messages.generic_error"));
      })
      .finally(() => {
        setLoading(false);
      });
  }, [
    clinicId,
    params.search,
    params.status,
    params.currentPage,
    params.pageSize,
    params.orderBy,
    params.orderDirection,
    t,
  ]);

  const columns: DatatableColumn<CallLogListView>[] = [
    { header: t("datatable.id"), accessor: "id" as const },
    { header: t("datatable.externalCallId"), accessor: "external_call_id" as const },
    { header: t("datatable.callerFirstName"), accessor: "caller_first_name" as const },
    { header: t("datatable.callerLastName"), accessor: "caller_last_name" as const },
    { header: t("datatable.callerPhoneNumber"), accessor: "caller_phone_number" as const },
    {
      header: t("datatable.callStartedAt"),
      accessor: "call_started_at" as const,
      renderCell: (row) => <>{new Date(row.call_started_at).toLocaleString()}</>,
    },
    { header: t("datatable.reasonForCall"), accessor: "reason_for_call" as const },
    { header: t("datatable.status"), accessor: "status" as const },
    {
      header: t("datatable.action"),
      accessor: undefined,
      renderCell: (row) => (
        <Link to={`/clinics/${clinicId}/call-logs/${row.id}`} title={t("datatable.view")} />
      ),
    },
  ];

  return (
    <div className="iz_content-block iz_content-dasboard iz_position-relative">
      <div className="iz_content-block-container">
        <div className="iz_content-title iz_flex">
          <h2 className="iz_title-h2">
            {t("callLogList.listTitle")} {!loading && `(${pagination.totalItems})`}
          </h2>
        </div>
        <div className="iz_flex iz_content-links">
          <div className="iz_field iz_field-search">
            <input
              type="search"
              placeholder={t("callLogList.searchPlaceholder")}
              defaultValue={params.search}
              onChange={(e) => updateParams({ search: e.target.value })}
            />
          </div>
          <div className="iz_field iz_field-select iz_flex">
            <label>{t("callLogList.statusFilter.all")}</label>
            <select
              value={params.status || ""}
              onChange={(e) => updateParams({ status: e.target.value })}
            >
              <option value="">{t("callLogList.statusFilter.all")}</option>
              <option value="NEW">{t("callLogList.statusFilter.NEW")}</option>
              <option value="IN_PROGRESS">{t("callLogList.statusFilter.IN_PROGRESS")}</option>
              <option value="DONE">{t("callLogList.statusFilter.DONE")}</option>
              <option value="ARCHIVED">{t("callLogList.statusFilter.ARCHIVED")}</option>
            </select>
          </div>
        </div>
        <div className="iz-listing-docs iz_listing-table">
          {loading ? (
            <LoadingScreen />
          ) : callLogs.length === 0 ? (
            <NoDataScreen />
          ) : (
            <Datatable
              data={callLogs}
              columns={columns}
              loading={loading}
              pagination={pagination}
              setPagination={setPagination}
              searchTerm={params.search}
              sortConfig={{ key: params.orderBy, direction: params.orderDirection }}
              handleSort={(col) => {
                const dir =
                  params.orderBy === col && params.orderDirection === "asc"
                    ? "desc"
                    : "asc";
                updateParams({ orderBy: col, orderDirection: dir });
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CallLogListPage;