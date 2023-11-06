import { useNavigate } from "react-router-dom";
const Nav = ({ authToken, minimal, setShowModal, showModal, setIsSignUp }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    setShowModal(true);
    setIsSignUp(false);
  };

  return (
    <nav>
      <div className="logo-container"></div>
      {!authToken && !minimal && (
        <button
          className="nav-button"
          onClick={handleClick}
          disabled={showModal}
        >
          Log in
        </button>
      )}
      {authToken && !minimal && (
        <button
          className="nav-button"
          onClick={() => navigate("/edit-profile")}
        >
          Edit Profile
        </button>
      )}
    </nav>
  );
};
export default Nav;
