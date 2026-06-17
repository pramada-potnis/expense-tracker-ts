import { Expense, Category } from '../types/expense';

export const sample: Expense = {
  id: '1',
  title: 'Groceries',
  amount: 85.50,
  date: '2026-06-17',
  category: Category.Food,
};