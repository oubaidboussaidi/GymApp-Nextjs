// MongoDB Seed Script for GymApp
// Run with: mongosh mongodb://localhost:27017/gym-app seed-mongo.js

// Switch to the gym-app database
db = db.getSiblingDB('gym-app');

// Clear existing data
print('Clearing existing data...');
db.users.deleteMany({});
db.programs.deleteMany({});
db.enrollments.deleteMany({});
print('Cleared all collections.');

// Create users
print('Creating users...');

// Admin user
const admin = {
  name: 'Admin User',
  email: 'admin@gymcore.com',
  password: '$2b$10$9MTayDYQ9RjD8B9daUwuQ.sTA3jJGe/iqz.d1FOuryPaZC9focnMS',
  role: 'admin',
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
};
db.users.insertOne(admin);
print('✓ Created Admin: ' + admin.email + ' (password: admin123)');

// Coach user
const coach = {
  name: 'Coach Carter',
  email: 'coach@gymcore.com',
  password: '$2b$10$bvEMANugEYGYU6aY5hND1umZ0jormrCgLK8tEzmig3OXhy16bOKgu',
  role: 'coach',
  image: '/uploads/coach-avatar.png',
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
};
const coachResult = db.users.insertOne(coach);
const coachId = coachResult.insertedId;
print('✓ Created Coach: ' + coach.email + ' (password: coach123)');

// Client user
const client = {
  name: 'John Client',
  email: 'user@gymcore.com',
  password: '$2b$10$hQIi5bOy6nafsMzKqz.F7eKSFKrN5Sbi/FLm2r68.bRRDEVh38a5.',
  role: 'client',
  age: 25,
  isActive: true,
  physicalStats: {
    weight: 75,
    squat: 100,
    bench: 80
  },
  createdAt: new Date(),
  updatedAt: new Date()
};
db.users.insertOne(client);
print('✓ Created Client: ' + client.email + ' (password: user123)');

// Create a sample program for the coach
print('Creating sample program...');
const program = {
  title: 'Beginner Strength',
  description: 'A starting point for new lifters.',
  level: 'Beginner',
  coachId: coachId,
  exercises: [
    { name: 'Squat', sets: 3, reps: 5 },
    { name: 'Bench Press', sets: 3, reps: 5 },
    { name: 'Deadlift', sets: 1, reps: 5 }
  ],
  createdAt: new Date(),
  updatedAt: new Date()
};
db.programs.insertOne(program);
print('✓ Created Program: ' + program.title);

print('\n===========================================');
print('Database seeding completed successfully! 🎉');
print('===========================================');
print('\nLogin credentials:');
print('Admin:  admin@gymcore.com / admin123');
print('Coach:  coach@gymcore.com / coach123');
print('Client: user@gymcore.com / user123');
print('===========================================\n');
