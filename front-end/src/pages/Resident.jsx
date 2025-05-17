import React from 'react';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import '../styles/Resident.css';

const Resident = () => {
  return (
    <div className="resident-container">
        <Header />
        <Sidebar />
        <Navbar />
    </div>
  );
};

export default Resident;