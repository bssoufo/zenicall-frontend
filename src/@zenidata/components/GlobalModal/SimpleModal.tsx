import React from "react";
import "./SimpleModal.css";

interface Props {
  open: boolean;
  title: string;
  options: React.ReactNode[];
  closeModal: () => void;
  children: React.ReactNode;
  enableControl?: boolean;
}

const SimpleModal = ({
  open,
  title,
  enableControl,
  options,
  closeModal,
  children,
}: Props) => {
  if (!open) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="dialog-title">{title}</h2>
        <div className="dialog-message">{children}</div>
        {(enableControl === true || enableControl === undefined) && (
          <div className="dialog-actions">
            {options.length > 0 ? (
              options.map((option, index) => (
                <>
                  {typeof option === "string" ? (
                    <button
                      key={index}
                      className={`iz_btn  ${
                        index === options.length - 1
                          ? "iz_btn-error"
                          : "iz_btn-primary"
                      }`}
                      onClick={() =>
                        typeof option === "string" &&
                        index === options.length - 1
                          ? closeModal()
                          : null
                      }>
                      {option}
                    </button>
                  ) : (
                    <React.Fragment key={index}>{option}</React.Fragment>
                  )}
                </>
              ))
            ) : (
              <button className="iz_btn iz_btn-primary" onClick={closeModal}>
                Fermer
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleModal;
