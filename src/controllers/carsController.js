import { pool } from '../db/db.js';

export const getCars = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM cars');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCar = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM cars WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Car not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createCar = async (req, res) => {
  try {
    const { brand, model, year, price } = req.body;
    const result = await pool.query(
      'INSERT INTO cars (brand, model, year, price) VALUES ($1, $2, $3, $4) RETURNING *',
      [brand, model, year, price]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateCar = async (req, res) => {
  try {
    const { id } = req.params;
    const { brand, model, year, price } = req.body;
    const result = await pool.query(
      'UPDATE cars SET brand=$1, model=$2, year=$3, price=$4 WHERE id=$5 RETURNING *',
      [brand, model, year, price, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Car not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

