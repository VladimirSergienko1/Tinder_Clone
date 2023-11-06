import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const AuthModal = ({ setShowModal, isSignUp }) => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [error, setError] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies(null);

  let navigate = useNavigate();

  console.log(email, password, confirmPassword);

  const handleClick = () => {
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isSignUp && password !== confirmPassword) {
        setError("Passwords dont match!");
        return;
      }

      const response = await axios.post(
        `http://localhost:8000/${isSignUp ? "signup" : "login"}`,
        { email, password }
      );

      setCookie("AuthToken", response.data.token);
      setCookie("UserId", response.data.userId);

      const success = response.status === 201;
      if (success && isSignUp) navigate("/onboarding");
      else if (success && !isSignUp) {
        if (response.data.userId === "9a4298c1-1e3e-4d6c-a64f-95240daee202") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      }

      window.location.reload();
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setError("User with this email already exists.");
      } else {
        console.log(error);
      }
    }
  };

  return (
    <div className="auth-modal">
      <div
        className="close-icon"
        onClick={handleClick}
        style={{ cursor: "pointer" }}
      >
        <FontAwesomeIcon icon={faTimes} />
      </div>

      <h2>{isSignUp ? "CREATE ACCOUNT" : "LOG IN"}</h2>
      <p>
        By clicking Log In, you agree to our terms. Please read about our
        Privacy Policy.
      </p>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="email"
          required={true}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          id="password"
          name="password"
          placeholder="password"
          required={true}
          onChange={(e) => setPassword(e.target.value)}
        />
        {isSignUp && (
          <input
            type="password"
            id="password-check"
            name="password-check"
            placeholder="confirm password"
            required={true}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        )}
        <input className="secondary-button" type="submit" />
        <p style={{ color: "red" }}>{error}</p>
      </form>

      <hr />
      <h2></h2>
    </div>
  );
};
export default AuthModal;
