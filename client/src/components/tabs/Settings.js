import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../config/supabase';
import { FREE_MODELS } from '../../config/openrouter';
import '../../styles/Settings.css';

const Settings = () => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: '',
    bio: '',
    profile_avatar: ''
  });
  const [aiSettings, setAiSettings] = useState({
    preferredModel: 'tngtech/deepseek-r1t2-chimera:free',
    feedbackStyle: 'balanced',
    analysisFrequency: 'manual'
  });
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'team_members',
    shareMatchData: true,
    allowAiAnalysis: true
  });
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        role: user.role || 'Player',
        bio: user.bio || '',
        profile_avatar: user.profile_avatar || ''
      });
      loadUserSettings();
    }
  }, [user]);

  const loadUserSettings = async () => {
    try {
      // Load AI and privacy settings from user preferences
      const { data: settings, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (settings && !error) {
        setAiSettings({
          preferredModel: settings.preferred_ai_model || 'tngtech/deepseek-r1t2-chimera:free',
          feedbackStyle: settings.feedback_style || 'balanced',
          analysisFrequency: settings.analysis_frequency || 'manual'
        });
        setPrivacySettings({
          profileVisibility: settings.profile_visibility || 'team_members',
          shareMatchData: settings.share_match_data !== false,
          allowAiAnalysis: settings.allow_ai_analysis !== false
        });
      }
    } catch (error) {
      console.error('Error loading user settings:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAiSettingChange = (e) => {
    const { name, value } = e.target;
    setAiSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePrivacyChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPrivacySettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const saveProfileSettings = async () => {
    try {
      setLoading(true);
      setSaveStatus('saving');

      // Update user profile using AuthContext
      const { error: profileError } = await updateProfile({
        username: formData.username,
        role: formData.role,
        bio: formData.bio,
        profile_avatar: formData.profile_avatar
      });

      if (profileError) throw profileError;

      // Update or insert user settings
      const { error: settingsError } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          preferred_ai_model: aiSettings.preferredModel,
          feedback_style: aiSettings.feedbackStyle,
          analysis_frequency: aiSettings.analysisFrequency,
          profile_visibility: privacySettings.profileVisibility,
          share_match_data: privacySettings.shareMatchData,
          allow_ai_analysis: privacySettings.allowAiAnalysis,
          updated_at: new Date().toISOString()
        });

      if (settingsError) throw settingsError;

      // Profile is automatically updated by updateProfile function

      setSaveStatus('success');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings">
      <div className="settings-header">
        <h1>⚙️ Settings</h1>
        <p>Customize your CoachGG experience</p>
      </div>

      <div className="settings-content">
        {/* Profile Settings */}
        <div className="settings-section">
          <div className="section-header">
            <h2>👤 Profile Settings</h2>
            <p>Manage your personal information and profile</p>
          </div>

          <div className="settings-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter your username"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                disabled
              />
              <small className="form-help">Email cannot be changed after registration</small>
            </div>

            <div className="form-group">
              <label htmlFor="role">Role</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
              >
                <option value="Player">Player</option>
                <option value="Coach">Coach</option>
                <option value="Manager">Manager</option>
                <option value="Analyst">Analyst</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Tell others about yourself, your gaming experience, and goals..."
                rows="4"
              />
              <small className="form-help">This will be visible to team members and potential teammates</small>
            </div>
          </div>
        </div>

        {/* AI Coach Configuration */}
        <div className="settings-section">
          <div className="section-header">
            <h2>🤖 AI Coach Configuration</h2>
            <p>Customize your AI coaching experience</p>
          </div>

          <div className="settings-form">
            <div className="form-group">
              <label htmlFor="preferredModel">Preferred AI Model</label>
              <select
                id="preferredModel"
                name="preferredModel"
                value={aiSettings.preferredModel}
                onChange={handleAiSettingChange}
              >
                <option value={FREE_MODELS.DEEPSEEK_R1T2}>DeepSeek R1T2 Chimera (Recommended)</option>
                <option value={FREE_MODELS.QWEN_2_5_7B}>Qwen 2.5 7B Instruct</option>
                <option value={FREE_MODELS.LLAMA_3_2_3B}>Llama 3.2 3B Instruct</option>
                <option value={FREE_MODELS.GEMMA_2_9B}>Gemma 2 9B IT</option>
                <option value={FREE_MODELS.LLAMA_3_1_8B}>Llama 3.1 8B Instruct</option>
                <option value={FREE_MODELS.MISTRAL_7B}>Mistral 7B Instruct</option>
              </select>
              <small className="form-help">Different models may provide varying analysis styles and response times</small>
            </div>

            <div className="form-group">
              <label htmlFor="feedbackStyle">Feedback Style</label>
              <select
                id="feedbackStyle"
                name="feedbackStyle"
                value={aiSettings.feedbackStyle}
                onChange={handleAiSettingChange}
              >
                <option value="encouraging">Encouraging - Focus on positive reinforcement</option>
                <option value="balanced">Balanced - Mix of praise and constructive criticism</option>
                <option value="direct">Direct - Straightforward analysis and improvement areas</option>
                <option value="detailed">Detailed - Comprehensive analysis with explanations</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="analysisFrequency">Analysis Frequency</label>
              <select
                id="analysisFrequency"
                name="analysisFrequency"
                value={aiSettings.analysisFrequency}
                onChange={handleAiSettingChange}
              >
                <option value="manual">Manual - Generate insights when requested</option>
                <option value="after_matches">After Matches - Auto-analyze after adding matches</option>
                <option value="daily">Daily - Generate daily performance summaries</option>
                <option value="weekly">Weekly - Weekly performance reviews</option>
              </select>
              <small className="form-help">Automatic analysis features coming soon</small>
            </div>
          </div>
        </div>

        {/* Privacy & Data Settings */}
        <div className="settings-section">
          <div className="section-header">
            <h2>🔒 Privacy & Data</h2>
            <p>Control how your data is shared and used</p>
          </div>

          <div className="settings-form">
            <div className="form-group">
              <label htmlFor="profileVisibility">Profile Visibility</label>
              <select
                id="profileVisibility"
                name="profileVisibility"
                value={privacySettings.profileVisibility}
                onChange={handlePrivacyChange}
              >
                <option value="public">Public - Visible to everyone</option>
                <option value="team_members">Team Members - Only visible to teammates</option>
                <option value="private">Private - Only visible to you</option>
              </select>
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="shareMatchData"
                  checked={privacySettings.shareMatchData}
                  onChange={handlePrivacyChange}
                />
                <span className="checkbox-text">
                  <strong>Share Match Data with Teammates</strong>
                  <small>Allow team members to see your detailed match statistics</small>
                </span>
              </label>
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="allowAiAnalysis"
                  checked={privacySettings.allowAiAnalysis}
                  onChange={handlePrivacyChange}
                />
                <span className="checkbox-text">
                  <strong>Enable AI Analysis</strong>
                  <small>Allow AI to analyze your performance data for insights and recommendations</small>
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="settings-actions">
          <button
            className="save-button"
            onClick={saveProfileSettings}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="button-spinner"></span>
                Saving...
              </>
            ) : (
              <>
                <span className="button-icon">💾</span>
                Save Settings
              </>
            )}
          </button>

          {saveStatus && (
            <div className={`save-status ${saveStatus}`}>
              {saveStatus === 'success' && '✅ Settings saved successfully!'}
              {saveStatus === 'error' && '❌ Failed to save settings. Please try again.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;