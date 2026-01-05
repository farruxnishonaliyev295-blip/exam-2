import express from 'express';
import {
  getCars,
  getCar,
  createCar,
  updateCar,
} from '../controllers/carsController.js';

const router = express.Router();

router.get('/', getCars);
router.get('/:id', getCar);
router.post('/', createCar);
router.put('/:id', updateCar);


export default router;
