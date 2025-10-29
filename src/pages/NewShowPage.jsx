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

      // 2. Fetch all standard categories
      const { data: categories, error: categoriesErr } = await supabase.from('dbce_budget_categories').select('*');
      if (categoriesErr) throw categoriesErr;

      // 3. Create the budget for the new show
      const { data: budget, error: budgetErr } = await supabase
        .from('dbce_budgets')
        .insert([{ show_id: newShowId, budget_name: `${showName} Budget` }])
        .select()
        .single();
      
      if (budgetErr) throw budgetErr;
      const newBudgetId = budget.id;

      // 4. Create line items for each category by copying category data
      const lineItems = categories.map(category => {
        const defaultRate = 0;
        const defaultQuantity = 1;
        const defaultNumberOfItems = 1;
        
        return {
          budget_id: newBudgetId,
          summary_group: category.summary_group,
          department: category.department,
          sub_department: category.sub_department,
          line_item: category.line_item,
          number_of_items: defaultNumberOfItems,
          quantity: defaultQuantity,
          rate_type: 'allowance',
          rate_gbp: defaultRate,
          total_gbp: defaultNumberOfItems * defaultQuantity * defaultRate,
          date_added: new Date().toISOString(),
          date_changed: new Date().toISOString(),
        };
      });

      const { error: lineItemsErr } = await supabase.from('dbce_budget_line_items').insert(lineItems);
      if (lineItemsErr) throw lineItemsErr;

      // 5. Navigate to the new show's homepage
      navigate(`/shows/${newShowId}`);

    } catch (err) {
      logError(err, 'Error creating new show and budget');
      
      let errorMessage = 'An unknown error occurred.';
      if (typeof err === 'object' && err !== null) {
        if (err.message) {
            errorMessage = `Database Error: ${err.message}`;
            if (err.details) errorMessage += `\nDetails: ${err.details}`;
            if (err.hint) errorMessage += `\nHint: ${err.hint}`;
        } else {
            errorMessage = `An unexpected error object was caught. Full details:\n${JSON.stringify(err, Object.getOwnPropertyNames(err), 2)}`;
        }
      } else {
        errorMessage = `An unexpected error was caught: ${err}`;
      }
      
      setError(`Failed to create the show. Please see the details below:\n\n${errorMessage}`);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Create a New Show</h2>
      <form onSubmit={handleSubmit}>
        {error && <pre className="error-message">{error}</pre>}
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
    </div>
  );
}

export default NewShowPage;
