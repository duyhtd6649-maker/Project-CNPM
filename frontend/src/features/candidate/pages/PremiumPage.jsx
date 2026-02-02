import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import CandidateNavbar from '../components/CandidateNavbar';
import "../components/HomepageCandidates.css";
import "../components/PremiumPage.css";


const PremiumPage = () => {
  const navigate = useNavigate();
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    { name: 'Free', price: 0, button: 'Try for Free' },
    { name: 'Personal', price: 9, button: 'Try Personal' },
    { name: 'Professional', price: 30, button: 'Try Professional' },
    { name: 'Startup', price: 60, button: 'Try Startup' },
    { name: 'Business', price: 90, button: 'Try Business' },
  ];

  return (
    <div className="hp-container">
      <CandidateNavbar />

      <div className="premium-content">
        <div className="billing-toggle">
          <span>Month</span>
          <label className="switch">
            <input type="checkbox" onChange={() => setIsYearly(!isYearly)} />
            <span className="slider round"></span>
          </label>
          <span>Year</span>
        </div>

        <div className="plans-grid">
          {plans.map((plan) => (
            <div key={plan.name} className="plan-card">
              <h3>{plan.name}</h3>
              <div className="price-tag">
                <span className="currency">$</span>
                <span className="amount">{isYearly ? plan.price * 10 : plan.price}</span>
                <span className="period">/mon</span>
              </div>
              <button className="plan-button">{plan.button}</button>
            </div>
          ))}
        </div>

        <div className="back-to-menu" onClick={() => navigate('/homepage')}>
          <ArrowLeft size={18} /> Back to menu
        </div>
      </div>
    </div>
  );
};

export default PremiumPage;