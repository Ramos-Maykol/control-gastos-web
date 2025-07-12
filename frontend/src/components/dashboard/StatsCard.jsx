import React from 'react';
import './StatsCard.css';

const StatsCard = ({ title, value, icon, type }) => {
    return (
        <div className={`stat-card ${type}`}>
            <div className="stat-info">
                <h3>{title}</h3>
                <div className="stat-value">{value}</div>
            </div>
            <div className={`stat-icon ${type}`}>{icon}</div>
        </div>
    );
};

export default StatsCard;
