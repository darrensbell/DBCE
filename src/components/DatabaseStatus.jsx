import React from 'react';
import { Box, Typography, Tooltip } from '@mui/material';
import { Circle } from '@mui/icons-material';
import { supabase } from '../supabaseClient';

const DatabaseStatus = () => {
  const [isConnected, setIsConnected] = React.useState(true);
  const [lastChecked, setLastChecked] = React.useState(null);

  React.useEffect(() => {
    const checkConnection = async () => {
      const { error } = await supabase.from('dbce_shows').select('id').limit(1);
      setIsConnected(!error);
      setLastChecked(new Date().toLocaleTimeString());
    };

    checkConnection();
    const interval = setInterval(checkConnection, 60000); // Check every 60 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <Tooltip title={`Last checked at ${lastChecked}`} placement="top">
        <Box sx={{ display: 'flex', alignItems: 'center', p: 1, borderRadius: 1, backgroundColor: '#f5f5f5' }}>
            <Circle sx={{ 
                fontSize: 12,
                mr: 1,
                color: isConnected ? 'success.main' : 'error.main',
                transition: 'color 0.5s'
            }} />
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {isConnected ? 'Database Connected' : 'Connection Lost'}
            </Typography>
        </Box>
    </Tooltip>
  );
};

export default DatabaseStatus;
