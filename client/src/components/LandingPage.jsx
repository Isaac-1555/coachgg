import React, { useState, useEffect, useRef } from 'react';
import { 
  IconDeviceGamepad2, 
  IconTrophy, 
  IconRobot, 
  IconChartLine,
  IconUsers,
  IconCalendar,
  IconTarget,
  IconBolt,
  IconStar,
  IconCheck,
  IconArrowRight,
  IconBrandDiscord,
  IconBrandTwitter,
  IconBrandGithub
} from '@tabler/icons-react';
import '../styles/LandingPage.css';

const LandingPage = ({ onGetStarted }) => {
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoRef = useRef(null);
  
  const videos = [
    '/Videos/7914851-hd_1920_1080_30fps.mp4',
    '/Videos/7914800-hd_1920_1080_30fps.mp4',
    '/Videos/9071409-hd_1920_1080_25fps.mp4'
  ];

  // Handle video cycling
  const handleVideoEnd = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
  };

  // Update video source when index changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load(); // Reload the video with new source
    }
  }, [currentVideoIndex]);

  const features = [
    {
      icon: IconDeviceGamepad2,
      title: "Match Tracking",
      description: "Track your gaming performance across multiple games with detailed statistics and insights."
    },
    {
      icon: IconRobot,
      title: "AI Coach",
      description: "Get personalized coaching recommendations powered by advanced AI to improve your gameplay."
    },
    {
      icon: IconChartLine,
      title: "Performance Analytics",
      description: "Visualize your progress with interactive charts and comprehensive performance metrics."
    },
    {
      icon: IconUsers,
      title: "Team Management",
      description: "Create and manage teams, compare member performance, and track team statistics."
    },
    {
      icon: IconCalendar,
      title: "Event Scheduling",
      description: "Schedule practice sessions, tournaments, and team meetings with integrated calendar."
    },
    {
      icon: IconTarget,
      title: "Achievement System",
      description: "Unlock achievements and track milestones to stay motivated on your gaming journey."
    },
    {
      icon: IconStar,
      title: "Skill Progression",
      description: "Monitor your skill development over time with detailed progression tracking and milestones."
    },
    {
      icon: IconTrophy,
      title: "Competitive Rankings",
      description: "Compare your performance against other players and climb the competitive leaderboards."
    }
  ];

  const screenshots = [
    {
      title: "Dashboard Overview",
      description: "Get a complete view of your gaming performance at a glance",
      image: "/Screenshots/Screenshot 1.png"
    },
    {
      title: "Solo Tracker",
      description: "Track your individual matches with detailed performance analytics",
      image: "/Screenshots/Screenshot 2.png"
    },
    {
      title: "Team Management",
      description: "Create and manage teams with comprehensive member analytics",
      image: "/Screenshots/Screenshot 3.png"
    },
    {
      title: "AI Coach Insights",
      description: "Receive personalized coaching recommendations to improve your gameplay",
      image: "/Screenshots/Screenshot 4.png"
    },
    {
      title: "Advanced Analytics",
      description: "Deep dive into performance metrics with interactive charts",
      image: "/Screenshots/Screenshot 5.png"
    },
    {
      title: "Manager Dashboard",
      description: "Comprehensive tools for team coaches and managers",
      image: "/Screenshots/Screenshot 6.png"
    }
  ];

  const pricingPlans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for casual gamers getting started",
      features: [
        "Track up to 50 matches",
        "Basic performance analytics",
        "Join up to 2 teams",
        "Community support"
      ],
      highlighted: false,
      buttonText: "Get Started Free"
    },
    {
      name: "Pro",
      price: "$9.99",
      period: "per month",
      description: "Ideal for serious competitive players",
      features: [
        "Unlimited match tracking",
        "Advanced AI coaching",
        "Unlimited teams",
        "Priority support",
        "Export reports",
        "Advanced analytics"
      ],
      highlighted: true,
      buttonText: "Start Pro Trial"
    },
    {
      name: "Team",
      price: "$14.99",
      period: "per month",
      description: "Built for professional teams and coaches",
      features: [
        "Everything in Pro",
        "Team management tools",
        "Coach dashboard",
        "Calendar integration",
        "Team analytics",
        "Custom branding",
        "API access"
      ],
      highlighted: false,
      buttonText: "Contact Sales"
    }
  ];

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-container">
          <div className="nav-brand">
            <img src="/logo.svg" alt="CoachGG Logo" className="brand-logo" />
            <span className="brand-text">CoachGG</span>
          </div>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#screenshots">Screenshots</a>
            <a href="#pricing">Pricing</a>
            <button className="nav-cta" onClick={onGetStarted}>
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Level Up Your
              <span className="hero-highlight"> Gaming Performance</span>
            </h1>
            <p className="hero-subtitle">
              Transform from casual player to competitive pro with AI-powered coaching, 
              comprehensive analytics, and team collaboration tools designed for esports excellence.
            </p>
            <div className="hero-cta">
              <button className="cta-primary" onClick={onGetStarted}>
                <IconBolt size={20} />
                Start Your Journey
                <IconArrowRight size={16} />
              </button>
              <button className="cta-secondary">
                <IconDeviceGamepad2 size={20} />
                Watch Demo
              </button>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">10K+</span>
                <span className="stat-label">Matches Tracked</span>
              </div>
              <div className="stat">
                <span className="stat-number">500+</span>
                <span className="stat-label">Active Players</span>
              </div>
              <div className="stat">
                <span className="stat-number">95%</span>
                <span className="stat-label">Improvement Rate</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-video-container">
              <video 
                ref={videoRef}
                autoPlay 
                muted 
                playsInline
                className="hero-video"
                onEnded={handleVideoEnd}
              >
                <source src={videos[currentVideoIndex]} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="video-overlay"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="container">
          <div className="section-header">
            <h2>Everything You Need to Dominate</h2>
            <p>Comprehensive tools designed for competitive gaming excellence</p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">
                  <feature.icon size={24} />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Screenshots Section */}
      <section id="screenshots" className="screenshots">
        <div className="container">
          <div className="section-header">
            <h2>See CoachGG in Action</h2>
            <p>Explore the interface designed for competitive gamers</p>
          </div>
          <div className="screenshots-grid">
            {screenshots.map((screenshot, index) => (
              <div key={index} className="screenshot-card">
                <div className="screenshot-image">
                  <img src={screenshot.image} alt={screenshot.title} />
                </div>
                <div className="screenshot-content">
                  <h3>{screenshot.title}</h3>
                  <p>{screenshot.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="pricing">
        <div className="container">
          <div className="section-header">
            <h2>Choose Your Plan</h2>
            <p>Start free and upgrade as you grow</p>
          </div>
          <div className="pricing-grid">
            {pricingPlans.map((plan, index) => (
              <div 
                key={index} 
                className={`pricing-card ${plan.highlighted ? 'highlighted' : ''}`}
              >
                {plan.highlighted && (
                  <div className="plan-badge">Most Popular</div>
                )}
                <div className="plan-header">
                  <h3>{plan.name}</h3>
                  <div className="plan-price">
                    <span className="price">{plan.price}</span>
                    <span className="period">/{plan.period}</span>
                  </div>
                  <p className="plan-description">{plan.description}</p>
                </div>
                <div className="plan-features">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="feature-item">
                      <IconCheck size={16} className="check-icon" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                <button 
                  className={`plan-button ${plan.highlighted ? 'primary' : 'secondary'}`}
                  onClick={onGetStarted}
                >
                  {plan.buttonText}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="brand">
                <img src="/logo.svg" alt="CoachGG Logo" className="brand-logo" />
                <span className="brand-text">CoachGG</span>
              </div>
              <p>Empowering gamers to reach their competitive potential</p>
              <div className="social-links">
                <a href="#" className="social-link">
                  <IconBrandDiscord size={20} />
                </a>
                <a href="#" className="social-link">
                  <IconBrandTwitter size={20} />
                </a>
                <a href="#" className="social-link">
                  <IconBrandGithub size={20} />
                </a>
              </div>
            </div>
            <div className="footer-links">
              <div className="link-group">
                <h4>Product</h4>
                <a href="#features">Features</a>
                <a href="#pricing">Pricing</a>
                <a href="#">API</a>
              </div>
              <div className="link-group">
                <h4>Support</h4>
                <a href="#">Help Center</a>
                <a href="#">Contact</a>
                <a href="#">Status</a>
              </div>
              <div className="link-group">
                <h4>Company</h4>
                <a href="#">About</a>
                <a href="#">Blog</a>
                <a href="#">Careers</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 CoachGG. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;