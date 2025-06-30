// src/components/UI/PaginatedList.jsx
import React from "react";
import "./PaginatedList.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import Loader from "./Loader";

interface Props {
  documents: Object[];
  pagination: any;
  onSearchChange: (value: string) => void;
  onFilterChange: (value: string) => void;
  onPageChange: (value: number) => void;
  searchPlaceholder: string;
  renderTableHeader: () => React.ReactNode;
  renderTableBody: (value: any) => React.ReactNode;
  loading: boolean;
  error: string;
}

function PaginatedList({
  documents,
  pagination,
  onSearchChange,
  // onFilterChange,
  onPageChange,
  searchPlaceholder,
  renderTableHeader,
  renderTableBody,
  loading,
  error,
}: Props) {
  const { totalPages, currentPage } = pagination;
  return (
    <div className="paginated-list">
      {/* Barre de recherche améliorée */}
      <div className="search-bar">
        <FontAwesomeIcon icon={faSearch} className="search-icon" />
        <input
          type="text"
          placeholder={searchPlaceholder}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
          aria-label="Recherche"
        />
        {/* L'icône de suppression est gérée dans le parent */}
      </div>
      {/* Affichage des erreurs */}
      {error && <p className="error">{error}</p>}
      {/* Affichage de l'état de chargement */}
      {loading ? (
        <Loader />
      ) : (
        <>
          {/* Table des documents */}
          <div className="items-container">
            <table className="paginated-table">
              <thead>{renderTableHeader()}</thead>
              <tbody>
                {documents.length > 0 ? (
                  documents.map((doc) => renderTableBody(doc))
                ) : (
                  <tr>
                    <td colSpan={7}>Aucun document trouvé.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => onPageChange(pageNumber)}
                  className={`page-number ${
                    currentPage === pageNumber ? "active" : ""
                  }`}
                  aria-label={`Page ${pageNumber}`}>
                  {pageNumber}
                </button>
              )
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default PaginatedList;
