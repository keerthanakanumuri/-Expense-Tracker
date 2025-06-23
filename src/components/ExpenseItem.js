import React from 'react';

const ExpenseItem = ({ expense, onDelete }) => {
  return (
    <li className="expense-item">
      <span>{expense.title}</span>
      <span>₹{expense.amount.toFixed(2)}</span>
      <span>{expense.date}</span>
      <button onClick={() => onDelete(expense.id)}>❌</button>
    </li>
  );
};

export default ExpenseItem;
