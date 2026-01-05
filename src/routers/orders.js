import express from 'express';
import {
  getOrders,
  getOrder,
  createOrder,
  updateOrder
} from '../controllers/ordersController.js';

const router = express.Router();

router.get('/', getOrders);
router.get('/:id', getOrder);
router.post('/', createOrder);
router.put('/',updateOrder)

export default router;
