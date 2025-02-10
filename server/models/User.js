const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userName: { type: String, required: true, unique: true },
    userEmail: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "user" }
});

// ⬇️ Make sure the schema is defined before using it in mongoose.model()
const User = mongoose.model('User', userSchema);

module.exports = User; // ⬅️ Ensure this is correctly exported
