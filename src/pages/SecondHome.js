import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import "./SecondHome.css";

export default function SecondHome() {
  const [featuredList, setFeaturedList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetched, setFetched] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Fetch anime data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "animes"));
        const list = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(), // includes featuredPhoto, episodes, etc.
        }));

        if (list.length > 0) {
          setFeaturedList(list.slice(0, 3));
          setTrends(list.slice(3));
        }

        setFetched(true);
      } catch (err) {
        console.error("Error fetching animes:", err);
      } finally {
        setLoading(false);
      }
    };

    if (!fetched) fetchData();
  }, [fetched]);

  // ✅ Slideshow interval
  useEffect(() => {
    if (featuredList.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % featuredList.length);
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [featuredList]);

  if (loading && !fetched) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  const currentFeatured = featuredList[currentIndex] || {};

  // ✅ Navigate with overlay background
  const openAnimeDetail = (id) => {
    if (!id) return;
    navigate(`/anime/${id}`, { state: { backgroundLocation: location } });
  };

  return (
    <div className="second-home">
      {/* ===== Featured Slideshow Section ===== */}
      {featuredList.length > 0 && (
        <section className="featured">
          {/* 🔹 Background Banner */}
          <div className="featured-banner">
            <img
              src={currentFeatured.featuredPhoto || "https://via.placeholder.com/150"}
              alt={currentFeatured.title}
              className="featured-photo"
            />

            <div className="featured-overlay">
              <div className="featured-card">
                <h2 className="section-title">Featured</h2>
                <div className="featured-content">
                  {/* Poster */}
                  <img
                    src={
                      currentFeatured.imageBase64 ||
                      "https://via.placeholder.com/150"
                    }
                    alt={currentFeatured.title || "N/A"}
                    className="featured-img"
                    onClick={() => openAnimeDetail(currentFeatured.id)}
                    style={{ cursor: "pointer" }}
                  />

                  {/* Details */}
                  <div className="featured-details">
                    <h3>{currentFeatured.title || "N/A"}</h3>
                    <p>{currentFeatured.releaseDate || "N/A"}</p>
                    <p>{currentFeatured.genre || "N/A"}</p>
                    <p>
                      {Array.isArray(currentFeatured.episodes)
                        ? `${currentFeatured.episodes.length} episodes`
                        : "0 episodes"}
                    </p>
                    <button
                      className="watch-btn"
                      onClick={() => openAnimeDetail(currentFeatured.id)}
                    >
                      ▶ Watch Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===== Separator ===== */}
      <div className="section-separator"></div>

      {/* ===== Top Trends Section ===== */}
      <section className="trends">
        <h2 className="section-title">Top Trends Today</h2>
        {trends.length === 0 ? (
          <p>No trends available.</p>
        ) : (
          <div className="trends-container">
            <div className="trends-row">
              {trends.map((anime, index) => (
                <div
                  key={anime.id}
                  className="trend-card"
                  onClick={() => openAnimeDetail(anime.id)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="trend-number">#{index + 1}</div>
                  <img
                    src={anime.imageBase64 || "https://via.placeholder.com/120"}
                    alt={anime.title || "N/A"}
                    className="trend-img"
                  />
                  <div className="trend-info">
                    <p className="trend-title">{anime.title || "N/A"}</p>
                    <p className="trend-genre">{anime.genre || "N/A"}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
