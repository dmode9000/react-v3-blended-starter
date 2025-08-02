// React
import { memo } from "react";
import type { MouseEvent, ReactNode } from "react";
import { useEffect } from "react";
import { createPortal } from "react-dom";

// Libraries
import toast from "react-hot-toast";

// Styles
import css from "./Modal.module.css";

const modalRoot = document.querySelector("#modal-root");

interface ModalProps {
  children: ReactNode;
  onClose: () => void;
}

function Modal({ children, onClose }: ModalProps) {
  const handleEscapeKey = (event: KeyboardEvent) => {
    if (event.key === "Escape") onClose();
  };

  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) onClose();
  };

  const configureModal = () => {
    document.addEventListener("keydown", handleEscapeKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "";
    };
  };

  useEffect(configureModal);

  if (!modalRoot) {
    toast.error("No modal root found");
    return null;
  }

  console.log("Modal: рендериться");

  return createPortal(
    <div className={css.backdrop} role="dialog" aria-modal="true" onClick={handleBackdropClick}>
      <div className={css.modal}>
        <button className={css.closeButton} aria-label="Close modal" onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>,
    modalRoot
  );
}

export default memo(Modal);
