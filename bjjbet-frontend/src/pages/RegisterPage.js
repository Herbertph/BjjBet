import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './RegisterPage.module.css';
import Header from '../components/header';
import Footer from '../components/footer';

const RegisterPage = () => {
  const [userData, setUserData] = useState({
    username: '',
    name: '',
    email: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const navigate = useNavigate();

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token'); // Supondo que o token está armazenado no localStorage
        const response = await fetch('http://localhost:5002/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data);
          setNewEmail(data.email);
        } else {
          console.error('Failed to fetch user data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  // Handle email update
  const handleEmailUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5002/users/update-email', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: newEmail }),
      });

      if (response.ok) {
        setUserData({ ...userData, email: newEmail });
        setIsEditing(false);
      } else {
        console.error('Failed to update email:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating email:', error);
    }
  };

  return (
    <div>
        <Header />
      <h1>Registration Details</h1>
      <form>
        <div>
          <label>Username:</label>
          <input type="text" value={userData.username} disabled />
        </div>
        <div>
          <label>Name:</label>
          <input type="text" value={userData.name} disabled />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={isEditing ? newEmail : userData.email}
            onChange={(e) => setNewEmail(e.target.value)}
            disabled={!isEditing}
          />
          <button
            type="button"
            onClick={() => (isEditing ? handleEmailUpdate() : setIsEditing(true))}
          >
            {isEditing ? 'Save' : 'Edit'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            style={{ marginLeft: '10px' }} // Espaço entre os botões
          >
            Back
          </button>
        </div>
      </form>
      <Footer />
    </div>
  );
};

export default RegisterPage;
