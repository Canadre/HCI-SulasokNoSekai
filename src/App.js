import { Routes, Route } from "react-router-dom";
import SplashPage from "./pages/SplashPage";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<SplashPage />} />
      <Route path="/home" element={<HomePage />} />
    </Routes>
  );
}

export default App;
