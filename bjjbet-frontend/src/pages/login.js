import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LoginPage.module.css";
import Header from "../components/header";
import Footer from "../components/footer";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5002/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await response.json(); // Recebe o JSON retornado pela API
      localStorage.setItem("token", data.token); // Salva o token no localStorage
      localStorage.setItem("username", username); // Salva o nome de usuário
      navigate("/"); // Redireciona para a página principal
    } catch (err) {
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <div>
      <Header />
      <div className={styles["login-container"]}>
        <main className={styles["login-main"]}>
          <div className={styles["login-formContainer"]}>
            <h2>Login</h2>
            {error && <p className={styles["login-error"]}>{error}</p>}
            <form onSubmit={handleLogin}>
              <label className={styles["login-label"]}>Nome de usuário:</label>
              <input
                type="text"
                className={styles["login-input"]}
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <label className={styles["login-label"]}>Senha:</label>
              <input
                type="password"
                className={styles["login-input"]}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className={styles["login-buttonGroup"]}>
                <button
                  type="button"
                  className={styles["login-button"]}
                  onClick={() => navigate("/")}
                >
                  Voltar
                </button>
                <button type="submit" className={styles["login-button"]}>
                  Entrar
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default LoginPage;
