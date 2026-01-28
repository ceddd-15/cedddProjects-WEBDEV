import "../styles/Input.css";

const Input = ({ label, error, ...props }) => {
  return (
    <div className="input-group">
      {label && <label classnName="input-label">{label}</label>}
      <input
        className={`input-field${error ? "input-error" : ""}`}
        {...props}
      />
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

export default Input;
