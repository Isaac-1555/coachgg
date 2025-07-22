require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Allow requests from your React client
app.use(express.json()); // To parse JSON bodies
app.use(express.urlencoded({ extended: true }));

// Simple test route
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to CoachGG API!' });
});

// TODO: Add your API routes from ./src/routes here

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});