require('dotenv').config();
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    console.log('Authorization Header:', authHeader);

    const token = authHeader && authHeader.split(' ')[1];
    console.log('Token:', token);

    if (!token) {
        console.warn('Authorization token is missing');
        return res.status(401).json({ message: 'Authorization token is missing' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.error('JWT Verification Error:', err.message);
            return res.status(403).json({ 
                message: 'Invalid or expired token',
                error: err.message,
            });
        }

        console.log('Decoded JWT Payload:', user);
        req.user = user;
        next();
    });
}

module.exports = authenticateToken;
