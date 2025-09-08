import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate, useLocation } from "react-router-dom";
import "./PopularAnime.css";

const PopularAnime = () => {
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

        // 🔥 Priority titles
        const priorityTitles = [
          "Demon Slayer: Kimetsu no Yaiba",
          "Naruto: Shippuden",
          "Hunter x Hunter",
          "Dragon Ball Z",
          "One Piece",
          "Jujutsu Kaisen",
          "Haikyu",
          "Attack on Titan",
          "One Punch",
          "Bleach",
          "Hajime no Ippo"
        ];

        // 🔥 Custom sort: priority first, then alphabetical
        animeData.sort((a, b) => {
          const aPriority = priorityTitles.findIndex(
            (t) => t.toLowerCase() === (a.title || "").toLowerCase()
          );
          const bPriority = priorityTitles.findIndex(
            (t) => t.toLowerCase() === (b.title || "").toLowerCase()
          );

          if (aPriority !== -1 && bPriority !== -1) {
            return aPriority - bPriority; // both are priority, keep order
          } else if (aPriority !== -1) {
            return -1; // a is priority
          } else if (bPriority !== -1) {
            return 1; // b is priority
          } else {
            return (a.title || "").localeCompare(b.title || "");
          }
        });

        setAnimes(animeData);
      } catch (err) {
        console.error("Error fetching animes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimes();
  }, []);

  return (
    <div className="popular-anime-page">
      <div className="popular-header">
        <h1 className="popular-title">🔥 Popular Anime</h1>
        <p className="popular-subtitle">
          Explore trending and most popular anime right now
        </p>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Fetching popular anime...</p>
        </div>
      ) : animes.length > 0 ? (
        <div className="popular-grid">
          {animes.map((anime) => (
            <div
              key={anime.id}
              className="popular-card"
              onClick={() =>
                navigate(`/anime/${anime.id}`, {
                  state: { backgroundLocation: location },
                })
              }
            >
              <div className="popular-img-wrapper">
                <img
                  src={
                    anime.imageBase64 ||
                    "https://via.placeholder.com/250x320/2c3e50/ffffff?text=No+Image"
                  }
                  alt={anime.title}
                  className="popular-img"
                  loading="lazy"
                />
              </div>
              <div className="popular-info">
                <h3 className="popular-anime-title">{anime.title}</h3>
                <p className="popular-anime-genre">{anime.genre || "Unknown"}</p>
                {Array.isArray(anime.episodes) && (
                  <p className="popular-episodes">
                    {anime.episodes.length} episodes
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-anime">
          <img src="/karl.jpg" alt="No Anime Found" />
          <p className="no-anime-text">No popular anime found</p>
        </div>
      )}
    </div>
  );
};

export default PopularAnime;
