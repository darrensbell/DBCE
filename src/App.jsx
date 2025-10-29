import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import NewShowPage from './pages/NewShowPage';
import ShowHomepage from './pages/ShowHomepage';
import ShowDetailPage from './pages/ShowDetailPage';
import BudgetPage from './pages/BudgetPage';
import NewBudgetPage from './pages/NewBudgetPage'; // Import the new budget page
import './styles/global.css';

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="app-container">
        <nav className="sidebar">
          <div className="sidebar-header">
            <h2>Show Manager</h2>
          </div>
          <ul>
            <li><Link to="/shows">Shows</Link></li>
          </ul>
        </nav>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate replace to="/shows" />} />
            <Route path="/shows" element={<ShowHomepage />} />
            <Route path="/shows/new" element={<NewShowPage />} />
            <Route path="/shows/:showId" element={<ShowDetailPage />} />
            {/* Add the new route for creating a budget */}
            <Route path="/shows/:showId/budgets/new" element={<NewBudgetPage />} />
            <Route path="/budgets/:budgetId" element={<BudgetPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
