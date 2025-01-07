import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./header.module.css";

const Header = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  //botao de logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/");
    
  };

  return (
    //caso usuario esteja logado, aparece botao de login ao lado da mensagem de welcome
    //caso contrario, aparece botao de login
    <header className={styles.header}>
      <div className={styles.logo}>BJJ Bet</div>
      {username ? (
        <>
        <p className={styles.welcomeMessage}>Welcome {username}</p><button className={styles.loginButton} 
        onClick={handleLogout}> Logout</button>
        </>
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
