const express = require('express');
const pool = require('../db/config');
const router = express.Router();

//Create an event
router.post('/', async (req, res) => {
    const { name, date, location, image_url } = req.body;
    console.log('Dados recebidos no body:', req.body); // Log para depuração

    try {
        const result = await pool.query(
            "INSERT INTO events (name, date, location, image_url) VALUES ($1, $2, $3, $4) RETURNING *",
            [name, date, location, image_url]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao criar evento:', error);
        res.status(500).json({ error: 'Erro no servidor' });
    }
});

//Get all events
router.get('/', async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM events");
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

// Rota para buscar o próximo evento
router.get('/next', async (req, res) => {
    try {
        const currentDate = new Date(); // Data atual

        // Consulta ao banco de dados para buscar eventos futuros
        const result = await pool.query(
            "SELECT * FROM events WHERE date >= $1 ORDER BY date ASC LIMIT 1",
            [currentDate]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Nenhum evento encontrado.' });
        }

        res.json(result.rows[0]); // Retorna o próximo evento
    } catch (error) {
        console.error('Erro ao buscar o próximo evento:', error);
        res.status(500).json({ error: 'Erro no servidor.' });
    }
});

//Get an event
router.get('/:id', async (req, res) => {
    const {id} = req.params;

    try {
        const result = await pool.query("SELECT * FROM events WHERE id = $1", [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({error: "Event not found"});
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

//Update an event
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, date, location, image_url } = req.body;

    try {
        const result = await pool.query(
            "UPDATE events SET name = $1, date = $2, location = $3, image_url = $4 WHERE id = $5 RETURNING *",
            [name, date, location, image_url, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Event not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao atualizar evento:', error);
        res.status(500).json({ error: 'Erro no servidor' });
    }
});

//Delete an event
router.delete('/:id', async (req, res) => {
    const {id} = req.params;

    try {
        const result = await pool.query("DELETE FROM events WHERE id = $1 RETURNING *", [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({error: "Event not found"});
        }
        res.status(200).json({message: "Event deleted"});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

router.get("/:id/with-fights", async (req, res) => {
    const {id} = req.params;

    try {
        const eventResult = await pool.query("SELECT * FROM events WHERE id = $1", [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({error: "Event not found"});
        }

        const event = eventResult.rows[0];

        //Obtain all fights associated to the event
        const fightsResult = await pool.query("SELECT * FROM fights WHERE event_id = $1", [id]);
     const fights = fightsResult.rows;

     //combine data from event and fights
     res.status(200).json({...event, fights});

    } catch (err) {
        res.status(500).json({error: err.message});
    }
});



module.exports = router;