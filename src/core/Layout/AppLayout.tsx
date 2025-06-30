import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState, useTransition } from "react";
import { AuthContext } from "../../modules/auth/contexts/AuthContext";
import { useAxiosInterceptor } from "../../modules/auth/hooks/useAxiosInterceptor";
import useScreenSize from "../../@zenidata/hooks/useScreenSize";
import LanguageSwitcher from "../../@zenidata/components/UI/Language/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { useAxiosErrorHandingInterceptor } from "../../@zenidata/api/ApiClient";

function AppLayout() {
  const { t } = useTranslation();
  useAxiosInterceptor();
  useAxiosErrorHandingInterceptor();
  // useResetOnNavigation();
  const navigate = useNavigate();
  const location = useLocation();

  const { user, logout } = useContext(AuthContext);

  const { isMobileScreen } = useScreenSize();

  const [sidebarOpen, setSidebarOpen] = useState(!isMobileScreen);

  useEffect(() => {
    const mainContentBlock = document.querySelector(".iz_content-block");
    const headerBlock = document.getElementById("iz-header");

    if (sidebarOpen) {
      mainContentBlock?.classList.remove("closed");
      headerBlock?.classList.remove("closed");
    } else {
      mainContentBlock?.classList.add("closed");
      headerBlock?.classList.add("closed");
    }

    const handleResize = () => {
      const isOpen = window.innerWidth > 767;
      setSidebarOpen(isOpen);

      if (isOpen) {
        mainContentBlock.classList.remove("closed");
        headerBlock.classList.remove("closed");
      } else {
        mainContentBlock.classList.add("closed");
        headerBlock.classList.add("closed");
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [sidebarOpen]);

  const isActive = (url: string) => {
    if (url === "/") return location.pathname === url;
    return location.pathname.startsWith(url);
  };

  const sidebarNavigateTo = (url: string) => {
    navigate(url);
    if (window.matchMedia("(max-width: 767px)").matches) {
      const sidebar = document.getElementById("iz-sidebar");
      sidebar.classList.add("closed");
    }
  };
  return (
    // <div className="app-layout">
    //   <Sidebar />
    //   <div className="main-content">
    //     <Header /> {/* Ajoutez le Header ici */}
    //     <ContentArea>
    //       <Outlet />
    //     </ContentArea>
    //   </div>
    // </div>

    <>
      {/* <div style={{ position: "absolute", top: "3rem", zIndex: 900 }}>
        {loggingOut && (
          <div className="iz_success-alert-box iz_alert-box">
            <Loader />
          </div>
        )}
      </div> */}
      <div className="iz_site iz_dashboard iz_position-relative">
        <div id="iz-header" className="iz_dashboard-header">
          <div className="iz_dashboard-header-content">
            <div className="iz_flex">
              <div className="iz_user-short-info">
                {!sidebarOpen && (
                  <a
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    style={{ marginRight: "1rem", cursor: "pointer" }}>
                    <i className="fa-solid fa-bars"></i>
                  </a>
                )}
                <span>
                  Hi <span className="iz_user-name">{user?.first_name}</span> !
                </span>
              </div>

              <div className="iz_dashboard-header-links iz_flex">
                <div className="iz_menu-mobile">
                  <a onClick={() => setSidebarOpen(!sidebarOpen)}>
                    <i className="fa-solid fa-bars"></i>
                  </a>
                </div>
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => sidebarNavigateTo("/")}
                  className="iz_logo-mobile">
                  IzenDoc
                </div>
                <ul className="iz_admin-bar">
                  {/* <li className="iz_admin-bar-document">
                    <Link to="/upload" title="Upload Document">
                      Upload Document
                    </Link>
                  </li> */}
                  <li className="iz_admin-bar-lang">
                    {/* <span>English</span>
                    <div className="iz_sub-wrapper">
                      <ul>
                        <li>
                          <a href="#" title="Français">
                            Français
                          </a>
                        </li>
                      </ul>
                    </div> */}
                    <LanguageSwitcher />
                  </li>
                  {/* <li className="iz_admin-bar-settings">
                    <a href="#" title="Settings"></a>
                  </li>
                  <li className="iz_admin-bar-notifications">
                    <a href="#" title="Notifications"></a>
                  </li> */}
                </ul>
                <ul className="iz_admin-bar-user">
                  <li>
                    {user && (
                      <div>
                        <div
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            background: "#eee",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 900,
                            color: "#173D82",
                          }}>
                          {user?.first_name[0]}
                          {user?.last_name[0]}
                        </div>
                        {/* <img alt="" src="/assets/img/user-thumb.png" /> */}
                      </div>
                    )}
                    <div className="iz_sub-wrapper">
                      <ul>
                        <li>
                          <Link to="/settings">
                            {t("header.dropdownOptionEditProfile")}
                          </Link>
                        </li>
                        <li
                          onClick={() => logout()}
                          style={{ color: "red", cursor: "pointer" }}>
                          <a>{t("header.dropdownOptionLogout")}</a>
                        </li>
                      </ul>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="iz_site-content">
          <div
            id="iz-sidebar"
            className={`${!sidebarOpen && "closed"} iz_sidebar iz_bg-primary`}>
            <div className="iz_sidebar-content">
              <div className="iz_nav-top">
                <div className="iz_flex">
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() => sidebarNavigateTo("/")}>
                    <span>IzenDoc</span>
                  </div>
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="m_menu-nav">
                    <a>
                      <i className="fa-solid fa-bars"></i>
                    </a>
                  </div>
                </div>
              </div>
              <div className="iz_nav-vertical-menus">
                <ul>
                  <li className={`${isActive("/") ? "iz_menu-active" : ""}`}>
                    <a onClick={() => sidebarNavigateTo("/")}>
                      <i className="iz_icon-dashboard"></i>
                      {t("sidebar.dashboard")}
                    </a>
                  </li>
                  {/* iz_has-menu-child */}
                  <li
                    className={`${
                      isActive("/folders") ? "iz_menu-active" : ""
                    }`}>
                    <a onClick={() => sidebarNavigateTo("/folders")}>
                      <i className="iz_icon-documents"></i>{" "}
                      {t("sidebar.folders")}
                    </a>
                    {/* <ul className="iz_submenu-vertical">
                      <li>
                        <a href="#">All folders</a>
                      </li>
                      <li>
                        <a href="#">Upload documents</a>
                      </li>
                    </ul> */}
                  </li>

                  <li
                    className={`${
                      isActive("/clinics") ? "iz_menu-active" : ""
                    }`}
                  >
                    <a onClick={() => sidebarNavigateTo("/clinics")}>
                      <i className="iz_icon-documents"></i>{" "}
                      {t("sidebar.clinics")}
                    </a>
                  </li>

                  {/* iz_has-menu-child */}
                  <li
                    className={`${
                      isActive("/account") ? "iz_menu-active" : ""
                    }`}>
                    <a onClick={() => sidebarNavigateTo("/account")}>
                      <i className="iz_icon-settings"></i>{" "}
                      {t("sidebar.account")}
                    </a>
                    {/* <ul className="iz_submenu-vertical">
                      <li>
                        <a href="#">Account</a>
                      </li>
                      <li>
                        <a href="#">Preferences</a>
                      </li>
                      <li>
                        <a href="#">Other settings</a>
                      </li>
                    </ul> */}
                  </li>
                  {/* iz_has-menu-child */}
                  <li
                    className={`${
                      isActive("/support") ? "iz_menu-active" : ""
                    }`}>
                    <a onClick={() => sidebarNavigateTo("/support")}>
                      <i className="iz_icon-support"></i> {t("sidebar.support")}
                    </a>
                    {/* <ul className="iz_submenu-vertical">
                      <li>
                        <a href="#">Contact us</a>
                      </li>
                      <li>
                        <a href="#">Help center</a>
                      </li>
                    </ul> */}
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {/* <div className="iz_content-block iz_content-dasboard iz_position-relative">
            <div className="iz_content-block-container">
              <div className="iz_hidden-tablet-desktop iz_user-hello">
                <span>Hi {user?.username}!</span>
              </div> */}

          <Outlet />
          {/* </div>
          </div>*/}
        </div>
      </div>
    </>
  );
}
export default AppLayout;
