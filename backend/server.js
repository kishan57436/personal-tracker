const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Body parser

// DB Config
const db = process.env.MONGO_URI;

// Connect to MongoDB
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

// Define Routes


app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/challenges', require('./routes/challenges'));

// Simple script to pre-populate challenges
const Challenge = require('./models/Challenge');
const seedChallenges = async () => {
    const count = await Challenge.countDocuments();
    if (count === 0) {
        console.log("Seeding challenges...");
        await Challenge.create([
            { title: '7-Day Hydration', description: 'Drink 8 glasses of water every day for a week.', durationDays: 7, badgeAwarded: 'HydrationHero' },
            { title: 'Mindful Morning', description: 'Spend 10 minutes without screens after waking up.', durationDays: 7, badgeAwarded: 'MindfulMornings' }
        ]);
    }
};
seedChallenges();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));