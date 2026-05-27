import fs from 'fs/promises';
import path from 'path';

const FILE_PATH = path.join(process.cwd(), 'data', 'bookings.json');

async function getBookings() {
  const data = await fs.readFile(FILE_PATH, 'utf-8');
  return JSON.parse(data);
}

async function addBooking(booking) {
  const bookings = await getBookings();
  const maxId = bookings.length > 0 ? Math.max(...bookings.map(b => b.id)) : 0;
  const newBooking = { id: maxId + 1, ...booking };
  bookings.push(newBooking);
  await fs.writeFile(FILE_PATH, JSON.stringify(bookings, null, 2));
  return newBooking;
}

async function deleteBooking(id) {
  const bookings = await getBookings();
  const index = bookings.findIndex(b => b.id === Number(id));
  if (index === -1) return null;
  const [removed] = bookings.splice(index, 1);
  await fs.writeFile(FILE_PATH, JSON.stringify(bookings, null, 2));
  return removed;
}

export default { getBookings, addBooking, deleteBooking };