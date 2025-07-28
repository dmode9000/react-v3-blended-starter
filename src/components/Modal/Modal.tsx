import type { ReactNode } from "react";
import styled from "./Modal.module.css";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";

const modalRoot = document.querySelector("#modal-root");

interface ModalProps {
  children: ReactNode;
  onClose: () => void;
}

export default function Modal({ children, onClose }: ModalProps) {
  if (!modalRoot) {
    toast.error("no modal root found");
    return null;
  }

  return createPortal(
    <div className={styled.backdrop} role="dialog" aria-modal="true">
      <div className={styled.modal}>
        <button className={styled.closeButton} aria-label="Close modal" onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>,
    modalRoot
  );
}
