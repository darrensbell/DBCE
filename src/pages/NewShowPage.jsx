import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function NewShowPage() {
  const [showName, setShowName] = useState('');
  const [showDate, setShowDate] = useState('');
  const [plannedPerformances, setPlannedPerformances] = useState('');
  const [venue, setVenue] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data: show, error } = await supabase
      .from('dbce_shows')
      .insert([{ show_name: showName, show_date: showDate, planned_performances: plannedPerformances, venue: venue }])
      .select();

    if (error) {
      console.error('Error creating show:', error);
    } else {
        if (show && show.length > 0) {
            const newShowId = show[0].id;

            const { data: categories, error: categoriesError } = await supabase
            .from('dbce_budget_categories')
            .select('*');

            if (categoriesError) {
                console.error('Error fetching budget categories:', categoriesError);
                return;
            }

            const { data: budget, error: budgetError } = await supabase
            .from('dbce_budgets')
            .insert([{ show_id: newShowId, budget_name: `${showName} Budget` }])
            .select();

            if (budgetError) {
                console.error('Error creating budget:', budgetError);
                return;
            }

            if (budget && budget.length > 0) {
                const newBudgetId = budget[0].id;

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
                    navigate(`/shows/${newShowId}`);
                }
            } else {
                console.error('Budget data is null or empty.');
            }
        } else {
            console.error('Show data is null or empty.');
        }
    }
  };

  return (
    <div>
      <h1>Create New Show</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Show Name</label>
          <input type="text" value={showName} onChange={(e) => setShowName(e.target.value)} required />
        </div>
        <div>
          <label>Show Date</label>
          <input type="date" value={showDate} onChange={(e) => setShowDate(e.target.value)} />
        </div>
        <div>
          <label>Planned Performances</label>
          <input type="number" value={plannedPerformances} onChange={(e) => setPlannedPerformances(e.target.value)} />
        </div>
        <div>
          <label>Venue</label>
          <input type="text" value={venue} onChange={(e) => setVenue(e.target.value)} />
        </div>
        <button type="submit">Create Show</button>
      </form>
    </div>
  );
}

export default NewShowPage;
