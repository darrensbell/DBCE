import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function NewBudgetPage() {
  const { showId } = useParams();
  const [budgetName, setBudgetName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from('dbce_budgets')
      .insert([{ show_id: showId, budget_name: budgetName }])
      .select();

    if (error) {
      console.error('Error creating budget:', error);
    } else {
      const newBudgetId = data[0].id;
      const { data: categories, error: categoriesError } = await supabase
        .from('dbce_budget_categories')
        .select('*');

      if (categoriesError) {
        console.error('Error fetching budget categories:', categoriesError);
        return;
      }

      const lineItems = categories.map(category => ({
        budget_id: newBudgetId,
        budget_category_id: category.id,
      }));

      const { error: lineItemsError } = await supabase
        .from('dbce_budget_line_items')
        .insert(lineItems);

      if (lineItemsError) {
        console.error('Error creating budget line items:', lineItemsError);
      } else {
        navigate(`/budgets/${newBudgetId}`);
      }
    }
  };

  return (
    <div>
      <h1>Create New Budget</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Budget Name</label>
          <input type="text" value={budgetName} onChange={(e) => setBudgetName(e.target.value)} required />
        </div>
        <button type="submit">Create Budget</button>
      </form>
    </div>
  );
}

export default NewBudgetPage;
