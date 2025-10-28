# Show Manager Application Blueprint

## Overview

A simple yet powerful application to help users manage their shows. It provides functionalities to create new shows and browse through existing ones. The application is built with React and Vite and uses `react-router-dom` for navigation. It connects to a Supabase database for live data, including shows, budgets, and budget line items. The application is currently unstyled.

## Project Outline

### Core Technologies

*   **Framework:** React (with Vite)
*   **Routing:** `react-router-dom`
*   **Database:** Supabase
*   **Linting:** ESLint

### Application Structure

*   `src/main.jsx`: Application entry point.
*   `src/index.css`: Global styles.
*   `src/App.jsx`: Main application component, responsible for routing.
*   `src/pages/`: Directory containing all page components.
    *   `LandingPage.jsx`: The initial page users see, offering navigation to other parts of the app.
    *   `NewShowPage.jsx`: A form for creating a new show.
    *   `ExistingShowsPage.jsx`: A page to display and manage existing shows.
    *   `ShowHomepage.jsx`: A detailed view for a single show, displaying its budgets.
    *   `NewBudgetPage.jsx`: A form for creating a new budget for a show.
    *   `BudgetPage.jsx`: A detailed view for a single budget, displaying its line items and a form to add new ones.
*   `src/supabaseClient.js`: Supabase client configuration.
*   `.env`: Environment variables for Supabase credentials.

### Design & Aesthetics

*   **Current State:** The application is currently unstyled.
*   **Goal:** The aim is to create clean, modern, and responsive layouts for all pages, with clear typography, an appealing color scheme, and consistent interactive elements.

## Previous Plan: Rebuild and Enhance

1.  **[DONE]** Demolish the previous application structure by removing files from the `src` directory.
2.  **[DONE]** Rebuild a functional React application with basic routing and page components.
3.  **[REMOVED]** Configure and integrate Tailwind CSS for modern styling.
4.  **[REMOVED]** Refactor all page components to utilize Tailwind CSS for a visually appealing and responsive design.
5.  **[DONE]** Integrate Supabase for live data, including creating a Supabase client, adding environment variables, and refactoring pages to fetch and create data.
6.  **[DONE]** Implement budgeting functionality, allowing users to create budgets for shows and add line items to those budgets.

## Current Plan: Address Styling

1.  **[DONE]** Remove Tailwind CSS and all related configurations to resolve the PostCSS build error.
2.  **[IN PROGRESS]** Ensure all code adheres to quality standards by running the linter.
3.  **[TODO]** Verify the application is fully functional in the preview environment.
4.  **[PROPOSED]** Implement a new styling solution. As per guidelines, CSS Modules is the default choice. This will involve:
    *   Creating `.module.css` files for each component.
    *   Refactoring each component to import and use the styles from its corresponding CSS Module.
    *   Applying styles to achieve a polished and responsive design.
