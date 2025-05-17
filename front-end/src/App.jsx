import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Household from './pages/Household';
import Fee from './pages/Fee';
import Settings from './pages/Settings';
import Resident from './pages/Resident';
import Vehicle from './pages/Vehicle';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="app">
        <main className="main-content">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/household" element={<Household />} />
            <Route path="/fee" element={<Fee />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/resident" element={<Resident />} />
            <Route path="/vehicle" element={<Vehicle />} />
          </Routes>


        </main>
      </div>
    </Router>
  );
};

export default App;
