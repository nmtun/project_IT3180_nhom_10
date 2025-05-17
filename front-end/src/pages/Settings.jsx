import React from 'react';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import '../styles/Settings.css';

const Settings = () => {
  return (
    <div className="settings-container">
        <Header />
        <Sidebar />
        <Navbar />
    </div>
  );
};

export default Settings;