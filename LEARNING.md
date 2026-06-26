# TypeScript Learning Journal — Expense Tracker

A step-by-step record of TypeScript concepts learned while building this project.

---

## Setup

- **Vite + React + TypeScript** — scaffolded with `npm create vite@latest . -- --template react-ts`
- Dev server runs at `http://localhost:5173` via `npm run dev`

---

## Step 1: Data Model — Types & Interfaces

**File:** `src/types/expense.ts`

### Concept: `type` vs `interface`

```typescript
// A basic type alias — gives a name to any type
type Category = string;

// An interface describes the shape of an object
export interface Expense {
  id: string;
  title: string;
  amount: number;
  date: string;
  category: Category;
  note?: string;       // ? means optional (can be undefined)
}
```

### Key takeaways

- `interface` defines the **shape of an object** — TypeScript enforces every required field
- `type` creates an **alias** for any type (primitives, objects, unions, etc.)
- `?` marks a field as **optional** — it can be omitted or undefined
- Fields have explicit types: `string`, `number` — no implicit `any`
- If you remove a required field (e.g. `amount`), TypeScript flags it immediately as an error

### Using the interface

```typescript
import { Expense } from './types/expense';

const sample: Expense = {
  id: '1',
  title: 'Groceries',
  amount: 85.50,
  date: '2026-06-17',
  category: 'Food',
  // note is optional, so we can omit it
};
```

### `type` vs `interface` — when to use which?

| | `interface` | `type` |
|---|---|---|
| Object shapes | ✅ Preferred | ✅ Works |
| Primitives / unions | ❌ | ✅ Required |
| Extendable | ✅ `extends` | ✅ `&` intersection |
| General rule | Use for objects | Use for everything else |

---

---

## Step 2: Enums for Categories

**File:** `src/types/expense.ts`

### Concept: `enum`

```typescript
export enum Category {
  Food = 'Food',
  Transport = 'Transport',
  Housing = 'Housing',
  Entertainment = 'Entertainment',
  Health = 'Health',
  Other = 'Other',
}
```

Update the `Expense` interface to use it:
```typescript
export interface Expense {
  ...
  category: Category;   // now restricted to enum values only
}
```

Use it in data:
```typescript
import { Expense, Category } from '../types/expense';

const sample: Expense = {
  category: Category.Food,  // type Category. to see autocomplete
};
```

### Key takeaways

- `enum` restricts a field to a **fixed set of named constants** — no typos possible
- String enums (`Category = 'Food'`) are preferred over numeric enums (`Category = 0`) because the value is human-readable in logs, APIs, and the UI
- TypeScript flags `category: 'food'` as an error — must use `Category.Food`
- Enums generate **runtime JavaScript** (unlike interfaces/types which are erased) — that's why `erasableSyntaxOnly` had to be disabled

### `erasableSyntaxOnly` flag

Vite's default `tsconfig.app.json` (line 21) sets:
```json
"erasableSyntaxOnly": true
```

This disallows any TypeScript syntax that generates **runtime JavaScript** — enums and namespaces are the main culprits. The idea is that TypeScript should only add types, which are fully erased at compile time, keeping the output JS clean and predictable.

We disabled it for learning purposes:
```json
"erasableSyntaxOnly": false
```

### Modern alternative: `as const`

If you want to keep `erasableSyntaxOnly: true` (stricter/modern projects), use this pattern instead of enum:

```typescript
export const Category = {
  Food: 'Food',
  Transport: 'Transport',
  Housing: 'Housing',
  Entertainment: 'Entertainment',
  Health: 'Health',
  Other: 'Other',
} as const;

// Derive the type from the object values
export type Category = typeof Category[keyof typeof Category];
```

- `as const` tells TypeScript to treat all values as **literal types** (not just `string`)
- `typeof Category[keyof typeof Category]` derives the union type `'Food' | 'Transport' | 'Housing' | ...` automatically
- Usage is identical: `Category.Food` — autocomplete still works
- No runtime overhead — the object exists at runtime but generates no extra JS like enum does

| | `enum` | `as const` |
|---|---|---|
| Runtime JS generated | ✅ Yes | ❌ No (just an object) |
| Autocomplete | ✅ | ✅ |
| Works with `erasableSyntaxOnly` | ❌ | ✅ |
| Common in older codebases | ✅ | Less common |
| Preferred in modern TS | Less common | ✅ |

---

---

## Step 3: Components with Typed Props

**Files:** `src/components/ExpenseItem.tsx`, `src/App.tsx`

### Concept: Typing props with an interface

```typescript
import type { Expense } from '../types/expense';

interface ExpenseItemProps {
  expense: Expense;
  onDelete: (id: string) => void;  // function type: takes string, returns nothing
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
```

### Key takeaways

- Props are typed with an `interface` — TypeScript enforces what you pass in
- `(id: string) => void` is how you type a function prop — takes a string, returns nothing
- `expense.note && <p>...</p>` safely renders optional fields — no crash if `note` is undefined
- Passing a wrong prop type is immediately flagged as an error

### `import type` vs `import`

`verbatimModuleSyntax: true` in `tsconfig.app.json` requires you to be explicit about type-only imports:

```typescript
import type { Expense } from '../types/expense';  // interface — type only, erased at runtime
import { Category } from '../types/expense';       // enum — exists at runtime as JS object
```

Without `import type`, Vite tries to import `Expense` as a JS value at runtime — but interfaces are fully erased during compilation, so the browser throws a `SyntaxError`.

| What you're importing | Use |
|---|---|
| `interface` or `type` | `import type { ... }` |
| `enum`, function, class, constant | `import { ... }` |

### What is a React Component?

A component is a **self-contained piece of UI** — it owns its own markup, logic, and sometimes state. One component = one responsibility.

Think of a webpage as Lego blocks:

```
App                          ← root component, holds everything
├── ExpenseList              ← responsible for rendering the list
│   ├── ExpenseItem          ← responsible for ONE expense row
│   └── ExpenseItem
├── ExpenseForm              ← responsible for adding a new expense
└── FilterBar                ← responsible for filtering by category
```

Each component:
- **Receives data via props** (passed from parent)
- **Manages its own state** if needed (e.g. form input values)
- **Renders a piece of UI** (returns JSX)

**In our case:**

`ExpenseItem` has one job — render a single expense and provide a delete button. It doesn't know or care about the list, the form, or filtering. It just gets an `expense` object and an `onDelete` function via props and renders them.

`App` is the parent — it holds the full list of expenses in state and passes individual items down to `ExpenseItem`.

**This is why TypeScript + React is powerful** — when `App` passes props to `ExpenseItem`, TypeScript enforces the contract between them. If `App` forgets to pass `onDelete`, TypeScript flags it immediately before it ever runs in the browser.

### How Delete works — data flow

**`ExpenseItem` calls UP to `App`, not the other way around.**

```
User clicks Delete button (inside ExpenseItem)
      ↓
ExpenseItem calls onDelete(expense.id)   ← ExpenseItem initiates this
      ↓
App's handleDelete receives that id      ← App responds
      ↓
handleDelete filters out that expense
      ↓
setExpenses updates state
      ↓
React re-renders — that ExpenseItem disappears
```

- **App is the manager** — owns the data, decides what happens to it
- **ExpenseItem is the worker** — displays one expense, doesn't know about the full list
- When Delete is clicked, ExpenseItem says *"someone wants to delete id='1', you handle it"* — and App does

### Data flows down, events flow up

```
App
 │
 │  expense (data flows DOWN via props)
 │  onDelete (function flows DOWN via props)
 ↓
ExpenseItem
 │
 │  onDelete(id) (event flows UP when button clicked)
 ↑
App reacts and updates state
```

Components never modify data directly — they signal upward and let the **owner of the data** handle it. This is called **lifting state up** — a core React pattern.

TypeScript enforces this contract:
```typescript
onDelete: (id: string) => void
```
If `ExpenseItem` tried to call `onDelete(123)` (number instead of string), TypeScript catches it immediately.

### First taste of generics — `useState<Expense[]>`

```typescript
const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
```

`useState` is a **generic function** — `<Expense[]>` tells TypeScript the state holds an array of `Expense` objects. We'll go deep on generics in Step 4.

---

---

## Step 4: Generics

**Files:** `src/utils/filter.ts`, `src/App.tsx`

### What is a Generic?

Generics let you write **reusable code that works with any type** while still being type-safe.

Without generics, you'd have to write separate functions for each type:
```typescript
function getFirstExpense(arr: Expense[]): Expense { return arr[0]; }
function getFirstString(arr: string[]): string { return arr[0]; }
```

With generics, one function handles any type:
```typescript
function getFirst<T>(arr: T[]): T {
  return arr[0];
}

getFirst([1, 2, 3]);       // T = number
getFirst(['a', 'b']);      // T = string
getFirst(expenses);        // T = Expense
```

`T` is a **type parameter** — a placeholder that gets filled in when the function is called. TypeScript infers it automatically from what you pass in.

---

### Generic filter function

**File:** `src/utils/filter.ts`

```typescript
export function filterByField<T, K extends keyof T>(
  items: T[],
  field: K,
  value: T[K]
): T[] {
  return items.filter(item => item[field] === value);
}
```

Breaking it down:
- `T` — the type of items in the array (e.g. `Expense`)
- `K extends keyof T` — `K` must be a valid key of `T` (e.g. `'category'`, `'title'`) — TypeScript will flag invalid keys immediately
- `value: T[K]` — the value must match the type of that specific field
- Returns `T[]` — same type as input array

```typescript
// Valid — 'category' is a key on Expense, Category.Food matches its type
filterByField(expenses, 'category', Category.Food);

// TypeScript error — 'price' is not a key on Expense
filterByField(expenses, 'price', 'Food');
```

---

### Generic with a constraint

```typescript
export function findById<T extends { id: string }>(
  items: T[],
  id: string
): T | undefined {
  return items.find(item => item.id === id);
}
```

- `T extends { id: string }` — constrains `T` to only types that have an `id: string` field
- `T | undefined` — returns either a `T` or `undefined` if not found — this is a **union type** (covered in Step 5)

---

### Seeing generics in action on the UI

`App.tsx` uses `filterByField` with a selected category state to filter what's displayed:

```typescript
const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');

const visibleExpenses = selectedCategory === 'All'
  ? expenses
  : filterByField(expenses, 'category', selectedCategory);
```

`useState<Category | 'All'>` is itself a generic — it tells TypeScript the state holds either a `Category` enum value or the string `'All'`. This is a union type used as a generic argument.

---

### How category buttons render on screen

```typescript
{Object.values(Category).map(cat => (
  <button key={cat} onClick={() => setSelectedCategory(cat)}>
    {cat}
  </button>
))}
```

`Object.values(Category)` turns the enum into an array:
```typescript
['Food', 'Transport', 'Housing', 'Entertainment', 'Health', 'Other']
```

`.map()` loops over it and creates one `<button>` per value. No hardcoding — if you add a new category to the enum, a new button appears automatically without touching `App.tsx`.

---

### Full flow when user clicks a category button

```
Click "Food" button
      ↓
setSelectedCategory(Category.Food)
      ↓
React re-renders App (runs the component function top to bottom)
      ↓
visibleExpenses = filterByField(expenses, 'category', 'Food')
      → returns only [{ title: 'Groceries', category: 'Food', ... }]
      ↓
.map() renders only ExpenseItem for Groceries
      ↓
UI shows only Groceries
```

Every time state changes, React re-runs the component function. `visibleExpenses` is recalculated fresh on every render:
- `selectedCategory === 'All'` → return all expenses
- Otherwise → call `filterByField` and return only matching ones

The other expenses aren't hidden — they're simply **not rendered at all**.

---

### Key takeaways

- `<T>` is a type parameter — a placeholder filled in at call time
- `K extends keyof T` constrains a type parameter to only valid keys of another type
- Generics make functions reusable across types without losing type safety
- `useState<Type>` is a generic — you're telling React what type the state holds
- `Object.values(Category)` dynamically generates buttons from the enum — adding a new category automatically adds a new button

---

---

## Step 5: Union Types and Type Guards

**Files:** `src/types/alert.ts`, `src/components/AlertBanner.tsx`, `src/utils/filter.ts`

### Concept 1: Union Types

A union type says a value can be **one of several types**. The `|` means "or".

You already used one in Step 4:
```typescript
useState<Category | 'All'>('All')
```

More examples:
```typescript
type ID = string | number;                       // can be either
type Status = 'active' | 'inactive' | 'pending'; // string literal union
type MaybeExpense = Expense | null;               // value or null
```

---

### Concept 2: Type Guards

When you have a union, TypeScript needs you to **narrow it down** before using it. A type guard does that.

```typescript
// value is Category — type predicate
export function isCategory(value: string): value is Category {
  return Object.values(Category).includes(value as Category);
}
```

`value is Category` is a **type predicate** — it tells TypeScript "if this function returns true, treat `value` as `Category` from this point on."

---

### Concept 3: Discriminated Unions

The most powerful union pattern. Each member has a unique `kind` field — the **discriminant** — that TypeScript uses to narrow the type.

**File:** `src/types/alert.ts`

```typescript
type SuccessAlert = {
  kind: 'success';
  message: string;
};

type ErrorAlert = {
  kind: 'error';
  message: string;
  code: number;       // only errors have a code
};

type LoadingAlert = {
  kind: 'loading';
  progress: number;  // only loading has progress
};

export type Alert = SuccessAlert | ErrorAlert | LoadingAlert;
```

TypeScript **narrows the type** inside each `case` of a switch — it knows exactly which shape you're dealing with:

```typescript
function handleAlert(alert: Alert) {
  switch (alert.kind) {
    case 'success':
      console.log(alert.message);
      // alert.code — TypeScript error! code doesn't exist on SuccessAlert
      break;
    case 'error':
      console.log(alert.message, alert.code);  // code available here
      break;
    case 'loading':
      console.log(alert.progress);  // progress available here
      break;
  }
}
```

---

### Using it on the UI — AlertBanner component

**File:** `src/components/AlertBanner.tsx`

```typescript
import type { Alert } from '../types/alert';

interface AlertBannerProps {
  alert: Alert;
}

export function AlertBanner({ alert }: AlertBannerProps) {
  switch (alert.kind) {
    case 'success':
      return <div style={{ color: 'green' }}>{alert.message}</div>;
    case 'error':
      return <div style={{ color: 'red' }}>{alert.message} (code: {alert.code})</div>;
    case 'loading':
      return <div>Loading... {alert.progress}%</div>;
  }
}
```

In `App.tsx`, state holds `Alert | null` — another union:
```typescript
const [alert, setAlert] = useState<Alert | null>(null);
```

`handleDelete` triggers a success alert on delete:
```typescript
const handleDelete = (id: string) => {
  setExpenses(expenses.filter(e => e.id !== id));
  setAlert({ kind: 'success', message: 'Expense deleted!' });
};
```

Rendered conditionally — only shows when alert is not null:
```typescript
{alert && <AlertBanner alert={alert} />}
```

---

### `import type` reminder

Any file importing an `interface` or `type` must use `import type` due to `verbatimModuleSyntax: true`:
```typescript
import type { Alert } from '../types/alert';   // interface/type — use import type
import { Category } from '../types/expense';   // enum — regular import
```

Files that only use generics (like `filter.ts`) don't need to import the type at all — `T` is the placeholder.

---

### Component structure — how a typed React component is organized

A typed React component has 3 parts:

```
1. Type definition (.ts file)
   └── defines the data shape (what the component works with)

2. Props interface (in the .tsx file)
   └── defines what the parent must pass in

3. Export function (in the .tsx file)
   └── the actual UI component
```

In our AlertBanner example:
```
src/types/alert.ts              ← Step 1: data shape
  type SuccessAlert = { ... }
  type ErrorAlert = { ... }
  export type Alert = SuccessAlert | ErrorAlert | LoadingAlert

src/components/AlertBanner.tsx  ← Steps 2 & 3: props + component
  interface AlertBannerProps    ← Step 2: what parent must pass
  export function AlertBanner   ← Step 3: the UI
```

**Steps 2 & 3 always live in the same `.tsx` file** — the props interface sits right above the component that uses it. Only data/type definitions shared across the app go in a separate `.ts` file.

| File | Purpose |
|---|---|
| `src/types/*.ts` | Data shapes shared across the app |
| `src/components/*.tsx` | Props interface + component UI |

You don't always need a separate types file. If a type is only used by one component, define it in that `.tsx` file directly. Move it to `types/` when multiple files need it — like `Alert` or `Expense`.

---

### How component props syntax works

```typescript
export function AlertBanner({ alert }: AlertBannerProps)
//             ^^^^^^^^^^^^^^^^^^^^^  ^^^^^^^^^^^^^^^^
//             destructure alert      type the whole props object
//             from props object      as AlertBannerProps
```

Without destructuring:
```typescript
function AlertBanner(props: AlertBannerProps) {
  switch (props.alert.kind) { ... }  // access via props.alert
}
```

With destructuring:
```typescript
function AlertBanner({ alert }: AlertBannerProps) {
  switch (alert.kind) { ... }        // access directly as alert
}
```

Both are identical — destructuring removes the `props.` prefix everywhere. `{ alert }` is JavaScript destructuring, `: AlertBannerProps` is TypeScript typing. They work together to give you clean access to props with full type safety.

---

### Key takeaways

- `A | B` is a union — the value is either type A or type B
- String literal unions (`'success' | 'error'`) restrict values to exact strings
- A **type guard** narrows a union to a specific member at runtime
- **Discriminated unions** use a shared `kind` field to let TypeScript know which shape you have inside a `switch`
- TypeScript only allows fields that exist on the specific narrowed type — accessing `alert.code` on a `SuccessAlert` is a compile error
- Props interface always lives in the same `.tsx` file as the component
- `{ alert }: AlertBannerProps` — destructuring + typing in one expression

---

---

## Step 6: Utility Types

**Files:** `src/utils/expenseUtils.ts`, `src/App.tsx`

Utility types **transform existing types into new ones**. Instead of rewriting interfaces, you derive what you need from what you already have.

---

### `Partial<T>` — make all fields optional

Useful when updating an expense — only pass the fields that changed:

```typescript
// All fields required
const expense: Expense = {
  id: '1', title: 'Groceries', amount: 85.50,
  date: '2026-06-17', category: Category.Food
};

// Partial makes every field optional
const update: Partial<Expense> = {
  amount: 90.00   // only update amount, rest untouched
};

export function updateExpense(expense: Expense, changes: Partial<Expense>): Expense {
  return { ...expense, ...changes };
}
```

---

### `Pick<T, K>` — keep only specific fields

Useful when a component only needs a subset of a type:

```typescript
type ExpenseSummary = Pick<Expense, 'title' | 'amount'>;

const summary: ExpenseSummary = {
  title: 'Groceries',
  amount: 85.50
  // id, date, category not needed
};

export function summarise(expense: Expense): ExpenseSummary {
  return { title: expense.title, amount: expense.amount };
}
```

---

### `Omit<T, K>` — remove specific fields

Opposite of `Pick` — keep everything except certain fields:

```typescript
// New expense form — no id yet (generated on save)
type NewExpense = Omit<Expense, 'id'>;

export function createExpense(data: NewExpense): Expense {
  return { ...data, id: crypto.randomUUID() };
}
```

TypeScript errors if you try to pass `id` — `NewExpense` doesn't have it.

---

### `Record<K, V>` — typed key-value map

Useful for grouping expenses by category:

```typescript
type ExpensesByCategory = Record<Category, Expense[]>;

export function groupByCategory(expenses: Expense[]): Partial<Record<Category, Expense[]>> {
  return expenses.reduce((acc, expense) => {
    const key = expense.category;
    acc[key] = [...(acc[key] ?? []), expense];
    return acc;
  }, {} as Partial<Record<Category, Expense[]>>);
}
```

`Partial<Record<Category, Expense[]>>` — not every category may have expenses, so `Partial` makes all keys optional.

---

### Seeing it on the UI

`groupByCategory` is used in `App.tsx` to show totals per category:

```typescript
const grouped = groupByCategory(expenses);

{Object.entries(grouped).map(([category, items]) => (
  <p key={category}>
    {category}: {items?.length} expense(s) — 
    ${items?.reduce((sum, e) => sum + e.amount, 0).toFixed(2)}
  </p>
))}
```

This renders a live summary — e.g. `Food: 1 expense(s) — $85.50`. Deleting an expense updates the totals automatically because `grouped` is recalculated on every render from the `expenses` state.

---

### Utility types at a glance

| Utility type | What it does | When to use |
|---|---|---|
| `Partial<T>` | All fields optional | Update/patch operations |
| `Pick<T, K>` | Keep only named fields | Summary/preview components |
| `Omit<T, K>` | Remove named fields | Forms (no id before save) |
| `Record<K, V>` | Typed key-value map | Grouping, lookup tables |

---

### Key takeaways

- Utility types derive new types from existing ones — no duplication
- `Omit<Expense, 'id'>` is safer than a separate `NewExpense` interface — stays in sync automatically when `Expense` changes
- `Partial` is the go-to for update functions — only pass what changed
- `Record<Category, Expense[]>` ensures every key is a valid `Category` — no arbitrary strings

---

## Up Next

- Step 7: Async data fetching with typed responses
