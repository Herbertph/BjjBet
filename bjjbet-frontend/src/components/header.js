import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./header.module.css";

const Header = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  // Botão de logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/");
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo} onClick={() => navigate("/")}>
        BJJ Bet
      </div>
      {username ? (
        <div className={styles.buttonsContainer}>
          <p className={styles.welcomeMessage}>Welcome {username}</p>
          <button
            className={`${styles.button}`}
            onClick={() => navigate("/register")}
          >
            Profile
          </button>
          <button
            className={`${styles.button} ${styles.logout}`}
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      ) : (
        <button
          className={styles.loginButton}
          onClick={() => navigate("/login")}
        >
          Login
        </button>
      )}
    </header>
  );
};

export default Header;
