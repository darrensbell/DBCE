import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';
import { logError } from '../../utils/logger';
import { Box, TextField, Button, CircularProgress, Typography } from '@mui/material';

const NewBudgetItemForm = ({ budgetId, handleClose }) => {
  const [lineItem, setLineItem] = useState('');
  const [rateGbp, setRateGbp] = useState('');
  const [totalGbp, setTotalGbp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.from('dbce_budget_line_items').insert([
        {
          budget_id: budgetId,
          line_item: lineItem,
          rate_gbp: rateGbp || null,
          total_gbp: totalGbp || null,
        },
      ]);

      if (error) throw error;

      handleClose();
    } catch (err) {
      logError(err, 'Error creating new budget item');
      setError('Failed to create item. Please try again.');
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
        id="lineItem"
        label="Line Item"
        name="lineItem"
        autoFocus
        value={lineItem}
        onChange={(e) => setLineItem(e.target.value)}
      />
      <TextField
        margin="normal"
        fullWidth
        id="rateGbp"
        label="Rate (GBP)"
        name="rateGbp"
        type="number"
        value={rateGbp}
        onChange={(e) => setRateGbp(e.target.value)}
      />
      <TextField
        margin="normal"
        fullWidth
        id="totalGbp"
        label="Total (GBP)"
        name="totalGbp"
        type="number"
        value={totalGbp}
        onChange={(e) => setTotalGbp(e.target.value)}
      />
      {error && <Typography color="error">{error}</Typography>}
      <Box sx={{ mt: 2, position: 'relative' }}>
        <Button type="submit" fullWidth variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Create Item'}
        </Button>
      </Box>
    </Box>
  );
};

export default NewBudgetItemForm;
