import React, { useState } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import styles from "./SignUpPage.module.css";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar senha e confirmação
    if (formData.password !== formData.confirmPassword) {
      alert("As senhas não correspondem.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5002/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          username: formData.username,
          password: formData.password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Usuário ${data.username} registrado com sucesso!`);
        setFormData({
          name: "",
          email: "",
          username: "",
          password: "",
          confirmPassword: "",
        });
      } else {
        const error = await response.json();
        alert(`Erro: ${error}`);
      }
    } catch (error) {
      console.error("Erro ao registrar usuário:", error);
      alert("Erro ao conectar ao servidor.");
    }
  };

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <div className={styles.formContainer}>
          <h2>Cadastro</h2>
          <form onSubmit={handleSubmit}>
            <label>
              Nome:
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Nome de usuário:
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Senha:
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Confirmação de senha:
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </label>
            <div className={styles.buttonGroup}>
              <button type="button" onClick={() => window.history.back()}>
                Voltar
              </button>
              <button type="submit">Cadastrar</button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SignUpPage;
