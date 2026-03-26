import { useState, useEffect } from "react";

export function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-title">{title}</h3>
        <p className="modal-message">{message}</p>
        <div className="modal-actions">
          <button className="modal-btn modal-btn-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="modal-btn modal-btn-confirm" onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}