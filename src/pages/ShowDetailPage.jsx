import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { logError } from '../utils/logger';
import styles from '../styles/ShowDetailPage.module.css';

function ShowDetailPage() {
  const { showId } = useParams();
  const [show, setShow] = useState(null);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const showPromise = supabase
          .from('dbce_shows')
          .select('*')
          .eq('id', showId)
          .single();

        const budgetsPromise = supabase
          .from('dbce_budgets')
          .select('*')
          .eq('show_id', showId);

        const [showResult, budgetsResult] = await Promise.all([
          showPromise,
          budgetsPromise,
        ]);

        if (showResult.error) throw showResult.error;
        setShow(showResult.data);

        if (budgetsResult.error) throw budgetsResult.error;
        setBudgets(budgetsResult.data);

      } catch (err) {
        logError(err, 'Error fetching show details');
        setError('Failed to load show details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [showId]);

  if (loading) return <div className="card"><h2>Loading Show Details...</h2></div>;
  if (error) return <div className="card"><h2>Error</h2><p>{error}</p></div>;
  if (!show) return <div className="card"><h2>Show not found.</h2></div>;

  return (
    <div className={styles.showDetailPage}>
      <div className={`${styles.showInfoCard} card`}>
        <h1>{show.show_name}</h1>
        <p><strong>Date:</strong> {show.show_date}</p>
        <p><strong>Venue:</strong> {show.venue}</p>
        <p><strong>Planned Performances:</strong> {show.planned_performances}</p>
      </div>

      <div className={`${styles.budgetsCard} card`}>
        <div className={styles.budgetsHeader}>
          <h2>Budgets</h2>
          <Link to={`/shows/${showId}/budgets/new`} className={styles.createButton}>Create New Budget</Link>
        </div>
        {budgets.length === 0 ? (
          <p>No budgets have been created for this show yet.</p>
        ) : (
          <ul className={styles.budgetList}>
            {budgets.map(budget => (
              <li key={budget.id}>
                <Link to={`/budgets/${budget.id}`}>{budget.budget_name}</Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ShowDetailPage;
