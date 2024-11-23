import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Landing from './pages/Landing';
import Cardpack from './pages/Cardpack';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Route for Login Page */}
          <Route path="/" element={<Login />} />
          {/* Route for Landing Page */}
          <Route path="/landing" element={<Landing />} />
          {/* Route for Cardpack page */}
          <Route path="/cardpack" element={<Cardpack />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
