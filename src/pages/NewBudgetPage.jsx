import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { logError } from '../utils/logger';

function NewBudgetPage() {
  const { showId } = useParams();
  const [budgetName, setBudgetName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Create the new budget
      const { data: newBudget, error: budgetErr } = await supabase
        .from('dbce_budgets')
        .insert([{ show_id: showId, budget_name: budgetName }])
        .select()
        .single();

      if (budgetErr) throw budgetErr;
      const newBudgetId = newBudget.id;

      // 2. Fetch all budget categories
      const { data: categories, error: categoriesErr } = await supabase
        .from('dbce_budget_categories')
        .select('id');

      if (categoriesErr) throw categoriesErr;

      // 3. Create line items for each category
      const lineItems = categories.map(category => ({
        budget_id: newBudgetId,
        budget_category_id: category.id,
      }));

      const { error: lineItemsErr } = await supabase
        .from('dbce_budget_line_items')
        .insert(lineItems);

      if (lineItemsErr) throw lineItemsErr;

      // 4. Navigate to the new budget's page
      navigate(`/budgets/${newBudgetId}`);

    } catch (err) {
      logError(err, 'Error creating new budget');
      
      let errorMessage = 'An unknown error occurred.';
      if (typeof err === 'object' && err !== null) {
        if (err.message && err.details) {
            errorMessage = `Database Error: ${err.message}\nDetails: ${err.details}\nHint: ${err.hint || 'No hint provided.'}`;
        } else if (err.message) {
            errorMessage = `Error: ${err.message}`;
        } else {
            errorMessage = `An unexpected error object was caught. Full details:\n${JSON.stringify(err, Object.getOwnPropertyNames(err), 2)}`;
        }
      } else {
        errorMessage = `An unexpected error was caught: ${err}`;
      }
      
      setError(`Failed to create the budget. Please see the details below:\n\n${errorMessage}`);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Create a New Budget</h2>
      <form onSubmit={handleSubmit}>
        {error && <pre className="error-message">{error}</pre>}
        <div className="form-group">
          <label>Budget Name</label>
          <input type="text" value={budgetName} onChange={(e) => setBudgetName(e.target.value)} required />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Creating Budget...' : 'Create Budget'}
        </button>
      </form>
    </div>
  );
}

export default NewBudgetPage;
