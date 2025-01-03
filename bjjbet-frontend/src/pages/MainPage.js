import react, { useEffect, useState } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import styles from "./MainPage.module.css";

const MainPage = () => {
    const [nextEvent, setNextEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNextEvent = async () => {
            try {
            const response = await fetch("http://localhost:5001/events");
            const data = await response.json();
            console.log('Dados recebidos da API:', data); 
            setNextEvent(data.length > 0 ? data[0] : null);
            } catch (error) {
            console.log(error);
            } finally {
            setLoading(false);
            }
        };
    
        fetchNextEvent();
        }, []);

        return (
            <div className={styles.container}>
              <Header />
              <main className={styles.main}>
                <div className={styles.signupContainer}>
                  <button className={styles.signupButton}>Cadastre-se</button>
                </div>
                <div className={styles.eventContainer}>
                  <h2>Next Event</h2>
                  {loading ? (
                    <p>Loading...</p>
                  ) : nextEvent ? (
                    <div>
                      <p><strong>Nome:</strong> {nextEvent.name}</p>
                      <p><strong>Data:</strong> {new Date(nextEvent.date).toLocaleDateString()}</p>
                      <p><strong>Local:</strong> {nextEvent.location}</p>
                    </div>
                  ) : (
                    <p>Nenhum evento encontrado.</p>
                  )}
                </div>
                <div className={styles.emptyContainer}></div>
              </main>
              <Footer />
            </div>
          );
        };
  
  export default MainPage;