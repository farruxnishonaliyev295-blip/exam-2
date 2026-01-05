import { pool } from '../db/db.js';

export const getPayments = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM payments ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM payments WHERE id=$1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Payment not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createPayment = async (req, res) => {
  try {
    const { orderid, amount } = req.body; 

    if (!orderid || !amount)
      return res.status(400).json({ message: 'Molumotni toliq kiriting' });

    const result = await pool.query(
      'INSERT INTO payments (orderid, amount) VALUES ($1, $2) RETURNING *',
      [orderid, amount]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

