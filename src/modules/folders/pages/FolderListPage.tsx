import React, { useEffect, useRef, useState } from "react";
import FolderList from "../components/FolderList";
import Folder from "../FolderModel";
import { handleAxiosError } from "../../../@zenidata/api/ApiClient";
import FolderService from "../FolderService";
import { Link } from "react-router-dom";
import { LoadingScreen } from "../../../@zenidata/components/UI/Loader";
import UserHello from "../../auth/components/UserHello";
import NoDataScreen from "../../../@zenidata/components/UI/NoDataScreen";
import { displayFolderStatus } from "../helper";
import useScreenSize from "../../../@zenidata/hooks/useScreenSize";
import { formatDate } from "../../../@zenidata/utils";
import { useTranslation } from "react-i18next";
import { useTableParams } from "../../../@zenidata/components/datatable/useTableParams";

const FolderListPage = () => {
  const { t } = useTranslation("folders");
  const { isMobileScreen } = useScreenSize();

  const { params, updateParams } = useTableParams<Folder>();

  const [folders, setFolders] = React.useState<Folder[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>(params.search);
  const [statusFilter, setStatusFilter] = useState<string>(params.status);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);

  const [pagination, setPagination] = useState({
    totalItems: folders.length,
    totalPages: 0,
    currentPage: params.currentPage,
    pageSize: params.pageSize,
    hasNextPage: folders.length > 5,
    hasPrevPage: false,
  });

  const [sortConfig, setSortConfig] = useState<{
    key: keyof Folder | null;
    direction: "asc" | "desc" | null;
  }>({
    key: params.orderBy,
    direction: params.orderDirection,
  });

  const searchInputRef = useRef(null);
  const statusSelectRef = useRef(null);

  const fetchFolders = () => {
    setLoading(true);
    setError("");
    try {
      FolderService.getFolders({
        search: searchTerm,
        status: statusFilter,
        page: pagination.currentPage,
        limit: pagination.pageSize,
        orderBy: sortConfig.key,
        direction: sortConfig.direction,
      }).then((data) => {
        setFolders(data.folders);
        // console.log(data);
        setPagination(data.pagination);
        // console.log(data);
        setLoading(false);
      });
    } catch (err) {
      handleAxiosError(err);
    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
    const { pageSize, currentPage } = pagination;
    const { key, direction } = sortConfig;
    updateParams({
      pageSize,
      currentPage,
      orderBy: key,
      orderDirection: direction,
      status: statusFilter ?? "",
      search: searchTerm ?? "",
    });

    fetchFolders();
  }, [
    pagination.currentPage,
    pagination.pageSize,
    searchTerm,
    statusFilter,
    sortConfig.key,
    sortConfig.direction,
  ]);

  useEffect(() => {
    if (searchInputRef.current) searchInputRef.current.value = params.search;
    if (statusSelectRef.current) statusSelectRef.current.value = params.status;
  }, [params.search, params.status]);

  const handleSelectedRows = (rows) => {
    console.log("Lignes sélectionnées :", rows);
  };

  const handleSearchInputChange = (e) => {
    if (searchTimeout) {
      clearInterval(searchTimeout);
    }

    const timeout = setTimeout(() => {
      const search = e.target.value;
      setSearchTerm(search);
      updateParams({ search });
    }, 1000);

    setSearchTimeout(timeout);
  };

  const handleSelectInputChange = (e) => {
    const status = e.target.value;
    setStatusFilter(status);
    // console.log(e.target.value);
    updateParams({ status });
  };

  const handleSort = (column: keyof Folder) => {
    if (!sortConfig) return;
    setSortConfig((prev) => ({
      key: prev.key === column ? column : column,
      direction:
        prev.key === column && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleReset = () => {
    setSearchTerm("");
    setStatusFilter(null);
    setSortConfig({
      key: "created_at",
      direction: "desc",
    });

    setPagination({
      totalItems: folders.length,
      totalPages: 0,
      currentPage: 1,
      pageSize: 20,
      hasNextPage: folders.length > 5,
      hasPrevPage: false,
    });

    // <<<<<<<-------------
    updateParams({});

    searchInputRef.current.value = null;
    statusSelectRef.current.value = "";
  };

  return (
    <>
      <div className="iz_content-block iz_content-dasboard iz_position-relative">
        <div className="iz_content-block-container">
          <UserHello />

          <div className="iz_folders-block">
            <div className="iz_content-title iz_flex">
              <h2 className="iz_title-h2">
                {t("foldersList.folders")}{" "}
                {!loading && `(${pagination.totalItems})`}
              </h2>
              <div className="iz_flex iz_content-links">
                {/* {!loading && ( */}
                <form className="" action="">
                  <div className="iz_fields iz_flex">
                    <div className="iz_field iz_field-search">
                      <input
                        value={searchInputRef?.current?.value}
                        ref={searchInputRef}
                        onChange={handleSearchInputChange}
                        type="search"
                        placeholder="Search"
                      />
                    </div>
                    <div>
                      <button
                        type="button"
                        style={{ marginRight: "0.5rem" }}
                        onClick={handleReset}
                        title=""
                        className={`${
                          loading && ""
                        } iz_btn iz_btn-white iz_btn-white-2 iz_hidden-mobile`}>
                        {t("foldersList.reset")}
                      </button>
                    </div>

                    <div
                      style={{ display: "flex", flexWrap: "nowrap" }}
                      className="iz_field iz_field-select iz_flex">
                      <label> {t("foldersList.status")}</label>
                      <select
                        ref={statusSelectRef}
                        style={{ marginLeft: "1rem" }}
                        defaultValue="active"
                        disabled={loading}
                        onChange={handleSelectInputChange}>
                        <option value="">
                          {t("foldersList.statusFilter.all")}
                        </option>
                        <option value="active">
                          {t("foldersList.statusFilter.active")}
                        </option>
                        <option value="archived">
                          {t("foldersList.statusFilter.archived")}
                        </option>
                      </select>
                    </div>
                  </div>
                </form>
                {/* )} */}
                <Link
                  to="/folders/create"
                  title="Add folder"
                  className="iz_btn iz_btn-primary iz_hidden-mobile">
                  {t("foldersList.addFolder")}
                </Link>
              </div>
            </div>
            <div className="iz-listing-docs iz_listing-table">
              <div className="iz_hidden-tablet-desktop iz-listing-docs-content iz_listing-table-content">
                {isMobileScreen && loading && <LoadingScreen />}

                {!loading &&
                  folders.length > 0 &&
                  folders.map((folder, index) => (
                    <div key={index} className="iz_item-table">
                      <div className="iz_item-table-content">
                        <h3 className="iz_item-name">{folder.name}</h3>
                        <div className="iz_fields-table">
                          {/* <div className="iz_field-table iz_flex">
                        <span>Reception email</span>
                        <span>toto@gmail.com</span>
                      </div> */}

                          <div className="iz_field-table iz_flex">
                            <span>{t("foldersList.documentType")}</span>
                            <span>{folder.document_type}</span>
                          </div>
                          <div className="iz_field-table iz_flex">
                            <span>{t("foldersList.documentCount")}</span>
                            <span>{folder.document_count}</span>
                          </div>
                          {/* <div className=" iz_field-table iz_flex">
                        <span>Document Status</span>
                        <span>{folder.status}</span>
                      </div> */}
                          {/* <div className="iz_field-table iz_flex">
                        <span>Retention duration</span>
                        <span>PNG</span>
                      </div> */}
                          <div className=" iz_field-table iz_flex">
                            <span>{t("foldersList.createdOn")}</span>
                            <span>{formatDate(folder.created_at)}</span>
                          </div>
                          <div className=" iz_field-table iz_flex">
                            <span>{t("foldersList.status")}</span>
                            <span className="iz_text-success">
                              {displayFolderStatus(folder.status)}
                            </span>
                          </div>
                        </div>
                        <div className="iz_fields-btn-action iz_flex">
                          <Link
                            to={`/folders/${folder.id}/documents/create`}
                            title="View document"
                            className="iz_link-document iz_field-link-table">
                            {t("foldersList.addDocument")}
                          </Link>
                          <Link
                            to={`/folders/${folder.id}`}
                            className="iz_btn-view-document iz_field-link-table">
                            {/* <i className="fa-regular fa-eye"></i> */}
                          </Link>
                          {/* <a
                            href="#"
                            className="iz_btn-menu iz_field-link-table">
                            <i className="fa-solid fa-ellipsis"></i>
                          </a> */}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              {/* <div className="iz-table-container iz_hidden-mobile">
            <table className="iz_hidden-mobile">
              <thead>
                <tr>
                  <th className="iz_check-column">
                    <input type="checkbox" />
                  </th>
                  <th>
                    <a href="#">
                      Folder Name{" "}
                      <span className="iz_sorting-indicators"></span>
                    </a>
                  </th>
                  <th>
                    <a href="#">
                      Reception Email{" "}
                      <span className="iz_sorting-indicators"></span>
                    </a>
                  </th>
                  <th>
                    <a href="#">
                      Document <span className="iz_sorting-indicators"></span>
                    </a>
                  </th>
                  <th>
                    <a href="#">
                      Document Status{" "}
                      <span className="iz_sorting-indicators"></span>
                    </a>
                  </th>
                  <th>
                    <a href="#">
                      Retention duration{" "}
                      <span className="iz_sorting-indicators"></span>
                    </a>
                  </th>
                  <th>
                    <a href="#">Created On</a>
                  </th>
                  <th>
                    <a href="#">
                      Status<span className="iz_sorting-indicators"></span>
                    </a>
                  </th>
                  <th className="iz_column-actions">
                    <a href="#">Actions</a>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="iz_check-column">
                    <input type="checkbox" />
                  </td>
                  <td>
                    <span>invoice 2025</span>
                  </td>
                  <td>
                    <span>toto@gmail.com</span>
                  </td>
                  <td className="iz_col-number-doc iz_text-center">
                    <span>2</span>
                  </td>
                  <td className="iz_no-file">
                    <span>na</span>
                  </td>
                  <td className="iz_text-center">
                    <span>30</span>
                  </td>
                  <td>
                    <span>07/01/2025</span>
                  </td>
                  <td>
                    <span className="iz_text-success">Folder active</span>
                  </td>
                  <td>
                    <div className="iz_btns-action">
                      <a href="#" className="iz_btn-add-document">
                        <i className="fa-regular fa-plus"></i>
                      </a>
                      <a
                        href="#"
                        className="iz_btn-view-document iz_btn-view-item">
                        <i className="fa-regular fa-eye"></i>
                      </a>
                      <a href="#" className="iz_btn-menu">
                        <i className="fa-solid fa-ellipsis"></i>
                      </a>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="iz_check-column">
                    <input type="checkbox" />
                  </td>
                  <td>
                    <span>invoice 2025</span>
                  </td>
                  <td>
                    <span>titi@gmail.com</span>
                  </td>
                  <td className="iz_col-number-doc iz_text-center">
                    <span>2</span>
                  </td>
                  <td className="">
                    <span>2 of 2 processed</span>
                  </td>
                  <td className="iz_text-center">
                    <span>30</span>
                  </td>
                  <td>
                    <span>07/01/2025</span>
                  </td>
                  <td>
                    <span className="iz_text-success">Folder active</span>
                  </td>
                  <td>
                    <div className="iz_btns-action">
                      <a href="#" className="iz_btn-add-document">
                        <i className="fa-regular fa-plus"></i>
                      </a>
                      <a
                        href="#"
                        className="iz_btn-view-document iz_btn-view-item">
                        <i className="fa-regular fa-eye"></i>
                      </a>
                      <a href="#" className="iz_btn-menu">
                        <i className="fa-solid fa-ellipsis"></i>
                      </a>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div> */}

              {/* {loading ? (
                <LoadingScreen />
              ) : ( */}
              {!loading && folders.length === 0 ? (
                <NoDataScreen />
              ) : (
                <FolderList
                  // fetchData={fetchFolders}
                  folders={folders}
                  pagination={pagination}
                  setPagination={setPagination}
                  loading={loading}
                  handleSelectedRows={handleSelectedRows}
                  sortConfig={sortConfig}
                  handleSort={handleSort}
                />
              )}
              {/* )} */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FolderListPage;
