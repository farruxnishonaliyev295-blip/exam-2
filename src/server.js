import express from 'express';
import carsRouter from './routers/cars.js';
import customersRouter from './routers/customers.js';
import ordersRouter from './routers/orders.js';
import paymentsRouter from './routers/payments.js';


const app = express();
app.use(express.json());

app.use('/api/cars', carsRouter);
app.use('/api/customers', customersRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/payments', paymentsRouter);


app.use((req, res) => res.status(404).json({ message: 'Not Found' }));

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
