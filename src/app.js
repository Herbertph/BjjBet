const express = require('express');
const fighterRoutes = require('./routes/fighters');

const app = express();
app.use(express.json());
app.use('/fighters', fighterRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));