import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

  // Fetch anime data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "animes"));
        const list = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
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

  // Slideshow interval
  useEffect(() => {
    if (featuredList.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % featuredList.length);
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [featuredList]);

  // Show loading on first fetch
  if (loading && !fetched) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // Prevent crash if featuredList is empty
  const currentFeatured = featuredList[currentIndex] || {};

  return (
    <div className="second-home">
      {/* ===== Featured Slideshow Section ===== */}
      {featuredList.length > 0 && (
        <section className="featured">
          <div className="featured-card">
            <h2 className="section-title">Featured</h2>
            <div className="featured-content">
              <img
                src={currentFeatured.imageBase64 || "https://via.placeholder.com/150"}
                alt={currentFeatured.title || "N/A"}
                className="featured-img"
                onClick={() => currentFeatured.id && navigate(`/anime/${currentFeatured.id}`)}
                style={{ cursor: "pointer" }}
              />
              <div className="featured-details">
                <h3>{currentFeatured.title || "N/A"}</h3>
                <p>{currentFeatured.releaseDate || "N/A"}</p>
                <p>{currentFeatured.genre || "N/A"}</p>
                <p>
                  {currentFeatured.seasons
                    ? `${currentFeatured.seasons} seasons ${currentFeatured.episodes || 0} episodes`
                    : "0 seasons 0 episodes"}
                </p>
                <button
                  className="watch-btn"
                  onClick={() => currentFeatured.id && navigate(`/anime/${currentFeatured.id}`)}
                >
                  ▶ Watch Now
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===== Top Trends Section ===== */}
      <section className="trends">
        <h2 className="section-title">Top Trends Today</h2>
        {trends.length === 0 ? (
          <p>No trends available.</p>
        ) : (
          <div className="trends-row">
            {trends.map((anime) => (
              <div
                key={anime.id}
                className="trend-card"
                onClick={() => anime.id && navigate(`/anime/${anime.id}`)}
                style={{ cursor: "pointer" }}
              >
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
        )}
      </section>
    </div>
  );
}
