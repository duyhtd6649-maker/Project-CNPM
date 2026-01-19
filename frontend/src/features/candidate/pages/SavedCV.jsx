import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home,
  LayoutDashboard,
  UserCircle,
  FileText,
  Edit3,
  Download,
  Eye,
  Trash2,
  Plus
} from 'lucide-react';
import '../components/SavedCV.css';

const SavedCV = () => {
  const navigate = useNavigate();

  const cvList = [
    {
      id: 1,
      title: "Software Engineer Resume",
      lastModified: "Oct 26, 2024",
      targetPosition: "Software Engineer",
      image: "https://via.placeholder.com/400x300?text=CV+Preview",
    },
    {
      id: 2,
      title: "Digital Marketing Specialist CV",
      lastModified: "Oct 26, 2024",
      targetPosition: "Marketing Specialist",
      image: "https://via.placeholder.com/400x300?text=CV+Preview",
    },
    {
      id: 3,
      title: "Graphic Design Portfolio CV",
      lastModified: "Oct 26, 2024",
      targetPosition: "Graphic Designer",
      image: "https://via.placeholder.com/400x300?text=CV+Preview",
    },
    {
      id: 4,
      title: "Data Analyst Resume",
      lastModified: "Oct 25, 2024",
      targetPosition: "Data Analyst",
      image: "https://via.placeholder.com/400x300?text=CV+Preview",
    },
    {
      id: 5,
      title: "Entry-Level Nurse CV",
      lastModified: "Oct 20, 2024",
      targetPosition: "Nurse",
      image: "https://via.placeholder.com/400x300?text=CV+Preview",
    },
    {
      id: 6,
      title: "Project Manager Resume",
      lastModified: "Oct 18, 2024",
      targetPosition: "Project Manager",
      image: "https://via.placeholder.com/400x300?text=CV+Preview",
    }
  ];

  return (
    <div className="saved-cv-container">
      <header className="saved-cv-header">
        <div className="header-left">
          <div className="logo-vertical" onClick={() => navigate('/home')}>
            <div className="logo-line">UTH</div>
            <div className="logo-line">WORKPLACE</div>
          </div>
        </div>
        <div className="header-right">
          <div className="home-btn" onClick={() => navigate('/home')}>
            <Home size={20} />
            <span>Home</span>
          </div>
        </div>
      </header>

      <div className="saved-cv-body">
        <aside className="saved-cv-sidebar">
          <div className="sidebar-item" onClick={() => navigate('/home')}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </div>
          <div className="sidebar-item" onClick={() => navigate('/profile')}>
            <UserCircle size={20} />
            <span>My Profile</span>
          </div>
          <div className="sidebar-item active">
            <FileText size={20} />
            <span>Saved CVs</span>
          </div>
        </aside>
        <main className="saved-cv-main">
          <h1 className="main-title">Saved CVs</h1>

          <div className="cv-grid">
            <div className="create-new-card" onClick={() => navigate('/create-cv')}>
              <Plus className="plus-icon" />
              <span className="create-text">Create New CV</span>
            </div>
            {cvList.map((cv) => (
              <article key={cv.id} className="cv-card">
                <div className="cv-preview">
                  <img src={cv.image} alt={cv.title} />
                </div>

                <div className="cv-info">
                  <h3 className="cv-title" title={cv.title}>{cv.title}</h3>
                  <p className="cv-meta">Last Modified: {cv.lastModified}</p>
                  <p className="cv-meta">Target Position: {cv.targetPosition}</p>
                </div>

                <div className="cv-actions">
                  <button className="action-btn">
                    <Edit3 />
                    <span>Edit</span>
                  </button>
                  <button className="action-btn">
                    <Download />
                    <span>Download</span>
                  </button>
                  <button className="action-btn">
                    <Eye />
                    <span>Preview</span>
                  </button>
                  <button className="action-btn delete">
                    <Trash2 />
                    <span>Delete</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SavedCV;