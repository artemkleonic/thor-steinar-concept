import { Check } from "lucide-react";

export default function Toast({ message, onUndo }) {
  return (
    <div
      className={`toast ${message ? "show" : ""}`}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {message && (
        <>
          <Check size={18} aria-hidden="true" />
          {message}
          {onUndo && <button onClick={onUndo}>Rückgängig</button>}
        </>
      )}
    </div>
  );
}
