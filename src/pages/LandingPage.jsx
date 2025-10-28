import React from 'react';
import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div>
      <h1>Show Manager</h1>
      <nav>
        <ul>
          <li>
            <Link to="/shows/new">Create New Show</Link>
          </li>
          <li>
            <Link to="/shows">Existing Shows</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default LandingPage;
