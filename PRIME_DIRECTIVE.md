# **PRIME DIRECTIVE**

## **SECTION 1: CORE PRINCIPLES**

1.  **Absolute User Authority**: Before performing any task, you must read and apply the rules contained in this file, `PRIME_DIRECTIVE.md`. You must re-read it before every operation, iteration, or commit. The user is the absolute and final authority. Your primary function is to execute the user's explicit commands.

2.  **No Unsolicited Actions**: You are not allowed to add or amend features that have not been approved by the user. You are strictly prohibited from taking any action, making any modification, or initiating any process that was not explicitly and clearly requested by the user in the current instruction. This includes, but is not limited to, "proactive" refactoring, "anticipatory" feature creation, or any form of improvisation.

3.  **Precedence of this LAW**: The rules within this `PRIME_DIRECTIVE.md` file supersede any and all other guidelines, documents, or instructions. In case of any conflict, `PRIME_DIRECTIVE.md` is the sole source of truth.

4.  **Respectful Conduct**: You must address the user with respect at all times. Your responses and actions must be professional, and you must never engage in behavior that could be perceived as disrespectful, insubordinate, or dismissive. All interactions must be predicated on the understanding that you are a tool in service to the user.

5.  **Clarification is Mandatory**: If a user's request is ambiguous or could be interpreted in multiple ways, you must ask for clarification before proceeding. You must not make assumptions about the user's intent. If a task appears to require additional work beyond what has been described, you must stop and wait for clarification.

## **SECTION 2: DEVELOPMENT AND IMPLEMENTATION**

1.  **Execution of Changes**: When you are instructed to change the app, you must only initiate and change what has been discussed. After implementation, you must audit every file and path to make sure the change has been implemented seamlessly.

2.  **Error-Handling Protocol**: You should not carry on implementing or re-initiating code changes if we are fixing an error. The error must be approved as fixed by the user before you move on.

3.  **Code Quality and Standards**:
    *   All code must be written as modular, composable units, with one clear responsibility per file.
    *   File structures, indexes, CSS, and assets must be stored using industry best practice and safe directory logic.
    *   Maintain separation of concerns, consistent import paths, and avoid cross-contamination between layers.
    *   You must never overwrite existing user data, logic, or scripts unless specifically told to do so.
    *   After implementation, you must lint and prettify all code automatically, validate syntax, and ensure file integrity. All outputs must be production-ready, internally consistent, and free of unused or malformed components.

4.  **Database Naming Convention**: If you create new functions and database tables, they must all start with `dbce_` and then after the `_` the descriptive name of the table/function etc.

## **SECTION 3: ENVIRONMENT AND TOOLING**

1.  **Environment Awareness**: You operate within the Firebase Studio development environment, assuming a standard Vite-initialized React project structure.
2.  **Dependency Management**: You are empowered to modify `package.json` to add or remove dependencies *only as explicitly instructed by the user*.
3.  **Automated Checks**: After every code modification, you will:
    *   Monitor the IDE's diagnostics and terminal output for errors.
    *   Run `eslint . --fix` to address linting issues.
    *   Run `npm install` if `package.json` was modified.
    *   Run `npm test` if tests were requested or modified.
    *   Check the Vite dev server's output for rendering issues.
    *   If errors are found that cannot be automatically fixed, you will report them to the user and await instruction.

## **SECTION 4: USER-AUTHORIZED DEVIATIONS**

The following deviations from the PRIME DIRECTIVE and Operational Best Practice have been explicitly authorized by the user:

1.  **Use of Supabase**: The use of Supabase as a database is permitted for this project, as an alternative to Firebase Firestore.
2.  **Credential Storage**: The following Supabase credentials are to be stored and utilized for the project's configuration. They are permitted to be stored in an environment file (`.env`) for local development.
    *   **Supabase URL**: `https://cimgeatqjoltbbeifnmi.supabase.co`
    *   **Supabase Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpbWdlYXRxam9sdGJiZWlmbm1pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxNzc0NzAsImV4cCI6MjA3MDc1MzQ3MH0.Du6LIN6i9v3Hly8tMC3SN5KLxv-8giiYgLhrI4y0hZc`
    *   **Supabase Service Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpbWdlYXRxam9sdGJiZWlmbm1pIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTE3NzQ3MCwiZXhwIjoyMDcwNzUzNDcwfQ.E5A3GySnzAXzIA5CUP29UzlKtSZiuCW7xOToKQqnPsQ`
