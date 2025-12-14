import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../src/models/User';
import Program from '../src/models/Program';
import Enrollment from '../src/models/Enrollment';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gym-app';

async function seed() {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined');
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Program.deleteMany({});
    await Enrollment.deleteMany({});
    console.log('Cleared existing data');

    // Create Admin
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@gymcore.com',
      password: adminPassword,
      role: 'admin',
    });
    console.log('Created Admin:', admin.email);

    // Create Coach
    const coachPassword = await bcrypt.hash('coach123', 10);
    const coach = await User.create({
      name: 'Coach Carter',
      email: 'coach@gymcore.com',
      password: coachPassword,
      role: 'coach',
      image: '/uploads/coach-avatar.png', // Placeholder
    });
    console.log('Created Coach:', coach.email);

    // Create a sample Program for the Coach
    const program = await Program.create({
      title: 'Beginner Strength',
      description: 'A starting point for new lifters.',
      level: 'Beginner',
      coachId: coach._id,
      exercises: [
        { name: 'Squat', sets: 3, reps: 5 },
        { name: 'Bench Press', sets: 3, reps: 5 },
        { name: 'Deadlift', sets: 1, reps: 5 },
      ],
    });
    console.log('Created Program:', program.title);

    console.log('Seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
