import React from 'react';
import { useNavigate } from 'react-router-dom';
import CandidateNavbar from '../components/CandidateNavbar';
import '../components/HomepageCandidates.css';
import '../components/notificationunderdevelopment.css';

const NotificationSystem = () => {
  const navigate = useNavigate();

  return (
    <div className="ns-body">
      <header className="ns-header">
        <div className="ns-header-container">
          <div className="ns-header-left">
            <div className="ns-logo">
              <span className="ns-logo-main">UTH</span>
              <span className="ns-logo-sub">WORKPLACE</span>
            </div>
          </div>

        </div>
      </header>


      <main className="ns-main">
        <div className="ns-card">
          <div className="ns-card-icon-wrapper">
            <div className="ns-glow-effect"></div>
            <div className="ns-main-icon-circle">
              <span className="material-icons-outlined ns-icon-engineering">engineering</span>
            </div>
            <span className="material-icons-outlined ns-icon-float ns-icon-build">build</span>
            <span className="material-icons-outlined ns-icon-float ns-icon-code">code</span>
          </div>

          <h1 className="ns-title">
            We're Building Something Great
          </h1>
          <p className="ns-description">
            This feature is currently under active development. Our team is working hard to bring you a better experience. Stay tuned for updates!
          </p>

          <div className="ns-progress-bar-bg">
            <div className="ns-progress-bar-fill"></div>
          </div>

          <div className="ns-actions">
            <a className="ns-btn ns-btn-primary" onClick={() => navigate('/homepage')} style={{ cursor: 'pointer' }}>
              <span className="material-icons-outlined">dashboard</span>
              Back to Dashboard
            </a>

            <a className="ns-btn ns-btn-outline" href="#">
              <span className="material-icons-outlined">notifications_active</span>
              Notify Me When Ready
            </a>
          </div>

          <div className="ns-card-footer">
            <p className="ns-feedback-text">
              Have feedback? <a href="#">Contact Support</a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotificationSystem;
