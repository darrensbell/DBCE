# Show Manager Application Blueprint

## Overview

A simple yet powerful application to help users manage their shows. It provides functionalities to create new shows and browse through existing ones. The application is built with React and Vite and uses `react-router-dom` for navigation. It connects to a Supabase database for live data, including shows, budgets, and budget line items. The application now features a modern, card-based design with a global stylesheet for a consistent look and feel.

## Database Schema (Authoritative)

This schema is automatically fetched from the Supabase database and serves as the single source of truth for all database operations.

### `dbce_shows`

| Column               | Type        |
|----------------------|-------------|
| `id`                 | `int4`      |
| `show_name`          | `varchar`   |
| `show_date`          | `date`      |
| `planned_performances`| `int4`      |
| `venue`              | `varchar`   |
| `created_at`         | `timestamptz` |
| `updated_at`         | `timestamptz` |

### `dbce_budgets`

| Column        | Type        |
|---------------|-------------|
| `id`          | `int4`      |
| `show_id`     | `int4`      |
| `budget_name` | `varchar`   |
| `created_at`  | `timestamptz` |
| `updated_at`  | `timestamptz` |

### `dbce_budget_categories`

| Column         | Type        |
|----------------|-------------|
| `id`           | `int4`      |
| `ordering`     | `int4`      |
| `summary_group`| `text`      |
| `department`   | `text`      |
| `sub_department`| `text`      |
| `line_item`    | `text`      |
| `date_created` | `timestamptz` |
| `date_amended` | `timestamptz` |

### `dbce_budget_line_items`

| Column              | Type             |
|---------------------|------------------|
| `id`                | `int4`           |
| `budget_id`         | `int4`           |
| `budget_category_id`| `int4`           |
| `number_of_items`   | `int4`           |
| `quantity`          | `int4`           |
| `rate_type`         | `dbce_rate_type` |
| `rate_gbp`          | `numeric`        |
| `total_gbp`         | `numeric`        |
| `notes`             | `text`           |
| `date_added`        | `timestamptz`    |
| `date_changed`      | `timestamptz`    |

## Project Outline

*   **Framework:** React (with Vite)
*   **Routing:** `react-router-dom`
*   **Database:** Supabase
*   **Styling:** Global CSS, CSS Modules
*   **Component Library:** Handsontable for spreadsheet views.

## Version History

### Version 1.1.1

*   **Feature:** Implemented Git versioning and pushed the initial stable version to GitHub.
*   **Fix:** Resolved a critical bug where budget creation failed silently. The root cause was a Row Level Security (RLS) policy on the `dbce_budget_categories` table that prevented the application from fetching the necessary category data. This led to shows being created with empty budgets. The user removed the RLS policy, which resolved the issue.

## Current Plan: Interactive Budget Spreadsheet

**Goal:** To replace the static budget table on the `BudgetPage` with a dynamic, Excel-style spreadsheet grid using the Handsontable library.

**Key Features:**

*   Display budget line items in a familiar spreadsheet interface.
*   Allow inline editing of the 'Quantity', 'Rate', and 'Notes' fields.
*   Automatically recalculate the 'Total' column when 'Quantity' or 'Rate' changes.
*   Save any edits back to the Supabase database in real-time.

**Action Items:**

1.  **Install Dependencies:** Install `@handsontable/react` and `handsontable` via npm.
2.  **Refactor BudgetPage.jsx:** Replace the existing HTML table with the `<HotTable>` component.
3.  **Configure Spreadsheet:** Set up the columns, data binding, and define which columns are editable.
4.  **Implement Auto-Save:** Create a function that listens for cell changes and triggers an update to the `dbce_budget_line_items` table in Supabase.
5.  **Style the Grid:** Import the Handsontable CSS to ensure the grid has a clean, professional appearance.
