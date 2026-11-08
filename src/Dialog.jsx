import { useEffect, useRef } from "react";

/** Native modal semantics provide focus containment and an inert background. */
export default function Dialog({ open, onClose, className = "", children }) {
  const dialog = useRef(null);
  const trigger = useRef(null);
  useEffect(() => {
    if (!open) return;
    trigger.current = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    dialog.current.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog.current?.close();
      document.body.style.overflow = previousOverflow;
      if (trigger.current?.isConnected)
        trigger.current.focus({ preventScroll: true });
    };
  }, [open]);
  return (
    <dialog
      ref={dialog}
      className={`panel ${className}`}
      aria-labelledby="dialog-title"
      onKeyDownCapture={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          event.stopPropagation();
          onClose();
        }
      }}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === dialog.current) onClose();
      }}
      onKeyDown={(event) => {
        if (event.key !== "Tab") return;
        const controls = [
          ...dialog.current.querySelectorAll(
            'button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), [tabindex="0"]',
          ),
        ].filter((element) => element.getClientRects().length > 0);
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }}
    >
      {children}
    </dialog>
  );
}
