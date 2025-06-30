import { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { handleAxiosError } from "../../../@zenidata/api/ApiClient";
import FolderService from "../../folders/FolderService";
import Datatable, {
  DatatableColumn,
  DatatableSortConfig,
} from "../../../@zenidata/components/datatable/Datatable";
import { Document } from "../models/DocumentModel";
import { Pagination } from "../../../@zenidata/models/Shared";
import { Link } from "react-router-dom";
import { formatDate } from "../../../@zenidata/utils";

interface Props {
  data: Document[];
  fetchData: () => any;
  searchTerm?: string;
  pagination?: Pagination;
  setPagination?: (p: Pagination | ((prev: Pagination) => Pagination)) => void;
  loading?: boolean;
  handleSelectedRows?: (rows: Document[]) => void;
  sortConfig?: DatatableSortConfig<Document>;
  handleSort?: (config: keyof Document) => void;
}
const DocumentList = ({
  data,
  fetchData,
  searchTerm,
  pagination,
  setPagination,
  handleSelectedRows,
  sortConfig,
  handleSort,
}: Props) => {
  const { t } = useTranslation("documents");
  // const navigate = useNavigate();

  // const [pagination, setPagination] = useState<Pagination>({
  //   totalItems: 0,
  //   totalPages: 0,
  //   currentPage: 1,
  //   pageSize: 10,
  //   hasNextPage: false,
  //   hasPrevPage: false,
  // });
  // const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("pending");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  //   const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  //   const [processing, setProcessing] = useState<boolean>(false);
  // @ts-ignore
  const [processStatus, setProcessStatus] = useState<
    "processing" | "completed" | null
  >(null);
  //   const pollingIntervalRef = useRef<number | null>(null);

  //   const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  //   const [dialogTitle, setDialogTitle] = useState<string>("");
  //   const [dialogMessage, setDialogMessage] = useState<string>("");
  //   const [dialogConfirmAction, setDialogConfirmAction] = useState<() => void>(
  //     () => {}
  //   );
  //   const [dialogCancelAction, setDialogCancelAction] = useState<() => void>(
  //     () => {}
  //   );

  // useEffect(() => {
  //   fetchData();
  // }, [fetchData]);

  const columns: DatatableColumn<Document>[] = [
    { header: t("datatable.id"), accessor: "id" as const }, // Identifiant unique du document
    { header: t("datatable.documentName"), accessor: "name" as const }, // Nom du document
    // { header: "Document Type", accessor: "document_type" as const }, // Nom du document
    { header: t("datatable.folder"), accessor: "folder_name" as const }, // Nom du document
    // { header: "Size", accessor: "size" as const }, // Chemin du fichier
    // { header: "Format", accessor: "extension" as const }, // Chemin du fichier
    // { header: "Type", accessor: "document_type" as const }, // Chemin du fichier
    // { header: "Dossier", accessor: "folder_id" as const }, // Chemin du fichier
    // { header: "Taille", accessor: "size" as const }, // Chemin du fichier
    {
      header: t("datatable.processedOn"),
      accessor: "updated_at" as const,
      renderCell: (row) => <>{formatDate(row.updated_at)}</>,
    }, // Chemin du fichier
    // { header: "Status", accessor: "status" as const }, // Statut du document (processed, completed, failed)
    {
      header: t("datatable.action"),
      // accessor: "status" as const,
      renderCell: (row) => (
        <div className="iz_btns-action">
          <Link
            to={`/folders/${row.folder_id}/documents/${row.id}`}
            className="iz_btn-view-document"
            title="View document"></Link>

          {/* <a href="#" className="iz_btn-menu">
            <i className="fa-solid fa-ellipsis"></i>
          </a> */}
        </div>
      ),
    }, // Statut du document (processed, completed, failed)
    // { header: "Updated By", accessor: "updated_by" as const }, // Utilisateur ayant effectué la mise à jour
    // { header: "Updated At", accessor: "updated_at" as const }, // Date de la dernière mise à jour
    // { header: "Folder ID", accessor: "folder_id" as const }, // Identifiant du dossier
    // { header: "Created By", accessor: "created_by" as const }, // Créateur du document
    // { header: "Created At", accessor: "created_at" as const }, // Date de création
    // { header: "File URL", accessor: "file_url" as const }, // URL d'accès au fichier
  ];

  return (
    <>
      <Datatable
        columns={columns}
        data={data}
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

export default DocumentList;
