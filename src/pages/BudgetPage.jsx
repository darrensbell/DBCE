
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import DataGrid, { textEditor, SelectColumn } from 'react-data-grid';
import 'react-data-grid/lib/styles.css';
import { logError } from '../utils/logger';
import styles from '../styles/BudgetPage.module.css';

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
});

const unitOptions = [
  { label: 'Fee', value: 'fee' },
  { label: 'Allowance', value: 'allowance' },
  { label: 'Buyout', value: 'buyout' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Daily', value: 'daily' },
];

const columns = [
  { key: 'gl_code', name: 'GL Code', resizable: true, width: 120 },
  { key: 'description', name: 'Description', resizable: true, width: 300 },
  {
    key: 'unit',
    name: 'Unit',
    width: 120,
    editor: (p) => (
      <select
        autoFocus
        className="rdg-select"
        value={p.row.unit}
        onChange={(e) => p.onRowChange({ ...p.row, unit: e.target.value }, true)}
      >
        {unitOptions.map(({ label, value }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    ),
  },
  { key: 'quantity', name: 'Quantity', width: 120, editor: textEditor },
  {
    key: 'rate',
    name: 'Rate',
    width: 120,
    editor: textEditor,
    formatter: ({ row }) => currencyFormatter.format(row.rate || 0),
  },
  {
    key: 'total',
    name: 'Total',
    width: 120,
    formatter: ({ row }) => currencyFormatter.format(row.total || 0),
  },
  { key: 'notes', name: 'Notes', editor: textEditor },
];


const BudgetPage = () => {
  const { budgetId } = useParams();
  const [budget, setBudget] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const budgetPromise = supabase
          .from('dbce_budgets')
          .select('*')
          .eq('id', budgetId)
          .single();

        const lineItemsPromise = supabase
          .from('dbce_budget_line_items')
          .select('*, dbce_budget_categories(*)')
          .eq('budget_id', budgetId)
          .order('id', { ascending: true });

        const [budgetResult, lineItemsResult] = await Promise.all([
          budgetPromise,
          lineItemsPromise,
        ]);

        if (budgetResult.error) throw budgetResult.error;
        setBudget(budgetResult.data);

        if (lineItemsResult.error) throw lineItemsResult.error;
        
        const formattedLineItems = lineItemsResult.data.map(item => ({
          id: item.id,
          gl_code: item.dbce_budget_categories?.ordering,
          description: `${item.dbce_budget_categories?.department} - ${item.dbce_budget_categories?.line_item}`,
          unit: item.rate_type,
          quantity: item.quantity,
          rate: item.rate_gbp,
          total: item.total_gbp,
          notes: item.notes,
        }));
        setRows(formattedLineItems);

      } catch (err) {
        logError(err, 'Error fetching budget data');
        setError('Failed to fetch budget data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [budgetId]);

  const handleRowsChange = async (newRows, { indexes, column }) => {
    const updatedRows = [...newRows];
  
    for (const index of indexes) {
      const row = updatedRows[index];
      const originalRow = rows[index];
  
      // Only proceed if a value has actually changed
      if (row[column.key] === originalRow[column.key]) {
        continue;
      }
  
      const { id, quantity, rate, notes, unit } = row;
      const newTotal = (quantity || 0) * (rate || 0);
  
      // Update the row in the local state immediately for a responsive UI
      updatedRows[index] = { ...row, total: newTotal };
      setRows(updatedRows);
  
      const { error: updateError } = await supabase
        .from('dbce_budget_line_items')
        .update({
          quantity: quantity,
          rate_gbp: rate,
          total_gbp: newTotal,
          notes: notes,
          rate_type: unit,
        })
        .eq('id', id);
  
      if (updateError) {
        logError(updateError, `Error updating line item: ${id}`);
        // If the update fails, revert the change in the UI
        updatedRows[index] = originalRow;
        setRows(updatedRows);
      }
    }
  };
  
  if (loading) return <div className="card"><h2>Loading Budget...</h2></div>;
  if (error) return <div className="card"><h2 className={styles.errorTitle}>Error</h2><p>{error}</p></div>;
  if (!budget) return <div className="card"><h2>Budget not found.</h2></div>;

  return (
    <div className={styles.budgetPage}>
      <div className="card">
        <h1>{budget.budget_name}</h1>
      </div>
      <div className="card">
      <DataGrid
        columns={columns}
        rows={rows}
        onRowsChange={handleRowsChange}
        className="rdg-light"
        rowHeight={35}
        style={{ height: 'calc(100vh - 250px)' }} // Adjust height as needed
      />
      </div>
    </div>
  );
};

export default BudgetPage;
