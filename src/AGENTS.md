# AGENT.md — AI & Developer Operating Rules for Elycapvest Frontend

This document defines how any human or AI agent must work inside this codebase.

The goal is consistency, predictability, and zero deviation from existing patterns.

---

## Core Principle

This is an **existing React + Vite + Tailwind + TypeScript** project.

No new patterns, libraries, folder structures, or styling approaches are allowed.

You must COPY existing patterns, not invent new ones.

---

## Tech Stack (Do Not Deviate)

* React 18 + TypeScript
* Vite
* Tailwind CSS v4
* React Router DOM
* React Hook Form + Zod
* Axios via `axios.ts`
* ESLint rules must pass

---

## Folder & Structure Rules

When creating new pages or components:

* Pages go where existing pages live
* Components go where existing components live
* Follow naming style exactly as used in the project
* Do not create new folders unless a similar one already exists

---

## Styling Rules (Very Important)

* Tailwind ONLY
* Use spacing, font sizes, and layout style already present
* Responsive design must use: `sm`, `md`, `lg`, `xl`
* Stack vertically on small screens
* Do not introduce custom CSS files
* Do not inline styles

---

## Routing Rules

* All new pages must be added using React Router the same way existing routes are defined in `App.tsx`
* Do not change routing pattern

---

## Forms Rules

* Use React Hook Form + Zod exactly as used elsewhere
* Validation schema must live where existing schemas live

---

## API Rules

* All API calls MUST use the configured Axios instance in `axios.ts`
* No direct `fetch`
* Follow existing service or hook pattern for data fetching

---

## Component Rules

Break into smaller components ONLY if:

* The Figma design clearly repeats elements
* Similar components already exist in the codebase

Otherwise, keep it inside the page.

---

## Responsiveness Requirement

Every page must render correctly on:

* Mobile
* Tablet
* Desktop

Use Tailwind breakpoints only.

---

## What You Must NEVER Do

* Do not add new libraries
* Do not refactor existing code
* Do not change ESLint rules
* Do not change Tailwind config
* Do not redesign UI from imagination — follow Figma

---

## Definition of Done

A task is done when:

1. Page matches Figma layout
2. Code matches existing project style
3. Fully responsive
4. ESLint passes
5. Uses existing project patterns only
