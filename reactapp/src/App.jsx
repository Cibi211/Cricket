import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./components/Home";
import AddPlayer from "./components/Addplayer";
import ViewPlayer from "./components/ViewPlayer";

function App() {
  useEffect(() => {
    // remove default body gap
    document.body.style.margin = "0";
    document.body.style.padding = "0";
  }, []);

  return (
    <BrowserRouter>
      <div>
       

        {/* Page Routes */}
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/addPlayer" element={<AddPlayer />} />
            <Route path="/viewplayer" element={<ViewPlayer />} />
          </Routes>
        </main>

       
      </div>
    </BrowserRouter>
  );
}

export default App;