import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {

  return (
    <div className="card">
      <h1>Welcome to the Show Manager</h1>
      <p>This is your central hub for managing show productions and budgets.</p>
      <div className="home-actions">
        <Link to="/new-show" className="button">Create a New Show</Link>
        {/* <Link to="/existing-shows" className="button">View Existing Shows</Link> */}
      </div>
    </div>
  );
}

export default HomePage;
