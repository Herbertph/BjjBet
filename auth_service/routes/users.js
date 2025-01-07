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

        res.status(200).json(token);
    } catch (error) {
        console.error(error.message);
        res.status(500).json('Server Error');
    }
});

//Test middlewares
// Rota protegida
router.get('/profile', authenticateToken, (req, res) => {
    res.json({
        message: `Hello, ${req.user.username}! This is your profile.`,
        user: req.user, // Dados do usuário decodificados do token
    });
});

// Outra rota protegida
router.get('/protected', authenticateToken, (req, res) => {
    res.json({
        message: 'This is a protected route. You have access!',
    });
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

//// Rota para validar o token e retornar o usuário
router.get('/validate-token', authenticateToken, async (req, res) => {
    try {
        const user = await pool.query('SELECT id, username, email FROM users WHERE id = $1', [req.user.id]);
        if (user.rows.length === 0) {
            return res.status(404).json('User not found');
        }
        res.status(200).json(user.rows[0]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json('Server Error');
    }
});

module.exports = router;
