import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { logError } from '../utils/logger';
import styles from '../styles/HomePage.module.css';

function HomePage() {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShows = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('dbce_shows')
          .select('id, show_name, show_date, venue')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setShows(data);
      } catch (err) {
        logError(err, 'Error fetching shows');
        setError('Could not fetch shows. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchShows();
  }, []);

  if (loading) {
    return <div className="card"><h2>Loading shows...</h2></div>;
  }

  if (error) {
    return <div className="card"><h2>{error}</h2></div>;
  }

  return (
    <div>
      <div className="card">
          <h1>Shows</h1>
          <p>Select a show to view its budget, or create a new one.</p>
      </div>

      <div className={styles.gridContainer}>
        {shows.map(show => (
          <Link to={`/shows/${show.id}`} key={show.id} className="card">
            <h3>{show.show_name}</h3>
            <p>{new Date(show.show_date).toLocaleDateString()}</p>
            <p>{show.venue}</p>
          </Link>
        ))}
        <Link to="/new-show" className={`card ${styles.newShowCard}`}>
            <div className={styles.plusIcon}>+</div>
            <h3>Create New Show</h3>
        </Link>
      </div>
    </div>
  );
}

export default HomePage;
