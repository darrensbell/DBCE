import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';
import { logError } from '../../utils/logger';
import { Box, TextField, Button, CircularProgress, Typography } from '@mui/material';

const NewBudgetForm = ({ showId, handleClose }) => {
  const [budgetName, setBudgetName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('dbce_budgets')
        .insert([{ budget_name: budgetName, show_id: showId }]);

      if (error) throw error;

      handleClose();
    } catch (err) {
      logError(err, 'Error creating new budget');
      setError('Failed to create budget. Please try again.');
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
        id="budgetName"
        label="Budget Name"
        name="budgetName"
        autoFocus
        value={budgetName}
        onChange={(e) => setBudgetName(e.target.value)}
      />
      {error && <Typography color="error">{error}</Typography>}
      <Box sx={{ mt: 2, position: 'relative' }}>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Create Budget'}
        </Button>
      </Box>
    </Box>
  );
};

export default NewBudgetForm;
