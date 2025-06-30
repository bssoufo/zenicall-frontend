import { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { handleAxiosError } from "../../../@zenidata/api/ApiClient";
import Folder from "../FolderModel";
import FolderService from "../FolderService";
import Datatable, {
  DatatableColumn,
  DatatableSortConfig,
} from "../../../@zenidata/components/datatable/Datatable";
import { Link } from "react-router-dom";
import { Pagination } from "../../../@zenidata/models/Shared";
import { formatDate } from "../../../@zenidata/utils";
import { displayFolderStatus } from "../helper";

interface Props {
  folders: Folder[];
  // fetchData: () => any;
  searchTerm?: string;
  pagination?: Pagination;
  setPagination?: (p: Pagination | ((prev: Pagination) => Pagination)) => void;
  loading?: boolean;
  handleSelectedRows: (rows: Folder[]) => void;

  sortConfig?: DatatableSortConfig<Folder>;
  handleSort?: (config: keyof Folder) => void;
}
const FolderList = ({
  folders,
  // fetchData,
  pagination,
  setPagination,
  loading,
  handleSelectedRows,
  sortConfig,
  handleSort,
}: Props) => {
  const { t: tCore } = useTranslation();
  const { t } = useTranslation("folders");

  //   const [loading, setLoading] = useState(false);
  //   const [error, setError] = useState("");

  // const [searchTerm, setSearchTerm] = useState("");
  // const [statusFilter, setStatusFilter] = useState("active");

  // const [pagination, setPagination] = useState({
  //   totalItems: folders.length,
  //   totalPages: Math.ceil(folders.length / 5),
  //   currentPage: 1,
  //   pageSize: 5,
  //   hasNextPage: folders.length > 5,
  //   hasPrevPage: false,
  // });

  // useEffect(
  //   () => {
  //     console.log(searchTerm, pagination.currentPage, pagination.pageSize);
  //     fetchData();
  //   },
  //   []
  //   // [searchTerm, pagination.currentPage, pagination.pageSize]
  // );

  const columns: DatatableColumn<Folder>[] = [
    { header: t("datatable.id"), accessor: "id" as const },
    { header: t("datatable.folderName"), accessor: "name" as const },
    // { header: "Reception Email", accessor: "reception_email" as const },
    { header: t("datatable.documentType"), accessor: "document_type" as const },

    {
      header: t("datatable.documentCount"),
      accessor: "document_count" as const,
      renderCell: (row) => (
        <div className="iz_col-number-doc iz_text-center">
          <span>{row.document_count}</span>
        </div>
      ),
    },
    // { header: "Document Status", accessor: "status" as const },
    // { header: "Retention Duration", accessor: "retention_duration" as const },
    {
      header: t("datatable.createdOn"),
      accessor: "created_at" as const,
      renderCell: (row) => <>{formatDate(row.created_at)}</>,
    },
    {
      header: t("datatable.status"),
      accessor: "status" as const,
      renderCell: (row) => (
        <span className="iz_text-success">
          {displayFolderStatus(row.status, tCore(row.status))}
        </span>
      ),
    },
    {
      header: t("datatable.action"),
      accessor: undefined,
      renderCell: (row) => (
        <div className="iz_btns-action">
          <Link
            to={`/folders/${row.id}/documents/create`}
            className="iz_btn-add-document"
            title={t("datatable.addDocument")}>
            <i></i>
          </Link>
          <Link
            to={`/folders/${row.id}`}
            className="iz_btn-view-document iz_btn-view-item"
            title={t("datatable.viewDocument")}></Link>
          {/* <a href="#" className="iz_btn-menu">
            <i className="fa-solid fa-ellipsis"></i>
          </a> */}
        </div>
      ),
    },
    // { header: "Created At", accessor: "created_at" as const },
    // { header: "Created By", accessor: "created_by" as const },
    // { header: "Updated By", accessor: "updated_by" as const },
    // { header: "Updated At", accessor: "updated_at" as const },
  ];

  // if (folders.length === 0) return <p>Aucun dossier</p>;

  // const handleSelectedRows = (rows) => {
  //   console.log("Lignes sélectionnées :", rows);
  // };

  return (
    <>
      <Datatable
        columns={columns}
        data={folders}
        pagination={pagination}
        setPagination={setPagination}
        loading={loading}
        // selectable={true}
        onSelectRows={handleSelectedRows}
        sortConfig={sortConfig}
        handleSort={handleSort}
      />
    </>
  );
};

export default FolderList;
