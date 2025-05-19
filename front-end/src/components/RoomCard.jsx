import React from 'react';
import '../styles/RoomCard.css'; 

const RoomCard = ({ title, children, style }) => (
  <div className="custom-card" style={style}>
    {title && <div className="custom-card-title">{title}</div>}
    <div className="custom-card-body">
      {children}
    </div>
  </div>
);

export default RoomCard;