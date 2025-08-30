import React, { useState, useEffect } from 'react';
import { Search, Menu, User, Bell, ChevronLeft, ChevronDown, ChevronRight, Home, TrendingUp, Calendar, Play, Star, Users, BookOpen } from 'lucide-react';
import './HomePage.css';

const Homepage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isGenreDropdownOpen, setIsGenreDropdownOpen] = useState(false);
  const [isWatchAnimeDropdownOpen, setIsWatchAnimeDropdownOpen] = useState(false);
  const [animatedStats, setAnimatedStats] = useState({ anime: 0, users: 0, episodes: 0, genres: 0 });
  
  const menuItems = [
    { name: 'Home', path: './home', icon: Home },
    { name: 'Most Popular', path: '/popular', icon: TrendingUp },
    { name: 'Events', path: '/events', icon: Calendar }
  ];

  const watchAnimeItems = [
    { name: 'Subbed Anime', path: '/subbed' },
    { name: 'Dubbed Anime', path: '/dubbed' },
    { name: 'Movies', path: '/movies' },
    { name: 'TV Series', path: '/tv-series' },
    { name: 'OVAs', path: '/ovas' },
    { name: 'Specials', path: '/specials' }
  ];

  const genres = [
    { name: 'Action', color: '#ff6b6b' },
    { name: 'Adventure', color: '#4ecdc4' },
    { name: 'Comedy', color: '#96ceb4' },
    { name: 'Drama', color: '#fdcb6e' },
    { name: 'Ecchi', color: '#6c5ce7' },
    { name: 'Fantasy', color: '#a29bfe' },
    { name: 'Horror', color: '#ff4757' },
    { name: 'Music', color: '#57606f' },
    { name: 'Mystery', color: '#5352ed' },
    { name: 'Romance', color: '#ff3838' },
    { name: 'School', color: '#18dcff' },
    { name: 'Sci-Fi', color: '#7bed9f' },
    { name: 'Slice of Life', color: '#70a1ff' },
    { name: 'Sports', color: '#ff6348' },
    { name: 'Supernatural', color: '#2ed573' },
    { name: 'Thriller', color: '#ff4757' }
  ];

  const featuredContent = [
    {
      title: "Latest Episodes",
      description: "Stay updated with the newest episodes of your favorite anime series, released daily.",
      icon: Play
    },
    {
      title: "Top Rated",
      description: "Discover highly-rated anime series and movies loved by our community.",
      icon: Star
    },
    {
      title: "Community",
      description: "Join discussions, share reviews, and connect with fellow anime enthusiasts.",
      icon: Users
    }
  ];

  const stats = [
    { label: 'Anime Series', value: 15000, key: 'anime' },
    { label: 'Active Users', value: 2500000, key: 'users' },
    { label: 'Episodes', value: 450000, key: 'episodes' },
    { label: 'Genres', value: 25, key: 'genres' }
  ];

  // Animate stats on component mount
  useEffect(() => {
    const animateValue = (start, end, duration, key) => {
      const range = end - start;
      const increment = end > start ? 1 : -1;
      const stepTime = Math.abs(Math.floor(duration / range));
      
      let current = start;
      const timer = setInterval(() => {
        current += increment * Math.ceil(range / 100);
        if (current >= end) {
          current = end;
          clearInterval(timer);
        }
        setAnimatedStats(prev => ({ ...prev, [key]: current }));
      }, stepTime);
    };

    stats.forEach(stat => {
      animateValue(0, stat.value, 2000, stat.key);
    });
  }, []);

  const toggleGenreDropdown = () => {
    setIsGenreDropdownOpen(!isGenreDropdownOpen);
  };

  const toggleWatchAnimeDropdown = () => {
    setIsWatchAnimeDropdownOpen(!isWatchAnimeDropdownOpen);
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
  };

  return (
    <div className="homepage">
      {/* Background Elements */}
      <div className="background-container">
        <div className="gradient-bg"></div>
        <div className="floating-particles">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="particle"></div>
          ))}
        </div>
      </div>

      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <button 
            className="sidebar-close"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close menu"
          >
            <ChevronLeft />
            <span>Close menu</span>
          </button>
        </div>

        <div className="sidebar-content">
          <div className="community-section">
            <div className="community-button">
              <span className="community-icon">💬</span>
              <span>Community</span>
            </div>
          </div>

          <nav className="sidebar-nav">
            {menuItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <a key={index} href={item.path} className="sidebar-nav-item">
                  <IconComponent className="nav-item-icon" />
                  <span>{item.name}</span>
                </a>
              );
            })}
          </nav>

          {/* Watch Anime Section */}
          <div className="watch-anime-section">
            <button 
              className="watch-anime-toggle"
              onClick={toggleWatchAnimeDropdown}
              aria-expanded={isWatchAnimeDropdownOpen}
            >
              <h3 className="watch-anime-title">Watch Anime</h3>
              {isWatchAnimeDropdownOpen ? <ChevronDown /> : <ChevronRight />}
            </button>
            
            <div className={`watch-anime-dropdown ${isWatchAnimeDropdownOpen ? 'watch-anime-dropdown-open' : ''}`}>
              {watchAnimeItems.map((item, index) => (
                <a 
                  key={index} 
                  href={item.path} 
                  className="watch-anime-item"
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>

          <div className="genre-section">
            <button 
              className="genre-toggle"
              onClick={toggleGenreDropdown}
              aria-expanded={isGenreDropdownOpen}
            >
              <h3 className="genre-title">Genre</h3>
              {isGenreDropdownOpen ? <ChevronDown /> : <ChevronRight />}
            </button>
            
            <div className={`genre-dropdown ${isGenreDropdownOpen ? 'genre-dropdown-open' : ''}`}>
              <div className="genre-grid">
                {genres.map((genre, index) => (
                  <a 
                    key={index} 
                    href={`/genre/${genre.name.toLowerCase().replace(/\s+/g, '-')}`} 
                    className="genre-item"
                    style={{ '--genre-color': genre.color }}
                  >
                    {genre.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-brand">
            <button 
              className="hamburger-menu"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu />
            </button>
            <h1>SULASOK NO SEKAI</h1>
          </div>
          
          <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
            <div className="search-container">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search anime, movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="nav-actions">
              <button className="nav-btn" aria-label="Notifications">
                <Bell />
              </button>
              <button className="nav-btn" aria-label="Profile">
                <User />
              </button>
            </div>
          </div>

          <button 
            className="menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <Menu />
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-container">
          <h2>Welcome to the Ultimate Anime Experience</h2>
          <p>
            Discover thousands of anime series, movies, and OVAs. Join millions of fans 
            in the most comprehensive anime streaming platform in the universe.
          </p>
          
          <div className="hero-actions">
            <a href="/watch" className="cta-button cta-primary">
              <Play size={20} />
              Start Watching
            </a>
            <a href="/browse" className="cta-button">
              <BookOpen size={20} />
              Browse Library
            </a>
          </div>

          {/* Stats Section */}
          <div className="stats-section">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item">
                <span className="stat-number">
                  {formatNumber(animatedStats[stat.key])}
                </span>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Featured Content Section */}
      <section className="featured-section">
        <div className="featured-grid">
          {featuredContent.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div key={index} className="featured-card">
                <IconComponent size={48} style={{ 
                  marginBottom: '1rem', 
                  color: '#ff6b9d',
                  filter: 'drop-shadow(0 0 10px rgba(255, 107, 157, 0.6))'
                }} />
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Homepage;