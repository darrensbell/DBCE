import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { logError } from '../utils/logger';
import styles from '../styles/ShowHomepage.module.css';

function ShowHomepage() {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShows = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('dbce_shows')
          .select('*')
          .order('show_date', { ascending: false });

        if (error) throw error;
        setShows(data);
      } catch (err) {
        logError(err, 'Error fetching shows');
        setError('Failed to fetch shows. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchShows();
  }, []);

  if (loading) return <div className="card"><h2>Loading Shows...</h2></div>;
  if (error) return <div className="card"><h2>Error</h2><p>{error}</p></div>;

  return (
    <div className={styles.showHomepage}>
      <div className={`${styles.headerCard} card`}>
        <h1>All Shows</h1>
        <Link to="/shows/new" className={styles.createButton}>Create New Show</Link>
      </div>

      {shows.length === 0 ? (
        <div className={`card ${styles.noShowsCard}`}>
          <h2>No shows found.</h2>
          <p>Get started by creating a new show.</p>
          <Link to="/shows/new" className={styles.createButton}>Create New Show</Link>
        </div>
      ) : (
        <div className={styles.showGrid}>
          {shows.map(show => (
            <Link to={`/shows/${show.id}`} key={show.id} className={styles.showCardLink}>
              <div className={`${styles.showCard} card`}>
                <h2>{show.show_name}</h2>
                <p><strong>Date:</strong> {show.show_date}</p>
                <p><strong>Venue:</strong> {show.venue}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default ShowHomepage;
