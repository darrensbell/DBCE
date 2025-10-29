# TheatreBudget Application Blueprint

## Overview

A simple yet powerful application to help users manage their theatre production budgets. The application, now named **TheatreBudget**, provides functionalities to create new shows and browse through existing ones. It is built with React and Vite and uses `react-router-dom` for navigation. The application features a global sidebar with a home button and a database connection status indicator. It connects to a Supabase database for live data, including shows, budgets, and budget line items. The application now features a modern, card-based design with a global stylesheet for a consistent look and feel.

## Database Schema

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

This table serves as a template for creating new budgets.

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
| `summary_group`     | `text`           |
| `department`        | `text`           |
| `sub_department`    | `text`           |
| `line_item`         | `text`           |
| `number_of_items`   | `numeric`        |
| `quantity`          | `numeric`        |
| `rate_type`         | `dbce_rate_type` |
| `rate_gbp`          | `numeric`        |
| `total_gbp`         | `numeric`        |
| `notes`             | `text`           |
| `created_at`        | `timestamptz`    |
| `updated_at`      | `timestamptz`    |

## Project Outline

*   **Framework:** React (with Vite)
*   **Routing:** `react-router-dom`
*   **Database:** Supabase
*   **Styling:** Global CSS, CSS Modules

## Version History

### Version 1.3.0

*   **Feature:** Renamed the application to "TheatreBudget".
*   **Feature:** Added a global sidebar with a "Home" button for easy navigation and a database connection status indicator.
*   **Feature:** The total budget cost is now prominently displayed at the top of the budget page.
*   **Feature:** The show's venue is now displayed under the budget title for better context.
*   **Enhancement:** Improved the main landing page with a clear title and a welcoming message.

### Version 1.2.0

*   **Feature:** Major UI/UX overhaul for the budget page, including a more compact and streamlined table layout, optimized column widths, and a "Saving..." indicator for auto-saves.
*   **Feature:** Added `number_of_items` field to the budget table and calculations.
*   **Fix:** Resolved a critical bug preventing line item edits from being saved correctly.
*   **Fix:** Corrected data type mismatches for numeric inputs.
*   **Enhancement:** Improved user experience for empty budgets and allowed decimal inputs for financial values.

### Version 1.1.1

*   **Fix:** Resolved a critical bug where budget creation failed silently due to a Supabase Row Level Security policy.
