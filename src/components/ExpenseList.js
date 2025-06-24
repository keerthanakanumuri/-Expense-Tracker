import React from 'react';
import ExpenseItem from './ExpenseItem';

const ExpenseList = ({ expenses, onDelete }) => {
  return (
    <ul className="expense-list">
      {expenses.length === 0 && <p>No expenses added yet.</p>}
      {expenses.map((expense) => (
        <ExpenseItem key={expense.id} expense={expense} onDelete={onDelete} />
      ))}
    </ul>
  );
};

export default ExpenseList;

