const express = require('express');
const pool = require('../db/config');
const router = express.Router();

//Create an event
router.post('/', async (req, res) => {
    const {name, date, location} = req.body;

    try {
        const result = await pool.query("INSERT INTO events (name, date, location) VALUES ($1, $2, $3) RETURNING *",
        [name, date, location]);
        res.json(newEvent.rows[0]);
    } catch (err) {
        res.status(500).json({error: err.message});
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
    const {id} = req.params;
    const {name, date, location} = req.body;

    try {
        const result = await pool.query("UPDATE events SET name = $1, date = $2, location = $3, updated_at = NOW() WHERE id = $4 RETURNING *",
      [name, date, location, id]
    );
        if (result.rows.length === 0) {
            return res.status(404).json({error: "Event not found"});
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({error: err.message});
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

module.exports = router;