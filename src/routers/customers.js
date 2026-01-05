import express from 'express';
import {
  getCustomers,
  getCustomer,
  createCustomer,
} from '../controllers/customersController.js';

const router = express.Router();

router.get('/', getCustomers);
router.get('/:id', getCustomer);
router.post('/', createCustomer);

export default router;
