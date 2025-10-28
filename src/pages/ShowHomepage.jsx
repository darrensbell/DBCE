import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function ShowHomepage() {
  const { showId } = useParams();
  const [show, setShow] = useState(null);
  const [budgets, setBudgets] = useState([]);

  useEffect(() => {
    const fetchShow = async () => {
      const { data, error } = await supabase
        .from('dbce_shows')
        .select('*')
        .eq('id', showId)
        .single();

      if (error) {
        console.error('Error fetching show:', error);
      } else {
        setShow(data);
      }
    };

    const fetchBudgets = async () => {
      const { data, error } = await supabase
        .from('dbce_budgets')
        .select('*')
        .eq('show_id', showId);

      if (error) {
        console.error('Error fetching budgets:', error);
      } else {
        setBudgets(data);
      }
    };

    fetchShow();
    fetchBudgets();
  }, [showId]);

  if (!show) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{show.show_name}</h1>
      <p>Date: {show.show_date}</p>
      <p>Planned Performances: {show.planned_performances}</p>
      <p>Venue: {show.venue}</p>

      <h2>Budgets</h2>
      <ul>
        {budgets.map((budget) => (
          <li key={budget.id}>
            <Link to={`/budgets/${budget.id}`}>{budget.budget_name}</Link>
          </li>
        ))}
      </ul>
      <Link to={`/shows/${showId}/budgets/new`}>Create New Budget</Link>
    </div>
  );
}

export default ShowHomepage;
