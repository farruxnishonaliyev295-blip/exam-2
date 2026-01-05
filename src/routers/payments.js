import express from 'express';
import {
  getPayments,
  getPayment,
  createPayment,
} from '../controllers/paymentsController.js';

const router = express.Router();

router.get('/', getPayments);
router.get('/:id', getPayment);
router.post('/', createPayment);

export default router;
