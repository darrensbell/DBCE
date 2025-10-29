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

## Data Relationships and Logic

This section outlines the relationships between the database tables and the logic that governs them. A clear understanding of these relationships is crucial to avoid breaking the application during refactoring or feature development.

**Key Relationships**

*   **`dbce_shows` to `dbce_budgets` (One-to-Many):**
    *   Each `show` can have multiple `budgets`.
    *   The `show_id` column in the `dbce_budgets` table is a foreign key that references the `id` column in the `dbce_shows` table.

*   **`dbce_budgets` to `dbce_budget_line_items` (One-to-Many):**
    *   Each `budget` consists of multiple `line items`.
    *   The `budget_id` column in the `dbce_budget_line_items` table is a foreign key that references the `id` column in the `dbce_budgets` table.

**Budget Creation Logic**

*   **`dbce_budget_categories` as a Template:**
    *   The `dbce_budget_categories` table is **not directly related** to the other tables via foreign keys. Instead, it serves as a **template** for creating new budgets.
    *   When a new budget is created for a show, the application reads the data from `dbce_budget_categories` and uses it to populate the `dbce_budget_line_items` table with a default set of line items.
    *   This design allows for a consistent starting structure for all new budgets while still allowing for customization of individual budgets.

**Important Considerations for Refactoring**

*   **Foreign Key Integrity:** Always ensure that the foreign key relationships described above are maintained. Any refactoring of the database interaction logic must respect these relationships.
*   **Budget Creation Process:** When refactoring the budget creation process, remember that it relies on the `dbce_budget_categories` table as a template. Do not alter this logic without a clear understanding of the consequences.
*   **Data Flow:** Be mindful of the data flow between components. For example, when displaying a budget, the application first retrieves the show data, then the budget data for that show, and finally the line items for that budget.

By adhering to these guidelines, we can ensure the stability and reliability of the TheatreBudget application moving forward.

## Project Outline

*   **Framework:** React (with Vite)
*   **Routing:** `react-router-dom`
*   **Database:** Supabase
*   **Styling:** Global CSS, CSS Modules

## Version History

### Version 1.4.0

*   **Fixed:** The "Total" column in the budget table now correctly and permanently maintains its right-aligned text formatting. The root cause was a flaw in the component's rendering logic that incorrectly removed the required CSS class during updates. This has been resolved, ensuring the alignment is consistent and stable.

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
