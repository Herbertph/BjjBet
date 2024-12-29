const express = require('express');
const pool = require('../db/config');
const router = express.Router();
const axios = require('axios');

//Create a fight
router.post('/', async (req, res) => {
    const {event_id, fighter_1_id, fighter_2_id } = req.body;

    try {
        //check if the fighters exist in fighters microservice
        const fighter1 = await axios.get(`http://localhost:5000/fighters/${fighter_1_id}`);
        const fighter2 = await axios.get(`http://localhost:5000/fighters/${fighter_2_id}`);

        if (!fighter1.data || !fighter2.data) {
            return res.status(400).json({ error: "Lutadores inválidos" });
          }

          //Create the fight in DB
            const result = await pool.query("INSERT INTO fights (event_id, fighter_1_id, fighter_2_id) VALUES ($1, $2, $3) RETURNING *",
            [event_id, fighter_1_id, fighter_2_id]);
            res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

//list the fight by id
router.get('/:event_id', async (req, res) => {
    const {event_id} = req.params;

    try {
        const result = await pool.query("SELECT * FROM fights WHERE event_id = $1", [event_id]);
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});
 
//update the fight result
router.put('/:id', async (req, res) => {
    const {id} = req.params;
    const {result} = req.body;

    try {
        const fight = await pool.query("UPDATE fights SET result = $1, updated_at = NOW() WHERE id = $2 RETURNING *",
      [result, id]
    );
        if (fight.rows.length === 0) {
            return res.status(404).json({error: "Fight not found"});
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

//delete the fight
router.delete('/:id', async (req, res) => {
    const {id} = req.params;

    try {
        const result = await pool.query("DELETE FROM fights WHERE id = $1 RETURNING *", [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({error: "Fight not found"});
        }
        res.status(200).json({ message: "Luta deletada com sucesso" });
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

module.exports = router;