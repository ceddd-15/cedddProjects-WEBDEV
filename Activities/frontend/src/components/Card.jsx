import "../styles/Card.css";

const Card = ({ title, subtitle, children, className = "" }) => {
  return (
    <div className="card-container">
      <div className={`card ${className}`}>
        {title && <h2 className="card-title">{title}</h2>}
        {subtitle && <p className="card-subtitle">{subtitle}</p>}
        {children}
      </div>
    </div>
  );
};

export default Card;
