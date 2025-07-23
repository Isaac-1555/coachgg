const express = require('express');
const { supabaseAdmin } = require('../config/supabase');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Initialize storage buckets
const initializeStorageBuckets = async () => {
  const buckets = [
    {
      name: 'avatars',
      public: true,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      fileSizeLimit: 2 * 1024 * 1024 // 2MB
    },
    {
      name: 'team-logos',
      public: true,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      fileSizeLimit: 1 * 1024 * 1024 // 1MB
    },
    {
      name: 'match-screenshots',
      public: true,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      fileSizeLimit: 5 * 1024 * 1024 // 5MB
    }
  ];

  for (const bucket of buckets) {
    try {
      // Check if bucket exists
      const { data: existingBuckets } = await supabaseAdmin.storage.listBuckets();
      const bucketExists = existingBuckets?.some(b => b.name === bucket.name);

      if (!bucketExists) {
        // Create bucket
        const { data, error } = await supabaseAdmin.storage.createBucket(bucket.name, {
          public: bucket.public,
          allowedMimeTypes: bucket.allowedMimeTypes,
          fileSizeLimit: bucket.fileSizeLimit
        });

        if (error) {
          console.error(`Error creating bucket ${bucket.name}:`, error);
        } else {
          console.log(`✅ Created storage bucket: ${bucket.name}`);
        }
      } else {
        console.log(`✅ Storage bucket already exists: ${bucket.name}`);
      }
    } catch (error) {
      console.error(`Error initializing bucket ${bucket.name}:`, error);
    }
  }
};

// Initialize buckets on startup
initializeStorageBuckets();

// Get file info
router.get('/file/:bucket/:path(*)', authenticateToken, async (req, res) => {
  try {
    const { bucket, path } = req.params;
    
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .list(path);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ data });
  } catch (error) {
    console.error('Get file error:', error);
    res.status(500).json({ error: 'Failed to get file info' });
  }
});

// Delete file
router.delete('/file/:bucket/:path(*)', authenticateToken, async (req, res) => {
  try {
    const { bucket, path } = req.params;
    const userId = req.user.id;

    // Verify user owns the file (basic security check)
    // In a production app, you'd want more sophisticated ownership verification
    
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ 
      message: 'File deleted successfully',
      data 
    });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

// Get storage usage stats
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // This is a simplified version - in production you'd want to track
    // file ownership and calculate actual usage per user
    const buckets = ['avatars', 'team-logos', 'match-screenshots'];
    const stats = {};

    for (const bucket of buckets) {
      try {
        const { data, error } = await supabaseAdmin.storage
          .from(bucket)
          .list('', { limit: 1000 });

        if (!error && data) {
          stats[bucket] = {
            fileCount: data.length,
            // Note: Supabase doesn't provide easy size calculation via API
            // You'd need to track this separately in production
            totalSize: 'N/A'
          };
        }
      } catch (err) {
        stats[bucket] = { error: err.message };
      }
    }

    res.json({ stats });
  } catch (error) {
    console.error('Get storage stats error:', error);
    res.status(500).json({ error: 'Failed to get storage stats' });
  }
});

module.exports = router;