import "./App.css";
import CreationPage from "./pages/CreationPage";
import PlacesPage from "./pages/PlacesPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="flex items-center justify-center w-full min-h-screen">
        <Routes>
          <Route path="/" element={<CreationPage />} />
          <Route path="/places" element={<PlacesPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
