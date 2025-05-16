import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const Home = () => {


  return (
    <div className="home-container">
      <Header />
      <Sidebar />
      <Navbar />
    </div>
  );
};

export default Home; 