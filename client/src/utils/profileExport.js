// Profile Export Utility
// Generates a downloadable PDF profile for esports organizations

import jsPDF from 'jspdf';

export const generateProfilePDF = async (user, stats, matches, achievements) => {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let yPosition = 20;
    
    // Helper function to add text with automatic page breaks
    const addText = (text, x, y, options = {}) => {
      if (y > pageHeight - 20) {
        pdf.addPage();
        y = 20;
      }
      
      if (options.fontSize) pdf.setFontSize(options.fontSize);
      if (options.color) pdf.setTextColor(...options.color);
      if (options.style) pdf.setFont('helvetica', options.style);
      
      pdf.text(text, x, y);
      return y + (options.lineHeight || 7);
    };
    
    // Header Section
    pdf.setFontSize(24);
    pdf.setTextColor(57, 255, 20); // Neon green
    pdf.setFont('helvetica', 'bold');
    yPosition = addText(`${user.username} - Esports Profile`, 20, yPosition, { fontSize: 24, color: [57, 255, 20], style: 'bold', lineHeight: 10 });
    
    pdf.setFontSize(12);
    pdf.setTextColor(100, 100, 100); // Gray
    pdf.setFont('helvetica', 'normal');
    yPosition = addText('Professional Gaming Performance Report', 20, yPosition, { fontSize: 12, color: [100, 100, 100], lineHeight: 10 });
    
    yPosition += 5;
    
    // Player Information Section
    pdf.setFontSize(16);
    pdf.setTextColor(0, 0, 0); // Black
    pdf.setFont('helvetica', 'bold');
    yPosition = addText('PLAYER INFORMATION', 20, yPosition, { fontSize: 16, style: 'bold', lineHeight: 10 });
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    yPosition = addText(`Player Name: ${user.username}`, 20, yPosition, { fontSize: 10, lineHeight: 6 });
    yPosition = addText(`Role: ${user.role || 'Player'}`, 20, yPosition, { fontSize: 10, lineHeight: 6 });
    yPosition = addText(`Profile Created: ${new Date(user.created_at).toLocaleDateString()}`, 20, yPosition, { fontSize: 10, lineHeight: 6 });
    yPosition = addText(`Report Generated: ${new Date().toLocaleDateString()}`, 20, yPosition, { fontSize: 10, lineHeight: 6 });
    
    if (user.bio) {
      yPosition = addText(`Bio: ${user.bio}`, 20, yPosition, { fontSize: 10, lineHeight: 6 });
    }
    
    yPosition += 10;
    
    // Performance Statistics Section
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    yPosition = addText('PERFORMANCE STATISTICS', 20, yPosition, { fontSize: 16, style: 'bold', lineHeight: 10 });
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    yPosition = addText(`Total Matches Played: ${stats.totalMatches}`, 20, yPosition, { fontSize: 10, lineHeight: 6 });
    yPosition = addText(`Overall Win Rate: ${stats.winRate}%`, 20, yPosition, { fontSize: 10, lineHeight: 6 });
    yPosition = addText(`Wins: ${stats.wins} | Losses: ${stats.losses}`, 20, yPosition, { fontSize: 10, lineHeight: 6 });
    yPosition = addText(`Current Win Streak: ${stats.currentStreak}`, 20, yPosition, { fontSize: 10, lineHeight: 6 });
    yPosition = addText(`Estimated Hours Played: ${stats.hoursPlayed}`, 20, yPosition, { fontSize: 10, lineHeight: 6 });
    
    yPosition += 10;
    
    // Game Performance Breakdown
    if (matches.length > 0) {
      const gameStats = calculateGameStats(matches);
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      yPosition = addText('GAME PERFORMANCE BREAKDOWN', 20, yPosition, { fontSize: 16, style: 'bold', lineHeight: 10 });
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      Object.entries(gameStats).forEach(([game, data]) => {
        yPosition = addText(`${game}: ${data.wins}W/${data.losses}L (${data.winRate}% win rate)`, 25, yPosition, { fontSize: 10, lineHeight: 6 });
      });
      
      yPosition += 10;
    }
    
    // Recent Performance Analysis
    if (matches.length >= 5) {
      const recentMatches = matches.slice(0, 10);
      const recentWinRate = (recentMatches.filter(m => m.result === 'win').length / recentMatches.length * 100).toFixed(1);
      
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      yPosition = addText('RECENT PERFORMANCE ANALYSIS', 20, yPosition, { fontSize: 16, style: 'bold', lineHeight: 10 });
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      yPosition = addText(`Last ${recentMatches.length} Matches Win Rate: ${recentWinRate}%`, 20, yPosition, { fontSize: 10, lineHeight: 6 });
      const trend = recentWinRate > stats.winRate ? 'Improving ↗' : recentWinRate < stats.winRate ? 'Declining ↘' : 'Stable →';
      yPosition = addText(`Performance Trend: ${trend}`, 20, yPosition, { fontSize: 10, lineHeight: 6 });
      
      yPosition += 10;
    }
    
    // Achievements Section
    if (achievements.length > 0) {
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      yPosition = addText('NOTABLE ACHIEVEMENTS', 20, yPosition, { fontSize: 16, style: 'bold', lineHeight: 10 });
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      achievements.slice(0, 8).forEach(achievement => {
        const achievementData = achievement.achievements || achievement;
        yPosition = addText(`• ${achievementData.title}`, 25, yPosition, { fontSize: 10, lineHeight: 6 });
      });
      
      yPosition += 10;
    }
    
    // Player Strengths Analysis
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    yPosition = addText('PLAYER STRENGTHS', 20, yPosition, { fontSize: 16, style: 'bold', lineHeight: 10 });
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    
    if (stats.winRate >= 70) {
      yPosition = addText(`• Exceptional win rate (${stats.winRate}%) - demonstrates consistent performance`, 25, yPosition, { fontSize: 10, lineHeight: 6 });
    } else if (stats.winRate >= 55) {
      yPosition = addText(`• Strong win rate (${stats.winRate}%) - above average performance`, 25, yPosition, { fontSize: 10, lineHeight: 6 });
    } else if (stats.winRate >= 45) {
      yPosition = addText(`• Balanced performance (${stats.winRate}%) - room for strategic improvement`, 25, yPosition, { fontSize: 10, lineHeight: 6 });
    }
    
    if (stats.currentStreak >= 5) {
      yPosition = addText(`• Currently on a ${stats.currentStreak}-game win streak - showing momentum`, 25, yPosition, { fontSize: 10, lineHeight: 6 });
    }
    
    if (stats.totalMatches >= 100) {
      yPosition = addText(`• Extensive match experience (${stats.totalMatches} games) - demonstrates commitment`, 25, yPosition, { fontSize: 10, lineHeight: 6 });
    } else if (stats.totalMatches >= 50) {
      yPosition = addText(`• Solid match experience (${stats.totalMatches} games) - building consistency`, 25, yPosition, { fontSize: 10, lineHeight: 6 });
    }
    
    if (achievements.length >= 10) {
      yPosition = addText(`• Achievement-oriented player (${achievements.length} unlocked) - goal-driven mindset`, 25, yPosition, { fontSize: 10, lineHeight: 6 });
    }
    
    yPosition += 10;
    
    // Recruitment Summary
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    yPosition = addText('RECRUITMENT SUMMARY', 20, yPosition, { fontSize: 16, style: 'bold', lineHeight: 10 });
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    const summary = `${user.username} is ${stats.winRate >= 60 ? 'a strong competitive player' : 'a developing competitive player'} with ${stats.totalMatches} recorded matches and a ${stats.winRate}% overall win rate. ${stats.totalMatches >= 50 ? 'Their extensive match history demonstrates dedication to improvement and competitive gaming.' : 'They are building their competitive experience and showing commitment to growth.'} ${achievements.length >= 5 ? `With ${achievements.length} achievements unlocked, they show a goal-oriented approach to gaming.` : 'They are working towards achieving competitive milestones.'}`;
    
    // Split long text into multiple lines
    const splitText = pdf.splitTextToSize(summary, pageWidth - 40);
    splitText.forEach(line => {
      yPosition = addText(line, 20, yPosition, { fontSize: 10, lineHeight: 6 });
    });
    
    yPosition += 10;
    
    // Footer
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    pdf.setFont('helvetica', 'italic');
    yPosition = addText('Generated by CoachGG - Professional Esports Development Platform', 20, yPosition, { fontSize: 8, color: [100, 100, 100], style: 'italic', lineHeight: 5 });
    yPosition = addText(`Report Date: ${new Date().toLocaleDateString()}`, 20, yPosition, { fontSize: 8, color: [100, 100, 100], style: 'italic', lineHeight: 5 });
    
    // Save the PDF
    pdf.save(`${user.username}_esports_profile.pdf`);
    
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};


const calculateGameStats = (matches) => {
  const gameStats = {};
  
  matches.forEach(match => {
    const gameName = match.games?.name || 'Unknown Game';
    if (!gameStats[gameName]) {
      gameStats[gameName] = { wins: 0, losses: 0, total: 0 };
    }
    
    gameStats[gameName].total++;
    if (match.result === 'win') {
      gameStats[gameName].wins++;
    } else {
      gameStats[gameName].losses++;
    }
  });
  
  // Calculate win rates
  Object.keys(gameStats).forEach(game => {
    const stats = gameStats[game];
    stats.winRate = stats.total > 0 ? ((stats.wins / stats.total) * 100).toFixed(1) : 0;
  });
  
  return gameStats;
};

export const generateAdvancedProfilePDF = async (user, stats, matches, achievements, teams) => {
  // Enhanced version with charts and more detailed analysis
  // This could be implemented later with chart generation
  return generateProfilePDF(user, stats, matches, achievements);
};