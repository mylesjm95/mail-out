'use client';
import React, { useEffect, useState } from 'react';
import './Toast.css';

const Toast = ({ message, type = 'success', duration = 5000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onClose();
      }, 300); // Wait for fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div className={`toast-notification ${type} ${isVisible ? 'show' : ''}`}>
      <div className="toast-content">
        <div className="toast-icon">
          {type === 'success' && <i className="fas fa-check-circle"></i>}
          {type === 'error' && <i className="fas fa-exclamation-triangle"></i>}
          {type === 'info' && <i className="fas fa-info-circle"></i>}
        </div>
        <div className="toast-message">{message}</div>
        <button className="toast-close" onClick={handleClose}>
          <i className="fas fa-times"></i>
        </button>
      </div>
    </div>
  );
};

export default Toast;
