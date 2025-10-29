import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { logError } from '../utils/logger';
import { Card, CardContent, Typography, Button, Box, CircularProgress, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Add as AddIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import NewItemModal from '../components/NewItemModal';
import NewBudgetItemForm from '../components/forms/NewBudgetItemForm';

function BudgetDetailPage() {
  const { budgetId } = useParams();
  const navigate = useNavigate();
  const [budget, setBudget] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const budgetPromise = supabase.from('dbce_budgets').select('*, dbce_shows(show_name)').eq('id', budgetId).single();
      const itemsPromise = supabase.from('dbce_budget_items').select('*').eq('budget_id', budgetId);
      const [budgetResult, itemsResult] = await Promise.all([budgetPromise, itemsPromise]);

      if (budgetResult.error) throw budgetResult.error;
      setBudget(budgetResult.data);

      if (itemsResult.error) throw itemsResult.error;
      setItems(itemsResult.data);
    } catch (err) {
      logError(err, 'Error fetching budget details');
      setError('Failed to load budget details. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [budgetId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleModalClose = () => {
    setIsModalOpen(false);
    fetchData();
  };
  
  const totalEstimated = items.reduce((acc, item) => acc + (item.estimated_cost || 0), 0);
  const totalActual = items.reduce((acc, item) => acc + (item.actual_cost || 0), 0);

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><CircularProgress /></Box>;
  }

  if (error) return <Alert severity="error">{error}</Alert>;
  if (!budget) return <Alert severity="warning">Budget not found.</Alert>;

  return (
    <>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(`/shows/${budget.show_id}`)} sx={{ mb: 2 }}>
        Back to Show
      </Button>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom>{budget.budget_name}</Typography>
          <Typography variant="h6">for {budget.dbce_shows.show_name}</Typography>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" component="h2">Budget Items</Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setIsModalOpen(true)}>Create New Item</Button>
          </Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Item</TableCell>
                  <TableCell align="right">Estimated Cost</TableCell>
                  <TableCell align="right">Actual Cost</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell component="th" scope="row">{item.item_name}</TableCell>
                    <TableCell align="right">${item.estimated_cost ? item.estimated_cost.toLocaleString() : '0.00'}</TableCell>
                    <TableCell align="right">${item.actual_cost ? item.actual_cost.toLocaleString() : '0.00'}</TableCell>
                  </TableRow>
                ))}
                 <TableRow sx={{ '& > *': { fontWeight: 'bold' } }}>
                    <TableCell>Total</TableCell>
                    <TableCell align="right">${totalEstimated.toLocaleString()}</TableCell>
                    <TableCell align="right">${totalActual.toLocaleString()}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <NewItemModal open={isModalOpen} handleClose={handleModalClose} title="Create a New Budget Item">
        <NewBudgetItemForm budgetId={budgetId} handleClose={handleModalClose} />
      </NewItemModal>
    </>
  );
}

export default BudgetDetailPage;