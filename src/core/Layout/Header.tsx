// // src/components/Layout/Header.jsx
// import { useContext } from "react";
// import "./Header.css";
// import { AuthContext } from "../../modules/auth/contexts/AuthContext";
// import LanguageSwitcher from "../../@zenidata/components/UI/Language/LanguageSwitcher";
// function Header() {
//   // const { t } = useTranslation();
//   const { isAuthenticated, user, logout, loading } = useContext(AuthContext);

//   const handleLogout = async () => {
//     await logout();
//   };
//   return (
//     <header className="header">
//       <h1></h1>
//       {isAuthenticated && user && (
//         <div className="header-user-info">
//           <span>Bonjour, {user.username}</span>
//           <LanguageSwitcher />
//           <button
//             onClick={handleLogout}
//             className="logout-button"
//             disabled={loading}>
//             {loading ? "Déconnexion..." : "Logout"}
//           </button>
//         </div>
//       )}
//     </header>
//   );
// }
// export default Header;
