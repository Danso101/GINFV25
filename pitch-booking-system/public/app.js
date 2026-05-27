// Local client state storage
let users = [];
let pitches = [];
let bookings = [];

// DOM References
const userSelect = document.getElementById('userSelect');
const pitchSelect = document.getElementById('pitchSelect');
const bookingsTableBody = document.getElementById('bookingsTableBody');
const bookingForm = document.getElementById('bookingForm');
const feedback = document.getElementById('feedback');

// Initialization sequence
document.addEventListener('DOMContentLoaded', async () => {
  await Promise.all([fetchUsers(), fetchPitches()]);
  await fetchBookings();
});

function showFeedback(msg, type = 'danger') {
  feedback.innerText = msg;
  feedback.className = `alert alert-${type}`;
}

async function fetchUsers() {
  const res = await fetch('/api/users');
  users = await res.json();
  userSelect.innerHTML = users.map(u => `<option value="${u.id}">${u.name} (${u.email})</option>`).join('');
}

async function fetchPitches() {
  const res = await fetch('/api/pitches');
  pitches = await res.json();
  pitchSelect.innerHTML = pitches.map(p => `<option value="${p.id}">${p.name} - $${p.pricePerHour}/hr</option>`).join('');
}

async function fetchBookings() {
  const res = await fetch('/api/bookings');
  bookings = await res.json();
  renderBookingsTable();
}

function renderBookingsTable() {
  if (bookings.length === 0) {
    bookingsTableBody.innerHTML = `<tr><td colspan="8" class="text-center text-muted py-3">No bookings placed yet.</td></tr>`;
    return;
  }

  bookingsTableBody.innerHTML = bookings.map(b => {
    const user = users.find(u => u.id === b.userId)?.name || `User ID: ${b.userId}`;
    const pitch = pitches.find(p => p.id === b.pitchId)?.name || `Pitch ID: ${b.pitchId}`;
    return `
      <tr>
        <td><strong>#${b.id}</strong></td>
        <td>${user}</td>
        <td>${pitch}</td>
        <td>${b.date}</td>
        <td>${b.startTime}</td>
        <td>${b.hours} hrs</td>
        <td class="text-success fw-bold">$${b.totalAmount}</td>
        <td>
          <button class="btn btn-sm btn-danger border-0" onclick="cancelBooking(${b.id})">Cancel</button>
        </td>
      </tr>
    `;
  }).join('');
}

// Client-Side Interaction Handle & Form Constraints Validation
bookingForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  feedback.classList.add('d-none');

  const payload = {
    userId: userSelect.value,
    pitchId: pitchSelect.value,
    date: document.getElementById('bookingDate').value,
    startTime: document.getElementById('bookingTime').value,
    hours: document.getElementById('bookingHours').value
  };

  // Explicit HTML5 Validity Checking Routine
  if (!payload.date || !payload.startTime || !payload.hours) {
    showFeedback('Please fill out all schedule fields before reservation submission.');
    return;
  }
  if (Number(payload.hours) <= 0 || Number(payload.hours) > 10) {
    showFeedback('Booking duration constraint rule violation: Value must be between 1 and 10 hours.');
    return;
  }

  try {
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    
    if (!res.ok) {
      showFeedback(data.error || 'Server processing error occurred.');
    } else {
      showFeedback('Reservation secured successfully!', 'success');
      bookingForm.reset();
      await fetchBookings();
    }
  } catch (error) {
    showFeedback('Network connection failed. Check local node engine.');
  }
});

// Global binding context helper for row components action links
window.cancelBooking = async (id) => {
  if (!confirm('Are you certain you want to cancel this slot booking reservation?')) return;
  try {
    const res = await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
    if (res.ok) {
      await fetchBookings();
    } else {
      const data = await res.json();
      alert(data.error);
    }
  } catch (err) {
    alert('Failed communicating cancel command.');
  }
};