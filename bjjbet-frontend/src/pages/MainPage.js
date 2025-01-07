import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Importando useNavigate
import Header from "../components/header";
import Footer from "../components/footer";
import styles from "./MainPage.module.css";

const MainPage = () => {
  const [events, setEvents] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Hook para navegação
  const username = localStorage.getItem("username"); // Recuperando o nome de usuário do localStorage
  

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:5001/events");
        const data = await response.json();
        console.log("Dados recebidos da API:", data);
        setEvents(data);
      } catch (error) {
        console.error("Erro ao buscar eventos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const checkTokenValidity = () => {
      const token = localStorage.getItem('token');
    //se nao houver um token ou o token estiver nulo/em branco, apenas continua o fluxo normal de funcionamento
    if (!token) return;

  
      fetch('http://localhost:5002/users/validate-token', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          }
      })
          .then(response => response.json())
          .then(data => {
              if (data.valid) {
                  console.log('Token válido:', data.user);
              } else {
                  alert('Token inválido ou expirado');
              }
          })
          .catch(err => console.error('Erro ao verificar token:', err));
  };
  
    checkTokenValidity();
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? events.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <div className={styles.signupContainer}>
          {/* Adicionando funcionalidade ao botão Sign Up */}
          {!username ? (
          <button
            className={styles.signupButton} onClick={() => navigate("/signup")}>
            Sign Up
          </button>
          ) : null}
        </div>
        <div className={styles.carouselContainer}>
          <h2>Next Events</h2>
          {loading ? (
            <p>Carregando...</p>
          ) : (
            <div className={styles.carousel}>
              {events.map((event, index) => {
                const offset = (index - currentIndex + events.length) % events.length;
                const positionClass =
                  offset === 0
                    ? styles.centerSlide
                    : offset === 1
                    ? styles.rightSlide
                    : offset === events.length - 1
                    ? styles.leftSlide
                    : styles.hiddenSlide;
                return (
                  <div key={event.id} className={`${styles.slide} ${positionClass}`}>
                    <img
                      src={event.image_url}
                      alt={event.name}
                      className={styles.eventImage}
                    />
                    {/* Uncomment if event details are needed */}
                    {/* offset === 0 && (
                      <div className={styles.eventDetails}>
                        <p><strong>Nome:</strong> {event.name}</p>
                        <p><strong>Data:</strong> {new Date(event.date).toLocaleDateString()}</p>
                        <p><strong>Local:</strong> {event.location}</p>
                      </div>
                    ) */}
                  </div>
                );
              })}
            </div>
          )}
          <button className={styles.arrowLeft} onClick={prevSlide}>
            &lt;
          </button>
          <button className={styles.arrowRight} onClick={nextSlide}>
            &gt;
          </button>
        </div>
        <div className={styles.emptyContainer}></div>
      </main>
      <Footer />
    </div>
  );
};


export default MainPage;
