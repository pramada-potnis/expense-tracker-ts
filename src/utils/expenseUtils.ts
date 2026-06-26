import { Category } from '../types/expense';
import type { Expense } from '../types/expense';

// Partial — update only changed fields
export function updateExpense(
  expense: Expense,
  changes: Partial<Expense>
): Expense {
  return { ...expense, ...changes };
}

// Pick — summary view with only title and amount
export type ExpenseSummary = Pick<Expense, 'title' | 'amount'>;

export function summarise(expense: Expense): ExpenseSummary {
  return { title: expense.title, amount: expense.amount };
}

// Omit — new expense form has no id yet
export type NewExpense = Omit<Expense, 'id'>;

export function createExpense(data: NewExpense): Expense {
  return { ...data, id: crypto.randomUUID() };
}

// Record — group expenses by category
export function groupByCategory(expenses: Expense[]): Partial<Record<Category, Expense[]>> {
  return expenses.reduce((acc, expense) => {
    const key = expense.category;
    acc[key] = [...(acc[key] ?? []), expense];
    return acc;
  }, {} as Partial<Record<Category, Expense[]>>);
}

