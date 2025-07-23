// OpenRouter API configuration
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Free models available on OpenRouter (updated with working models)
export const FREE_MODELS = {
  DEEPSEEK_R1T2: 'tngtech/deepseek-r1t2-chimera:free',
  LLAMA_3_2_3B: 'meta-llama/llama-3.2-3b-instruct:free',
  QWEN_2_5_7B: 'qwen/qwen-2.5-7b-instruct:free',
  GEMMA_2_9B: 'google/gemma-2-9b-it:free',
  // Backup models that are usually available
  LLAMA_3_1_8B: 'meta-llama/llama-3.1-8b-instruct:free',
  MISTRAL_7B: 'mistralai/mistral-7b-instruct:free'
};

// Default model to use - DeepSeek R1T2 Chimera (known to be available)
export const DEFAULT_MODEL = FREE_MODELS.DEEPSEEK_R1T2;

class OpenRouterService {
  constructor() {
    this.apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
    this.baseURL = OPENROUTER_API_URL;
  }

  async makeRequest(messages, model = DEFAULT_MODEL, options = {}) {
    if (!this.apiKey) {
      throw new Error('OpenRouter API key not configured. Please add VITE_OPENROUTER_API_KEY to your .env file.');
    }

    // Try multiple models if the first one fails
    const modelsToTry = [
      model,
      FREE_MODELS.DEEPSEEK_R1T2,
      FREE_MODELS.QWEN_2_5_7B,
      FREE_MODELS.LLAMA_3_2_3B,
      FREE_MODELS.GEMMA_2_9B,
      FREE_MODELS.LLAMA_3_1_8B,
      FREE_MODELS.MISTRAL_7B
    ];

    // Remove duplicates
    const uniqueModels = [...new Set(modelsToTry)];

    for (let i = 0; i < uniqueModels.length; i++) {
      const currentModel = uniqueModels[i];
      
      const requestBody = {
        model: currentModel,
        messages,
        max_tokens: options.maxTokens || 600,
        temperature: options.temperature || 0.7,
        top_p: options.topP || 0.9,
        ...options
      };

      try {
        const response = await fetch(this.baseURL, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': window.location.origin || 'http://localhost:5173',
            'X-Title': 'CoachGG - Esports Coaching Platform'
          },
          body: JSON.stringify(requestBody)
        });

        if (response.ok) {
          const data = await response.json();
          
          // Try different response formats (DeepSeek uses reasoning field)
          const content = data.choices?.[0]?.message?.content || 
                         data.choices?.[0]?.message?.reasoning ||
                         data.choices?.[0]?.text || 
                         data.content || 
                         data.response ||
                         data.output;
          
          if (!content) {
            return 'AI response received but content could not be extracted. Please try again.';
          }
          
          return content;
        } else {
          const errorText = await response.text();
          
          // If this is the last model, throw the error
          if (i === uniqueModels.length - 1) {
            let errorData = {};
            try {
              errorData = JSON.parse(errorText);
            } catch (e) {
              // Silent error parsing
            }
            throw new Error(`Failed to generate AI insights. Please try again or check your API configuration.`);
          }
          // Otherwise, continue to next model
        }
      } catch (error) {
        // If this is the last model, throw the error
        if (i === uniqueModels.length - 1) {
          throw new Error(`Failed to generate AI insights. Please try again or check your API configuration.`);
        }
        // Otherwise, continue to next model
      }
    }
  }

  async analyzeMatch(matchData, playerStats) {
    const messages = [
      {
        role: 'system',
        content: `You are an expert esports coach. Analyze the match and provide feedback in this EXACT format. COMPLETE ALL SECTIONS:

MATCH ANALYSIS

Result: [Brief analysis of win/loss]

Key Performance Points:
- [Positive aspect 1]
- [Positive aspect 2]
- [Positive aspect 3]

Improvement Areas:
- [Area to improve 1]
- [Area to improve 2]

Next Match Focus:
- [One specific actionable tip]

IMPORTANT: Complete all sections. Do not cut off mid-sentence. Keep each point concise but complete.`
      },
      {
        role: 'user',
        content: `Analyze this match:

Game: ${matchData.games?.name || 'Unknown'}
Result: ${matchData.result.toUpperCase()}
Stats: ${JSON.stringify(matchData.stats)}

Player Context:
- Total Matches: ${playerStats.totalMatches}
- Overall Win Rate: ${playerStats.winRate}%
- Current Streak: ${playerStats.currentStreak}

Provide structured coaching feedback.`
      }
    ];

    return await this.makeRequest(messages, DEFAULT_MODEL, { maxTokens: 700 });
  }

  async analyzePerformanceTrend(matches, timeframe = '7 days') {
    const recentMatches = matches.slice(0, 10);
    const wins = recentMatches.filter(m => m.result === 'win').length;
    const winRate = recentMatches.length > 0 ? (wins / recentMatches.length) * 100 : 0;

    const messages = [
      {
        role: 'system',
        content: `You are an esports performance analyst. Provide structured trend analysis in this EXACT format. COMPLETE ALL SECTIONS:

PERFORMANCE TREND ANALYSIS

Current Form:
- [Recent performance summary]

Key Patterns Identified:
- [Pattern 1]
- [Pattern 2]
- [Pattern 3]

Trending Up:
- [Positive trends]

Needs Attention:
- [Areas of concern]

Strategic Recommendations:
- [Actionable advice 1]
- [Actionable advice 2]

IMPORTANT: Complete all sections. Do not cut off mid-sentence. Keep responses concise but complete.`
      },
      {
        role: 'user',
        content: `Analyze performance trends:

Recent Matches: ${recentMatches.length}
Recent Win Rate: ${winRate.toFixed(1)}%
Match Results: ${recentMatches.map(m => m.result).join(', ')}
Games: ${[...new Set(recentMatches.map(m => m.games?.name))].join(', ')}

Provide structured trend analysis.`
      }
    ];

    return await this.makeRequest(messages, DEFAULT_MODEL, { maxTokens: 600 });
  }

  async generateTeamStrategy(teamData, memberStats) {
    const messages = [
      {
        role: 'system',
        content: `You are a professional esports team coach. Analyze team composition and performance to suggest strategic improvements and team synergy enhancements. Provide complete, actionable advice without cutting off mid-sentence.`
      },
      {
        role: 'user',
        content: `Analyze this team's performance and suggest strategies:
        
        Team: ${teamData.name}
        Members: ${teamData.memberCount}
        Team Win Rate: ${teamData.winRate}%
        
        Member Performance Summary:
        ${Object.entries(memberStats).map(([id, stats]) => 
          `Player: ${stats.winRate}% win rate, ${stats.totalMatches} matches`
        ).join('\n')}
        
        Provide team strategy recommendations and synergy improvements.`
      }
    ];

    return await this.makeRequest(messages, DEFAULT_MODEL, { maxTokens: 600 });
  }

  async generateGoalSuggestions(playerStats, preferences = {}) {
    const messages = [
      {
        role: 'system',
        content: `You are a goal-setting coach for competitive gamers. Provide structured SMART goals in this EXACT format. COMPLETE ALL SECTIONS:

PERSONALIZED IMPROVEMENT GOALS

Weekly Goals (Next 7 Days):
- Goal 1: [Specific, measurable goal]
- Goal 2: [Specific, measurable goal]
- Goal 3: [Specific, measurable goal]

Monthly Goals (Next 30 Days):
- Goal 1: [Longer-term objective]
- Goal 2: [Skill development focus]

Focus Areas:
- [Primary improvement area]
- [Secondary improvement area]

Success Metrics:
- [How to measure progress]
- [Key indicators to track]

IMPORTANT: Complete all sections. Do not cut off mid-sentence. Provide actionable, specific goals.`
      },
      {
        role: 'user',
        content: `Create personalized improvement goals:
        
        Current Performance:
        - Total Matches: ${playerStats.totalMatches}
        - Win Rate: ${playerStats.winRate}%
        - Current Streak: ${playerStats.currentStreak}
        - Best Streak: ${playerStats.bestStreak}
        
        Provide structured SMART goals.`
      }
    ];

    return await this.makeRequest(messages, DEFAULT_MODEL, { maxTokens: 450 });
  }
}

export const openRouterService = new OpenRouterService();
export default openRouterService;