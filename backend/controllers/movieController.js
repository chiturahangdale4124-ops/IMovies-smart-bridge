const Movie = require('../models/Movie');
const Show = require('../models/Show');

// @desc    Get all movies with filters & search
// @route   GET /api/movies
// @access  Public
const getMovies = async (req, res, next) => {
  try {
    const { search, genre, status, featured } = req.query;
    let query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (genre && genre !== 'All') {
      query.genre = { $in: [new RegExp(genre, 'i')] };
    }

    if (featured === 'true') {
      query.featured = true;
    }

    if (search && search.trim() !== '') {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
        { genre: { $regex: search.trim(), $options: 'i' } },
        { language: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const movies = await Movie.find(query).sort({ releaseDate: -1, createdAt: -1 });

    res.json({
      success: true,
      count: movies.length,
      movies,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single movie by ID
// @route   GET /api/movies/:id
// @access  Public
const getMovieById = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found',
      });
    }

    res.json({
      success: true,
      movie,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new movie
// @route   POST /api/movies
// @access  Private/Admin
const createMovie = async (req, res, next) => {
  try {
    const {
      title,
      description,
      poster,
      banner,
      genre,
      language,
      duration,
      rating,
      releaseDate,
      trailerUrl,
      status,
      certification,
      featured,
    } = req.body;

    // Normalize genre and language to arrays if comma-separated strings were supplied
    const parsedGenre = Array.isArray(genre)
      ? genre
      : typeof genre === 'string'
      ? genre.split(',').map((g) => g.trim())
      : [];

    const parsedLanguage = Array.isArray(language)
      ? language
      : typeof language === 'string'
      ? language.split(',').map((l) => l.trim())
      : ['English'];

    const movie = await Movie.create({
      title,
      description,
      poster,
      banner: banner || poster,
      genre: parsedGenre,
      language: parsedLanguage,
      duration: Number(duration),
      rating: rating ? Number(rating) : 8.0,
      releaseDate: releaseDate ? new Date(releaseDate) : new Date(),
      trailerUrl: trailerUrl || '',
      status: status || 'now_showing',
      certification: certification || 'UA 16+',
      featured: featured === true || featured === 'true',
    });

    res.status(201).json({
      success: true,
      message: 'Movie created successfully',
      movie,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update movie
// @route   PUT /api/movies/:id
// @access  Private/Admin
const updateMovie = async (req, res, next) => {
  try {
    let movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found',
      });
    }

    // Process arrays if strings were given
    const updateData = { ...req.body };
    if (updateData.genre && typeof updateData.genre === 'string') {
      updateData.genre = updateData.genre.split(',').map((g) => g.trim());
    }
    if (updateData.language && typeof updateData.language === 'string') {
      updateData.language = updateData.language.split(',').map((l) => l.trim());
    }
    if (updateData.duration) {
      updateData.duration = Number(updateData.duration);
    }
    if (updateData.rating) {
      updateData.rating = Number(updateData.rating);
    }

    movie = await Movie.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: 'Movie updated successfully',
      movie,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete movie
// @route   DELETE /api/movies/:id
// @access  Private/Admin
const deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found',
      });
    }

    await Movie.findByIdAndDelete(req.params.id);
    // Also remove any scheduled shows for this movie
    await Show.deleteMany({ movieId: req.params.id });

    res.json({
      success: true,
      message: 'Movie and associated shows removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
};
