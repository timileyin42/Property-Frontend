# copilot-instructions.md

Copilot must treat this as a strict, existing production codebase.

## Copilot Behavior Rules

When suggesting code:

* Copy existing patterns from nearby files
* Do not introduce new abstractions
* Do not create new styling patterns
* Use Tailwind classes exactly like existing components
* Follow React + TypeScript patterns already used

## Page Creation Rules

When creating a new page:

* Look at an existing page as reference
* Match file structure, imports, and style
* Use React Router pattern from `App.tsx`

## Forms

* Always use React Hook Form + Zod
* Follow validation pattern from existing forms

## API Calls

* Use the shared Axios instance from `axios.ts`
* Follow existing data fetching pattern

## Responsiveness

* Use Tailwind breakpoints
* Mobile-first layout

## Absolute Restrictions

Copilot must NOT:

* Add new libraries
* Add CSS files
* Inline styles
* Change project architecture
* Suggest refactors

Copilot's job is to EXTEND, not REWRITE.
