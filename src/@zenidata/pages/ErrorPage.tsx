import { useLocation, useNavigate } from "react-router-dom";

const ErrorPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>⚠️ Oops! Something went wrong</h1>
      <p>{location.state?.message || "An unexpected error occurred."}</p>
      <button onClick={() => navigate("/")}>Go Back to Home</button>
    </div>
  );
};

export default ErrorPage;
