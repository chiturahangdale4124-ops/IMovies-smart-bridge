const Booking = require('../models/Booking');
const Show = require('../models/Show');
const Movie = require('../models/Movie');
const Theatre = require('../models/Theatre');

// Helper to generate a clean, unique booking reference
const generateBookingReference = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let randomStr = '';
  for (let i = 0; i < 5; i++) {
    randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const timestamp = Date.now().toString().slice(-4);
  return `IMOV-${randomStr}${timestamp}`;
};

// @desc    Book movie tickets with atomic concurrency safeguard
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res, next) => {
  try {
    const { showId, selectedSeats, paymentMethod } = req.body;

    if (!showId) {
      return res.status(400).json({ success: false, message: 'Show ID is required' });
    }

    if (!selectedSeats || !Array.isArray(selectedSeats) || selectedSeats.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please select at least one seat to book',
      });
    }

    // 1. Fetch the target show
    const show = await Show.findById(showId);
    if (!show) {
      return res.status(404).json({ success: false, message: 'Show not found' });
    }

    // 2. Validate seat existence and check if any are already marked booked
    const invalidSeats = [];
    const alreadyBookedSeats = [];
    const matchedSeats = [];

    selectedSeats.forEach((seatNum) => {
      const seatObj = show.seats.find((s) => s.seatNumber === seatNum);
      if (!seatObj) {
        invalidSeats.push(seatNum);
      } else if (seatObj.isBooked) {
        alreadyBookedSeats.push(seatNum);
      } else {
        matchedSeats.push(seatObj);
      }
    });

    if (invalidSeats.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid seat number(s): ${invalidSeats.join(', ')}`,
      });
    }

    if (alreadyBookedSeats.length > 0) {
      return res.status(409).json({
        success: false,
        message: `The following seat(s) are already booked: ${alreadyBookedSeats.join(', ')}. Please choose other seats.`,
      });
    }

    // 3. Perform atomic reservation on MongoDB
    // Ensure that none of the selected seats became booked concurrently
    const atomicUpdate = await Show.findOneAndUpdate(
      {
        _id: showId,
        seats: {
          $not: {
            $elemMatch: {
              seatNumber: { $in: selectedSeats },
              isBooked: true,
            },
          },
        },
      },
      {
        $set: {
          'seats.$[elem].isBooked': true,
          'seats.$[elem].bookedBy': req.user._id,
        },
      },
      {
        arrayFilters: [{ 'elem.seatNumber': { $in: selectedSeats } }],
        new: true,
      }
    );

    if (!atomicUpdate) {
      return res.status(409).json({
        success: false,
        message: 'Conflict: One or more selected seats were booked by another user moments ago. Please reselect your seats.',
      });
    }

    // 4. Calculate pricing & seat details
    const seatDetails = matchedSeats.map((s) => ({
      seatNumber: s.seatNumber,
      category: s.category,
      price: s.price,
    }));

    const subTotal = seatDetails.reduce((sum, s) => sum + s.price, 0);
    const convenienceFee = selectedSeats.length * 25; // 25 INR / standard fee per ticket
    const totalAmount = subTotal + convenienceFee;

    // 5. Generate unique booking reference
    let bookingReference = generateBookingReference();
    let existingRef = await Booking.findOne({ bookingReference });
    while (existingRef) {
      bookingReference = generateBookingReference();
      existingRef = await Booking.findOne({ bookingReference });
    }

    // 6. Create booking record
    const booking = await Booking.create({
      userId: req.user._id,
      showId: show._id,
      movieId: show.movieId,
      theatreId: show.theatreId,
      selectedSeats,
      seatDetails,
      totalAmount,
      bookingReference,
      bookingStatus: 'confirmed',
      paymentStatus: 'completed',
      paymentMethod: paymentMethod || 'IMovies Instant Checkout',
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('movieId', 'title poster banner duration rating certification language')
      .populate('theatreId', 'name location city')
      .populate('showId', 'screen showDate showTime ticketPrice')
      .populate('userId', 'name email');

    res.status(201).json({
      success: true,
      message: 'Tickets booked successfully! Enjoy your movie.',
      booking: populatedBooking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user's bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate('movieId', 'title poster banner duration rating certification language')
      .populate('theatreId', 'name location city')
      .populate('showId', 'screen showDate showTime ticketPrice')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get booking by ID or reference
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res, next) => {
  try {
    const query = req.params.id.startsWith('IMOV-')
      ? { bookingReference: req.params.id }
      : { _id: req.params.id };

    const booking = await Booking.findOne(query)
      .populate('movieId')
      .populate('theatreId')
      .populate('showId')
      .populate('userId', 'name email');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Verify ownership or admin
    if (
      !booking.userId.equals(req.user._id) &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking',
      });
    }

    res.json({
      success: true,
      booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings across the platform (admin only)
// @route   GET /api/bookings
// @access  Private/Admin
const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate('movieId', 'title poster')
      .populate('theatreId', 'name location')
      .populate('showId', 'screen showDate showTime')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel booking and release seats
// @route   PUT /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Check ownership or admin
    if (
      !booking.userId.equals(req.user._id) &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking',
      });
    }

    if (booking.bookingStatus === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'This booking is already cancelled',
      });
    }

    // Release the seats atomically in the Show document
    await Show.updateOne(
      { _id: booking.showId },
      {
        $set: {
          'seats.$[elem].isBooked': false,
          'seats.$[elem].bookedBy': null,
        },
      },
      {
        arrayFilters: [{ 'elem.seatNumber': { $in: booking.selectedSeats } }],
      }
    );

    booking.bookingStatus = 'cancelled';
    booking.paymentStatus = 'refunded';
    await booking.save();

    res.json({
      success: true,
      message: 'Booking cancelled successfully. Seats have been released.',
      booking,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  getAllBookings,
  cancelBooking,
};
