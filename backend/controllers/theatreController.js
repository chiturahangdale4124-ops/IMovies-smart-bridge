const Theatre = require('../models/Theatre');
const Show = require('../models/Show');

// @desc    Get all theatres
// @route   GET /api/theatres
// @access  Public
const getTheatres = async (req, res, next) => {
  try {
    const theatres = await Theatre.find().sort({ name: 1 });
    res.json({
      success: true,
      count: theatres.length,
      theatres,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single theatre
// @route   GET /api/theatres/:id
// @access  Public
const getTheatreById = async (req, res, next) => {
  try {
    const theatre = await Theatre.findById(req.params.id);
    if (!theatre) {
      return res.status(404).json({
        success: false,
        message: 'Theatre not found',
      });
    }
    res.json({
      success: true,
      theatre,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new theatre
// @route   POST /api/theatres
// @access  Private/Admin
const createTheatre = async (req, res, next) => {
  try {
    const { name, location, city, screens, facilities } = req.body;

    if (!name || !location) {
      return res.status(400).json({
        success: false,
        message: 'Please provide theatre name and location',
      });
    }

    const theatre = await Theatre.create({
      name,
      location,
      city: city || 'Mumbai',
      screens: screens && screens.length > 0 ? screens : [
        { screenNumber: 1, name: 'Screen 1 - Dolby Atmos', soundSystem: 'Dolby Atmos 7.1', totalSeats: 64 },
        { screenNumber: 2, name: 'Screen 2 - IMAX Laser', soundSystem: 'IMAX 12-channel', totalSeats: 64 },
      ],
      facilities: facilities || ['Dolby Atmos', '4K Projection', 'Food & Beverages', 'Parking'],
    });

    res.status(201).json({
      success: true,
      message: 'Theatre created successfully',
      theatre,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update theatre
// @route   PUT /api/theatres/:id
// @access  Private/Admin
const updateTheatre = async (req, res, next) => {
  try {
    const theatre = await Theatre.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!theatre) {
      return res.status(404).json({
        success: false,
        message: 'Theatre not found',
      });
    }

    res.json({
      success: true,
      message: 'Theatre updated successfully',
      theatre,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete theatre
// @route   DELETE /api/theatres/:id
// @access  Private/Admin
const deleteTheatre = async (req, res, next) => {
  try {
    const theatre = await Theatre.findById(req.params.id);

    if (!theatre) {
      return res.status(404).json({
        success: false,
        message: 'Theatre not found',
      });
    }

    await Theatre.findByIdAndDelete(req.params.id);
    await Show.deleteMany({ theatreId: req.params.id });

    res.json({
      success: true,
      message: 'Theatre and associated shows removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTheatres,
  getTheatreById,
  createTheatre,
  updateTheatre,
  deleteTheatre,
};
