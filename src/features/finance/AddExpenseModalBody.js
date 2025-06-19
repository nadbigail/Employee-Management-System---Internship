import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';

const EXPENSE_STATUS_OPTIONS = ['Pending', 'Approved', 'Rejected'];

function AddExpenseModalBody({ closeModal, extraObject }) {
  const { setExpenses, editingExpense, role, department } = extraObject;
  const { name: loggedInUserName } = useSelector(state => state.user);

  const canChangeStatus = role === 'admin' || department === 'Finance Accounting & Tax';

  const INITIAL_EXPENSE_OBJ = {
    itemName: '',
    price: '',
    purchasedFrom: '',
    purchaseDate: moment().format("YYYY-MM-DD"),
    reason: '',
  };

  const [expenseObj, setExpenseObj] = useState(
    editingExpense ? { ...editingExpense } : INITIAL_EXPENSE_OBJ
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setExpenseObj(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!expenseObj.itemName || !expenseObj.price || !expenseObj.purchaseDate) {
      alert("Please fill in Item Name, Price, and Purchase Date.");
      return;
    }

    const newExpense = {
      ...expenseObj,
      id: editingExpense?.id || crypto.randomUUID(),
      price: parseFloat(expenseObj.price),
      requestedBy: editingExpense?.requestedBy || loggedInUserName,
      status: editingExpense?.status ? expenseObj.status : 'Pending',
    };

    setExpenses(currentExpenses => {
      if (editingExpense) {
        return currentExpenses.map(exp => exp.id === editingExpense.id ? newExpense : exp);
      } else {
        return [newExpense, ...currentExpenses];
      }
    });

    closeModal();
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="label"><span className="label-text">Item Name</span></label>
        <input type="text" name="itemName" value={expenseObj.itemName} onChange={handleInputChange} className="input input-bordered w-full" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label"><span className="label-text">Price ($)</span></label>
          <input type="number" name="price" value={expenseObj.price} onChange={handleInputChange} className="input input-bordered w-full" />
        </div>
        <div>
          <label className="label"><span className="label-text">Purchase Date</span></label>
          <input type="date" name="purchaseDate" value={expenseObj.purchaseDate} onChange={handleInputChange} className="input input-bordered w-full" />
        </div>
      </div>
      <div>
        <label className="label"><span className="label-text">Purchased From</span></label>
        <input type="text" name="purchasedFrom" value={expenseObj.purchasedFrom} onChange={handleInputChange} className="input input-bordered w-full" />
      </div>
      <div>
        <label className="label"><span className="label-text">Reason / Description</span></label>
        <textarea name="reason" value={expenseObj.reason} onChange={handleInputChange} className="textarea textarea-bordered w-full"></textarea>
      </div>

      {editingExpense && canChangeStatus && (
        <div>
          <label className="label"><span className="label-text">Status</span></label>
          <select name="status" value={expenseObj.status} onChange={handleInputChange} className="select select-bordered w-full">
            {EXPENSE_STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
      )}

      <div className="modal-action mt-4">
        <button className="btn btn-ghost" onClick={() => closeModal()}>Cancel</button>
        <button className="btn btn-primary" onClick={handleSave}>
          {editingExpense ? 'Save Changes' : 'Submit Request'}
        </button>
      </div>
    </div>
  );
}

export default AddExpenseModalBody;