import React, { useState, useEffect } from 'react';
import { 
  Search, Menu, User, ChevronLeft, ChevronDown, ChevronRight, 
  Home, TrendingUp, Calendar
} from 'lucide-react';
import './HomePage.css';
import AdvancePage from './AdvancePage';
import SecondHome from './SecondHome';
import GenrePage from './GenrePage';
import SearchAnime from './SearchAnime'; // ← add this
// Firestore imports
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

  // Overlay states
  const [activePage, setActivePage] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState(null);
  // Overlay sorting state
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
    { name: 'Fantasy', color: '#a29bfe' },
    { name: 'Horror', color: '#ff4757' }, 
    { name: 'Mystery', color: '#5352ed' },
    { name: 'Romance', color: '#ff3838' },
    { name: 'School', color: '#18dcff' },
    { name: 'Sci-Fi', color: '#7bed9f' },
    { name: 'Slice of Life', color: '#70a1ff' },
    { name: 'Sports', color: '#ff6348' }
  ];

  // Fetch anime titles once
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

const handleSearchSubmit = (e) => {
  if (e.key === 'Enter' && searchQuery.trim() !== '') {
    setSearchResultsQuery(searchQuery);
    setActivePage(`Search result for "${searchQuery}"`); // dynamic title
    setIsSidebarOpen(true);
    setSuggestions([]);
  }
};

const handleSuggestionClick = (title) => {
  setSearchQuery(title);
  setSearchResultsQuery(title);
  setActivePage(`Search result for "${title}"`); // dynamic title
  setIsSidebarOpen(true);
  setSuggestions([]);
};


  return (
    <div className="homepage">
      {/* Animated Background */}
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
                <a key={idx} href={item.path} className="sidebar-nav-item">
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
                  onClick={() => setActivePage(item.name)}
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
  onKeyDown={handleSearchSubmit}  // ← Add this
  className="search-input"
/>

{suggestions.length > 0 && (
  <ul className="search-suggestions">
    {suggestions.map((title, idx) => (
      <li 
        key={idx} 
        onClick={() => handleSuggestionClick(title)} // ← Updated
      >
        {title}
      </li>
    ))}
  </ul>
)}

            </div>
           
            <div className="nav-actions">
              <button className="nav-btn">
                <User />
              </button>
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
          : activePage === 'advance-search'
          ? 'Advanced Search'
          : activePage}
      </h2>

      {/* Right-side buttons */}
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

     {activePage === 'genre' ? (
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
    </div>
  );
};

export default Homepage;
