const express = require('express');
const cors = require('cors');
const useRoutes = require('./routes/users');
require('dotenv').config();

const app = express();

app.use(cors({
    origin: 'http://localhost:3000', // Permite requisições do frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
    credentials: true // Permite o uso de cookies e headers como Authorization
}));

//middleware
app.use(express.json());

//routes
app.use('/users', useRoutes);

//server
const PORT = 5002;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});