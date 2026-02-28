import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Members from "./pages/Members";
import Navigation from "./components/Navigation"; // import the nav component

function App() {
  return (
    <BrowserRouter>
      <Navigation /> {/* reusable navbar */}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/members" element={<Members />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;