import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import useScreenSize from "../../../@zenidata/hooks/useScreenSize";
import { useTranslation } from "react-i18next";

const UserHello = () => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const { isMobileScreen } = useScreenSize();

  if (!isMobileScreen) return;

  return (
    <>
      <div
        style={{ marginBottom: "1rem" }}
        className="iz_content-block-container">
        <div className="iz_hidden-tablet-desktop iz_user-hello">
          <span>
            {t("hi")} {user?.first_name}!
          </span>
        </div>
      </div>
    </>
  );
};

export default UserHello;
