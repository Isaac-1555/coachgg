# AI Coach Setup Guide

## Overview
The AI Coach feature uses OpenRouter to provide intelligent coaching insights and recommendations. OpenRouter gives access to multiple free LLMs, making it cost-effective for development and testing.

## Setup Instructions

### 1. Get OpenRouter API Key
1. Visit [OpenRouter.ai](https://openrouter.ai/)
2. Sign up for a free account
3. Go to your [API Keys page](https://openrouter.ai/keys)
4. Create a new API key
5. Copy the API key (starts with `sk-or-v1-...`)

### 2. Configure Environment Variables
1. Copy `client/.env.example` to `client/.env`
2. Add your OpenRouter API key:
```env
VITE_OPENROUTER_API_KEY=sk-or-v1-your-api-key-here
```

### 3. Free Models Available
The AI Coach is configured to use free models by default:
- **Llama 3.2 3B Instruct** (default) - Good balance of speed and quality
- **Phi-3 Mini 128K** - Fast and efficient for quick insights
- **Gemma 2 9B** - Higher quality responses
- **Qwen 2.5 7B** - Good for detailed analysis

### 4. Features Available

#### Performance Analysis
- Analyzes individual match performance
- Provides specific improvement suggestions
- Identifies strengths and weaknesses

#### Trend Analysis
- Reviews recent performance patterns
- Detects improvement or decline trends
- Suggests strategic adjustments

#### Goal Setting
- Creates personalized SMART goals
- Based on current performance metrics
- Motivational and achievable targets

#### Match-Specific Analysis
- Click any match for detailed AI feedback
- Game-specific coaching advice
- Performance correlation insights

### 5. Usage Tips

#### Getting Better Results
- Add more matches for better trend analysis
- Include detailed stats (KDA, etc.) for richer insights
- Use the AI Coach regularly for consistent improvement

#### Cost Management
- Free models have usage limits but are generous for personal use
- Monitor your usage on the OpenRouter dashboard
- Upgrade to paid models if you need higher limits

### 6. Troubleshooting

#### "API key not configured" Error
- Ensure your `.env` file is in the `client/` directory
- Check that the variable name is exactly `VITE_OPENROUTER_API_KEY`
- Restart the development server after adding the key

#### "Failed to generate insights" Error
- Check your internet connection
- Verify your API key is valid on OpenRouter
- Try again in a few minutes (rate limiting)

#### No Insights Generated
- Ensure you have at least 1 match for basic analysis
- Need 3+ matches for trend analysis
- Check browser console for detailed error messages

### 7. Privacy & Data
- Match data is sent to OpenRouter for analysis
- No personal information beyond game stats is shared
- OpenRouter has a privacy policy available on their website
- Consider using anonymized usernames if privacy is a concern

## Example AI Insights

### Performance Analysis
> "Your 75% win rate shows strong consistency! Focus on maintaining your current strategies while working on your average KDA of 1.2. Consider being more aggressive in team fights to increase your impact."

### Trend Analysis
> "Your recent 8-game win streak indicates excellent form! Your performance has improved 15% over the last week. Keep up the current practice routine and consider challenging yourself with higher-ranked opponents."

### Goal Suggestions
> "Based on your 65% win rate, here are your goals for next week: 1) Achieve 70% win rate over 10 games, 2) Improve average KDA from 1.1 to 1.3, 3) Maintain current 5-game win streak."

## Support
If you encounter issues with the AI Coach:
1. Check this setup guide
2. Verify your OpenRouter configuration
3. Check the browser console for errors
4. Ensure you have sufficient match data for analysis