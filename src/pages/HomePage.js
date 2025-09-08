import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Menu, User, ChevronLeft, ChevronDown, ChevronRight, 
  Home, TrendingUp, Calendar, LogOut, Info
} from 'lucide-react';
import './HomePage.css';
import AdvancePage from './AdvancePage';
import SecondHome from './SecondHome';
import GenrePage from './GenrePage';
import SearchAnime from './SearchAnime'; 
import AboutPage from './AboutPage';
import ExitModal from './ExitModal';
import EventsModal from './EventsModal';
import TvSeriesModal from './TvSeriesModal';
import MoviesModal from './MoviesModal';
import PopularAnime from './PopularAnime'; // ✅ gagamitin na natin

import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

const Homepage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [allTitles, setAllTitles] = useState([]);

  const [isMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isGenreDropdownOpen, setIsGenreDropdownOpen] = useState(false);
  const [isWatchAnimeDropdownOpen, setIsWatchAnimeDropdownOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [isEventsModalOpen, setIsEventsModalOpen] = useState(false);
  const [isTvSeriesModalOpen, setIsTvSeriesModalOpen] = useState(false);
  const [isMoviesModalOpen, setIsMoviesModalOpen] = useState(false);
  
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const [activePage, setActivePage] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const [searchResultsQuery, setSearchResultsQuery] = useState('');

  // Disable background scroll when overlay is active
  useEffect(() => {
    if (activePage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [activePage]);

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.user-dropdown-container')) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Sidebar menu items
  const menuItems = [
    { name: 'Home', path: './home', icon: Home },
    { 
      name: 'Most Popular', 
      path: '#', 
      icon: TrendingUp, 
      onClick: () => setActivePage('popular') // 🔥 overlay like Genre
    },
    { 
      name: 'Events', 
      path: '#', 
      icon: Calendar, 
      onClick: () => setIsEventsModalOpen(true)
    }
  ];

  const watchAnimeItems = [
    { name: 'Subbed Anime', path: '/subbed' },
    { name: 'Dubbed Anime', path: '/dubbed' },
    { name: 'Movies', path: '#', onClick: () => setIsMoviesModalOpen(true) },
    { name: 'TV Series', path: '#', onClick: () => setIsTvSeriesModalOpen(true) }
  ];

  const genres = [
    { name: 'Action', color: '#ff6b6b' },
    { name: 'Adventure', color: '#4ecdc4' },
    { name: 'Comedy', color: '#96ceb4' },
    { name: 'Drama', color: '#fdcb6e' },
    { name: 'Fantasy', color: '#a29bfe' },
    { name: 'Horror', color: '#ff4757' }, 
    { name: 'Mystery', color: '#5352ed' },
    { name: 'Romance', color: '#ff3838' },
    { name: 'School', color: '#18dcff' },
    { name: 'Sci-Fi', color: '#7bed9f' },
    { name: 'Slice of Life', color: '#70a1ff' },
    { name: 'Sports', color: '#ff6348' }
  ];

  const userDropdownItems = [
    { name: 'About', icon: Info, action: () => setIsAboutModalOpen(true) },
    { name: 'Exit', icon: LogOut, action: () => setIsExitModalOpen(true) }
  ];

  const handleExit = () => {
    navigate('/');
  };

  // Fetch anime titles for search
  useEffect(() => {
    const fetchTitles = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "animes"));
        const titles = querySnapshot.docs.map(doc => doc.data().title || "");
        setAllTitles(titles);
      } catch (err) {
        console.error("Error fetching titles:", err);
      }
    };
    fetchTitles();
  }, []);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const filtered = allTitles.filter(title =>
      title.toLowerCase().includes(query.toLowerCase())
    );
    setSuggestions(filtered.slice(0, 10));
  };

  const toggleGenreDropdown = () => setIsGenreDropdownOpen(!isGenreDropdownOpen);
  const toggleWatchAnimeDropdown = () => setIsWatchAnimeDropdownOpen(!isWatchAnimeDropdownOpen);
  const toggleUserDropdown = () => setIsUserDropdownOpen(!isUserDropdownOpen);

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' && searchQuery.trim() !== '') {
      setSearchResultsQuery(searchQuery);
      setActivePage(`Search result for "${searchQuery}"`);
      setIsSidebarOpen(true);
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (title) => {
    setSearchQuery(title);
    setSearchResultsQuery(title);
    setActivePage(`Search result for "${title}"`);
    setIsSidebarOpen(true);
    setSuggestions([]);
  };

  return (
    <div className="homepage">
      {/* Background */}
      <div className="background-container">
        <div className="gradient-bg"></div>
      </div>

      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <button
            className="sidebar-close"
            onClick={() => {
              setIsSidebarOpen(false);
              setActivePage(null);
            }}
          >
            <ChevronLeft />
            <span>Close menu</span>
          </button>
        </div>

        <div className="sidebar-content">
          <div className="advance-search-button-section">
            <button 
              className="advance-search-button"
              onClick={() => setActivePage('advance-search')}
            >
              <span className="advance-search-icon">🔍</span>
              <span>Advance Search</span>
            </button>
          </div>

          <nav className="sidebar-nav">
            {menuItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <a 
                  key={idx} 
                  href={item.path} 
                  className="sidebar-nav-item"
                  onClick={(e) => {
                    if (item.onClick) {
                      e.preventDefault();
                      item.onClick();
                    }
                  }}
                >
                  <Icon className="nav-item-icon" />
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
              {watchAnimeItems.map((item, idx) => (
                <button 
                  key={idx} 
                  className="watch-anime-item"
                  onClick={() => {
                    if (item.onClick) {
                      item.onClick();
                    } else {
                      setActivePage(item.name);
                    }
                  }}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          {/* Genre Section */}
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
                {genres.map((genre, idx) => (
                  <button
                    key={idx}
                    className="genre-item"
                    style={{ '--genre-color': genre.color }}
                    onClick={() => {
                      setSelectedGenre(genre.name);
                      setActivePage('genre');
                    }}
                  >
                    {genre.name}
                  </button>
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
          onClick={() => {
            setIsSidebarOpen(false);
            setActivePage(null);
          }}
        ></div>
      )}

      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-brand">
            <button
              className="hamburger-menu"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu />
            </button>
            <h1>DOWN ANIVERSE</h1>
          </div>
         
          <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
            <div className="search-container">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search anime, movies..."
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleSearchSubmit}
                className="search-input"
              />

              {suggestions.length > 0 && (
                <ul className="search-suggestions">
                  {suggestions.map((title, idx) => (
                    <li 
                      key={idx} 
                      onClick={() => handleSuggestionClick(title)}
                    >
                      {title}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* User Dropdown */}
            <div className="nav-actions">
              <div className="user-dropdown-container">
                <button 
                  className="nav-btn"
                  onClick={toggleUserDropdown}
                  aria-expanded={isUserDropdownOpen}
                >
                  <User />
                </button>
                <div className={`user-dropdown ${isUserDropdownOpen ? 'user-dropdown-open' : ''}`}>
                  {userDropdownItems.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={idx}
                        className="user-dropdown-item"
                        onClick={() => {
                          item.action();
                          setIsUserDropdownOpen(false);
                        }}
                      >
                        <Icon className="dropdown-item-icon" />
                        <span>{item.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Homepage Content */}
      <SecondHome />

      {/* Overlay Page */}
      {activePage && (
        <div className="overlay-page">
          <div className="overlay-header">
            <h2>
              {activePage === 'genre'
                ? `${selectedGenre} Anime`
                : activePage === 'popular'
                ? 'Most Popular Anime'
                : activePage === 'advance-search'
                ? 'Advanced Search'
                : activePage}
            </h2>

            <div className="overlay-header-buttons">
              {activePage !== 'advance-search' && !activePage?.startsWith('Search result for') && (
                <button
                  className="filter-button"
                  onClick={() => setSortOrder(prev => (prev === "asc" ? "desc" : "asc"))}
                  title="Filter / Sort"
                >
                  {sortOrder === "asc" ? " A→Z" : " Z→A"}
                </button>
              )}

              <button 
                className="close-overlay"
                onClick={() => setActivePage(null)}
              >
                Close
              </button>
            </div>
          </div>

          {activePage === 'popular' ? (
  <PopularAnime />  
) : activePage === 'genre' ? (
  <GenrePage genre={selectedGenre} sortOrder={sortOrder} />
) : activePage === 'Subbed Anime' ? (
  <GenrePage showAll={true} title="Subbed Anime" sortOrder={sortOrder} />
) : activePage === 'Dubbed Anime' ? (
  <GenrePage showAll={true} title="Dubbed Anime" sortOrder={sortOrder} />
) : activePage === 'advance-search' ? (
  <AdvancePage />
) : activePage?.startsWith('Search result for') ? (
  <SearchAnime query={searchResultsQuery} />
) : (
  <div className="placeholder-content">
    <h1>{activePage}</h1>
    <p>Page under construction...</p>
  </div>
)}

        </div>
      )}

      {/* Modals */}
      <AboutPage 
        isOpen={isAboutModalOpen} 
        onClose={() => setIsAboutModalOpen(false)} 
      />

      <ExitModal 
        isOpen={isExitModalOpen} 
        onClose={() => setIsExitModalOpen(false)}
        onExit={handleExit}
      />

      <EventsModal 
        isOpen={isEventsModalOpen} 
        onClose={() => setIsEventsModalOpen(false)}
      />

      <TvSeriesModal 
        isOpen={isTvSeriesModalOpen} 
        onClose={() => setIsTvSeriesModalOpen(false)}
      />

      <MoviesModal 
        isOpen={isMoviesModalOpen} 
        onClose={() => setIsMoviesModalOpen(false)}
      />

    </div>
  );
};

export default Homepage;
