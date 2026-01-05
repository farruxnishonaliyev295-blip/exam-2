import { pool } from '../db/db.js';

export const getOrders = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM orders WHERE id=$1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Order not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createOrder = async (req, res) => {
  try {
    const { customersid, carsid, count_month, advance_payment } = req.body;

    if (!customersid || !carsid || !count_month || !advance_payment) {
      return res.status(400).json({ message: 'Molumotni toliq kiriting' });
    }

    const carResult = await pool.query('SELECT price FROM cars WHERE id = $1', [carsid]);
    if (carResult.rows.length === 0) {
      return res.status(404).json({ message: 'Mashina topilmadi' });
    }

    const carPrice = parseFloat(carResult.rows[0].price);

    const minAdvance = carPrice * 0.2;
    if (parseFloat(advance_payment) < minAdvance) {
      return res.status(400).json({ message: `toluv yetarli emas.  20% tolanishi kerek: ${minAdvance}` });
    }

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + parseInt(count_month));

    const orderResult = await pool.query(
      'INSERT INTO orders (customersid, carsid, count_month, start_date, end_date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [customersid, carsid, count_month, startDate, endDate]
    );

    const orderId = orderResult.rows[0].id;

    await pool.query(
      'INSERT INTO payments (orderid, amount) VALUES ($1, $2)',
      [orderId, advance_payment]
    );

    res.status(201).json({
      order: orderResult.rows[0],
      message: `Buyurtma yaratildi va ${advance_payment} 20% tolandi`
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { customersid, carsid, count_month, advance_payment } = req.body;

    if (!customersid || !carsid || !count_month || !advance_payment) {
      return res.status(400).json({ message: 'Molumotni toliq kiriting' });
    }

    // 1️⃣ Buyurtmani tekshirish
    const orderCheck = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);
    if (orderCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Buyurtma topilmadi' });
    }

    // 2️⃣ Mashina narxini olish
    const carResult = await pool.query('SELECT price FROM cars WHERE id = $1', [carsid]);
    if (carResult.rows.length === 0) {
      return res.status(404).json({ message: 'Mashina topilmadi' });
    }
    const carPrice = parseFloat(carResult.rows[0].price);

    // 3️⃣ Minimal avans 20%
    const minAdvance = carPrice * 0.2;

    // 4️⃣ Oldin to‘langan avansni olish
    const paymentResult = await pool.query(
      'SELECT COALESCE(SUM(amount),0) AS total_paid FROM payments WHERE orderid = $1',
      [id]
    );
    const totalPaid = parseFloat(paymentResult.rows[0].total_paid);

    if (totalPaid + parseFloat(advance_payment) < minAdvance) {
      return res.status(400).json({
        message: `Avans yetarli emas. Minimal 20%: ${minAdvance}`
      });
    }

    // 5️⃣ Start va End date hisoblash
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + parseInt(count_month));

    // 6️⃣ Buyurtmani yangilash
    const result = await pool.query(
      'UPDATE orders SET customersid=$1, carsid=$2, count_month=$3, start_date=$4, end_date=$5 WHERE id=$6 RETURNING *',
      [customersid, carsid, count_month, startDate, endDate, id]
    );

    // 7️⃣ Avans payment qo‘shish
    await pool.query(
      'INSERT INTO payments (orderid, amount) VALUES ($1, $2)',
      [id, advance_payment]
    );

    res.status(200).json({
      message: 'Buyurtma yangilandi va avans to‘landi',
      order: result.rows[0]
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
