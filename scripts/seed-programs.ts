import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gymapp';

// Schemas
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

const programSchema = new mongoose.Schema({
  title: String,
  description: String,
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  image: String,
  coachId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  exercises: [{
    name: String,
    sets: Number,
    reps: Number,
  }],
  averageRating: { type: Number, default: 0 },
  totalEnrollments: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const enrollmentSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  programId: { type: mongoose.Schema.Types.ObjectId, ref: 'Program' },
  status: { type: String, enum: ['active', 'completed', 'paused'], default: 'active' },
  progress: { type: Number, default: 0 },
  joinedAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
const Program = mongoose.models.Program || mongoose.model('Program', programSchema);
const Enrollment = mongoose.models.Enrollment || mongoose.model('Enrollment', enrollmentSchema);

// Real gym programs with Unsplash images
const programs = [
  // Coach 1 - Thomas (Force & Musculation)
  {
    coachEmail: 'thomas@gymcore.fr',
    programs: [
      {
        title: 'Force Maximale - PPL',
        description: 'Programme Push/Pull/Legs axé sur le développement de la force pure. Idéal pour progresser sur les mouvements fondamentaux comme le squat, le développé couché et le soulevé de terre.',
        level: 'Advanced',
        image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop',
        exercises: [
          { name: 'Squat barre', sets: 5, reps: 5 },
          { name: 'Développé couché', sets: 5, reps: 5 },
          { name: 'Soulevé de terre', sets: 5, reps: 5 },
          { name: 'Rowing barre', sets: 4, reps: 6 },
          { name: 'Développé militaire', sets: 4, reps: 6 },
        ],
      },
      {
        title: 'Hypertrophie Full Body',
        description: 'Programme complet pour le développement musculaire. Entraînement du corps entier 3 fois par semaine avec un focus sur le volume et la tension mécanique.',
        level: 'Intermediate',
        image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&h=600&fit=crop',
        exercises: [
          { name: 'Squat goblet', sets: 4, reps: 12 },
          { name: 'Développé haltères', sets: 4, reps: 10 },
          { name: 'Tractions', sets: 3, reps: 8 },
          { name: 'Fentes marchées', sets: 3, reps: 12 },
          { name: 'Curl biceps', sets: 3, reps: 12 },
          { name: 'Extensions triceps', sets: 3, reps: 12 },
        ],
      },
      {
        title: 'Débutant - Fondamentaux',
        description: 'Programme d\'initiation à la musculation. Apprenez les mouvements de base avec une technique parfaite avant de progresser vers des charges plus lourdes.',
        level: 'Beginner',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
        exercises: [
          { name: 'Squat au poids du corps', sets: 3, reps: 15 },
          { name: 'Pompes (genoux si nécessaire)', sets: 3, reps: 10 },
          { name: 'Rowing haltère', sets: 3, reps: 12 },
          { name: 'Planche', sets: 3, reps: 30 },
          { name: 'Gainage latéral', sets: 2, reps: 20 },
        ],
      },
    ],
  },
  // Coach 2 - Marie (Fitness & Cardio)
  {
    coachEmail: 'marie@gymcore.fr',
    programs: [
      {
        title: 'HIIT Brûle-Graisses',
        description: 'Entraînement par intervalles haute intensité pour maximiser la dépense calorique. Séances de 30 minutes ultra efficaces pour perdre du gras tout en préservant le muscle.',
        level: 'Intermediate',
        image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=600&fit=crop',
        exercises: [
          { name: 'Burpees', sets: 4, reps: 15 },
          { name: 'Mountain climbers', sets: 4, reps: 30 },
          { name: 'Jump squats', sets: 4, reps: 20 },
          { name: 'Jumping jacks', sets: 4, reps: 40 },
          { name: 'Planche dynamique', sets: 4, reps: 20 },
        ],
      },
      {
        title: 'Tonification Corps Entier',
        description: 'Programme complet de remise en forme pour sculpter votre silhouette. Combine exercices de tonification et cardio léger pour des résultats visibles.',
        level: 'Beginner',
        image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=600&fit=crop',
        exercises: [
          { name: 'Squats sumo', sets: 3, reps: 15 },
          { name: 'Pont fessier', sets: 3, reps: 20 },
          { name: 'Élévations latérales', sets: 3, reps: 12 },
          { name: 'Crunchs', sets: 3, reps: 20 },
          { name: 'Superman', sets: 3, reps: 15 },
        ],
      },
      {
        title: 'Abdos & Core Intense',
        description: 'Focus sur la sangle abdominale et le gainage. Développez un core solide pour améliorer votre posture et vos performances dans tous vos entraînements.',
        level: 'Intermediate',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
        exercises: [
          { name: 'Planche frontale', sets: 4, reps: 45 },
          { name: 'Russian twists', sets: 4, reps: 20 },
          { name: 'Leg raises', sets: 4, reps: 15 },
          { name: 'Dead bug', sets: 3, reps: 12 },
          { name: 'Planche latérale', sets: 3, reps: 30 },
        ],
      },
    ],
  },
  // Coach 3 - Lucas (CrossFit & Fonctionnel)
  {
    coachEmail: 'lucas@gymcore.fr',
    programs: [
      {
        title: 'CrossFit Fondations',
        description: 'Introduction au CrossFit avec les mouvements fondamentaux. Apprenez les techniques de base avant d\'affronter les WODs plus intenses.',
        level: 'Beginner',
        image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&h=600&fit=crop',
        exercises: [
          { name: 'Air squat', sets: 3, reps: 20 },
          { name: 'Push press', sets: 3, reps: 12 },
          { name: 'Kettlebell swing', sets: 3, reps: 15 },
          { name: 'Box step-ups', sets: 3, reps: 10 },
          { name: 'Rowing ergomètre', sets: 1, reps: 500 },
        ],
      },
      {
        title: 'WOD Performance',
        description: 'Entraînements CrossFit avancés pour améliorer votre condition physique globale. WODs variés pour ne jamais vous ennuyer.',
        level: 'Advanced',
        image: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&h=600&fit=crop',
        exercises: [
          { name: 'Thrusters', sets: 5, reps: 10 },
          { name: 'Pull-ups', sets: 5, reps: 10 },
          { name: 'Box jumps', sets: 5, reps: 15 },
          { name: 'Clean & Jerk', sets: 5, reps: 5 },
          { name: 'Double unders', sets: 5, reps: 50 },
        ],
      },
      {
        title: 'Mobilité & Récupération',
        description: 'Programme dédié à l\'amélioration de la mobilité et à la récupération active. Essentiel pour prévenir les blessures et optimiser vos performances.',
        level: 'Beginner',
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop',
        exercises: [
          { name: 'Étirement psoas', sets: 2, reps: 60 },
          { name: 'Foam rolling dos', sets: 2, reps: 60 },
          { name: 'Shoulder dislocates', sets: 3, reps: 15 },
          { name: 'Deep squat hold', sets: 3, reps: 45 },
          { name: 'Cat-cow stretch', sets: 3, reps: 10 },
        ],
      },
    ],
  },
];

async function seedPrograms() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    // Clear existing programs and enrollments
    await Program.deleteMany({});
    await Enrollment.deleteMany({});
    console.log('🗑️  Programmes et inscriptions existants supprimés');

    // Get all coaches and clients
    const coaches = await User.find({ role: 'coach' });
    const clients = await User.find({ role: 'client' });

    if (coaches.length === 0) {
      console.log('⚠️  Aucun coach trouvé. Exécutez d\'abord seed-users.ts');
      return;
    }

    let totalPrograms = 0;

    // Create programs for each coach
    for (const coachData of programs) {
      const coach = await User.findOne({ email: coachData.coachEmail });
      if (!coach) {
        console.log(`⚠️  Coach ${coachData.coachEmail} non trouvé`);
        continue;
      }

      for (const programData of coachData.programs) {
        const program = await Program.create({
          ...programData,
          coachId: coach._id,
          averageRating: Math.round((3.5 + Math.random() * 1.5) * 10) / 10,
          totalEnrollments: 0,
        });

        // Randomly enroll some clients
        const shuffledClients = clients.sort(() => 0.5 - Math.random());
        const enrollCount = Math.floor(Math.random() * 3) + 1;

        for (let i = 0; i < Math.min(enrollCount, shuffledClients.length); i++) {
          await Enrollment.create({
            studentId: shuffledClients[i]._id,
            programId: program._id,
            status: 'active',
            progress: Math.floor(Math.random() * 60),
          });
          await Program.findByIdAndUpdate(program._id, { $inc: { totalEnrollments: 1 } });
        }

        console.log(`📗 Créé: "${programData.title}" (${programData.level}) - ${enrollCount} inscriptions`);
        totalPrograms++;
      }
    }

    console.log(`\n✅ Seed des programmes terminé!`);
    console.log(`   ${totalPrograms} programmes créés`);
    console.log(`   Inscriptions aléatoires ajoutées`);

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Déconnecté de MongoDB');
  }
}

seedPrograms();
