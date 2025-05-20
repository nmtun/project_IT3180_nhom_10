import React from "react";
import "../styles/AddButton.css";

const AddButton = ({ onClick }) => (
  <button className="add-button" onClick={onClick} title="Thêm mới">
    +
  </button>
);

export default AddButton;