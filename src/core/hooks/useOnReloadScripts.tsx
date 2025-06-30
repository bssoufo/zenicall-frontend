// import { useEffect } from "react";
// import { useLocation } from "react-router-dom";

// const useOnReloadScripts = () => {
//   const location = useLocation();

//   useEffect(() => {
//     console.log("Changement de route détecté :", location.pathname);

//     const loadScript = (src: string, onLoadCallback?: () => void) => {
//       const script = document.createElement("script");
//       script.src = src;
//       script.async = true;
//       script.onload =
//         onLoadCallback || (() => console.log(`Script ${src} chargé !`));
//       document.body.appendChild(script);
//     };

//     loadScript("/assets/lib/selectjs/select2.min.js", () =>
//       console.log("Script select2.min.js chargé !")
//     );

//     loadScript("/assets/lib/mmenu/mmenu.js", () =>
//       console.log("Script mmenu.js chargé !")
//     );

//     loadScript("/assets/js/global.js", () =>
//       console.log("Script mmenu.js chargé !")
//     );

//     return () => {
//       // Nettoyer les scripts pour éviter les duplications
//       document
//         .querySelectorAll("script[src*='/assets/lib/']")
//         .forEach((script) => {
//           script.remove();
//         });
//     };
//   }, [location.pathname]); // Exécute l'effet à chaque changement de route
// };

// export default useOnReloadScripts;
