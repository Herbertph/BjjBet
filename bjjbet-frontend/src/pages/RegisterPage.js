import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LoginPage.module.css";
import Header from "../components/header";
import Footer from "../components/footer";

//vamos mostrar os dados do usuario logado
const ProfilePage = () => {
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  //funcao para buscar os dados do usuario
  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:5002/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Não foi possível buscar os dados do usuário");
      }

      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error("Erro ao buscar os dados do usuário:", error);
    }
  };

  //chamar a funcao fetchUser quando o componente for montado
  useState(() => {
    fetchUser();
  }, []);

  return (
    <div>
      <Header />
      <div className={styles["login-container"]}>
        <main className={styles["login-main"]}>
          <div className={styles["login-formContainer"]}>
            <h2>Profile</h2>
            <p>Nome: {user.name}</p>
            <p>Email: {user.email}</p>
            <p>Username: {user.username}</p>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};