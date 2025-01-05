import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SignUpPage.module.css";
import Header from "../components/header";
import Footer from "../components/footer";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};

    if (!formData.name || !/^[A-Za-z\s]{5,30}$/.test(formData.name)) {
      errors.name = "O nome deve conter entre 5 e 30 letras.";
    }

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Por favor, insira um email válido.";
    }

    if (!formData.username || formData.username.length < 3 || formData.username.length > 15) {
      errors.username = "O nome de usuário deve ter entre 3 e 15 caracteres.";
    }

    if (
      !formData.password ||
      formData.password.length < 9 ||
      !/\d/.test(formData.password) ||
      !/[A-Za-z]/.test(formData.password)
    ) {
      errors.password = "A senha deve conter no mínimo 9 caracteres, incluindo letras e números.";
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "As senhas não coincidem.";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await fetch("http://localhost:5001/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Cadastro realizado com sucesso! Verifique seu email.");
        navigate("/");
      } else {
        alert("Erro ao cadastrar. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro no cadastro:", error);
    }
  };

  return (
    <div className={styles.container}>
      <Header />
    <div className={styles.container}>
      <h2>Cadastro</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div>
          <label>Nome:</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          {errors.name && <p className={styles.error}>{errors.name}</p>}
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          {errors.email && <p className={styles.error}>{errors.email}</p>}
        </div>
        <div>
          <label>Nome de usuário:</label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          />
          {errors.username && <p className={styles.error}>{errors.username}</p>}
        </div>
        <div>
          <label>Senha:</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          {errors.password && <p className={styles.error}>{errors.password}</p>}
        </div>
        <div>
          <label>Confirmação de senha:</label>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
          />
          {errors.confirmPassword && <p className={styles.error}>{errors.confirmPassword}</p>}
        </div>
        <div className={styles.buttons}>
          <button type="button" onClick={() => navigate("/")}>
            Voltar
          </button>
          <button type="submit">Cadastrar</button>
        </div>
      </form>
    </div>
    <Footer />
    </div>
  );
};

export default SignUpPage;
