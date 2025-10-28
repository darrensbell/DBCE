import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import NewShowPage from './pages/NewShowPage';
import ShowHomepage from './pages/ShowHomepage'; // Corrected import
import BudgetPage from './pages/BudgetPage';
import './styles/global.css'; // Ensure this is imported

function App() {
  return (
    <Router>
      <div className="app-container">
        <nav className="sidebar">
          <div className="sidebar-header">
            <h2>Show Manager</h2>
          </div>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/new-show">Create New Show</Link></li>
          </ul>
        </nav>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/new-show" element={<NewShowPage />} />
            <Route path="/shows/:showId" element={<ShowHomepage />} /> {/* Corrected component */}
            <Route path="/budgets/:budgetId" element={<BudgetPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
