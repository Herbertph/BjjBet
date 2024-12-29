const express = require('express');
const eventsRoutes = require('./routes/events');
const fightsRoutes = require('./routes/fights');

const app = express();
app.use(express.json());
app.use('/events', eventsRoutes);
app.use('/fights', fightsRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
