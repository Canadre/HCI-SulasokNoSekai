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

        // Filter by genre if needed
        if (!showAll && genre) {
          animeData = animeData.filter(
            (anime) =>
              anime.genre &&
              anime.genre.toLowerCase().includes(genre.toLowerCase())
          );
        }

        // Sort only if sortOrder is provided
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
  }, [genre, showAll, sortOrder]); // sortOrder optional

  return (
    <div className="genre-page">
      {loading ? (
        <p>Loading...</p>
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
              style={{ cursor: "pointer" }}
            >
              <div className="anime-image">
                <img
                  src={anime.imageBase64 || "https://via.placeholder.com/120"}
                  alt={anime.title}
                />
              </div>
              <div className="anime-info">
                <h3 className="anime-title">{anime.title}</h3>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-anime">
          <img src="/karl.jpg" alt="No Anime" />
        </div>
      )}
    </div>
  );
};

export default GenrePage;
