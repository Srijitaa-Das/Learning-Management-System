require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth-routes');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Ensure MONGO_URI is defined
if (!MONGO_URI) {
    console.error('Error: MONGO_URI is not defined. Please add it to your .env file.');
    process.exit(1);
}

// Configure CORS middleware
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5000", // Ensure correct frontend URL
    credentials: true,
    methods: ["GET", "PUT", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));


// Parse incoming JSON requests
app.use(express.json());

// Connect to MongoDB
mongoose.connect(MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err.message);
        process.exit(1); // Exit the process if connection fails
    });

app.use(cors());
//routes configuration
app.use('/auth', authRoutes);

// Example route (optional, for testing)
app.get('/', (req, res) => {
    res.send('API is running...');
});

app.post("/auth/register", async (req, res) => {
    try {
        const { userName, userEmail, password } = req.body;
        
        // Your logic to create a new user...
        
        res.status(201).json({ success: true, message: "User registered successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
