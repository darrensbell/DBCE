import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';
import { logError } from '../../utils/logger';
import { Box, TextField, Button, CircularProgress, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NewShowForm = ({ handleClose }) => {
  const [showName, setShowName] = useState('');
  const [showDate, setShowDate] = useState('');
  const [venue, setVenue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('dbce_shows')
        .insert([{ show_name: showName, show_date: showDate, venue: venue }])
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        navigate(`/shows/${data[0].id}`);
      }
      handleClose(); 
    } catch (err) {
      logError(err, 'Error creating new show');
      setError('Failed to create show. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      <TextField
        margin="normal"
        required
        fullWidth
        id="showName"
        label="Show Name"
        name="showName"
        autoFocus
        value={showName}
        onChange={(e) => setShowName(e.target.value)}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="showDate"
        label="Show Date"
        type="date"
        id="showDate"
        InputLabelProps={{
          shrink: true,
        }}
        value={showDate}
        onChange={(e) => setShowDate(e.target.value)}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="venue"
        label="Venue"
        name="venue"
        value={venue}
        onChange={(e) => setVenue(e.target.value)}
      />
      {error && <Typography color="error">{error}</Typography>}
      <Box sx={{ mt: 2, position: 'relative' }}>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Create Show'}
        </Button>
      </Box>
    </Box>
  );
};

export default NewShowForm;
