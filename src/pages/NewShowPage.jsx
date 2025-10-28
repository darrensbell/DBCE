import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { logError } from '../utils/logger';

function NewShowPage() {
  const [showName, setShowName] = useState('');
  const [showDate, setShowDate] = useState('');
  const [plannedPerformances, setPlannedPerformances] = useState(1);
  const [venue, setVenue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Create the new show
      const { data: newShow, error: showErr } = await supabase
        .from('dbce_shows')
        .insert([{ show_name: showName, show_date: showDate, planned_performances: plannedPerformances, venue: venue }])
        .select()
        .single();

      if (showErr) throw showErr;
      const newShowId = newShow.id;

      // 2. Fetch all budget categories from the correct table
      const { data: categories, error: categoriesErr } = await supabase.from('dbce_categories').select('id');
      if (categoriesErr) throw categoriesErr;

      // 3. Create the budget for the new show
      const { data: budget, error: budgetErr } = await supabase
        .from('dbce_budgets')
        .insert([{ show_id: newShowId, budget_name: `${showName} Budget` }])
        .select()
        .single();
      
      if (budgetErr) throw budgetErr;
      const newBudgetId = budget.id;

      // 4. Create line items for each category
      const lineItems = categories.map(category => ({
        budget_id: newBudgetId,
        category_id: category.id, // Correct column name
        line_item_amount: 0, // Default to 0
      }));

      const { error: lineItemsErr } = await supabase.from('dbce_budget_line_items').insert(lineItems);
      if (lineItemsErr) throw lineItemsErr;

      // 5. Navigate to the new show's homepage
      navigate(`/shows/${newShowId}`);

    } catch (err) {
      logError(err, 'Error creating new show and budget');
      setError('Failed to create the show. Please check the details and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Create a New Show</h2>
      <form onSubmit={handleSubmit}>
        {error && <p className="error-message">{error}</p>}
        <div className="form-group">
          <label>Show Name</label>
          <input type="text" value={showName} onChange={(e) => setShowName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Show Date</label>
          <input type="date" value={showDate} onChange={(e) => setShowDate(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Planned Performances</label>
          <input type="number" value={plannedPerformances} onChange={(e) => setPlannedPerformances(e.target.value)} min="1" required />
        </div>
        <div className="form-group">
          <label>Venue</label>
          <input type="text" value={venue} onChange={(e) => setVenue(e.target.value)} required />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Creating Show...' : 'Create Show'}
        </button>
      </form>

      <style jsx>{`
        .error-message {
          color: red;
          margin-bottom: 1rem;
        }
      `}</style>
    </div>
  );
}

export default NewShowPage;
