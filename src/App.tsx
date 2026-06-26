import { useState } from 'react';
import type { Expense } from './types/expense';
import { Category } from './types/expense';
import { ExpenseItem } from './components/ExpenseItem';
import { filterByField } from './utils/filter';
import type { Alert } from './types/alert';
import { AlertBanner } from './components/AlertBanner';

const initialExpenses: Expense[] = [
  {
    id: '1',
    title: 'Groceries',
    amount: 85.50,
    date: '2026-06-17',
    category: Category.Food,
  },
  {
    id: '2',
    title: 'Bus Pass',
    amount: 45.00,
    date: '2026-06-17',
    category: Category.Transport,
    note: 'Monthly pass',
  },
  {
    id: '3',
    title: 'Cinema',
    amount: 20.00,
    date: '2026-06-17',
    category: Category.Entertainment,
  },
];

export default function App() {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [alert, setAlert] = useState<Alert | null>(null);

  const handleDelete = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
    setAlert({ kind: 'success', message: 'Expense deleted!' });
  };

  const visibleExpenses = selectedCategory === 'All'
    ? expenses
    : filterByField(expenses, 'category', selectedCategory);

  return (
    <div>
      <h1>Expense Tracker</h1>
      {alert && <AlertBanner alert={alert} />}

      {/* Category filter buttons */}
      <div>
        <button onClick={() => setSelectedCategory('All')}>All</button>
        {Object.values(Category).map(cat => (
          <button key={cat} onClick={() => setSelectedCategory(cat)}>
            {cat}
          </button>
        ))}
      </div>

      {/* Filtered expense list */}
      {visibleExpenses.map(expense => (
        <ExpenseItem
          key={expense.id}
          expense={expense}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}