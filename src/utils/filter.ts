import { Category } from '../types/expense';

// A generic filter function — works with any array of objects
export function filterByField<T, K extends keyof T>(
  items: T[],
  field: K,
  value: T[K]
): T[] {
  return items.filter(item => item[field] === value);
}

// T must have an 'id' field — that's the constraint
export function findById<T extends { id: string }>(
  items: T[],
  id: string
): T | undefined {
  return items.find(item => item.id === id);
}

// Type guard — returns true if value is a Category enum value
export function isCategory(value: string): value is Category {
  return Object.values(Category).includes(value as Category);
}