const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db/config');
const router = express.Router();
const authenticateToken = require('../middlewares/authenticateToken');

// Registration
router.post('/register', async (req, res) => {
    const { name, email, username, password } = req.body;

    try {
        // Verifica se o usuário já existe
        const userExists = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (userExists.rows.length > 0) {
            return res.status(401).json('User already exists');
        }

        // Hash da senha
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Salva o usuário no banco de dados
        const result = await pool.query(
            'INSERT INTO users (name, email, username, password_hash) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, email, username, hashedPassword]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json('Server Error');
    }
});

// Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Verify if user exists
        const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (user.rows.length === 0) {
            return res.status(401).json('Invalid Credential');
        }

        // Verify password
        const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);
        if (!validPassword) {
            return res.status(401).json('Invalid Credential');
        }

        // Generate token
        const token = jwt.sign(
            { id: user.rows[0].id, username: user.rows[0].username },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        // Retorna o token e o nome do usuário
        res.status(200).json({
            token,
            username: user.rows[0].username,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json('Server Error');
    }
});


//get all users
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Retorna informações do usuário logado
router.get('/me', authenticateToken, async (req, res) => {
    try {
        const user = await pool.query('SELECT id, name, username, email FROM users WHERE id = $1', [req.user.id]);
        if (user.rows.length === 0) {
            return res.status(404).json('User not found');
        }
        res.json(user.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json('Server Error');
    }
});

// Atualiza o email do usuário logado
router.put('/update-email', authenticateToken, async (req, res) => {
    const { email } = req.body;
    const userId = req.user.id;
  
    try {
      await pool.query('UPDATE users SET email = $1 WHERE id = $2', [email, userId]);
      res.status(200).json({ message: 'Email updated successfully' });
    } catch (error) {
      console.error('Error updating email:', error.message);
      res.status(500).json({ message: 'Server error' });
    }
  });
  

// Validate Token
router.post('/validate-token', (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.status(200).json({
            valid: true,
            user: decoded, // Payload do token decodificado (por exemplo, id e username)
        });
    } catch (err) {
        res.status(401).json({
            valid: false,
            message: 'Token inválido ou expirado',
            error: err.message,
        });
    }
});



module.exports = router;
