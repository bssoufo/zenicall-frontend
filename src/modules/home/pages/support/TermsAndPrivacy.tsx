import { Link } from "react-router-dom";
import AppLogo from "../../../../@zenidata/components/AppLogo";
import LanguageSwitcher from "../../../../@zenidata/components/UI/Language/LanguageSwitcher";

const TermsAndPrivacy = () => {
  return (
    <>
      <div className="iz_site">
        <div>
          <LanguageSwitcher />
        </div>
        <div className="iz_site-main iz_position-relative">
          <div className="iz_box-form-pass iz_box-form-signup iz_flex">
            <div className="iz-box-form-thumb same-height">
              <img alt="Sign up Izendoc" src="assets/img/signup.png" />
            </div>
            <div className="iz_box-form-content same-height">
              <Link
                style={{ color: "inherit", textDecoration: "none" }}
                to="/"
                className="m_logo-box">
                <AppLogo />
              </Link>

              <div className="iz_form-box">
                <div>
                  <h1>Terms And Privacy Policy</h1>
                </div>
              </div>

              {/* <div className="iz_social-pass">
                <div className="iz_social-pass-title iz_center iz_position-relative">
                  <span>Or login with</span>
                </div>
                <div className="iz_btn-connect">
                  <button
                    type="button"
                    className="iz_btn-facebook iz_btn-white"></button>
                  <button
                    type="button"
                    className="iz_btn-google iz_btn-white"></button>
                  <button
                    type="button"
                    className="iz_btn-apple iz_btn-white"></button>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TermsAndPrivacy;
