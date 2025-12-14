import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gymapp';

// User Schema (matching your model)
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['admin', 'coach', 'client'], default: 'client' },
  image: String,
  isActive: { type: Boolean, default: true },
  physicalStats: {
    weight: Number,
    squat: Number,
    bench: Number,
  },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

const users = [
  // Admin
  {
    name: 'Admin GymCore',
    email: 'admin@gymcore.fr',
    password: 'admin123',
    role: 'admin',
    image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&h=200&fit=crop',
  },
  // Coaches
  {
    name: 'Thomas Dupont',
    email: 'thomas@gymcore.fr',
    password: 'coach123',
    role: 'coach',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&h=200&fit=crop',
  },
  {
    name: 'Marie Laurent',
    email: 'marie@gymcore.fr',
    password: 'coach123',
    role: 'coach',
    image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=200&h=200&fit=crop',
  },
  {
    name: 'Lucas Martin',
    email: 'lucas@gymcore.fr',
    password: 'coach123',
    role: 'coach',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop',
  },
  // Clients
  {
    name: 'Sophie Bernard',
    email: 'sophie@email.fr',
    password: 'client123',
    role: 'client',
    image: 'https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?w=200&h=200&fit=crop',
    physicalStats: { weight: 62, squat: 60, bench: 35 },
  },
  {
    name: 'Pierre Leroy',
    email: 'pierre@email.fr',
    password: 'client123',
    role: 'client',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    physicalStats: { weight: 85, squat: 140, bench: 100 },
  },
  {
    name: 'Emma Dubois',
    email: 'emma@email.fr',
    password: 'client123',
    role: 'client',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
    physicalStats: { weight: 58, squat: 80, bench: 40 },
  },
  {
    name: 'Antoine Moreau',
    email: 'antoine@email.fr',
    password: 'client123',
    role: 'client',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
    physicalStats: { weight: 78, squat: 120, bench: 85 },
  },
  {
    name: 'Camille Petit',
    email: 'camille@email.fr',
    password: 'client123',
    role: 'client',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    physicalStats: { weight: 55, squat: 70, bench: 30 },
  },
];

async function seedUsers() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    // Clear existing users
    await User.deleteMany({});
    console.log('🗑️  Utilisateurs existants supprimés');

    // Create users with hashed passwords
    for (const userData of users) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      await User.create({
        ...userData,
        password: hashedPassword,
      });
      console.log(`👤 Créé: ${userData.name} (${userData.role})`);
    }

    console.log('\n✅ Seed des utilisateurs terminé!');
    console.log('\n📋 Identifiants de connexion:');
    console.log('   Admin:  admin@gymcore.fr / admin123');
    console.log('   Coach:  thomas@gymcore.fr / coach123');
    console.log('   Client: sophie@email.fr / client123');

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Déconnecté de MongoDB');
  }
}

seedUsers();
