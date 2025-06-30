// src/components/UI/Folder/list_folder/FolderList.jsx
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
// Import FontAwesome
import { handleAxiosError } from "../../../../@zenidata/api/ApiClient";
import ConfirmationDialog from "../../../../@zenidata/components/ConfirmationDialog";
import PaginatedList from "../../../../@zenidata/components/UI/PaginatedList";
import Folder from "../../FolderModel";
import FolderService from "../../FolderService";
/**
 * Composant pour lister les dossiers avec les actions Consulter, Modifier et Supprimer.
 * Inclut également un bouton pour ajouter un nouveau dossier.
 */
function FolderList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  // États pour les dossiers et la pagination
  const [folders, setFolders] = useState<Folder[]>([]);
  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: 5,
    hasNextPage: false,
    hasPrevPage: false,
  });
  // États pour la recherche et le filtrage
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("active");
  // États pour le chargement et les erreurs
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // États pour la sélection des dossiers
  const [selectedFolders, setSelectedFolders] = useState<Folder[]>([]);
  // États pour la boîte de dialogue de confirmation (optionnel)
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState<Folder | null>(null);
  /**
   * Fonction pour récupérer les dossiers avec les paramètres actuels.
   */
  const fetchFolders = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await FolderService.getFolders({
        search: searchTerm,
        status: statusFilter,
        page: pagination.currentPage,
        limit: pagination.pageSize,
      });
      setFolders(data.folders);
      setPagination(data.pagination);
    } catch (err) {
      handleAxiosError(err);
    } finally {
      setLoading(false);
    }
  }, [
    searchTerm,
    statusFilter,
    pagination.currentPage,
    pagination.pageSize,
    t,
  ]);
  // Appel initial et à chaque changement de paramètres
  useEffect(() => {
    console.log(searchTerm, pagination.currentPage, pagination.pageSize);
    fetchFolders();
  }, [searchTerm, pagination.currentPage, pagination.pageSize]);
  /**
   * Fonction pour gérer le changement de recherche.
   */
  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setPagination((prev) => ({ ...prev, currentPage: 1 })); // Réinitialiser à la première page
  };
  /**
   * Fonction pour gérer le changement de filtre.
   */
  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
    setPagination((prev) => ({ ...prev, currentPage: 1 })); // Réinitialiser à la première page
  };
  /**
   * Fonction pour changer de page.
   */
  const handlePageChange = (pageNumber: number) => {
    setPagination((prev) => ({ ...prev, currentPage: pageNumber }));
  };
  /**
   * Fonction pour sélectionner ou désélectionner un dossier.
   */
  const toggleSelectFolder = (folder: Folder) => {
    const folderId = folder.id;
    setSelectedFolders((prevSelected) =>
      prevSelected.findIndex((item) => item.id === folderId) > -1
        ? prevSelected.filter((item) => item.id !== folderId)
        : [...prevSelected, folder]
    );
  };
  /**
   * Fonction pour sélectionner ou désélectionner tous les dossiers.
   */
  const toggleSelectAll = () => {
    if (selectedFolders.length === folders.length) {
      setSelectedFolders([]);
    } else {
      setSelectedFolders(folders.map((folder) => folder));
    }
  };
  /**
   * Fonction pour supprimer un dossier.
   * @param {string} id - Identifiant du dossier à supprimer.
   */
  const deleteFolder = async (id: number) => {
    try {
      const response = await FolderService.deleteFolder(id);
      alert(t(`folder.api_messages.${response.api_message}`));
      // Mettre à jour la liste des dossiers en supprimant le dossier supprimé
      setFolders(folders.filter((folder) => folder.id !== id));
      // Recharger les dossiers pour mettre à jour la pagination
      fetchFolders();
    } catch (err) {
      handleAxiosError(err);
    }
  };
  /**
   * Fonction pour naviguer vers la page d'ajout de dossier.
   */
  const handleAdd = () => {
    navigate("/folders/create");
  };
  /**
   * Fonction pour naviguer vers la page de consultation d'un dossier.
   * @param {string} id - Identifiant du dossier à consulter.
   */
  const handleView = (id: number) => {
    navigate(`/folders/${id}/documents`);
  };
  /**
   * Fonction pour naviguer vers la page de modification d'un dossier.
   * @param {string} id - Identifiant du dossier à modifier.
   */
  // const handleEdit = (id: number) => {
  //   navigate(`/folders/edit/${id}`);
  // };
  /**
   * Fonction pour ouvrir la boîte de dialogue de confirmation avant suppression (optionnel).
   * @param {Object} folder - Dossier à supprimer.
   */
  const confirmDeleteFolder = (folder: Folder) => {
    setFolderToDelete(folder);
    setIsDialogOpen(true);
  };
  /**
   * Fonction appelée lorsque l'utilisateur confirme la suppression (optionnel).
   */
  const handleConfirmDelete = () => {
    if (folderToDelete) {
      deleteFolder(folderToDelete.id);
      setFolderToDelete(null);
      setIsDialogOpen(false);
    }
  };
  /**
   * Fonction appelée lorsque l'utilisateur annule la suppression (optionnel).
   */
  const handleCancelDelete = () => {
    setFolderToDelete(null);
    setIsDialogOpen(false);
  };
  /**
   * Rendu d’une ligne de dossier.
   * @param {Object} folder - Dossier à afficher.
   */
  const renderFolderItem = (folder: Folder) => (
    <tr key={folder.id}>
      <td>
        <input
          type="checkbox"
          aria-label={`Sélectionner le dossier ${folder.name}`}
          checked={!!selectedFolders.find((item) => item.id === folder.id)}
          onChange={() => toggleSelectFolder(folder)}
        />
      </td>
      <td>{folder.name || "N/A"}</td>
      <td>{folder.reception_email || "N/A"}</td>
      <td>{t(`folder.${folder.document_type}`) || "N/A"}</td>
      <td>{folder.retention_duration || "N/A"}</td>
      <td>{t(`folder.${folder.status}`) || "N/A"}</td>
      <td>
        <button onClick={() => handleView(folder.id)} className="action-button">
          {t("folder.Consulter")}
        </button>
        {/*
         <button onClick={() => handleEdit(folder.id)} className="action-button">
          {t('folder.Modifier')}
        </button>
        */}
        <button
          onClick={() => confirmDeleteFolder(folder)}
          className="delete-button">
          {t("folder.Supprimer")}
        </button>
      </td>
    </tr>
  );
  /**
   * Rendu de l'en-tête du tableau.
   */
  const renderTableHeader = () => (
    <tr>
      <th>
        <input
          type="checkbox"
          aria-label="Sélectionner tous les dossiers"
          checked={
            selectedFolders.length === folders.length && folders.length > 0
          }
          onChange={toggleSelectAll}
        />
      </th>
      <th>{t("folder.Name")}</th>
      <th>{t("folder.ReceptionEmail")}</th>
      <th>{t("folder.DocumentType")}</th>
      <th>{t("folder.RetentionDuration")}</th>
      <th>{t("folder.Status")}</th>
      <th>{t("folder.Actions")}</th>
    </tr>
  );
  /**
   * Rendu du corps du tableau.
   * @param {Object} folder - Dossier à afficher.
   */
  const renderTableBody = (folder: Folder) => renderFolderItem(folder);

  return (
    <div className="folder-list-container">
      <h2>{t("folder.Folders")}</h2>
      <button onClick={handleAdd} className="add-button" disabled={loading}>
        {t("folder.AddFolder")}
      </button>
      {/* Utilisation de PaginatedList */}
      <PaginatedList
        documents={folders}
        pagination={pagination}
        onSearchChange={handleSearchChange}
        onFilterChange={handleStatusChange}
        onPageChange={handlePageChange}
        searchPlaceholder={t("folder.searchPlaceholder") || "Rechercher..."}
        renderTableHeader={renderTableHeader}
        renderTableBody={renderTableBody}
        loading={loading}
        error={error}
      />
      {/* Boîte de Dialogue de Confirmation (optionnel) */}
      <ConfirmationDialog
        isOpen={isDialogOpen}
        title={t("folder.ConfirmDeleteTitle") || "Confirmer la Suppression"}
        message={
          t("folder.ConfirmDeleteMessage") ||
          "Êtes-vous sûr de vouloir supprimer ce dossier ? Cette action est irréversible."
        }
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        confirmText={t("folder.confirm") || "Confirmer"}
        cancelText={t("folder.cancel") || "Annuler"}
      />
    </div>
  );
}
// Exporter le composant par défaut
export default FolderList;
