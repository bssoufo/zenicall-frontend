import { useState } from "react";

const useScreenSize = () => {
  const [isMobileScreen, setIsMobileScreen] = useState(
    window.matchMedia("(max-width: 767px)").matches
  );
  window.addEventListener("resize", () => {
    setIsMobileScreen(window.matchMedia("(max-width: 767px)").matches);
  });

  return { isMobileScreen };
};

export default useScreenSize;
