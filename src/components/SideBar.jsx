import React from 'react';
import { Link } from 'react-router-dom';
import styles from './SideBar.module.css';
import { supabase } from '../supabaseClient'; // Adjust path as necessary

const SideBar = () => {
  const [isConnected, setIsConnected] = React.useState(true);

  React.useEffect(() => {
    const checkConnection = async () => {
      const { error } = await supabase.from('dbce_shows').select('id').limit(1);
      setIsConnected(!error);
    };

    checkConnection();
    const interval = setInterval(checkConnection, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.sidebar}>
      <Link to="/" className={styles.homeButton}>Home</Link>
      <div className={styles.statusIndicator}>
        <span className={`${styles.statusDot} ${isConnected ? styles.connected : styles.disconnected}`}></span>
        {isConnected ? 'Connected' : 'Disconnected'}
      </div>
    </div>
  );
};

export default SideBar;
