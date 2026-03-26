import "../styles/Input.css";

const Input = ({ label, error, hint, icon, ...props }) => {
  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <div className={`input-wrapper${error ? " input-error" : ""}`}>
        {icon && <span className="input-icon">{icon}</span>}
        <input
          className={`input-field${error ? " input-error" : ""}`}
          {...props}
        />
      </div>
      {hint && !error && <p className="input-hint">{hint}</p>}
      {error && <span className="error-message">⚠ {error}</span>}
    </div>
  );
};

export default Input;
