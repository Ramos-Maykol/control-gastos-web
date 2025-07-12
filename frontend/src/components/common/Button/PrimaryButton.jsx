// src/components/common/Button/PrimaryButton.jsx
import React from 'react';

const PrimaryButton = ({ onClick, children, type = "button" }) => {
    return (
        <button onClick={onClick} type={type} className="btn btn-primary">
            {children}
        </button>
    );
};

export default PrimaryButton;
