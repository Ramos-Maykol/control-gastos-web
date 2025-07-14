import React from 'react';
import './StatsCard.css';

const StatsCard = ({ title, value, icon, type }) => {
  return (
    <div className={`stat-card stat-card--${type}`}>
      <div className="stat-card__info">
        <h3 className="stat-card__title">{title}</h3>
        <p className="stat-card__value">{value}</p>
      </div>
      <div className="stat-card__icon">
        <span>{icon}</span>
      </div>
    </div>
  );
};

export default React.memo(StatsCard);