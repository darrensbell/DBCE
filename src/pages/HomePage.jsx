import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {

  return (
    <div className="card">
      <h1>Welcome to TheatreBudget</h1>
      <p>Your all-in-one solution for managing theatre production budgets.</p>
      <div className="home-actions">
        <Link to="/shows" className="button">Get Started</Link>
      </div>
    </div>
  );
}

export default HomePage;
