import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase"; // <-- make sure you have firebase.js config
import "./AdvancePage.css";

const AdvancePage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // State
  const [allAnime, setAllAnime] = useState([]);
  const [results, setResults] = useState([]);
  const [showFilters, setShowFilters] = useState(true);

  const [filters, setFilters] = useState({
    releaseYear: "",
    releaseMonth: "",
    releaseDay: "",
    genres: [], // ✅ multiple genres
    type: "All",
    status: "All",
  });

  const genreOptions = [
    "Action", "Adventure", "Comedy", "Drama","Fantasy", "Horror",
    "Mystery", "Romance",
    "School", "Sci-Fi", "Slice of Life", "Sports"
  ];

  const months = [
    "Month", "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const typeOptions = ["All", "Subbed", "Dubbed"];
  const statusOptions = ["All", "Completed", "Ongoing"];

  // Fetch data from Firestore
  useEffect(() => {
    const fetchAnime = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "animes"));
        const animeList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // ✅ remove fake data
        const cleanList = animeList.filter(
          (anime) => anime.title && anime.genre && anime.releaseDate
        );

        setAllAnime(cleanList);
      } catch (error) {
        console.error("Error fetching anime data:", error);
      }
    };

    fetchAnime();
  }, []);

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
  };

  const toggleGenre = (genre) => {
    setFilters((prev) => {
      const alreadySelected = prev.genres.includes(genre);
      if (alreadySelected) {
        return { ...prev, genres: prev.genres.filter((g) => g !== genre) };
      } else {
        return { ...prev, genres: [...prev.genres, genre] };
      }
    });
  };

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [""];
    for (let year = currentYear; year >= 1960; year--) {
      years.push(year.toString());
    }
    return years;
  };

  const generateDayOptions = () => {
    const days = [""];
    for (let day = 1; day <= 31; day++) {
      days.push(day.toString());
    }
    return days;
  };

  const handleSearch = () => {
    if (!allAnime || allAnime.length === 0) return;

    const filtered = allAnime.filter((anime) => {
      // ✅ Multi-genre check
      const matchGenre =
        filters.genres.length === 0 ||
        filters.genres.some((g) => anime.genre && anime.genre.includes(g));

      const matchType =
        filters.type === "All" ||
        filters.type === "Subbed" ||
        filters.type === "Dubbed";

      const matchStatus =
        filters.status === "All" ||
        filters.status === "Completed" ||
        filters.status === "Ongoing";

      const animeDate = new Date(anime.releaseDate);
      const filterYear = filters.releaseYear
        ? parseInt(filters.releaseYear)
        : null;
      const filterMonth = filters.releaseMonth
        ? parseInt(filters.releaseMonth)
        : null;
      const filterDay = filters.releaseDay
        ? parseInt(filters.releaseDay)
        : null;

      let matchDate = true;
      if (filterYear && animeDate.getFullYear() !== filterYear) matchDate = false;
      if (filterMonth && animeDate.getMonth() + 1 !== filterMonth) matchDate = false;
      if (filterDay && animeDate.getDate() !== filterDay) matchDate = false;

      return matchGenre && matchDate && matchType && matchStatus;
    });

    setResults(filtered);
    setShowFilters(false);
  };

  const handleShowFilters = () => {
    setShowFilters(true);
    setResults([]); // hide results
  };

  const handleAnimeClick = (animeId) => {
    navigate(`/anime/${animeId}`, {
      state: { backgroundLocation: location },
    });
  };

  return (
    <div className="advance-search-container">
      {showFilters && (
        <div className="filter-section">
          <h2 className="filter-title">Filter</h2>

          {/* Type & Status Filter */}
          <div className="select-group">
            <label>Type</label>
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange("type", e.target.value)}
              className="filter-select"
            >
              {typeOptions.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            <label>Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="filter-select"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Release Date Filter */}
          <div className="date-group">
            <label>Release Date</label>
            <div className="date-selects">
              <select
                value={filters.releaseYear}
                onChange={(e) => handleFilterChange("releaseYear", e.target.value)}
                className="date-select year-select"
              >
                <option value="">Year</option>
                {generateYearOptions().map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <select
                value={filters.releaseMonth}
                onChange={(e) => handleFilterChange("releaseMonth", e.target.value)}
                className="date-select month-select"
              >
                <option value="">Month</option>
                {months.slice(1).map((month, index) => (
                  <option key={month} value={index + 1}>
                    {month}
                  </option>
                ))}
              </select>
              <select
                value={filters.releaseDay}
                onChange={(e) => handleFilterChange("releaseDay", e.target.value)}
                className="date-select day-select"
              >
                <option value="">Day</option>
                {generateDayOptions().map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Genre buttons */}
          <div className="genre-section">
            <h3 className="genre2-title">Genres (Multiple)</h3>
            <div className="genre-buttons">
              {genreOptions.map((genre) => (
                <button
                  key={genre}
                  className={`genre-btn ${
                    filters.genres.includes(genre) ? "active" : ""
                  }`}
                  onClick={() => toggleGenre(genre)}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          <button className="filter-button" onClick={handleSearch}>
            Filter
          </button>
        </div>
      )}

      {!showFilters && (
        <div style={{ marginBottom: "20px" }}>
          <button className="filter-button" onClick={handleShowFilters}>
            Change Filters
          </button>
        </div>
      )}

      <section className="search-anime-page">
        {/* Grid Container - Named as "box" */}
        <div className="box">
          {!showFilters && results.length > 0 ? (
            results.map((anime) => (
              /* Anime Card - Named as "Animecards" */
              <div className="Animecards" key={anime.id}>
                {/* Image Container */}
                <div className="anime-image-container">
                  <img
                    src={anime.imageBase64 || "https://via.placeholder.com/300x200"}
                    alt={anime.title || "N/A"}
                    className="anime-image"
                    onClick={() => handleAnimeClick(anime.id)}
                  />
                </div>

                {/* Card Content */}
                <div className="anime-card-content">
                  <h3 className="anime-title">{anime.title || "N/A"}</h3>
                  
                  <div className="anime-info">
                    <p className="anime-date">{anime.releaseDate || "N/A"}</p>
                    <p className="anime-genre">{anime.genre || "N/A"}</p>
                    <p className="anime-extra">
                      Type: {filters.type !== "All" ? filters.type : "N/A"} | Status:{" "}
                      {filters.status !== "All" ? filters.status : "N/A"}
                    </p>
                  </div>

                  <button
                    className="watch-btn"
                    onClick={() => handleAnimeClick(anime.id)}
                  >
                    Play Now
                  </button>
                </div>
              </div>
            ))
          ) : (
            !showFilters && <div className="no-results">No results found</div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AdvancePage;