const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    showId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Show',
      required: true,
    },
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: true,
    },
    theatreId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Theatre',
      required: true,
    },
    selectedSeats: {
      type: [String],
      required: [true, 'At least one seat must be selected'],
    },
    seatDetails: [
      {
        seatNumber: String,
        category: String,
        price: Number,
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    bookingReference: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    bookingStatus: {
      type: String,
      enum: ['confirmed', 'cancelled'],
      default: 'confirmed',
    },
    paymentStatus: {
      type: String,
      enum: ['completed', 'refunded'],
      default: 'completed',
    },
    paymentMethod: {
      type: String,
      default: 'IMovies Instant Pay',
    },
  },
  {
    timestamps: true,
  }
);

bookingSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Booking', bookingSchema);
