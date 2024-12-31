const express = require('express');
const useRoutes = require('./routes/users');
require('dotenv').config();

const app = express();

//middleware
app.use(express.json());

//routes
app.use('/users', useRoutes);

//server
const PORT = 5002;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});