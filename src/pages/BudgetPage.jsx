import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function BudgetPage() {
  const { budgetId } = useParams();
  const [budget, setBudget] = useState(null);
  const [lineItems, setLineItems] = useState([]);
  const [summary, setSummary] = useState({});

  useEffect(() => {
    const fetchBudget = async () => {
      const { data, error } = await supabase
        .from('dbce_budgets')
        .select('*')
        .eq('id', budgetId)
        .single();
      if (error) console.error('Error fetching budget:', error);
      else setBudget(data);
    };

    const fetchLineItems = async () => {
      const { data, error } = await supabase
        .from('dbce_budget_line_items')
        .select(`
          *,
          dbce_budget_categories (*)
        `)
        .eq('budget_id', budgetId);

      if (error) {
        console.error('Error fetching line items:', error);
      } else {
        setLineItems(data);
        calculateSummary(data);
      }
    };

    fetchBudget();
    fetchLineItems();
  }, [budgetId]);

  const calculateSummary = (items) => {
    const summary = {};
    items.forEach(item => {
      const category = item.dbce_budget_categories;
      if (!category) return;

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
  };

  const handleUpdateLineItem = async (lineItemId, updates) => {
    const { error } = await supabase
      .from('dbce_budget_line_items')
      .update(updates)
      .eq('id', lineItemId);

    if (error) {
      console.error('Error updating line item:', error);
    } else {
        const { data, error } = await supabase
        .from('dbce_budget_line_items')
        .select(`
          *,
          dbce_budget_categories (*)
        `)
        .eq('budget_id', budgetId);

      if (error) {
        console.error('Error refetching line items:', error);
      } else {
        setLineItems(data);
        calculateSummary(data);
      }
    }
  };

  const handleInputChange = (lineItemId, field, value) => {
    const updatedLineItems = lineItems.map(item => {
      if (item.id === lineItemId) {
        const newItem = { ...item, [field]: value };
        if (field === 'number_of_items' || field === 'quantity' || field === 'rate_gbp') {
          newItem.total_gbp = (newItem.number_of_items || 0) * (newItem.quantity || 0) * (newItem.rate_gbp || 0);
        }
        return newItem;
      }
      return item;
    });
    setLineItems(updatedLineItems);
  };

  return (
    <div>
      <h1>{budget ? budget.budget_name : 'Loading...'}</h1>
      
      {Object.entries(summary).map(([summaryGroup, summaryData]) => (
        <div key={summaryGroup}>
          <h2>{summaryGroup} - £{summaryData.total.toFixed(2)}</h2>
          {Object.entries(summaryData.departments).map(([department, deptData]) => (
            <div key={department} style={{ marginLeft: '20px' }}>
              <h3>{department} - £{deptData.total.toFixed(2)}</h3>
              {Object.entries(deptData.sub_departments).map(([subDepartment, subDeptData]) => (
                <div key={subDepartment} style={{ marginLeft: '40px' }}>
                  <h4>{subDepartment} - £{subDeptData.total.toFixed(2)}</h4>
                  <table border="1" style={{ width: '100%', marginLeft: '60px' }}>
                    <thead>
                      <tr>
                        <th>Line Item</th>
                        <th>Number</th>
                        <th>Quantity</th>
                        <th>Type</th>
                        <th>Rate (£)</th>
                        <th>Total (£)</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subDeptData.line_items.map(item => (
                        <tr key={item.id}>
                          <td>{item.dbce_budget_categories.line_item}</td>
                          <td><input type="number" value={item.number_of_items || ''} onChange={e => handleInputChange(item.id, 'number_of_items', e.target.value)} /></td>
                          <td><input type="number" value={item.quantity || ''} onChange={e => handleInputChange(item.id, 'quantity', e.target.value)} /></td>
                          <td>
                            <select value={item.rate_type || 'allowance'} onChange={e => handleInputChange(item.id, 'rate_type', e.target.value)}>
                              <option value="fee">Fee</option>
                              <option value="allowance">Allowance</option>
                              <option value="buyout">Buyout</option>
                              <option value="weekly">Weekly</option>
                              <option value="daily">Daily</option>
                            </select>
                          </td>
                          <td><input type="number" value={item.rate_gbp || ''} onChange={e => handleInputChange(item.id, 'rate_gbp', e.target.value)} /></td>
                          <td>{item.total_gbp ? item.total_gbp.toFixed(2) : '0.00'}</td>
                          <td>
                            <button onClick={() => handleUpdateLineItem(item.id, { 
                              number_of_items: item.number_of_items, 
                              quantity: item.quantity, 
                              rate_type: item.rate_type, 
                              rate_gbp: item.rate_gbp,
                              total_gbp: (item.number_of_items || 0) * (item.quantity || 0) * (item.rate_gbp || 0)
                            })}>Update</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
