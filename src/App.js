import { Routes, Route } from "react-router-dom";
import SplashPage from "./pages/SplashPage";
import HomePage from "./pages/HomePage";
import SecondHome from "./pages/SecondHome";
import AnimeDetail from "./pages/AnimeDetail";

function App() {
  return (
    <Routes>
      <Route path="/" element={<SplashPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/second-home" element={<SecondHome />} />
      <Route path="/anime/:id" element={<AnimeDetail />} />
    </Routes>
  );
}

export default App;
