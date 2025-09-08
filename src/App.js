import { Routes, Route, useLocation } from "react-router-dom";
import SplashPage from "./pages/SplashPage";
import HomePage from "./pages/HomePage";
import SecondHome from "./pages/SecondHome";
import AnimeDetail from "./pages/AnimeDetail";
import GenrePage from "./pages/GenrePage";

function App() {
  const location = useLocation();
  const state = location.state;

  return (
    <>
      {/* Main routes (background pages) */}
      <Routes location={state?.backgroundLocation || location}>
        <Route path="/" element={<SplashPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/second-home" element={<SecondHome />} />
        <Route path="/genre/:genre" element={<GenrePage />} />
      </Routes>

      {/* Overlay route for modals */}
      <Routes>
        <Route path="/anime/:id" element={<AnimeDetail />} />
      </Routes>
    </>
  );
}

export default App;