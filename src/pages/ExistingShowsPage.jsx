import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function ExistingShowsPage() {
  const [shows, setShows] = useState([]);

  useEffect(() => {
    const fetchShows = async () => {
      const { data, error } = await supabase.from('dbce_shows').select('*');
      if (error) {
        console.error('Error fetching shows:', error);
      } else {
        setShows(data);
      }
    };

    fetchShows();
  }, []);

  return (
    <div>
      <h1>Existing Shows</h1>
      <ul>
        {shows.map((show) => (
          <li key={show.id}>
            <Link to={`/shows/${show.id}`}>{show.show_name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ExistingShowsPage;
