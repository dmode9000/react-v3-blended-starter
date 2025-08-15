// React imports
import { MouseEvent, ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";

// Styles
import css from "./Modal.module.css";

interface ModalProps {
  children: ReactNode;
  onClose: () => void;
}

export default function Modal({ children, onClose }: ModalProps) {
  const handleBackdropClick = (event: MouseEvent) => {
    if (event.target === event.currentTarget) onClose();
  };

  useEffect(() => {
    const escapeHandler = (event: globalThis.KeyboardEvent) => {
      if (event.code === "Escape") onClose();
    };

    document.addEventListener("keydown", escapeHandler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", escapeHandler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return createPortal(
    <div className={css.backdrop} role="dialog" aria-modal="true" onClick={handleBackdropClick}>
      <div className={css.modal}>{children}</div>
    </div>,
    document.body
  );
}
