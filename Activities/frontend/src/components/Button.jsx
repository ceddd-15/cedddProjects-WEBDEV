import "../styles/Button.css";
const Button = ({ children, loading, variant = "primary", icon, className = "", ...props }) => {
  return (
    <button 
      className={`btn btn-${variant} ${className}`} 
      disabled={loading} 
      {...props}
    >
      {loading ? (
        <>
          <span className="spinner"></span>
          Loading...
        </>
      ) : (
        <>
          {icon && <span>{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
