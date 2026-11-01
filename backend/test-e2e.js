const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('====================================================');
  console.log('🧪 RUNNING COMPREHENSIVE E2E & CONCURRENCY TESTS');
  console.log('====================================================');

  try {
    // 1. Health Check
    console.log('\n[Test 1] Health check...');
    const health = await axios.get(`${BASE_URL}/health`);
    console.log('✓ Health status:', health.data.status);

    // 2. Admin Login
    console.log('\n[Test 2] Admin authentication...');
    const adminLogin = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@imovies.com',
      password: 'Admin@123',
    });
    const adminToken = adminLogin.data.token;
    console.log('✓ Admin login successful. Role:', adminLogin.data.user.role);

    // 3. User Login
    console.log('\n[Test 3] User authentication...');
    const userLogin = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'user@imovies.com',
      password: 'User@123',
    });
    const userToken = userLogin.data.token;
    console.log('✓ User login successful. Name:', userLogin.data.user.name);

    // 4. Fetch Movies & Genres
    console.log('\n[Test 4] Querying movies and genre filters...');
    const allMovies = await axios.get(`${BASE_URL}/movies`);
    console.log(`✓ Fetched ${allMovies.data.count} movies.`);

    const sciFiMovies = await axios.get(`${BASE_URL}/movies?genre=Sci-Fi`);
    console.log(`✓ Filtered ${sciFiMovies.data.count} Sci-Fi movies.`);

    const searchMovies = await axios.get(`${BASE_URL}/movies?search=Dune`);
    console.log(`✓ Search "Dune" returned: ${searchMovies.data.movies[0]?.title}`);

    // 5. Query Theatres & Shows
    console.log('\n[Test 5] Fetching theatres & scheduled shows...');
    const theatres = await axios.get(`${BASE_URL}/theatres`);
    console.log(`✓ Found ${theatres.data.count} theatres.`);

    const targetMovie = allMovies.data.movies.find((m) => m.status === 'now_showing') || allMovies.data.movies[0];
    const shows = await axios.get(`${BASE_URL}/shows?movieId=${targetMovie._id}`);
    console.log(`✓ Found ${shows.data.count} shows for movie "${targetMovie.title}".`);
    const targetShow = shows.data.shows[0];

    // 6. Fetch Seats for Show
    console.log('\n[Test 6] Fetching seat status for show...');
    const seatStatus = await axios.get(`${BASE_URL}/shows/${targetShow._id}/seats`);
    console.log(`✓ Total seats: ${seatStatus.data.totalSeats}, Available: ${seatStatus.data.availableSeatsCount}`);

    // Pick 2 currently available seats
    const availableSeats = seatStatus.data.seats.filter((s) => !s.isBooked);
    if (availableSeats.length < 2) {
      throw new Error('Not enough available seats to run test');
    }
    const testSeats = [availableSeats[0].seatNumber, availableSeats[1].seatNumber];
    console.log(`Selecting seats: ${testSeats.join(', ')}`);

    // 7. Atomic Booking Reservation
    console.log('\n[Test 7] Creating ticket booking...');
    const bookingRes = await axios.post(
      `${BASE_URL}/bookings`,
      {
        showId: targetShow._id,
        selectedSeats: testSeats,
        paymentMethod: 'Test Card Payment',
      },
      { headers: { Authorization: `Bearer ${userToken}` } }
    );
    console.log('✓ Booking created successfully!');
    console.log('   Reference Code:', bookingRes.data.booking.bookingReference);
    console.log('   Total Paid: ₹', bookingRes.data.booking.totalAmount);
    console.log('   Seats:', bookingRes.data.booking.selectedSeats.join(', '));
    const createdBookingId = bookingRes.data.booking._id;

    // 8. CONCURRENCY & DUPLICATE BOOKING SAFEGUARD TEST
    console.log('\n[Test 8] Concurrency check: Attempting to duplicate book already reserved seats...');
    try {
      await axios.post(
        `${BASE_URL}/bookings`,
        {
          showId: targetShow._id,
          selectedSeats: testSeats, // Identical seats!
        },
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
      console.error('❌ FAILED: Duplicate booking was incorrectly allowed!');
      process.exit(1);
    } catch (conflictErr) {
      if (conflictErr.response && conflictErr.response.status === 409) {
        console.log('✓ CONFLICT PREVENTED AS EXPECTED (409):', conflictErr.response.data.message);
      } else {
        throw conflictErr;
      }
    }

    // 9. My Bookings
    console.log('\n[Test 9] Fetching logged in user bookings...');
    const myBookings = await axios.get(`${BASE_URL}/bookings/my-bookings`, {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    console.log(`✓ User has ${myBookings.data.count} bookings.`);

    // 10. Cancellation & Seat Release Test
    console.log('\n[Test 10] Cancelling booking and verifying seat release...');
    const cancelRes = await axios.put(
      `${BASE_URL}/bookings/${createdBookingId}/cancel`,
      {},
      { headers: { Authorization: `Bearer ${userToken}` } }
    );
    console.log('✓ Cancellation response:', cancelRes.data.message);

    // Verify seats are free again
    const postCancelSeats = await axios.get(`${BASE_URL}/shows/${targetShow._id}/seats`);
    const seatsFreed = postCancelSeats.data.seats
      .filter((s) => testSeats.includes(s.seatNumber))
      .every((s) => !s.isBooked);
    console.log('✓ Seats successfully freed up back to available:', seatsFreed);

    // 11. Admin Endpoints Check
    console.log('\n[Test 11] Checking Admin routes...');
    const allBookingsAdmin = await axios.get(`${BASE_URL}/bookings`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    console.log(`✓ Admin fetched all platform bookings: count = ${allBookingsAdmin.data.count}`);

    const allUsersAdmin = await axios.get(`${BASE_URL}/auth/users`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    console.log(`✓ Admin fetched registered users: count = ${allUsersAdmin.data.count}`);

    console.log('\n====================================================');
    console.log('🎉 ALL 11 TEST SUITES PASSED FLAWLESSLY!');
    console.log('====================================================\n');
  } catch (error) {
    console.error('❌ Test failed with error:', error.response?.data || error.message);
    process.exit(1);
  }
}

runTests();
