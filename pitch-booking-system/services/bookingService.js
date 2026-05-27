import bookingRepo from '../repositories/bookingRepository.js';
import pitchRepo from '../repositories/pitchRepository.js';

async function getAllBookings() {
  return await bookingRepo.getBookings();
}

async function createBooking(bookingData) {
  const pitches = await pitchRepo.getPitches();
  const targetPitch = pitches.find(p => p.id === Number(bookingData.pitchId));
  
  if (!targetPitch) {
    throw new Error('Selected pitch does not exist.');
  }

  // Calculate dynamic pricing server-side for integrity
  const totalAmount = targetPitch.pricePerHour * Number(bookingData.hours);
  
  const finalBooking = {
    userId: Number(bookingData.userId),
    pitchId: Number(bookingData.pitchId),
    date: bookingData.date,
    startTime: bookingData.startTime,
    hours: Number(bookingData.hours),
    totalAmount: totalAmount
  };

  return await bookingRepo.addBooking(finalBooking);
}

async function cancelBooking(id) {
  return await bookingRepo.deleteBooking(id);
}

export default { getAllBookings, createBooking, cancelBooking };