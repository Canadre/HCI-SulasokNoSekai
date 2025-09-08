import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate, useLocation } from "react-router-dom"; 
import "./GenrePage.css";

const GenrePage = ({ genre, showAll = false, title, sortOrder = null }) => {
  const [animes, setAnimes] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation(); 

  useEffect(() => {
    const fetchAnimes = async () => {
      setLoading(true);

      try {
        const querySnapshot = await getDocs(collection(db, "animes"));
        let animeData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // ✅ Fix: Proper genre filtering with includes()
        if (!showAll && genre) {
          animeData = animeData.filter((anime) => {
            if (!anime.genre) return false;

            // If genre is an array
            if (Array.isArray(anime.genre)) {
              return anime.genre.some((g) =>
                g.toLowerCase().includes(genre.toLowerCase())
              );
            }

            // If genre is a string (comma-separated or single)
            return anime.genre
              .toLowerCase()
              .split(",")
              .map((g) => g.trim())
              .some((g) => g.includes(genre.toLowerCase()));
          });
        }

        // ✅ Sorting
        if (sortOrder === "asc") {
          animeData.sort((a, b) => a.title.localeCompare(b.title));
        } else if (sortOrder === "desc") {
          animeData.sort((a, b) => b.title.localeCompare(a.title));
        }

        setAnimes(animeData);
      } catch (err) {
        console.error("Error fetching animes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimes();
  }, [genre, showAll, sortOrder]);

  return (
    <div className="genre-page">
      {/* Floating background elements */}
      <div className="floating-elements">
        <div className="floating-star"></div>
        <div className="floating-star"></div>
        <div className="floating-star"></div>
      </div>

      <div className="genre-page-container">
        {/* Header Section */}
        <div className="genre-header">
          <h1 className="genre3-title">
            {title || (genre ? `${genre} Anime` : "All Anime")}
          </h1>
          <p className="genre-subtitle">
            Discover amazing anime in this collection
          </p>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">Loading your anime collection...</p>
          </div>
        ) : animes.length > 0 ? (
          <div className="anime-grid">
            {animes.map((anime) => (
              <div
                key={anime.id}
                className="anime-card"
                onClick={() =>
                  navigate(`/anime/${anime.id}`, {
                    state: { backgroundLocation: location },
                  })
                }
              >
                <div className="anime-image">
                  <img
                    src={
                      anime.imageBase64 ||
                      "https://via.placeholder.com/250x320/2c3e50/ffffff?text=No+Image"
                    }
                    alt={anime.title}
                    loading="lazy"
                  />
                </div>
                <div className="anime-info">
                  <h3 className="anime-title">{anime.title}</h3>
                  {anime.genre && (
                    <p className="anime-genre">
                      {Array.isArray(anime.genre)
                        ? anime.genre.join(", ")
                        : anime.genre}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-anime">
            <img src="/karl.jpg" alt="No Anime Found" />
            <p className="no-anime-text">No anime found in this collection</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenrePage;
