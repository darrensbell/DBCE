import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { logError } from '../utils/logger';
import styles from '../styles/NewBudgetPage.module.css';

function NewBudgetPage() {
  const { showId } = useParams();
  const navigate = useNavigate();
  const [budgetName, setBudgetName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Step 1: Create the new budget
      const { data: budgetData, error: budgetError } = await supabase
        .from('dbce_budgets')
        .insert({ budget_name: budgetName, show_id: showId })
        .select()
        .single();

      if (budgetError) throw budgetError;

      const newBudgetId = budgetData.id;

      // Step 2: Fetch all budget categories
      const { data: categories, error: categoriesError } = await supabase
        .from('dbce_budget_categories')
        .select('id');
      
      if (categoriesError) throw categoriesError;

      // Step 3: Create a line item for each category
      const lineItemsToInsert = categories.map(category => ({
        budget_id: newBudgetId,
        category_id: category.id,
        quantity: 0,
        rate_gbp: 0,
        total_gbp: 0,
      }));

      const { error: lineItemsError } = await supabase
        .from('dbce_budget_line_items')
        .insert(lineItemsToInsert);

      if (lineItemsError) throw lineItemsError;

      // Step 4: Navigate to the new budget page
      navigate(`/budgets/${newBudgetId}`);

    } catch (err) {
      logError(err, 'Error creating new budget');
      setError('Failed to create new budget. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className={styles.newBudgetPage}>
      <div className="card">
        <h1>Create New Budget</h1>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="budgetName">Budget Name</label>
            <input
              id="budgetName"
              type="text"
              value={budgetName}
              onChange={(e) => setBudgetName(e.target.value)}
              placeholder="e.g., Q1 Production Budget"
              required
            />
          </div>
          {error && <p className={styles.errorText}>{error}</p>}
          <button type="submit" disabled={loading} className={styles.submitButton}>
            {loading ? 'Creating...' : 'Create and Go to Budget'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default NewBudgetPage;
