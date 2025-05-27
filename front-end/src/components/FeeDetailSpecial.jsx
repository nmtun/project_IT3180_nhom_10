import React from 'react';

const FeeDetailSpecial = ({ details, onStatusChange }) => {
  if (!details || details.length === 0) {
    return <p>Chưa có dữ liệu nộp phí cho đợt thu này.</p>;
  }

  return (
    <div>
      <h1>Đây là FeeDetailSpecial</h1>
    </div>
  );
};

export default FeeDetailSpecial;
