import { pool } from '../db/db.js';

export const getCustomers = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM customers ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM customers WHERE id=$1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Customer not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createCustomer = async (req, res) => {
  try {
    const { name, age, password, contact } = req.body;
    
    if (!name || !password || !contact || !age) {
      return res.status(400).json({ message: 'Toliq malumot kiriting' });
    }

    const exists = await pool.query('SELECT * FROM customers WHERE contact=$1', [contact]);
    if (exists.rows.length > 0) {
      return res.status(400).json({ message: 'Bunday contact mavjud' });
    }

    const result = await pool.query(
      'INSERT INTO customers (name, age, password, contact) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, age, password, contact]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

