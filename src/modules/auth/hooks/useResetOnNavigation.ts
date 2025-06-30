import React, { useContext } from "react";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const useResetOnNavigation = () => {
  const location = useLocation();
  const { setAlertMessage } = useContext(AuthContext);

  React.useEffect(() => {
    setAlertMessage(null);
    // const sidebarBlock = document.getElementById("iz-sidebar");
    // sidebarBlock.classList.add("closed");
    // console.log("sidebarBlock: ", sidebarBlock);
  }, [location.pathname]);
};

export default useResetOnNavigation;
