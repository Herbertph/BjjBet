import React, { useEffect, useState } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import styles from "./MainPage.module.css";

const MainPage = () => {
  const [events, setEvents] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

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
          <button className={styles.signupButton}>Cadastre-se</button>
        </div>
        <div className={styles.carouselContainer}>
          <h2>Próximos Eventos</h2>
          {loading ? (
            <p>Carregando...</p>
          ) : (
            <div className={styles.carousel}>
              {events.map((event, index) => {
                const offset = (index - currentIndex + events.length) % events.length;
                return (
                  <div
                    key={event.id}
                    className={`${styles.slide} ${
                      offset === 0
                        ? styles.activeSlide
                        : offset === 1 || offset === events.length - 1
                        ? styles.nearbySlide
                        : styles.hiddenSlide
                    }`}
                  >
                    <img
                      src={event.image_url}
                      alt={event.name}
                      className={styles.eventImage}
                    />
                   
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
