import React from 'react';
import { FaSearch } from 'react-icons/fa';
import '../styles/SearchBar.css'; 

const SearchBar = ({ placeholder, value, onChange, onKeyDown, onSearch }) => {
  return (
    <div className="searchbar-container">
      <FaSearch className="searchbar-icon" onClick={onSearch} />
      <input
        className="searchbar-input"
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
      />
    </div>
  );
};

export default SearchBar;