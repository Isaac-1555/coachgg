require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { supabaseAdmin } = require('./src/config/supabase');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [
        process.env.CORS_ORIGIN || 'https://your-app-name.vercel.app',
        /^https:\/\/.*\.vercel\.app$/,  // Allow all Vercel preview deployments
        /^https:\/\/coachgg.*\.vercel\.app$/  // Specific pattern for your app
      ]
    : ['http://localhost:5173', 'http://localhost:3000'], // Development origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with'],
  optionsSuccessStatus: 200 // For legacy browser support
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test Supabase connection
async function testSupabaseConnection() {
  try {
    // Simple connection test - try to query any table
    const { error } = await supabaseAdmin
      .from('users')
      .select('count')
      .limit(1);
    
    // PGRST116 = table doesn't exist, but connection works
    if (!error || error.code === 'PGRST116') {
      console.log('✅ Supabase connected successfully');
    } else {
      console.error('❌ Supabase connection error:', error);
    }
  } catch (err) {
    console.error('❌ Supabase connection failed:', err);
  }
}

// Import routes
const authRoutes = require('./src/routes/auth');
const storageRoutes = require('./src/routes/storage');

// Routes
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to CoachGG API!' });
});

// Auth routes
app.use('/api/auth', authRoutes);

// Storage routes
app.use('/api/storage', storageRoutes);

app.get('/api/health', async (req, res) => {
  try {
    // Test connection with a simple query
    const { error } = await supabaseAdmin
      .from('users')
      .select('count')
      .limit(1);
    
    // PGRST116 = table doesn't exist, but connection works
    const isConnected = !error || error.code === 'PGRST116';
    
    res.json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      database: isConnected ? 'Connected' : 'Error',
      supabase: 'Active'
    });
  } catch (err) {
    res.status(500).json({ 
      status: 'Error', 
      timestamp: new Date().toISOString(),
      database: 'Failed'
    });
  }
});

// Start server
async function startServer() {
  await testSupabaseConnection();
  
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);