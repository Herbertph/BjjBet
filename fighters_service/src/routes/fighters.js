const express = require('express');
const pool = require('../db/config');
const router = express.Router();

//create a fighter
router.post('/', async (req, res) => {
    const {name, birth_date, belt} = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO fighters (name, birth_date, belt) VALUES ($1, $2, $3) RETURNING *',
            [name, birth_date, belt]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
);

//get all fighters
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM fighters');
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//get a fighter
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM fighters WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            res.status(404).json({ message: 'Fighter not found' });
        } else {
            res.status(200).json(result.rows[0]);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//update a fighter
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, birth_date, belt } = req.body;
    try {
        const result = await pool.query(
            'UPDATE fighters SET name = $1, birth_date = $2, belt = $3 WHERE id = $4 RETURNING *',
            [name, birth_date, belt, id]
        );
        if (result.rows.length === 0) {
            res.status(404).json({ message: 'Fighter not found' });
        } else {
            res.status(200).json(result.rows[0]);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//delete a fighter
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM fighters WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            res.status(404).json({ message: 'Fighter not found' });
        } else {
            res.status(200).json({ message: 'Fighter deleted' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;