const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema(
  {
    seatNumber: {
      type: String,
      required: true,
    },
    row: {
      type: String,
      required: true,
    },
    column: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      enum: ['Silver', 'Gold', 'VIP'],
      default: 'Gold',
    },
    price: {
      type: Number,
      required: true,
    },
    isBooked: {
      type: Boolean,
      default: false,
    },
    bookedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { _id: false }
);

const showSchema = new mongoose.Schema(
  {
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: [true, 'Movie ID is required'],
    },
    theatreId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Theatre',
      required: [true, 'Theatre ID is required'],
    },
    screen: {
      type: String,
      default: 'Screen 1',
    },
    showDate: {
      type: String, // Format: YYYY-MM-DD for reliable calendar matching
      required: [true, 'Show date is required (YYYY-MM-DD)'],
    },
    showTime: {
      type: String, // e.g. "10:30 AM", "02:15 PM", "06:30 PM", "09:45 PM"
      required: [true, 'Show time is required'],
    },
    ticketPrice: {
      type: Number,
      required: [true, 'Base ticket price is required'],
      default: 250,
    },
    seats: [seatSchema],
  },
  {
    timestamps: true,
  }
);

showSchema.index({ movieId: 1, showDate: 1 });
showSchema.index({ theatreId: 1, showDate: 1 });

module.exports = mongoose.model('Show', showSchema);
