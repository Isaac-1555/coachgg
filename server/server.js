require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { supabaseAdmin } = require('./src/config/supabase');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
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

// Routes
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to CoachGG API!' });
});

// Auth routes
app.use('/api/auth', authRoutes);

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