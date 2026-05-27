import { Router } from 'express';
import { getUsersController, addUserController } from '../controllers/userController.js';
import { getPitchesController } from '../controllers/pitchController.js';
import { getBookingsController, addBookingController, deleteBookingController } from '../controllers/bookingController.js';

const router = Router();

router.get('/users', getUsersController);
router.post('/users', addUserController);

router.get('/pitches', getPitchesController);

router.get('/bookings', getBookingsController);
router.post('/bookings', addBookingController);
router.delete('/bookings/:id', deleteBookingController);

export default router;