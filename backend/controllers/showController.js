const Show = require('../models/Show');
const Movie = require('../models/Movie');
const Theatre = require('../models/Theatre');

// Helper function to generate cinema seat grid
const generateSeatLayout = (basePrice = 250) => {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const seatsPerRow = 8;
  const seats = [];

  rows.forEach((row) => {
    let category = 'Gold';
    let price = basePrice;

    if (row === 'A' || row === 'B') {
      category = 'VIP';
      price = basePrice + 100;
    } else if (row === 'G' || row === 'H') {
      category = 'Silver';
      price = Math.max(100, basePrice - 50);
    } else {
      category = 'Gold';
      price = basePrice;
    }

    for (let col = 1; col <= seatsPerRow; col++) {
      seats.push({
        seatNumber: `${row}${col}`,
        row,
        column: col,
        category,
        price,
        isBooked: false,
        bookedBy: null,
      });
    }
  });

  return seats;
};

// @desc    Get all shows with filters
// @route   GET /api/shows
// @access  Public
const getShows = async (req, res, next) => {
  try {
    const { movieId, theatreId, showDate } = req.query;
    let query = {};

    if (movieId) query.movieId = movieId;
    if (theatreId) query.theatreId = theatreId;
    if (showDate) query.showDate = showDate;

    const shows = await Show.find(query)
      .populate('movieId', 'title poster duration rating certification language genre')
      .populate('theatreId', 'name location city screens')
      .sort({ showDate: 1, showTime: 1 });

    res.json({
      success: true,
      count: shows.length,
      shows,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single show details
// @route   GET /api/shows/:id
// @access  Public
const getShowById = async (req, res, next) => {
  try {
    const show = await Show.findById(req.params.id)
      .populate('movieId')
      .populate('theatreId');

    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Show not found',
      });
    }

    res.json({
      success: true,
      show,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get seat status for a show
// @route   GET /api/shows/:id/seats
// @access  Public
const getShowSeats = async (req, res, next) => {
  try {
    const show = await Show.findById(req.params.id)
      .populate('movieId', 'title poster duration rating certification language')
      .populate('theatreId', 'name location city');

    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Show not found',
      });
    }

    const totalSeats = show.seats.length;
    const bookedSeatsCount = show.seats.filter((s) => s.isBooked).length;
    const availableSeatsCount = totalSeats - bookedSeatsCount;

    res.json({
      success: true,
      showId: show._id,
      movie: show.movieId,
      theatre: show.theatreId,
      screen: show.screen,
      showDate: show.showDate,
      showTime: show.showTime,
      ticketPrice: show.ticketPrice,
      totalSeats,
      bookedSeatsCount,
      availableSeatsCount,
      seats: show.seats,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new show with generated seat layout
// @route   POST /api/shows
// @access  Private/Admin
const createShow = async (req, res, next) => {
  try {
    const { movieId, theatreId, screen, showDate, showTime, ticketPrice } = req.body;

    if (!movieId || !theatreId || !showDate || !showTime) {
      return res.status(400).json({
        success: false,
        message: 'Please provide movieId, theatreId, showDate, and showTime',
      });
    }

    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }

    const theatre = await Theatre.findById(theatreId);
    if (!theatre) {
      return res.status(404).json({ success: false, message: 'Theatre not found' });
    }

    const basePrice = ticketPrice ? Number(ticketPrice) : 250;
    const seats = generateSeatLayout(basePrice);

    const show = await Show.create({
      movieId,
      theatreId,
      screen: screen || 'Screen 1 - Dolby Atmos',
      showDate,
      showTime,
      ticketPrice: basePrice,
      seats,
    });

    const populatedShow = await Show.findById(show._id)
      .populate('movieId', 'title poster')
      .populate('theatreId', 'name location');

    res.status(201).json({
      success: true,
      message: 'Show created successfully',
      show: populatedShow,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete show
// @route   DELETE /api/shows/:id
// @access  Private/Admin
const deleteShow = async (req, res, next) => {
  try {
    const show = await Show.findById(req.params.id);

    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Show not found',
      });
    }

    await Show.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Show deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getShows,
  getShowById,
  getShowSeats,
  createShow,
  deleteShow,
  generateSeatLayout,
};
