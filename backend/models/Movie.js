const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Movie title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Movie description is required'],
    },
    poster: {
      type: String,
      required: [true, 'Movie poster image URL is required'],
    },
    banner: {
      type: String,
      required: [true, 'Movie banner image URL is required'],
    },
    genre: {
      type: [String],
      required: [true, 'At least one genre is required'],
    },
    language: {
      type: [String],
      required: [true, 'At least one language is required'],
    },
    duration: {
      type: Number, // duration in minutes
      required: [true, 'Movie duration in minutes is required'],
    },
    rating: {
      type: Number,
      default: 8.5,
      min: 0,
      max: 10,
    },
    votes: {
      type: Number,
      default: 1250,
    },
    releaseDate: {
      type: Date,
      required: [true, 'Release date is required'],
    },
    trailerUrl: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['now_showing', 'upcoming', 'ended'],
      default: 'now_showing',
    },
    certification: {
      type: String,
      default: 'UA 16+',
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Text index for search with language_override: 'none' to allow language field to be an array
movieSchema.index({ title: 'text', description: 'text' }, { language_override: 'none' });

module.exports = mongoose.model('Movie', movieSchema);
