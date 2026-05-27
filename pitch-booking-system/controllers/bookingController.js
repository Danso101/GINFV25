import bookingService from '../services/bookingService.js';

export async function getBookingsController(req, res) {
  try {
    const bookings = await bookingService.getAllBookings();
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve bookings.' });
  }
}

export async function addBookingController(req, res) {
  const { userId, pitchId, date, startTime, hours } = req.body;

  // Robust Server-Side Validation
  if (!userId || !pitchId || !date || !startTime || !hours) {
    return res.status(400).json({ error: 'All fields (userId, pitchId, date, startTime, hours) are required.' });
  }
  if (Number(hours) <= 0) {
    return res.status(400).json({ error: 'Hours must be a positive integer.' });
  }

  try {
    const newBooking = await bookingService.createBooking({ userId, pitchId, date, startTime, hours });
    res.status(201).json(newBooking);
  } catch (err) {
    res.status(422).json({ error: err.message });
  }
}

export async function deleteBookingController(req, res) {
  try {
    const removed = await bookingService.cancelBooking(req.params.id);
    if (!removed) return res.status(404).json({ error: 'Booking item not found.' });
    res.status(200).json({ message: 'Booking canceled successfully.', removed });
  } catch (err) {
    res.status(500).json({ error: 'Server error during deletion.' });
  }
}