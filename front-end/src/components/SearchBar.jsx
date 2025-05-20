import React from 'react';
import { FaSearch } from 'react-icons/fa';
import '../styles/SearchBar.css'; 

const SearchBar = ({ value, onChange, placeholder }) => {
  return (
    <div className="searchbar-container">
      <FaSearch className="searchbar-icon" />
      <input
        className="searchbar-input"
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder || "Tìm kiếm..."}
      />
    </div>
  );
};

export default SearchBar;