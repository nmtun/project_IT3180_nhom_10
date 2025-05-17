import React from 'react';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import '../styles/Vehicle.css';

const Vehicle = () => {
  return (
    <div className="vehicle-container">
        <Header />
        <Sidebar />
        <Navbar />
    </div>
  );
};

export default Vehicle;