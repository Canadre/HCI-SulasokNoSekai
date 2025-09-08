// pages/SearchAnime.js
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate, useLocation } from "react-router-dom";
import "./SearchAnime.css";

const SearchAnime = ({ query: searchQuery }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation(); // track current page for modal overlay

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        const q = collection(db, "animes");
        const querySnapshot = await getDocs(q);

        const filtered = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((anime) =>
            anime.title.toLowerCase().includes(searchQuery.toLowerCase())
          );

        setResults(filtered);
      } catch (err) {
        console.error("Error fetching search results:", err);
      } finally {
        setLoading(false);
      }
    };

    if (searchQuery) fetchSearchResults();
  }, [searchQuery]);

  if (loading) return <p>Loading results...</p>;

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
                    state: { backgroundLocation: location }, // modal overlay
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

                {Array.isArray(anime.episodes) && anime.episodes.length > 0 && (
                  <ul className="anime-episode-list">
                    {anime.episodes.map((ep, idx) => (
                      <li key={idx}>{ep.EpisodeTitle || "Untitled Episode"}</li>
                    ))}
                  </ul>
                )}

                <button
                  className="watch-btn1"
                  onClick={() =>
                    navigate(`/anime/${anime.id}`, {
                      state: { backgroundLocation: location }, // modal overlay
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
    </section>
  );
};

export default SearchAnime;
