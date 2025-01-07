import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./header.module.css";

const Header = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  return (
    <header className={styles.header}>
      <div className={styles.logo}>BJJ Bet</div>
      {username ? (
        <p className={styles.welcomeMessage}>Welcome {username}</p>
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
