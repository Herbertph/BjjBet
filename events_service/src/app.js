const express = require('express');
const cors = require('cors');
const eventsRoutes = require('./routes/events');
const fightsRoutes = require('./routes/fights');


const app = express();

app.use(cors({origin: 'http://localhost:3000'}));
app.use(express.json());
app.use('/events', eventsRoutes);
app.use('/fights', fightsRoutes);


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
