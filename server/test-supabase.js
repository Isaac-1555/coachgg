const { supabaseAdmin } = require('./src/config/supabase');

async function testSupabase() {
  try {
    console.log('🔍 Testing Supabase connection...');
    
    // Test basic connection first
    const { error: connectionError } = await supabaseAdmin
      .from('users')
      .select('count')
      .limit(1);
    
    // PGRST116 = table doesn't exist, but connection works
    if (connectionError && connectionError.code !== 'PGRST116') {
      console.error('❌ Supabase connection failed:', connectionError);
      return;
    }
    
    console.log('✅ Supabase connection successful!');
    
    // Test auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (authError) {
      console.error('❌ Auth test failed:', authError);
    } else {
      console.log(`✅ Auth working - ${authData.users.length} users found`);
    }
    
    // Check if our tables exist by trying to query them
    const expectedTables = ['users', 'teams', 'games', 'matches', 'achievements', 'calendar_events', 'team_members'];
    const existingTables = [];
    const missingTables = [];
    
    for (const table of expectedTables) {
      try {
        const { error } = await supabaseAdmin
          .from(table)
          .select('*')
          .limit(1);
        
        if (error && error.code === '42P01') {
          missingTables.push(table);
        } else {
          existingTables.push(table);
        }
      } catch (err) {
        missingTables.push(table);
      }
    }
    
    if (existingTables.length > 0) {
      console.log('✅ Existing tables:');
      existingTables.forEach(table => console.log(`  - ${table}`));
    }
    
    if (missingTables.length > 0) {
      console.log('⚠️  Missing tables (run the SQL scripts in Supabase dashboard):');
      missingTables.forEach(table => console.log(`  - ${table}`));
    } else {
      console.log('🎉 All required tables exist!');
      
      // Test games data if table exists
      const { data: games, error: gamesError } = await supabaseAdmin
        .from('games')
        .select('*');
      
      if (!gamesError && games.length > 0) {
        console.log('🎮 Games in database:');
        games.forEach(game => console.log(`  - ${game.name}: ${game.description}`));
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testSupabase();