require('dotenv').config();
const mongoose = require('mongoose');
const { connectDB, disconnectDB } = require('./config/db');
const User = require('./models/User');
const Movie = require('./models/Movie');
const Theatre = require('./models/Theatre');
const Show = require('./models/Show');
const Booking = require('./models/Booking');
const { generateSeatLayout } = require('./controllers/showController');

const getFormattedDate = (daysAhead = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const seedData = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.log('[Seeder] Connecting to database...');
      await connectDB();
    }

    console.log('[Seeder] Clearing old records...');
    await User.deleteMany({});
    await Movie.deleteMany({});
    await Theatre.deleteMany({});
    await Show.deleteMany({});
    await Booking.deleteMany({});

    console.log('[Seeder] Creating Users...');
    // Notice: User.create triggers the pre('save') hook to hash passwords
    const adminUser = await User.create({
      name: 'IMovies Admin',
      email: 'admin@imovies.com',
      password: 'Admin@123',
      role: 'admin',
    });

    const demoUser = await User.create({
      name: 'Rahul Sharma',
      email: 'user@imovies.com',
      password: 'User@123',
      role: 'user',
    });

    const demoUser2 = await User.create({
      name: 'Priya Patel',
      email: 'priya@imovies.com',
      password: 'User@123',
      role: 'user',
    });

    console.log(`[Seeder] Created 3 users (Admin: admin@imovies.com, Users: user@imovies.com, priya@imovies.com)`);

    console.log('[Seeder] Creating Theatres...');
    const theatres = await Theatre.create([
      {
        name: 'PVR INOX: Phoenix Palladium',
        location: 'High Street Phoenix, 462 Senapati Bapat Marg, Lower Parel',
        city: 'Mumbai',
        screens: [
          { screenNumber: 1, name: 'Audi 1 - IMAX Laser 3D', soundSystem: 'IMAX 12-Channel', totalSeats: 64 },
          { screenNumber: 2, name: 'Audi 2 - Dolby Atmos', soundSystem: 'Dolby Atmos 7.1', totalSeats: 64 },
        ],
        facilities: ['IMAX Laser', 'Dolby Atmos', 'Gourmet Dine-In', 'Recliner Seating', 'Valet Parking'],
      },
      {
        name: 'Cinepolis: Viviana Mall',
        location: 'Viviana Mall, Eastern Express Highway, Thane West',
        city: 'Mumbai',
        screens: [
          { screenNumber: 1, name: 'Screen 1 - 4DX RealD', soundSystem: 'Dolby Atmos', totalSeats: 64 },
          { screenNumber: 2, name: 'Screen 2 - VIP Atmos Lounge', soundSystem: 'Dolby Atmos 7.1', totalSeats: 64 },
        ],
        facilities: ['4DX Experience', 'VIP Recliners', 'Café Coffee Lounge', 'Dolby Atmos', 'Wheelchair Access'],
      },
      {
        name: 'INOX: Megaplex Inorbit Mall',
        location: 'Inorbit Mall, Link Road, Malad West',
        city: 'Mumbai',
        screens: [
          { screenNumber: 1, name: 'Screen 1 - Insignia Luxury', soundSystem: 'Dolby Atmos', totalSeats: 64 },
          { screenNumber: 2, name: 'Screen 2 - ScreenX 270° Panoramic', soundSystem: 'Dolby Surround 7.1', totalSeats: 64 },
        ],
        facilities: ['Insignia Lounge', 'Live Kitchen', 'Dolby Atmos', 'Complimentary Wi-Fi', 'Reserved Parking'],
      },
    ]);
    console.log(`[Seeder] Created ${theatres.length} theatres.`);

    console.log('[Seeder] Creating Movies...');
    const movies = await Movie.create([
      {
        title: 'Dune: Part Two',
        description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he endeavors to prevent a terrible future.',
        poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
        banner: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80',
        genre: ['Sci-Fi', 'Adventure', 'Action'],
        language: ['English', 'Hindi'],
        duration: 166,
        rating: 8.6,
        votes: 42100,
        releaseDate: new Date('2024-03-01'),
        trailerUrl: 'https://www.youtube.com/watch?v=Way9Dexny3w',
        status: 'now_showing',
        certification: 'UA 16+',
        featured: true,
      },
      {
        title: 'Oppenheimer',
        description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II, exploring the moral and political consequences of scientific discovery.',
        poster: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=800&q=80',
        banner: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1600&q=80',
        genre: ['Biography', 'Drama', 'History'],
        language: ['English', 'Hindi'],
        duration: 180,
        rating: 8.9,
        votes: 68900,
        releaseDate: new Date('2023-07-21'),
        trailerUrl: 'https://www.youtube.com/watch?v=uYPbbksJxIg',
        status: 'now_showing',
        certification: 'A',
        featured: true,
      },
      {
        title: 'Interstellar',
        description: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.',
        poster: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
        banner: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1600&q=80',
        genre: ['Sci-Fi', 'Adventure', 'Drama'],
        language: ['English'],
        duration: 169,
        rating: 8.7,
        votes: 95400,
        releaseDate: new Date('2014-11-07'),
        trailerUrl: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
        status: 'now_showing',
        certification: 'UA',
        featured: true,
      },
      {
        title: 'The Dark Knight',
        description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
        poster: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=800&q=80',
        banner: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
        genre: ['Action', 'Crime', 'Drama'],
        language: ['English', 'Hindi'],
        duration: 152,
        rating: 9.0,
        votes: 110200,
        releaseDate: new Date('2008-07-18'),
        trailerUrl: 'https://www.youtube.com/watch?v=EXeTwQWrcwY',
        status: 'now_showing',
        certification: 'UA 16+',
        featured: false,
      },
      {
        title: 'Spider-Man: Across the Spider-Verse',
        description: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence. When the heroes clash on how to handle a new threat, Miles must redefine what it means to be a hero.',
        poster: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=800&q=80',
        banner: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1600&q=80',
        genre: ['Animation', 'Action', 'Sci-Fi'],
        language: ['English', 'Hindi', 'Tamil'],
        duration: 140,
        rating: 8.7,
        votes: 54300,
        releaseDate: new Date('2023-06-02'),
        trailerUrl: 'https://www.youtube.com/watch?v=cqGjhVJWtEg',
        status: 'now_showing',
        certification: 'U',
        featured: false,
      },
      {
        title: 'Gladiator II',
        description: 'Years after witnessing the death of revered hero Maximus at the hands of his uncle, Lucius must enter the Colosseum after his home is conquered by the tyrannical Emperors who now lead Rome with an iron fist.',
        poster: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
        banner: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1600&q=80',
        genre: ['Action', 'Adventure', 'Drama'],
        language: ['English', 'Hindi'],
        duration: 148,
        rating: 8.1,
        votes: 18200,
        releaseDate: new Date('2024-11-22'),
        trailerUrl: 'https://www.youtube.com/watch?v=4rgYUipGJNo',
        status: 'now_showing',
        certification: 'A',
        featured: false,
      },
      {
        title: 'Avatar: The Way of Water',
        description: 'Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na\'vi race to protect their home.',
        poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
        banner: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
        genre: ['Action', 'Sci-Fi', 'Adventure'],
        language: ['English', 'Hindi', 'Telugu'],
        duration: 192,
        rating: 7.6,
        votes: 49800,
        releaseDate: new Date('2022-12-16'),
        trailerUrl: 'https://www.youtube.com/watch?v=d9MyW72ELq0',
        status: 'now_showing',
        certification: 'UA 13+',
        featured: false,
      },
      {
        title: 'Deadpool & Wolverine',
        description: 'A listless Wade Wilson toils away in civilian life with his days as the morally flexible mercenary, Deadpool, behind him. But when his homeworld faces an existential threat, Wade must reluctantly suit-up again with an even more reluctant Wolverine.',
        poster: 'https://images.unsplash.com/photo-1531259683007-016a7b628fc3?auto=format&fit=crop&w=800&q=80',
        banner: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1600&q=80',
        genre: ['Action', 'Comedy', 'Sci-Fi'],
        language: ['English', 'Hindi'],
        duration: 128,
        rating: 7.8,
        votes: 38700,
        releaseDate: new Date('2024-07-26'),
        trailerUrl: 'https://www.youtube.com/watch?v=73_1biulkYk',
        status: 'now_showing',
        certification: 'A',
        featured: false,
      },
      {
        title: 'Avengers: Secret Wars',
        description: 'The climactic multiverse culmination where heroes from across realities gather to protect the fabric of time and existence from ultimate annihilation.',
        poster: 'https://images.unsplash.com/photo-1569003339405-ea396a5a8a90?auto=format&fit=crop&w=800&q=80',
        banner: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80',
        genre: ['Action', 'Sci-Fi', 'Adventure'],
        language: ['English', 'Hindi', 'Tamil', 'Telugu'],
        duration: 175,
        rating: 9.1,
        votes: 8900,
        releaseDate: new Date('2027-05-07'),
        trailerUrl: 'https://www.youtube.com/watch?v=TcMBFSGVi1c',
        status: 'upcoming',
        certification: 'UA 13+',
        featured: false,
      },
      {
        title: 'Batman: The Brave and the Bold',
        description: 'The dynamic introduction of Batman and his son Damian Wayne as Robin in an all-new thrilling chapter of Gotham City intrigue and dark heroism.',
        poster: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=800&q=80',
        banner: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1600&q=80',
        genre: ['Action', 'Crime', 'Thriller'],
        language: ['English'],
        duration: 145,
        rating: 8.8,
        votes: 6200,
        releaseDate: new Date('2027-08-15'),
        trailerUrl: 'https://www.youtube.com/watch?v=mqqft2x_Aa4',
        status: 'upcoming',
        certification: 'UA 16+',
        featured: false,
      },
      {
        title: 'Top Gun: Maverick',
        description: 'After thirty years, Maverick is still pushing the envelope as a top naval aviator, but must confront ghosts of his past when he leads TOP GUN\'s elite graduates on a mission that demands the ultimate sacrifice from those chosen to fly it.',
        poster: 'https://images.unsplash.com/photo-1519074069444-1ba4ea16e879?auto=format&fit=crop&w=800&q=80',
        banner: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1600&q=80',
        genre: ['Action', 'Drama'],
        language: ['English', 'Hindi'],
        duration: 130,
        rating: 8.3,
        votes: 78500,
        releaseDate: new Date('2022-05-27'),
        trailerUrl: 'https://www.youtube.com/watch?v=giXco2jaZ_4',
        status: 'now_showing',
        certification: 'UA',
        featured: false,
      },
    ]);
    console.log(`[Seeder] Created ${movies.length} movies.`);

    console.log('[Seeder] Creating Showtimes for multiple dates...');
    const timeSlots = ['10:30 AM', '02:00 PM', '06:15 PM', '09:30 PM'];
    const showDocs = [];

    // Schedule shows for today and the next 4 days
    for (let dayOffset = 0; dayOffset <= 4; dayOffset++) {
      const showDate = getFormattedDate(dayOffset);

      // Only schedule shows for 'now_showing' movies
      const nowShowingMovies = movies.filter((m) => m.status === 'now_showing');

      for (let i = 0; i < nowShowingMovies.length; i++) {
        const movie = nowShowingMovies[i];
        // Distribute across theatres
        const theatre = theatres[i % theatres.length];
        const screen = theatre.screens[i % theatre.screens.length];
        const basePrice = 220 + (i % 3) * 40; // 220, 260, 300

        // Create 2 showtimes per movie per day
        const selectedTimes = [timeSlots[i % timeSlots.length], timeSlots[(i + 2) % timeSlots.length]];

        for (const time of selectedTimes) {
          const seats = generateSeatLayout(basePrice);

          // Simulate some pre-booked seats for realism on today's shows
          if (dayOffset === 0 && (i === 0 || i === 1)) {
            ['C3', 'C4', 'D5', 'D6', 'A4'].forEach((seatNum) => {
              const seat = seats.find((s) => s.seatNumber === seatNum);
              if (seat) {
                seat.isBooked = true;
                seat.bookedBy = demoUser2._id;
              }
            });
          }

          showDocs.push({
            movieId: movie._id,
            theatreId: theatre._id,
            screen: screen.name,
            showDate,
            showTime: time,
            ticketPrice: basePrice,
            seats,
          });
        }
      }
    }

    const createdShows = await Show.create(showDocs);
    console.log(`[Seeder] Created ${createdShows.length} scheduled shows with seat layouts.`);

    // Seed a sample booking for Rahul Sharma (demo user)
    console.log('[Seeder] Creating sample booking history for demo user...');
    const sampleShow = createdShows[0];
    const sampleMovie = movies.find((m) => m._id.equals(sampleShow.movieId));
    const sampleTheatre = theatres.find((t) => t._id.equals(sampleShow.theatreId));

    // Mark seats booked on that show
    sampleShow.seats.forEach((seat) => {
      if (seat.seatNumber === 'B3' || seat.seatNumber === 'B4') {
        seat.isBooked = true;
        seat.bookedBy = demoUser._id;
      }
    });
    await sampleShow.save();

    await Booking.create({
      userId: demoUser._id,
      showId: sampleShow._id,
      movieId: sampleMovie._id,
      theatreId: sampleTheatre._id,
      selectedSeats: ['B3', 'B4'],
      seatDetails: [
        { seatNumber: 'B3', category: 'VIP', price: sampleShow.ticketPrice + 100 },
        { seatNumber: 'B4', category: 'VIP', price: sampleShow.ticketPrice + 100 },
      ],
      totalAmount: (sampleShow.ticketPrice + 100) * 2 + 50,
      bookingReference: 'IMOV-VIP9821',
      bookingStatus: 'confirmed',
      paymentStatus: 'completed',
      paymentMethod: 'IMovies Instant Checkout',
      createdAt: new Date(),
    });

    console.log('[Seeder] Sample booking seeded successfully.');
    console.log('----------------------------------------------------');
    console.log('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('Demo Credentials:');
    console.log('   Admin: admin@imovies.com / Admin@123');
    console.log('   User:  user@imovies.com  / User@123');
    console.log('----------------------------------------------------');

    if (require.main === module) {
      process.exit(0);
    }
    return true;
  } catch (error) {
    console.error('[Seeder] Error during database seeding:', error);
    if (require.main === module) {
      process.exit(1);
    }
    throw error;
  }
};

if (require.main === module) {
  seedData();
}

module.exports = seedData;
