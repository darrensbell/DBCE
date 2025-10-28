import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { logError } from '../utils/logger';
import styles from '../styles/BudgetPage.module.css';

function BudgetPage() {
  const { budgetId } = useParams();
  const [budget, setBudget] = useState(null);
  const [lineItems, setLineItems] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [missingCategoryWarning, setMissingCategoryWarning] = useState(false);

  const calculateSummary = useCallback((items) => {
    const summary = {};
    let hasMissingCategory = false;
    items.forEach(item => {
      const category = item.dbce_budget_categories;
      if (!category) {
        hasMissingCategory = true;
        logError(new Error(`Line item missing category: ${item.id}`), 'Data Integrity Issue');
        return;
      }

      const { summary_group, department, sub_department } = category;
      if (!summary[summary_group]) {
        summary[summary_group] = { total: 0, departments: {} };
      }
      if (!summary[summary_group].departments[department]) {
        summary[summary_group].departments[department] = { total: 0, sub_departments: {} };
      }
      if (!summary[summary_group].departments[department].sub_departments[sub_department]) {
        summary[summary_group].departments[department].sub_departments[sub_department] = { total: 0, line_items: [] };
      }

      const total = item.total_gbp || 0;
      summary[summary_group].total += total;
      summary[summary_group].departments[department].total += total;
      summary[summary_group].departments[department].sub_departments[sub_department].total += total;
      summary[summary_group].departments[department].sub_departments[sub_department].line_items.push(item);
    });
    setSummary(summary);
    setMissingCategoryWarning(hasMissingCategory);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const budgetPromise = supabase.from('dbce_budgets').select('*').eq('id', budgetId).single();
        const lineItemsPromise = supabase.from('dbce_budget_line_items').select('*, dbce_budget_categories (*)').eq('budget_id', budgetId);

        const [budgetResult, lineItemsResult] = await Promise.all([budgetPromise, lineItemsPromise]);

        if (budgetResult.error) {
          throw budgetResult.error;
        }
        setBudget(budgetResult.data);

        if (lineItemsResult.error) {
          throw lineItemsResult.error;
        }
        setLineItems(lineItemsResult.data);
        calculateSummary(lineItemsResult.data);

      } catch (err) {
        logError(err, 'Error fetching budget data');
        setError('Failed to fetch budget data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [budgetId, calculateSummary]);

  const handleInputChange = (lineItemId, field, value) => {
    const updatedLineItems = lineItems.map(item => {
      if (item.id === lineItemId) {
        const newItem = { ...item, [field]: value };
        // Recalculate total
        if (['number_of_items', 'quantity', 'rate_gbp'].includes(field)) {
          const num = parseFloat(newItem.number_of_items) || 0;
          const quant = parseFloat(newItem.quantity) || 0;
          const rate = parseFloat(newItem.rate_gbp) || 0;
          newItem.total_gbp = num * quant * rate;
        }
        return newItem;
      }
      return item;
    });
    setLineItems(updatedLineItems);
    calculateSummary(updatedLineItems); // Recalculate summary on every input change for live feedback
  };
  
  const handleInputBlur = async (lineItemId) => {
    const itemToUpdate = lineItems.find(item => item.id === lineItemId);
    if (!itemToUpdate) return;
  
    // Destructure to only send necessary fields, excluding the joined category object
    const { number_of_items, quantity, rate_type, rate_gbp, total_gbp } = itemToUpdate;
    const updates = { number_of_items, quantity, rate_type, rate_gbp, total_gbp };
  
    const { error: updateError } = await supabase
      .from('dbce_budget_line_items')
      .update(updates)
      .eq('id', lineItemId);
  
    if (updateError) {
      logError(updateError, `Error updating line item: ${lineItemId}`);
      // Optionally, revert the changes in the UI or show a specific error to the user
    }
  };

  if (loading) {
    return <div className="card"><h2>Loading Budget...</h2></div>;
  }

  if (error) {
    return <div className="card"><h2 className={styles.errorTitle}>Error</h2><p>{error}</p></div>;
  }
  
  if (!budget) {
      return <div className="card"><h2>Budget not found.</h2></div>
  }

  return (
    <div className={styles.budgetPage}>
      <div className="card">
        <h1>{budget.budget_name}</h1>
      </div>

      {missingCategoryWarning && (
        <div className={`${styles.warning} card`}>
          <strong>Data Integrity Warning:</strong> Some line items are missing a category and are not being displayed. Please check the data in the 'dbce_budget_line_items' table.
        </div>
      )}

      {Object.keys(summary).length === 0 && !loading && (
        <div className="card">
          <h2>No line items found for this budget.</h2>
        </div>
      )}

      {Object.entries(summary).map(([summaryGroup, summaryData]) => (
        <div key={summaryGroup} className={`${styles.summaryGroup} card`}>
          <h2 className={styles.summaryTitle}>{summaryGroup} - £{summaryData.total.toFixed(2)}</h2>
          {Object.entries(summaryData.departments).map(([department, deptData]) => (
            <div key={department} className={styles.department}>
              <h3>{department} - £{deptData.total.toFixed(2)}</h3>
              {Object.entries(deptData.sub_departments).map(([subDepartment, subDeptData]) => (
                <div key={subDepartment} className={styles.subDepartment}>
                  <h4>{subDepartment} - £{subDeptData.total.toFixed(2)}</h4>
                  <div className={styles.tableContainer}>
                    <table>
                      <thead>
                        <tr>
                          <th>Line Item</th>
                          <th>Number</th>
                          <th>Quantity</th>
                          <th>Type</th>
                          <th>Rate (£)</th>
                          <th>Total (£)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subDeptData.line_items.map(item => (
                          <tr key={item.id}>
                            <td>{item.dbce_budget_categories?.line_item || 'N/A'}</td>
                            <td><input type="number" value={item.number_of_items || ''} onChange={e => handleInputChange(item.id, 'number_of_items', e.target.value)} onBlur={() => handleInputBlur(item.id)} /></td>
                            <td><input type="number" value={item.quantity || ''} onChange={e => handleInputChange(item.id, 'quantity', e.target.value)} onBlur={() => handleInputBlur(item.id)} /></td>
                            <td>
                              <select value={item.rate_type || 'allowance'} onChange={e => handleInputChange(item.id, 'rate_type', e.target.value)} onBlur={() => handleInputBlur(item.id)}>
                                <option value="fee">Fee</option>
                                <option value="allowance">Allowance</option>
                                <option value="buyout">Buyout</option>
                                <option value="weekly">Weekly</option>
                                <option value="daily">Daily</option>
                              </select>
                            </td>
                            <td><input type="number" step="0.01" value={item.rate_gbp || ''} onChange={e => handleInputChange(item.id, 'rate_gbp', e.target.value)} onBlur={() => handleInputBlur(item.id)}/></td>
                            <td>£{item.total_gbp ? item.total_gbp.toFixed(2) : '0.00'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default BudgetPage;
