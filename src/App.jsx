import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import NewShowPage from './pages/NewShowPage';
import ShowHomepage from './pages/ShowHomepage';
import ShowDetailPage from './pages/ShowDetailPage';
import BudgetPage from './pages/BudgetPage';
import NewBudgetPage from './pages/NewBudgetPage';
import SideBar from './components/SideBar';
import './styles/global.css';

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="app-container">
        <SideBar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shows" element={<ShowHomepage />} />
            <Route path="/shows/new" element={<NewShowPage />} />
            <Route path="/shows/:showId" element={<ShowDetailPage />} />
            <Route path="/shows/:showId/budgets/new" element={<NewBudgetPage />} />
            <Route path="/budgets/:budgetId" element={<BudgetPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
