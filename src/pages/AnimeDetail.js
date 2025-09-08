import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import "./AnimeDetail.css";

export default function AnimeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const episodeRefs = useRef([]);
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // ✅ Lock scroll kapag nasa AnimeDetail
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // Fetch anime from Firestore
  useEffect(() => {
    const fetchAnime = async () => {
      try {
        const docRef = doc(db, "animes", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = { id: docSnap.id, ...docSnap.data() };
          data.episodes = data.episodes || [];
          setAnime(data);
        } else {
          console.log("No such document!");
        }
      } catch (err) {
        console.error("Error fetching anime:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnime();
  }, [id]);

  // Scroll and select episode
  const scrollToEpisode = (index) => {
    setCurrentEpisodeIndex(index);
    setIsPlaying(false); // reset play state

    if (episodeRefs.current[index]) {
      episodeRefs.current[index].scrollIntoView({ behavior: "smooth" });
    }
  };

  // Custom play button → play + fullscreen
  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);

      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if (videoRef.current.webkitRequestFullscreen) {
        videoRef.current.webkitRequestFullscreen();
      } else if (videoRef.current.msRequestFullscreen) {
        videoRef.current.msRequestFullscreen();
      }
    }
  };

  if (loading) return <p className="loading">Loading...</p>;
  if (!anime) return <p className="not-found">Anime not found.</p>;

  const hasEpisodes = anime.episodes && anime.episodes.length > 0;
  const currentEpisode = hasEpisodes
    ? anime.episodes[currentEpisodeIndex]
    : null;

  return (
    <div className="anime-detail">
      {/* Back Button */}
      <button className="back-btn" onClick={() => navigate(-1)}>
        ⬅ Back
      </button>

      {/* Anime Header */}
      <div className="anime-header">
        <img
          src={anime.imageBase64 || "https://via.placeholder.com/200"}
          alt={anime.title}
          className="anime-cover"
        />
        <div className="anime-info1">
          <h1>{anime.title}</h1>
          <p><strong>Release Date:</strong> {anime.releaseDate || "Unknown"}</p>
          <p><strong>Genre:</strong> {anime.genre || "N/A"}</p>
          <p><strong>Status:</strong> {anime.completed ? "Completed" : "Ongoing"}</p>
          <p><strong>Description:</strong> {anime.description || "No description"}</p>
          <p><strong>Total Episodes:</strong> {anime.episodes?.length || 0}</p>
        </div>
      </div>

      {/* Episodes Section */}
      <div className="episodes-wrapper">
        {hasEpisodes ? (
          <>
            <div className="episodes-section">
              <ul className="episodes-list">
                <li
                  ref={(el) => (episodeRefs.current[currentEpisodeIndex] = el)}
                  className="episode-card"
                >
                  <h3 className="episode-title">
                    Episode {currentEpisodeIndex + 1}:{" "}
                    {currentEpisode.EpisodeTitle ||
                      currentEpisode.title ||
                      "Untitled"}
                  </h3>

                  {/* Video Player */}
                  {currentEpisode.videoUrl || currentEpisode.url ? (
                    <div
                      className="episode-video-wrapper"
                      style={{ position: "relative" }}
                    >
                      <video
                        key={currentEpisodeIndex}
                        ref={videoRef}
                        className="episode-video"
                        poster={currentEpisode.thumbnail || ""}
                        controls={isPlaying}
                      >
                        <source
                          src={currentEpisode.videoUrl || currentEpisode.url}
                          type="video/mp4"
                        />
                      </video>

                      {/* Custom Play Button */}
                      {!isPlaying && (
                        <button
                          className="custom-play-btn"
                          onClick={handlePlay}
                          style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            fontSize: "3rem",
                            background: "rgba(0,0,0,0.6)",
                            border: "none",
                            borderRadius: "50%",
                            color: "white",
                            cursor: "pointer",
                            padding: "20px 30px",
                          }}
                        >
                          ▶
                        </button>
                      )}
                    </div>
                  ) : (
                    <p className="episode-description">No Episodes</p>
                  )}

                  <p className="episode-description">
                    {currentEpisode.EpisodeDescription ||
                      currentEpisode.description ||
                      "No description"}
                  </p>
                </li>
              </ul>
            </div>

            {/* Episode Number Sidebar */}
            <div className="episodes container">
              <p className="episode-number-label">Episodes:</p>
              <div className="episode-number-sidebar">
                {anime.episodes.map((_, idx) => (
                  <button
                    key={idx}
                    className="episode-number-button"
                    onClick={() => scrollToEpisode(idx)}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <p className="not-found">No Episodes</p>
        )}
      </div>
    </div>
  );
}
