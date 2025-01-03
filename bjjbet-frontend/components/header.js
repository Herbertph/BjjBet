import react from "react";
import styles from "../styles/Header.module.css";

const Header = () => {
  return (
    <header className={styles.header}>
        <div className={styles.logo}> BJJ Bet</div>
        <button className={styles.loginButton}>Login</button>
    </header>
  );
};

export default Header;