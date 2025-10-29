import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { logError } from '../utils/logger';
import styles from '../styles/BudgetPage.module.css';

const currencyFormatter = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' });

const debounce = (func, delay) => {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
};

const BudgetPage = () => {
  const { budgetId } = useParams();
  const [budget, setBudget] = useState(null);
  const [show, setShow] = useState(null);
  const [lineItems, setLineItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [modalData, setModalData] = useState({ summaryGroup: '', department: '', subDepartment: '', lineItem: '' });
  const [allCategories, setAllCategories] = useState([]);

  const updateLineItemInDB = useCallback(async (id, dataToUpdate) => {
    setIsSaving(true);
    try {
      const { error } = await supabase.from('dbce_budget_line_items').update(dataToUpdate).eq('id', id);
      if (error) throw error;
    } catch (err) {
      logError(err, `Error auto-saving line item ${id}`);
      setError(`Error: Could not save changes. ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  }, []);

  const debouncedUpdate = useMemo(() => debounce(updateLineItemInDB, 1000), [updateLineItemInDB]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: budgetData, error: budgetError } = await supabase.from('dbce_budgets').select('*, show:dbce_shows(*)').eq('id', budgetId).single();
      if (budgetError) throw budgetError;

      setBudget(budgetData);
      setShow(budgetData.show);

      const [lineItemsResult, categoriesResult] = await Promise.all([
        supabase.from('dbce_budget_line_items').select('*').eq('budget_id', budgetId).order('id', { ascending: true }),
        supabase.from('dbce_budget_categories').select('*'),
      ]);

      if (lineItemsResult.error) throw lineItemsResult.error;
      setLineItems(lineItemsResult.data);

      if (categoriesResult.error) throw categoriesResult.error;
      setAllCategories(categoriesResult.data);
    } catch (err) {
      logError(err, 'Error fetching budget data');
      setError('Failed to fetch budget data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [budgetId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleInputChange = (id, field, value) => {
    const newItems = lineItems.map(item => {
        if (item.id === id) {
            const updatedItem = { ...item, [field]: value };
            
            const numberOfItems = parseFloat(updatedItem.number_of_items) || 0;
            const quantity = parseFloat(updatedItem.quantity) || 0;
            const rate = parseFloat(updatedItem.rate_gbp) || 0;
            updatedItem.total_gbp = numberOfItems * quantity * rate;

            return updatedItem;
        }
        return item;
    });

    setLineItems(newItems);

    const itemForDB = newItems.find(item => item.id === id);
    if (itemForDB) {
        const payload = {
            line_item: itemForDB.line_item,
            number_of_items: parseFloat(itemForDB.number_of_items) || 0,
            quantity: parseFloat(itemForDB.quantity) || 0,
            rate_gbp: parseFloat(itemForDB.rate_gbp) || 0,
            total_gbp: itemForDB.total_gbp,
        };
        debouncedUpdate(id, payload);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this line item?')) return;
    try {
      const { error } = await supabase.from('dbce_budget_line_items').delete().eq('id', id);
      if (error) throw error;
      setLineItems(prevItems => prevItems.filter(item => item.id !== id));
    } catch (err) {
      logError(err, 'Error deleting line item');
      setError(`Failed to delete line item: ${err.message}`);
    }
  };

  const openAddLineModal = (summaryGroup) => {
    setModalData({ summaryGroup, department: '', subDepartment: '', lineItem: 'New Item' });
    setIsAddModalOpen(true);
  };

  const handleConfirmAddLine = async () => {
    if (!modalData.department || !modalData.subDepartment) {
      alert('Please select a department and sub-department.');
      return;
    }

    const category = allCategories.find(cat => cat.department === modalData.department && cat.sub_department === modalData.subDepartment);
    const rateType = category ? category.rate_type : 'Unit'; // Fallback

    try {
      const { data, error } = await supabase
        .from('dbce_budget_line_items')
        .insert({ 
            budget_id: budgetId, 
            summary_group: modalData.summaryGroup, 
            department: modalData.department, 
            sub_department: modalData.subDepartment, 
            line_item: modalData.lineItem,
            number_of_items: 1, 
            quantity: 1, 
            rate_gbp: 0, 
            total_gbp: 0,
            rate_type: rateType
        })
        .select().single();
        
      if (error) throw error;

      setLineItems(prevItems => [...prevItems, data]);
      setIsAddModalOpen(false);
    } catch (err) {
      logError(err, 'Error adding new line item');
      setError(`Could not add new line item: ${err.message}`);
    }
  };

  const AddLineModal = () => {
    const departmentOptions = useMemo(() => {
        if (!modalData.summaryGroup || !allCategories.length) return [];
        const uniqueDepts = new Set();
        allCategories.filter(cat => cat.summary_group === modalData.summaryGroup).forEach(cat => uniqueDepts.add(cat.department));
        return Array.from(uniqueDepts).sort();
    }, [modalData.summaryGroup, allCategories]);

    const subDepartmentOptions = useMemo(() => {
      if (!modalData.department || !allCategories.length) return [];
      const uniqueSubDepts = new Set();
      allCategories.filter(cat => cat.department === modalData.department).forEach(cat => uniqueSubDepts.add(cat.sub_department));
      return Array.from(uniqueSubDepts).sort();
    }, [modalData.department, allCategories]);

    if (!isAddModalOpen) return null;

    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <h2>Add Line Item to {modalData.summaryGroup}</h2>
          <div className={styles.formGroup}>
            <label>Department</label>
            <select value={modalData.department} onChange={e => setModalData({...modalData, department: e.target.value, subDepartment: ''})}>
              <option value="" disabled>Select a department</option>
              {departmentOptions.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Sub-Department</label>
            <select value={modalData.subDepartment} onChange={e => setModalData({...modalData, subDepartment: e.target.value})} disabled={!modalData.department}>
              <option value="" disabled>Select a sub-department</option>
              {subDepartmentOptions.map(sd => <option key={sd} value={sd}>{sd}</option>)}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Description</label>
            <input type="text" value={modalData.lineItem} onChange={e => setModalData({...modalData, lineItem: e.target.value})} />
          </div>
          <div className={styles.modalActions}>
            <button onClick={handleConfirmAddLine} className={styles.confirmButton}>Add</button>
            <button onClick={() => setIsAddModalOpen(false)} className={styles.cancelButton}>Cancel</button>
          </div>
        </div>
      </div>
    );
  };

  const groupedData = lineItems.reduce((acc, item) => {
    const subGroup = item.summary_group || 'Uncategorized';
    if (!acc[subGroup]) {
      acc[subGroup] = { line_items: [], subtotal: 0 };
    }
    acc[subGroup].line_items.push(item);
    acc[subGroup].subtotal += item.total_gbp || 0;
    return acc;
  }, {});

  for (const subGroup in groupedData) {
      groupedData[subGroup].line_items.sort((a, b) => a.department.localeCompare(b.department) || a.id - b.id);
  }

  const totalBudget = useMemo(() => lineItems.reduce((acc, item) => acc + (item.total_gbp || 0), 0), [lineItems]);

  if (loading && !budget) return <div className="card"><h2>Loading Budget...</h2></div>;
  
  return (
    <div className={styles.budgetPage}>
      <AddLineModal />
      <div className="card">
        <div className={styles.mainHeader}>
            <div>
                <h1>{budget?.budget_name || 'Budget'}</h1>
                {show && <p className={styles.venueName}>{show.venue}</p>}
            </div>
            <div className={styles.headerTotals}>
              <h2 className={styles.totalBudget}>Total: {currencyFormatter.format(totalBudget)}</h2>
              {isSaving && <div className={styles.savingIndicator}>Saving...</div>}
            </div>
        </div>
        {error && <p className={styles.errorText}>{error}</p>}
      </div>
      
      {Object.keys(groupedData).length === 0 && lineItems.length === 0 && !loading ? (
          <div className={`card ${styles.budgetGroup}`}>
            <div className={styles.subGroupHeader}>
                 <h2 className={styles.subGroutpTitle}>Let's get started!</h2>
            </div>
            <p>This budget has no line items yet. Click 'Add Line' to add the first one.</p>
             <button onClick={() => openAddLineModal('CAPEX')} className={styles.addButton}>Add Line</button>
          </div>
      ) : (
        Object.entries(groupedData).map(([subGroup, subGroupData]) => (
          <div key={subGroup} className={`card ${styles.budgetGroup}`}>
            <div className={styles.subGroupHeader}>
              <h2 className={styles.subGroupTitle}>{subGroup}</h2>
              <div className={styles.subGroupActions}>
                <h3 className={styles.subGroupSubtotal}>Subtotal: {currencyFormatter.format(subGroupData.subtotal)}</h3>
                 <button onClick={() => openAddLineModal(subGroup)} className={styles.addButton}>Add Line</button>
              </div>
            </div>
            <table className={styles.lineItemsTable}>
              <thead>
                <tr>
                  <th>Department</th>
                  <th>Description</th>
                  <th>Number</th>
                  <th>Quantity</th>
                  <th>Type</th>
                  <th>Rate</th>
                  <th>Total</th>
                  <th className={styles.actionHeader}></th>
                </tr>
              </thead>
              <tbody>
                {subGroupData.line_items.map(item => (
                  <tr key={item.id}>
                    <td>{item.department}</td>
                    <td><input type="text" value={item.line_item || ''} onChange={e => handleInputChange(item.id, 'line_item', e.target.value)} className={styles.inputField} /></td>
                    <td><input type="number" step="1" value={item.number_of_items || ''} onChange={e => handleInputChange(item.id, 'number_of_items', e.target.value)} className={`${styles.inputField} ${styles.numericInput}`} /></td>
                    <td><input type="number" step="0.01" value={item.quantity || ''} onChange={e => handleInputChange(item.id, 'quantity', e.target.value)} className={`${styles.inputField} ${styles.numericInput}`} /></td>
                    <td>{item.rate_type}</td>
                    <td><input type="number" step="0.01" value={item.rate_gbp || ''} onChange={e => handleInputChange(item.id, 'rate_gbp', e.target.value)} className={`${styles.inputField} ${styles.numericInput}`} /></td>
                    <td>{currencyFormatter.format(item.total_gbp || 0)}</td>
                    <td className={styles.actionCell}>
                      <button onClick={() => handleDelete(item.id)} className={styles.deleteButton}>&times;</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
};

export default BudgetPage;
