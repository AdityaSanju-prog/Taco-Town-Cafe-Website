require('dotenv').config();
const mongoose = require('mongoose');
const seedData = require('./seedData');

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    const count = await seedData();
    console.log(`✅ Seeded ${count} menu items!`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

run();
