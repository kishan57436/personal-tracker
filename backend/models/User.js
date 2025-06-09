const mongoose = require('mongoose');

const UserChallengeSchema = new mongoose.Schema({
    challengeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge' },
    startDate: { type: Date, default: Date.now },
    completed: { type: Boolean, default: false },
    // A simple log for daily check-ins
    progressLog: [{ date: Date, completed: Boolean }], 
});

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    username: { type: String, required: true },
    lifestyleScore: { type: Number, default: 0 },
    joinedChallenges: [UserChallengeSchema],
    badges: [{ type: String }], // e.g., ["HydrationHero", "MindfulMornings"]
    surveyTaken: { type: Boolean, default: false }
});

module.exports = mongoose.model('User', UserSchema);