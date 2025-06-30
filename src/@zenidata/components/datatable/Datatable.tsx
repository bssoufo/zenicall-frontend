import { ReactNode, useEffect, useState, useCallback } from "react";
import { Pagination } from "../../models/Shared";
import { LoadingScreen } from "../UI/Loader";
import { useTranslation } from "react-i18next";

export type DatatableColumn<T> = {
  header: string;
  accessor?: keyof T;
  renderCell?: (row: T) => ReactNode;
};

export type DatatableSortConfig<T> = {
  key: keyof T | null;
  direction: "asc" | "desc" | null;
};

type DatatableProps<T> = {
  data: T[];
  columns: DatatableColumn<T>[];
  searchTerm?: string;
  pagination?: Pagination;
  setPagination?: (p: Pagination | ((prev: Pagination) => Pagination)) => void;
  loading?: boolean;
  onSelectRows?: (rows: T[]) => void;
  sortConfig?: DatatableSortConfig<T>;
  handleSort?: (column: keyof T) => void;
};

const Datatable = <T,>({
  data,
  columns,
  searchTerm,
  pagination,
  setPagination,
  loading,
  onSelectRows,
  sortConfig,
  handleSort,
}: DatatableProps<T>) => {
  const { t: tCore } = useTranslation("core");
  const [selectedRows, setSelectedRowsState] = useState<T[]>([]);
  const [filteredData, setFilteredData] = useState<T[]>(data || []);

  useEffect(() => {
    // if (!data) throw Error("[Datatable]: Data cannot be undefined");
    let newData = data ? [...data] : [];

    // Filtrage global
    if (searchTerm) {
      newData = newData.filter((row) =>
        columns.some((col) =>
          row[col.accessor]
            ?.toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        )
      );
    }

    // // Tri
    // if (sortConfig?.key) {
    //   newData.sort((a, b) => {
    //     const valA = a[sortConfig.key!];
    //     const valB = b[sortConfig.key!];

    //     if (typeof valA === "number" && typeof valB === "number") {
    //       return sortConfig.direction === "asc" ? valA - valB : valB - valA;
    //     } else {
    //       return sortConfig.direction === "asc"
    //         ? valA.toString().localeCompare(valB.toString())
    //         : valB.toString().localeCompare(valA.toString());
    //     }
    //   });
    // }

    // const totalItems = newData.length;
    // const totalPages = Math.ceil(totalItems / pagination.pageSize);
    // const currentPage = Math.min(pagination.currentPage, totalPages) || 1;

    // // Vérification avant mise à jour pour éviter les boucles infinies
    // if (
    //   pagination.totalItems !== totalItems ||
    //   pagination.totalPages !== totalPages ||
    //   pagination.currentPage !== currentPage ||
    //   pagination.hasNextPage !== currentPage < totalPages ||
    //   pagination.hasPrevPage !== currentPage > 1
    // ) {
    //   setPagination((prev) => ({
    //     ...prev,
    //     totalItems,
    //     totalPages,
    //     currentPage,
    //     hasNextPage: currentPage < totalPages,
    //     hasPrevPage: currentPage > 1,
    //   }));
    // }

    // // Appliquer la pagination
    // const startIndex = (currentPage - 1) * pagination.pageSize;
    // setFilteredData(
    //   newData.slice(startIndex, startIndex + pagination.pageSize)
    // );

    setFilteredData(newData);
  }, [
    searchTerm,
    data,
    columns,
    sortConfig,
    pagination?.currentPage,
    pagination?.pageSize,
    pagination?.totalItems,
    setPagination,
  ]);

  // console.log("Data: ", data);

  // Gestion du tri

  // Changer de page (Utilisation de `useCallback` pour éviter les re-renders inutiles)
  const goToPage = useCallback(
    (page: number) => {
      if (loading) return;
      console.log("********* GOTO PAGE");
      setPagination((prev) => ({
        ...prev,
        currentPage: page,
        hasNextPage: page < prev.totalPages,
        hasPrevPage: page > 1,
      }));
    },
    [setPagination, loading]
  );

  // Changer la taille de la pagination
  const handlePageSizeChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const newSize = Number(event.target.value);
      setPagination((prev) => ({
        ...prev,
        pageSize: newSize,
        totalPages: Math.ceil(prev.totalItems / newSize),
        currentPage: 1, // Revenir à la première page après modification
      }));
    },
    [setPagination]
  );

  // Générer les boutons de pagination avec "..."
  const getPageNumbers = () => {
    const { totalItems, pageSize, currentPage } = pagination;
    const totalPages = Math.ceil(totalItems / pageSize); // Calculer correctement le total des pages
    const pages: (number | string)[] = [];

    if (totalPages <= 5) {
      // Si on a 5 pages ou moins, afficher toutes les pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1); // Toujours afficher la première page

      if (currentPage > 3) {
        pages.push("..."); // Ajouter une ellipse si l'utilisateur est loin du début
      }

      // Ajouter les numéros autour de la page actuelle
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("..."); // Ajouter une ellipse si l'utilisateur est loin de la fin
      }

      pages.push(totalPages); // Toujours afficher la dernière page
    }

    return pages;
  };

  const toggleRowSelection = (row: T) => {
    setSelectedRowsState((prev) => {
      const isSelected = prev.includes(row);
      const newSelectedRows = isSelected
        ? prev.filter((r) => r !== row)
        : [...prev, row];

      onSelectRows?.(newSelectedRows); // Envoi au parent si onSelectRows est défini
      return newSelectedRows;
    });
  };

  const toggleAllSelection = () => {
    const allSelected = selectedRows.length === filteredData.length;
    const newSelectedRows = allSelected ? [] : [...filteredData];

    setSelectedRowsState(newSelectedRows);
    onSelectRows?.(newSelectedRows);
  };

  // Vérifie si une ligne est sélectionnée
  const isRowSelected = (row: T) => selectedRows.includes(row);

  if (!columns || columns?.length === 0) <p>Invalid configuration</p>;

  return (
    <>
      {/* Sélecteur pour changer le nombre d'éléments affichés */}
      {pagination && filteredData.length > 0 && (
        <div className="iz_table-options" style={{ marginBottom: "0.5rem" }}>
          <label>
            <span>
              {tCore("datatable.page")} {pagination.currentPage} /{" "}
              {pagination.totalPages}
            </span>{" "}
            | <span>{tCore("datatable.totalElements")}</span>
            &nbsp;&nbsp;
            <select
              disabled={loading}
              value={pagination?.pageSize}
              onChange={handlePageSizeChange}
              className="iz_select-page-size">
              <option value="1">1</option>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </label>
        </div>
      )}
      <div className="iz-table-container iz_hidden-mobile">
        {loading ? (
          <LoadingScreen />
        ) : (
          <table className="iz_hidden-mobile">
            <thead>
              <tr>
                <th className="iz_check-column">
                  {!!onSelectRows && (
                    <input
                      type="checkbox"
                      onChange={toggleAllSelection}
                      checked={selectedRows.length === filteredData.length}
                    />
                  )}
                </th>
                {columns.map((col, index) => (
                  <th
                    key={index}
                    onClick={() => col.accessor && handleSort(col.accessor)}
                    style={{ cursor: col.accessor ? "pointer" : "default" }}>
                    <a href="#">
                      {col.header}
                      {col.accessor &&
                        sortConfig &&
                        col.accessor === sortConfig.key && (
                          <span className="iz_sorting-indicatorsxxx">
                            {!!sortConfig && (
                              <img
                                style={{
                                  height: "6px",
                                  rotate:
                                    sortConfig.direction === "asc"
                                      ? "90deg"
                                      : "270deg",

                                  // fill:
                                  //   sortConfig.key === col.accessor ? "red" : "",
                                }}
                                src="/assets/img/arrow-right.svg"

                                // src="/assets/img/icon-sorting-indicators.svg"
                              />
                            )}
                          </span>
                        )}
                    </a>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    <td className="iz_check-column">
                      {!!onSelectRows && (
                        <input
                          type="checkbox"
                          checked={isRowSelected(row)}
                          onChange={() => toggleRowSelection(row)}
                        />
                      )}
                    </td>
                    {columns.map((col, colIndex) => (
                      <td key={colIndex}>
                        {col.renderCell
                          ? col.renderCell(row)
                          : (row[col.accessor!] as ReactNode) ?? "-- --"}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length + 1} className="iz_no-results">
                    Aucune donnée trouvée.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
      {/* Pagination */}
      {pagination &&
        filteredData.length > 0 &&
        filteredData.length < pagination.totalItems && (
          <div
            className="iz_pagination iz_flex"
            style={{ cursor: loading && "wait" }}>
            <ul>
              <li>
                <span
                  onClick={() =>
                    pagination?.hasPrevPage &&
                    goToPage(pagination?.currentPage - 1)
                  }
                  style={{ cursor: loading && "wait" }}
                  className={`${
                    !pagination?.hasPrevPage && "iz_disabled-btn"
                  } iz_prev-page iz_btn-page`}
                  aria-hidden="true">
                  ‹
                </span>
              </li>
              {getPageNumbers().map((page, index) =>
                page === "..." ? (
                  <span key={index} className="iz_btn-page iz_btn-disabled">
                    ...
                  </span>
                ) : (
                  <li key={index}>
                    <a
                      style={{ cursor: loading && "wait" }}
                      className={`iz_btn-page ${
                        pagination.currentPage === page ? "iz_btn-active" : ""
                      }`}
                      onClick={() => goToPage(page as number)}>
                      {page}
                    </a>
                  </li>
                )
              )}

              <li>
                <a
                  style={{ cursor: loading && "wait" }}
                  className={`${
                    !pagination?.hasNextPage && "iz_disabled-btn "
                  }  iz_next-page iz_btn-page iz_loading-btn`}>
                  <span
                    onClick={() =>
                      pagination?.hasNextPage &&
                      goToPage(pagination?.currentPage + 1)
                    }
                    aria-hidden="true">
                    ›
                  </span>
                </a>
              </li>
            </ul>
          </div>
        )}
    </>
  );
};

export default Datatable;
