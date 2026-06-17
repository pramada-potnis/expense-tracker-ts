import type { Expense } from '../types/expense';

// Define the shape of props this component accepts
interface ExpenseItemProps {
  expense: Expense;
  onDelete: (id: string) => void;  // function type
}

export function ExpenseItem({ expense, onDelete }: ExpenseItemProps) {
  return (
    <div>
      <h3>{expense.title}</h3>
      <p>Amount: ${expense.amount}</p>
      <p>Category: {expense.category}</p>
      <p>Date: {expense.date}</p>
      {expense.note && <p>Note: {expense.note}</p>}
      <button onClick={() => onDelete(expense.id)}>Delete</button>
    </div>
  );
}