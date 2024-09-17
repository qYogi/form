import "./NotFound.css";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const nav = useNavigate();

  const handleClick = () => {
    nav("/login");
  };

  return (
    <div className="cont">
      <h1 className="error">404</h1>
      <div className="style">
        Ooops!!! The page you are looking for is not found
      </div>
      <button onClick={handleClick} className="back-home">
        Back to home
      </button>
    </div>
  );
}
