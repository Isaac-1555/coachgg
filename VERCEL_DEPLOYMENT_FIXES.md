# Vercel Deployment Fixes for CoachGG

This document outlines all the changes required to successfully deploy the CoachGG application on Vercel. The current deployment is failing due to several configuration and code issues that need to be addressed.

## Table of Contents
1. [Critical Configuration Issues](#critical-configuration-issues)
2. [File Structure and Extension Problems](#file-structure-and-extension-problems)
3. [Build Process Fixes](#build-process-fixes)
4. [Environment Variables Setup](#environment-variables-setup)
5. [Server Configuration Changes](#server-configuration-changes)
6. [Import and Module Resolution Fixes](#import-and-module-resolution-fixes)
7. [Performance Optimizations](#performance-optimizations)
8. [Step-by-Step Implementation Guide](#step-by-step-implementation-guide)

## Critical Configuration Issues

### 1. Fix vercel.json Configuration

**Current Issue:** The vercel.json file has incorrect build configuration that prevents proper deployment.

**Current Code:**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "client/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    },
    {
      "src": "server/server.js",
      "use": "@vercel/node"
    }
  ]
}
```

**Required Fix:**
Replace the entire vercel.json file with:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "client/**",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "client/dist",
        "buildCommand": "cd client && npm install && npm run build"
      }
    },
    {
      "src": "server/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "/client/$1"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  },
  "functions": {
    "server/server.js": {
      "maxDuration": 30
    }
  }
}
```

### 2. Root Package.json Build Scripts

**Current Issue:** Missing proper build commands for Vercel deployment.

**Required Changes:**
Update the root `package.json` scripts section:
```json
{
  "scripts": {
    "server": "npm run dev --prefix server",
    "client": "npm run dev --prefix client",
    "dev": "concurrently \"npm run server\" \"npm run client\"",
    "build": "cd client && npm install && npm run build",
    "vercel-build": "npm run build",
    "start": "node server/server.js"
  }
}
```

## File Structure and Extension Problems

### 1. React Component File Extensions

**Current Issue:** Many React components use `.js` extension but contain JSX syntax, which can cause build failures in production.

**Files to Rename from .js to .jsx:**

1. `client/src/components/Dashboard.js` → `client/src/components/Dashboard.jsx`
2. `client/src/components/LandingPage.js` → `client/src/components/LandingPage.jsx`
3. `client/src/components/Sidebar.js` → `client/src/components/Sidebar.jsx`
4. `client/src/components/AuthForm.js` → `client/src/components/AuthForm.jsx`
5. `client/src/components/AchievementManager.js` → `client/src/components/AchievementManager.jsx`
6. `client/src/components/AchievementDisplay.js` → `client/src/components/AchievementDisplay.jsx`
7. `client/src/components/AchievementNotification.js` → `client/src/components/AchievementNotification.jsx`
8. `client/src/components/Calendar.js` → `client/src/components/Calendar.jsx`
9. `client/src/components/CoachingNotes.js` → `client/src/components/CoachingNotes.jsx`
10. `client/src/components/FileUpload.js` → `client/src/components/FileUpload.jsx`
11. `client/src/components/MatchList.js` → `client/src/components/MatchList.jsx`
12. `client/src/components/PlayerOverview.js` → `client/src/components/PlayerOverview.jsx`
13. `client/src/components/StatsCards.js` → `client/src/components/StatsCards.jsx`
14. `client/src/components/TeamCard.js` → `client/src/components/TeamCard.jsx`
15. `client/src/components/TeamDetails.js` → `client/src/components/TeamDetails.jsx`

**Tab Components:**
1. `client/src/components/tabs/Overview.js` → `client/src/components/tabs/Overview.jsx`
2. `client/src/components/tabs/SoloTracker.js` → `client/src/components/tabs/SoloTracker.jsx`
3. `client/src/components/tabs/TeamManagement.js` → `client/src/components/tabs/TeamManagement.jsx`
4. `client/src/components/tabs/Calendar.js` → `client/src/components/tabs/Calendar.jsx`
5. `client/src/components/tabs/ManagerDashboard.js` → `client/src/components/tabs/ManagerDashboard.jsx`
6. `client/src/components/tabs/AICoach.js` → `client/src/components/tabs/AICoach.jsx`
7. `client/src/components/tabs/AdvancedCharts.js` → `client/src/components/tabs/AdvancedCharts.jsx`
8. `client/src/components/tabs/Settings.js` → `client/src/components/tabs/Settings.jsx`

**Modal Components:**
1. `client/src/components/modals/AddMatchModal.js` → `client/src/components/modals/AddMatchModal.jsx`
2. `client/src/components/modals/AddNoteModal.js` → `client/src/components/modals/AddNoteModal.jsx`
3. `client/src/components/modals/CreateEventModal.js` → `client/src/components/modals/CreateEventModal.jsx`
4. `client/src/components/modals/CreateTeamModal.js` → `client/src/components/modals/CreateTeamModal.jsx`
5. `client/src/components/modals/JoinTeamModal.js` → `client/src/components/modals/JoinTeamModal.jsx`

**Chart Components:**
1. `client/src/components/charts/ChartControls.js` → `client/src/components/charts/ChartControls.jsx`
2. `client/src/components/charts/CoachingEffectivenessChart.js` → `client/src/components/charts/CoachingEffectivenessChart.jsx`
3. `client/src/components/charts/EnhancedWinRateChart.js` → `client/src/components/charts/EnhancedWinRateChart.jsx`
4. `client/src/components/charts/GameDistributionChart.js` → `client/src/components/charts/GameDistributionChart.jsx`
5. `client/src/components/charts/ManagerTeamComparisonChart.js` → `client/src/components/charts/ManagerTeamComparisonChart.jsx`
6. `client/src/components/charts/MemberPerformanceChart.js` → `client/src/components/charts/MemberPerformanceChart.jsx`
7. `client/src/components/charts/PerformanceChart.js` → `client/src/components/charts/PerformanceChart.jsx`
8. `client/src/components/charts/PerformanceHeatmap.js` → `client/src/components/charts/PerformanceHeatmap.jsx`
9. `client/src/components/charts/PlayerPerformanceTrendChart.js` → `client/src/components/charts/PlayerPerformanceTrendChart.jsx`
10. `client/src/components/charts/SkillRadarChart.js` → `client/src/components/charts/SkillRadarChart.jsx`
11. `client/src/components/charts/TeamActivityOverviewChart.js` → `client/src/components/charts/TeamActivityOverviewChart.jsx`
12. `client/src/components/charts/TeamGameDistributionChart.js` → `client/src/components/charts/TeamGameDistributionChart.jsx`
13. `client/src/components/charts/TeamVsIndividualChart.js` → `client/src/components/charts/TeamVsIndividualChart.jsx`
14. `client/src/components/charts/TeamWinRateChart.js` → `client/src/components/charts/TeamWinRateChart.jsx`
15. `client/src/components/charts/WinRateChart.js` → `client/src/components/charts/WinRateChart.jsx`

### 2. Update Import Statements

**After renaming files, update all import statements throughout the codebase:**

**In `client/src/App.jsx`:**
```javascript
// Change from:
import LandingPage from './components/LandingPage';
import AuthForm from './components/AuthForm';
import Dashboard from './components/Dashboard';

// To:
import LandingPage from './components/LandingPage.jsx';
import AuthForm from './components/AuthForm.jsx';
import Dashboard from './components/Dashboard.jsx';
```

**In `client/src/components/Dashboard.jsx`:**
```javascript
// Change from:
import Sidebar from './Sidebar';
import Overview from './tabs/Overview';
import SoloTracker from './tabs/SoloTracker';
// ... etc

// To:
import Sidebar from './Sidebar.jsx';
import Overview from './tabs/Overview.jsx';
import SoloTracker from './tabs/SoloTracker.jsx';
// ... etc
```

**Note:** This pattern needs to be applied to ALL import statements that reference the renamed files.

## Build Process Fixes

### 1. Client Package.json Updates

**Current Issue:** Build configuration may not work properly with Vercel.

**Required Changes in `client/package.json`:**
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build --outDir dist",
    "lint": "eslint .",
    "preview": "vite preview",
    "build:production": "NODE_ENV=production vite build --outDir dist"
  }
}
```

### 2. Vite Configuration Updates

**Current Issue:** Vite config needs optimization for production builds.

**Required Changes in `client/vite.config.js`:**
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['chart.js', 'react-chartjs-2', 'chartjs-plugin-zoom'],
          supabase: ['@supabase/supabase-js'],
          icons: ['@tabler/icons-react'],
          utils: ['html2canvas', 'jspdf']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false
      }
    }
  },
  preview: {
    port: 4173
  },
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.[jt]sx?$/,
    exclude: []
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx'
      }
    }
  }
})
```

## Environment Variables Setup

### 1. Vercel Dashboard Configuration

**Required Environment Variables to set in Vercel Dashboard:**

**Client Variables (VITE_ prefix required):**
- `VITE_SUPABASE_URL` = Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` = Your Supabase anonymous key
- `VITE_OPENROUTER_API_KEY` = Your OpenRouter API key

**Server Variables:**
- `SUPABASE_URL` = Your Supabase project URL (same as client)
- `SUPABASE_SERVICE_ROLE_KEY` = Your Supabase service role key
- `JWT_SECRET` = A secure random string for JWT signing
- `NODE_ENV` = production

### 2. Environment Files Update

**Update `client/.env.example`:**
```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# OpenRouter Configuration (for AI Coach)
VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here
```

**Update `server/.env.example`:**
```env
PORT=3001
NODE_ENV=production

# Supabase Configuration (for backend)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random

# CORS Configuration
CORS_ORIGIN=https://your-app-name.vercel.app
```

## Server Configuration Changes

### 1. Server Export for Vercel Functions

**Current Issue:** Server needs proper export for Vercel serverless functions.

**Required Changes in `server/server.js`:**

Add at the end of the file:
```javascript
// Export for Vercel
module.exports = app;
```

### 2. CORS Configuration Update

**Current Issue:** CORS might not work properly in production.

**Required Changes in `server/server.js`:**
```javascript
// Update CORS configuration
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
```

### 3. Server Package.json Updates

**Required Changes in `server/package.json`:**
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test-supabase": "node test-supabase.js",
    "build": "echo 'No build step needed for Node.js'",
    "vercel-build": "echo 'Server ready for deployment'",
    "postinstall": "echo 'Server dependencies installed'"
  }
}
```

## Import and Module Resolution Fixes

### 1. Fix Relative Import Paths

**Current Issue:** Some imports may fail due to missing file extensions.

**Required Pattern for All Imports:**
```javascript
// Instead of:
import Component from './Component';

// Use:
import Component from './Component.jsx';

// For utility files:
import { helper } from '../utils/helper.js';

// For config files:
import { supabase } from '../config/supabase.js';
```

### 2. Dynamic Imports for Heavy Dependencies

**Current Issue:** Large dependencies like html2canvas and jsPDF can cause build timeouts.

**Required Changes in `client/src/utils/chartExport.js`:**
```javascript
// Replace static imports with dynamic imports
export const exportChart = async (chartRef, format = 'png', filename = 'chart') => {
  if (!chartRef || !chartRef.current) {
    throw new Error('Chart reference not found');
  }

  try {
    // Dynamic import for html2canvas
    const html2canvas = (await import('html2canvas')).default;
    
    const canvas = await html2canvas(chartRef.current, {
      backgroundColor: '#0D0D0D',
      scale: 2,
      logging: false,
      useCORS: true
    });

    switch (format.toLowerCase()) {
      case 'png':
        return downloadPNG(canvas, filename);
      case 'jpg':
      case 'jpeg':
        return downloadJPEG(canvas, filename);
      case 'pdf':
        return downloadPDF(canvas, filename);
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  } catch (error) {
    console.error('Export failed:', error);
    throw error;
  }
};

const downloadPDF = async (canvas, filename) => {
  // Dynamic import for jsPDF
  const { jsPDF } = await import('jspdf');
  
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // ... rest of PDF logic
};
```

## Performance Optimizations

### 1. Bundle Size Optimization

**Add to `client/vite.config.js`:**
```javascript
export default defineConfig({
  // ... existing config
  build: {
    // ... existing build config
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['chart.js', 'react-chartjs-2', 'chartjs-plugin-zoom'],
          supabase: ['@supabase/supabase-js'],
          icons: ['@tabler/icons-react'],
          utils: ['html2canvas', 'jspdf'],
          mantine: ['@mantine/core', '@mantine/hooks']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})
```

### 2. Code Splitting for Routes

**If using React Router, implement lazy loading:**
```javascript
// In main routing file
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./components/Dashboard.jsx'));
const LandingPage = lazy(() => import('./components/LandingPage.jsx'));

// Wrap with Suspense
<Suspense fallback={<div>Loading...</div>}>
  <Dashboard />
</Suspense>
```

## Step-by-Step Implementation Guide

### Phase 1: File Structure Changes
1. Rename all React component files from `.js` to `.jsx`
2. Update all import statements to include file extensions
3. Test locally that all imports still work

### Phase 2: Configuration Updates
1. Update `vercel.json` with new configuration
2. Update root `package.json` scripts
3. Update `client/package.json` scripts
4. Update `client/vite.config.js`

### Phase 3: Server Changes
1. Add module export to `server/server.js`
2. Update CORS configuration
3. Update `server/package.json` scripts

### Phase 4: Environment Setup
1. Set all required environment variables in Vercel dashboard
2. Update `.env.example` files
3. Test environment variable access

### Phase 5: Performance Optimizations
1. Implement dynamic imports for heavy dependencies
2. Update bundle splitting configuration
3. Test build size and performance

### Phase 6: Testing and Deployment
1. Test build locally: `npm run build`
2. Test preview locally: `npm run preview`
3. Deploy to Vercel
4. Monitor deployment logs for any remaining issues

## Common Deployment Errors and Solutions

### Error: "Module not found"
**Solution:** Check that all import paths include proper file extensions and correct casing.

### Error: "Build timeout"
**Solution:** Implement dynamic imports for large dependencies and optimize bundle splitting.

### Error: "Function timeout"
**Solution:** Increase maxDuration in vercel.json functions configuration.

### Error: "Environment variables not found"
**Solution:** Ensure all variables are set in Vercel dashboard with correct names and VITE_ prefix for client variables.

### Error: "CORS policy error"
**Solution:** Update CORS configuration in server to include your Vercel domain.

## Verification Checklist

Before deploying, verify:
- [ ] All React components renamed to `.jsx`
- [ ] All imports updated with file extensions
- [ ] `vercel.json` updated with correct configuration
- [ ] All package.json scripts updated
- [ ] Server exports module properly
- [ ] Environment variables set in Vercel dashboard
- [ ] Local build works: `npm run build`
- [ ] Local preview works: `npm run preview`
- [ ] No console errors in development
- [ ] All dependencies properly installed

## Post-Deployment Testing

After successful deployment:
1. Test user registration and login
2. Test match creation and tracking
3. Test team creation and management
4. Test AI Coach functionality
5. Test file uploads (avatars, team logos)
6. Test chart exports
7. Test all navigation and routing
8. Test responsive design on mobile
9. Monitor Vercel function logs for errors
10. Test performance and loading times

This comprehensive guide should resolve all deployment issues and ensure successful deployment to Vercel.