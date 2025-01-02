require('dotenv').config();
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    console.log('Authorization Header:', authHeader); // Verifica o cabeçalho

    const token = authHeader && authHeader.split(' ')[1];
    console.log('Token:', token); // Verifica o token

    if (!token) {
        return res.status(401).json('Unauthorized');
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.error('JWT Error:', err); // Verifica o erro
            return res.status(403).json('Invalid Token');
        }

        req.user = user;
        next();
    });
}


module.exports = authenticateToken;
