# Show Manager Application Blueprint

## Overview

A simple yet powerful application to help users manage their shows. It provides functionalities to create new shows and browse through existing ones. The application is built with React and Vite and uses `react-router-dom` for navigation. It connects to a Supabase database for live data, including shows, budgets, and budget line items. The application now features a modern, card-based design with a global stylesheet for a consistent look and feel.

## Project Outline

### Core Technologies

*   **Framework:** React (with Vite)
*   **Routing:** `react-router-dom`
*   **Database:** Supabase
*   **Linting:** ESLint
*   **Styling:** Global CSS, CSS Modules for component-specific styles.

### Application Structure

*   `src/main.jsx`: Application entry point.
*   `src/styles/global.css`: Global styles, including the card design.
*   `src/styles/HomePage.module.css`: Component-specific styles for the homepage.
*   `src/App.jsx`: Main application component, responsible for routing and the main layout.
*   `src/pages/`: Directory containing all page components.
    *   `HomePage.jsx`: The main dashboard, displaying shows in a card grid.
    *   `NewShowPage.jsx`: A form for creating a new show.
    *   `ShowHomepage.jsx`: A detailed view for a single show, displaying its budgets.
    *   `BudgetPage.jsx`: A detailed view for a single budget, displaying its line items.
*   `src/supabaseClient.js`: Supabase client configuration.
*   `.env`: Environment variables for Supabase credentials.
*   `src/utils/logger.js`: A utility for logging errors.

### Design & Aesthetics

*   **Current State:** The application uses a modern, responsive design featuring a sidebar for navigation and a main content area. The primary display paradigm is a card-based layout, where each show and interactive element is presented as a distinct, "floating" card. Styling is managed through a global stylesheet (`src/styles/global.css`) for consistency and component-specific CSS modules for targeted styles.
*   **Goal:** To continue refining the UI/UX, ensuring all components are visually cohesive, accessible, and intuitive to use.

## Recent Changes & Bug Fixes

### Styling and Layout Refactor

*   **[DONE]** Removed the previous, unstyled implementation.
*   **[DONE]** Implemented a global stylesheet (`src/styles/global.css`) to define the main application layout (sidebar + main content) and a consistent, reusable "card" style.
*   **[DONE]** Refactored `App.jsx` to serve as the main layout component.
*   **[DONE]** Updated `HomePage.jsx` to use the new card-based grid layout, making the interface more modern and visually appealing.

### Bug Fixes

*   **[FIXED]** Corrected a critical bug in `NewShowPage.jsx` where budget line items were not being created for new shows. The issue was caused by an incorrect table name (`dbce_budget_categories` instead of `dbce_categories`) and an incorrect column name (`budget_category_id` instead of `category_id`).
*   **[FIXED]** Resolved a build error in `App.jsx` caused by an incorrect import path for the `ShowHomepage.jsx` component (`ShowPage` vs. `ShowHomepage`).
*   **[FIXED]** Removed an invalid `<style jsx>` block from `NewShowPage.jsx` that was causing a React rendering error, as `styled-jsx` is not a dependency in this project. The associated styles were moved to the global stylesheet.
*   **[IMPROVED]** Enhanced the error handling in `NewShowPage.jsx` to display specific database error messages instead of a generic "[object Object]" error. This will make future debugging much more efficient.

## Current Plan

1.  **[DONE]** Ensure all code adheres to quality standards by running the linter.
2.  **[DONE]** Verify the application is fully functional in the preview environment.
3.  **[TODO]** Continue to build out features and refine the user interface based on feedback.
