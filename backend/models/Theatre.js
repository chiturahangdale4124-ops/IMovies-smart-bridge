const mongoose = require('mongoose');

const screenSchema = new mongoose.Schema({
  screenNumber: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    default: 'Screen 1',
  },
  soundSystem: {
    type: String,
    default: 'Dolby Atmos 7.1',
  },
  totalSeats: {
    type: Number,
    default: 80,
  },
});

const theatreSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Theatre name is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Theatre location / address is required'],
    },
    city: {
      type: String,
      default: 'Mumbai',
    },
    screens: [screenSchema],
    facilities: {
      type: [String],
      default: ['Dolby Atmos', '4K Projection', 'Food & Beverages', 'Wheelchair Accessible', 'Parking'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Theatre', theatreSchema);
