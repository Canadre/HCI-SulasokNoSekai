import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate, useLocation } from "react-router-dom";
import "./SearchAnime.css";

const SearchAnime = ({ query: searchQuery }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recommended, setRecommended] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        const q = collection(db, "animes");
        const querySnapshot = await getDocs(q);

        const allAnimes = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const filtered = allAnimes.filter((anime) =>
          anime.title?.toLowerCase().includes(searchQuery.toLowerCase())
        );

        setResults(filtered);

        // ✅ Fetch recommended based on first anime's genre
        if (filtered.length > 0 && filtered[0].genre) {
          const genre = filtered[0].genre;
          const related = allAnimes.filter(
            (anime) => anime.genre === genre && anime.id !== filtered[0].id
          );

          // Shuffle random 5
          const shuffled = related.sort(() => 0.5 - Math.random()).slice(0, 5);
          setRecommended(shuffled);
        } else {
          setRecommended([]);
        }
      } catch (err) {
        console.error("Error fetching search results:", err);
      } finally {
        setLoading(false);
      }
    };

    if (searchQuery) fetchSearchResults();
  }, [searchQuery]);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (results.length === 0)
    return (
      <div className="no-anime">
        <img src="/karl.jpg" alt="No Anime Found" className="no-anime-img" />
        <p className="no-anime-text">
          Oops! We couldn’t find any anime matching "{searchQuery}" 😢
        </p>
        <p className="no-anime-suggestion">
          Try searching another title or check out our featured anime!
        </p>
      </div>
    );

  return (
    <section className="search-anime-page">
      <div className="search-anime-container">
        {results.map((anime) => (
          <div className="featured-card search-anime-card" key={anime.id}>
            <div className="featured-content">
              <img
                src={anime.imageBase64 || "https://via.placeholder.com/150"}
                alt={anime.title || "N/A"}
                className="featured-img anime-image"
                style={{ cursor: "pointer" }}
                onClick={() =>
                  navigate(`/anime/${anime.id}`, {
                    state: { backgroundLocation: location },
                  })
                }
              />
              <div className="featured-details1">
                <h3 className="anime-title">{anime.title || "N/A"}</h3>
                <p className="anime-date">★ {anime.releaseDate || "N/A"}</p>
                <p className="anime-genre">{anime.genre || "N/A"}</p>
                <p className="anime-seasons">
                  {anime.seasons || 0} seasons{" "}
                  {Array.isArray(anime.episodes) ? anime.episodes.length : 0}{" "}
                  episodes
                </p>

                <button
                  className="watch-btn1"
                  onClick={() =>
                    navigate(`/anime/${anime.id}`, {
                      state: { backgroundLocation: location },
                    })
                  }
                >
                  Play Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ✅ Recommended Section */}
      {recommended.length > 0 && (
        <div className="recommended-section">
          <h2>Recommended For You</h2>
          <div className="recommended-list">
            {recommended.map((anime) => (
              <div className="recommended-card" key={anime.id}>
                {/* Video / First Episode Preview */}
                {anime.episodes && anime.episodes[0]?.videoUrl ? (
                  <video
                    className="recommended-video"
                    controls
                    poster={anime.episodes[0]?.thumbnail || ""}
                  >
                    <source
                      src={anime.episodes[0].videoUrl}
                      type="video/mp4"
                    />
                  </video>
                ) : (
                  <img
                    src={anime.imageBase64 || "https://via.placeholder.com/150"}
                    alt={anime.title}
                    className="recommended-img"
                  />
                )}

                <div className="recommended-info">
                  <h3>{anime.episodes?.[0]?.EpisodeTitle || anime.title}</h3>
                  <p>
                    {anime.episodes?.[0]?.EpisodeDescription ||
                      anime.description ||
                      "No description available."}
                  </p>
                  <button
                    className="watch-btn1"
                    onClick={() => navigate(`/anime/${anime.id}`)}
                  >
                    Watch Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default SearchAnime;
