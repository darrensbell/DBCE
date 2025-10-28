import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import NewShowPage from './pages/NewShowPage';
import ExistingShowsPage from './pages/ExistingShowsPage';
import ShowHomepage from './pages/ShowHomepage';
import NewBudgetPage from './pages/NewBudgetPage';
import BudgetPage from './pages/BudgetPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/shows/new" element={<NewShowPage />} />
        <Route path="/shows" element={<ExistingShowsPage />} />
        <Route path="/shows/:showId" element={<ShowHomepage />} />
        <Route path="/shows/:showId/budgets/new" element={<NewBudgetPage />} />
        <Route path="/budgets/:budgetId" element={<BudgetPage />} />
      </Routes>
    </Router>
  );
}

export default App;
