const mongoose = require('mongoose');

const ChallengeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    durationDays: { type: Number, default: 7 },
    badgeAwarded: { type: String, required: true }
});

module.exports = mongoose.model('Challenge', ChallengeSchema);