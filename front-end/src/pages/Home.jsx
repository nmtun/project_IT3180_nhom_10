import React, { useState, useEffect } from 'react';
import '../styles/Home.css';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import SearchBar from '../components/SearchBar';
import RoomCard from '../components/RoomCard';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Home = () => {
  // Khởi tạo state open từ localStorage
  const [open, setOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved === null ? false : JSON.parse(saved);
  });

  // Lưu lại mỗi khi open thay đổi
  useEffect(() => {
    localStorage.setItem('sidebarOpen', JSON.stringify(open));
  }, [open]);

  const [search, setSearch] = useState('');

  const [selectedFloor, setSelectedFloor] = useState(null);

  const [floorScroll, setFloorScroll] = useState(0);
  const floorSelectRef = React.useRef(null);

  const scrollFloors = (direction) => {
    if (floorSelectRef.current) {
      const scrollAmount = 200; // px mỗi lần bấm
      floorSelectRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="home-container">
      <Header />
      <div className="home-body">
        <Sidebar open={open} setOpen={setOpen} />
        <div className={`home-content ${open ? 'sidebar-open' : 'sidebar-closed'}`}>
          <div className="floor-select-wrapper">
            <button className="floor-arrow" onClick={() => scrollFloors('left')}>
              <FaChevronLeft />
            </button>
            <div className="floor-select" ref={floorSelectRef}>
              {Array.from({ length: 24 }).map((_, floorIdx) => (
                <button
                  key={floorIdx}
                  className={selectedFloor === floorIdx ? 'selected' : ''}
                  onClick={() => setSelectedFloor(floorIdx)}
                >
                  Tầng {floorIdx + 1}
                </button>
              ))}
            </div>
            <button className="floor-arrow" onClick={() => scrollFloors('right')}>
              <FaChevronRight />
            </button>
          </div>
          <div className="home-cards">
            {selectedFloor !== null && (
              <div className="room-row">
                {Array.from({ length: 10 }).map((_, roomIdx) => (
                  <RoomCard key={roomIdx} title={`Tầng ${selectedFloor + 1}`}>
                    <p>Phòng {roomIdx + 1}</p>
                  </RoomCard>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Navbar />
    </div>
  );
};

export default Home;
