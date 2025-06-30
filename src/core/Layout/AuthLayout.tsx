import { Outlet } from "react-router-dom";
import useResetOnNavigation from "../../modules/auth/hooks/useResetOnNavigation";
import LanguageSwitcher from "../../@zenidata/components/UI/Language/LanguageSwitcher";

const AuthLayout = () => {
  useResetOnNavigation();
  return (
    <>
      <div className="iz_site">
        <div>
          <LanguageSwitcher />
        </div>
        <div className="iz_site-main iz_position-relative">
          <div className="iz_box-form-pass iz_box-form-forgot-password iz_flex">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthLayout;
