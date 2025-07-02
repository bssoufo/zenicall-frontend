// src/modules/call-logs/pages/CallLogListPageWithContext.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Datatable, { DatatableColumn } from "../../../@zenidata/components/datatable/Datatable";
import { useTableParams } from "../../../@zenidata/components/datatable/useTableParams";
import { LoadingScreen } from "../../../@zenidata/components/UI/Loader";
import NoDataScreen from "../../../@zenidata/components/UI/NoDataScreen";
import { handleAxiosError } from "../../../@zenidata/api/ApiClient";
import CallLogService from "../CallLogService";
import { CallLogListView, CallLogStatus } from "../CallLogModel";
import { toast } from "react-hot-toast";
import { useClinic } from "../../clinics/hooks/useClinic";

const CallLogListPageWithContext: React.FC = () => {
  const { t } = useTranslation("call-logs");
  const { selectedClinic, clinics } = useClinic();
  const { params, updateParams } = useTableParams<CallLogListView>();

  const [callLogs, setCallLogs] = useState<CallLogListView[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 0,
    currentPage: params.currentPage,
    pageSize: params.pageSize,
    hasNextPage: false,
    hasPrevPage: false,
  });

  useEffect(() => {
    if (!selectedClinic) return;
    
    setLoading(true);
    CallLogService.getCallLogsByClinic(selectedClinic.id, {
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
    selectedClinic,
    params.search,
    params.status,
    params.currentPage,
    params.pageSize,
    params.orderBy,
    params.orderDirection,
    t,
  ]);

  const columns: DatatableColumn<CallLogListView>[] = [
    { 
      header: t("datatable.externalCallId"), 
      accessor: "external_call_id" as const,
      renderCell: (row) => (
        <Link 
          to={`/clinics/${selectedClinic?.id}/call-logs/${row.id}`}
          className="call-log-link"
          style={{ color: "#3b82f6", textDecoration: "none" }}
        >
          {row.external_call_id}
        </Link>
      )
    },
    { 
      header: t("datatable.callerFirstName"), 
      accessor: "caller_first_name" as const,
      renderCell: (row) => row.caller_first_name || "-"
    },
    { 
      header: t("datatable.callerLastName"), 
      accessor: "caller_last_name" as const,
      renderCell: (row) => row.caller_last_name || "-"
    },
    { 
      header: t("datatable.callerPhoneNumber"), 
      accessor: "caller_phone_number" as const 
    },
    {
      header: t("datatable.callStartedAt"),
      accessor: "call_started_at" as const,
      renderCell: (row) => (
        <span style={{ fontSize: "14px" }}>
          {new Date(row.call_started_at).toLocaleString()}
        </span>
      ),
    },
    { 
      header: t("datatable.reasonForCall"), 
      accessor: "reason_for_call" as const,
      renderCell: (row) => row.reason_for_call || "-"
    },
    { 
      header: t("datatable.status"), 
      accessor: "status" as const,
      renderCell: (row) => (
        <span className={`status-badge status-${row.status.toLowerCase().replace(' ', '-')}`}>
          {row.status}
        </span>
      )
    },
    {
      header: t("datatable.action"),
      accessor: undefined,
      renderCell: (row) => (
        <Link 
          to={`/clinics/${selectedClinic?.id}/call-logs/${row.id}`} 
          title={t("datatable.view")}
          className="action-link"
          style={{ 
            color: "#3b82f6", 
            textDecoration: "none",
            padding: "4px 8px",
            border: "1px solid #3b82f6",
            borderRadius: "4px",
            fontSize: "12px"
          }}
        >
          View
        </Link>
      ),
    },
  ];

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
              No Clinic Selected
            </h3>
            <p style={{ 
              margin: "0 0 16px 0", 
              color: "#6b7280",
              fontSize: "16px"
            }}>
              Please select a clinic from the header to view call logs.
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
                Create Your First Clinic
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
            Call Logs - {selectedClinic.name} {!loading && `(${pagination.totalItems})`}
          </h2>
        </div>
        
        {/* Search and Filter Controls */}
        <div className="iz_flex iz_content-links" style={{ 
          marginBottom: "20px", 
          gap: "16px",
          alignItems: "center"
        }}>
          <div className="iz_field iz_field-search">
            <input
              type="search"
              placeholder={t("callLogList.searchPlaceholder") || "Search call logs..."}
              defaultValue={params.search}
              onChange={(e) => updateParams({ search: e.target.value })}
              style={{
                padding: "8px 12px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "14px",
                minWidth: "250px"
              }}
            />
          </div>
          <div className="iz_field iz_field-select iz_flex" style={{ alignItems: "center", gap: "8px" }}>
            <label style={{ fontSize: "14px", color: "#374151" }}>Status:</label>
            <select
              value={params.status || ""}
              onChange={(e) => updateParams({ status: e.target.value })}
              style={{
                padding: "8px 12px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "14px",
                background: "white"
              }}
            >
              <option value="">All Statuses</option>
              <option value="New">New</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
              <option value="Archived">Archived</option>
            </select>
          </div>
        </div>

        {/* Call Logs Table */}
        <div className="iz-listing-docs iz_listing-table">
          {loading ? (
            <LoadingScreen />
          ) : callLogs.length === 0 ? (
            <div style={{
              textAlign: "center",
              padding: "3rem",
              background: "#f9fafb",
              borderRadius: "8px",
              border: "1px solid #e5e7eb"
            }}>
              <i className="fas fa-phone-slash" style={{ 
                fontSize: "48px", 
                color: "#9ca3af", 
                marginBottom: "16px" 
              }}></i>
              <h3 style={{ 
                margin: "0 0 8px 0", 
                color: "#374151",
                fontSize: "18px"
              }}>
                No Call Logs Found
              </h3>
              <p style={{ 
                margin: "0", 
                color: "#6b7280",
                fontSize: "14px"
              }}>
                {params.search || params.status 
                  ? "Try adjusting your search or filter criteria."
                  : "This clinic doesn't have any call logs yet."
                }
              </p>
            </div>
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

      {/* Add some custom styles */}
      <style jsx>{`
        .status-badge {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .status-new {
          background: #fef3c7;
          color: #92400e;
        }
        .status-in-progress {
          background: #e0e7ff;
          color: #3730a3;
        }
        .status-done {
          background: #d1fae5;
          color: #065f46;
        }
        .status-archived {
          background: #f3f4f6;
          color: #374151;
        }
        .call-log-link:hover,
        .action-link:hover {
          opacity: 0.8;
        }
      `}</style>
    </div>
  );
};

export default CallLogListPageWithContext;