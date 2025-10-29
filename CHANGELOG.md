## Version 1.1.1

**This version is the first stable release after a critical bug fix.**

*   **Fixed:** The budget creation process was failing silently and catastrophically. The root cause was determined to be a Row Level Security (RLS) policy on the `dbce_budget_categories` table in the Supabase database. The policy was preventing the application from reading the category list, leading to the creation of shows with no associated budget line items. The RLS policy was removed by the user, and the existing code now functions as intended.
