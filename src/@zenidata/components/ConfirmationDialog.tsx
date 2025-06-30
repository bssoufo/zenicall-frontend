// src/components/ConfirmationDialog.jsx
// import "./ConfirmationDialog.css"; // Import du fichier de styles

interface Props {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => any;
  confirmText: string;
  cancelText: string;
}
function ConfirmationDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText,
  cancelText,
}: Props) {
  if (!isOpen) return null;
  return (
    <div
      className="dialog-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title">
      <div className="dialog-content">
        {title && (
          <h2 id="dialog-title" className="dialog-title">
            {title}
          </h2>
        )}
        {message && <p className="dialog-message">{message}</p>}
        <div className="dialog-actions">
          <button className="dialog-button confirm-button" onClick={onConfirm}>
            {confirmText || "Confirmer"}
          </button>
          <button className="dialog-button cancel-button" onClick={onCancel}>
            {cancelText || "Annuler"}
          </button>
        </div>
      </div>
    </div>
  );
}
export default ConfirmationDialog;
