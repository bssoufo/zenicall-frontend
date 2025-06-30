import { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { handleAxiosError } from "../../../@zenidata/api/ApiClient";
import Folder from "../../folders/FolderModel";
import FolderService from "../../folders/FolderService";
import Datatable, {
  DatatableColumn,
  DatatableSortConfig,
} from "../../../@zenidata/components/datatable/Datatable";
import { BackendDocument } from "../models/DocumentModel";
import { Pagination } from "../../../@zenidata/models/Shared";
import { Link, useParams } from "react-router-dom";
import Loader from "../../../@zenidata/components/UI/Loader";
import { downloadFile, formatDate } from "../../../@zenidata/utils";
import { useGlobalModal } from "../../../@zenidata/components/GlobalModal/GlobalModal";
import { displayDocumentStatus } from "../helper";

const url = "/assets/img/amico.png";

interface Props {
  data: BackendDocument[];
  processingState: Record<number, boolean>;
  fetchData: () => any;
  handleProcessDocuments: (ids: number[]) => void;
  searchTerm?: string;
  pagination?: Pagination;
  setPagination?: (p: Pagination | ((prev: Pagination) => Pagination)) => void;
  loading?: boolean;
  handleDeleteDocument?: (row: BackendDocument) => void;
  handleSelectedRows: (rows: BackendDocument[]) => void;
  sortConfig?: DatatableSortConfig<BackendDocument>;
  handleSort?: (config: keyof BackendDocument) => void;
}
const DocumentEditableList = ({
  data,
  processingState,
  fetchData,
  handleProcessDocuments,
  searchTerm,
  pagination,
  setPagination,
  loading,
  handleSelectedRows,
  handleDeleteDocument,
  sortConfig,
  handleSort,
}: Props) => {
  const { t: tCore } = useTranslation();
  const { t } = useTranslation("documents");
  const { folderId } = useParams();
  // const navigate = useNavigate();

  // console.log(processingDocumentIds);

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
  // const [loading, setLoading] = useState<boolean>(false);
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

  // useEffect(() => {number
  //   fetchData();
  // }, [fetchData]);

  const columns: DatatableColumn<BackendDocument>[] = [
    { header: t("datatable.id"), accessor: "id" as const }, // Identifiant unique du document
    { header: t("datatable.documentName"), accessor: "name" as const }, // Nom du document
    // { header: "Size", accessor: "size" as const }, // Chemin du fichier
    // { header: "Format", accessor: "extension" as const }, // Chemin du fichier
    // { header: "Type", accessor: "document_type" as const }, // Chemin du fichier
    // { header: "Dossier", accessor: "folder_id" as const }, // Chemin du fichier
    // { header: "Taille", accessor: "size" as const }, // Chemin du fichier
    {
      header: t("datatable.createdOn"),
      accessor: "created_at" as const,
      renderCell: (row) => <>{formatDate(row.created_at)}</>,
    }, // Chemin du fichier
    {
      header: t("datatable.status"),
      accessor: "status" as const,
      renderCell: (row) => displayDocumentStatus(row.status, tCore(row.status)),
    }, // Statut du document (processed, completed, failed)
    {
      header: t("datatable.action"),
      // accessor: "status" as const,
      renderCell: (row) => (
        <div className="iz_btns-action">
          <div
            className="iz_btns-action-content iz_flex"
            style={{ justifyContent: "flex-end" }}>
            <button
              style={{ display: "flex", alignItems: "center" }}
              onClick={() => handleProcessDocuments([row.id])}
              disabled={!!processingState[row.id]}
              className="iz_btn iz_btn-white-2"
              title="process">
              {/* Process */}
              {!!processingState[row.id] ? (
                <>
                  <Loader showText={false} size="small" />
                  {t("processing")}
                </>
              ) : (
                t("process")
              )}
            </button>

            <Link
              // style={{
              //   opacity: row.status == "processed" ? 1 : 0.3,
              //   cursor: row.status == "processed" ? "pointer" : "not-allowed",
              // }}
              to={`/folders/${row.folder_id}/documents/${row.id}`}
              className="iz_btn-view-document iz_btn-view-item"></Link>

            {/* <a
              onClick={() => downloadFile(url)}
              className="iz_btn-download-document">
             <i className="fa-regular fa-download"></i> 
            </a> */}
            {/* <Link to="#" className="iz_folder-btn-update"></Link> */}
            <a
              onClick={() => handleDeleteDocument(row)}
              className="iz_file-delete-upload iz_text-error"
              title="Remove upload"></a>
          </div>
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
        pagination={pagination}
        setPagination={setPagination}
        loading={loading}
        onSelectRows={handleSelectedRows}
        sortConfig={sortConfig}
        handleSort={handleSort}
      />
    </>
  );
};

export default DocumentEditableList;
