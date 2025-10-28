import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import styles from '../styles/Sidebar.module.css';

function Sidebar() {
  const [dbStatus, setDbStatus] = useState('checking');

  useEffect(() => {
    const checkDbConnection = async () => {
      const { error } = await supabase.from('dbce_shows').select('id', { head: true, count: 'exact' });
      if (error) {
        setDbStatus('disconnected');
        console.error('Supabase connection error:', error);
      } else {
        setDbStatus('connected');
      }
    };

    checkDbConnection();
    const interval = setInterval(checkDbConnection, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.sidebar}>
      <div className={styles.branding}>
        <h1>Show Manager</h1>
      </div>
      <nav className={styles.nav}>
        <ul>
          <li><NavLink to="/" end>Home</NavLink></li>
          <li><NavLink to="/shows/new">Create New Show</NavLink></li>
          <li><NavLink to="/shows">Existing Shows</NavLink></li>
        </ul>
      </nav>
      <div className={styles.dbStatus}>
        <span className={`${styles.statusIndicator} ${styles[dbStatus]}`}></span>
        <span>Database: {dbStatus}</span>
      </div>
    </div>
  );
}

export default Sidebar;
