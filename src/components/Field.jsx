import './Field.css';

/** Label + control + error/hint wrapper. The control (input, select, textarea) is passed as children. */
export default function Field({ id, label, error, hint, children }) {
  return (
    <div className={'field' + (error ? ' has-error' : '')}>
      <label htmlFor={id} className="field__label">
        {label}
        <span aria-hidden="true"> *</span>
        <span className="visually-hidden"> (required)</span>
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="field__error">
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 4.5v4.2M8 11v.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <span>{error}</span>
        </p>
      ) : (
        hint && <p id={`${id}-hint`} className="field__hint">{hint}</p>
      )}
    </div>
  );
}
