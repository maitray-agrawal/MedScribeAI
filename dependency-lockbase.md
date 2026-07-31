# Locked Dependency Base (dependency-lockbase.md)

> **Mandatory Rule:** This file is the single source of truth for all installed packages in this repository. Any modification, addition, removal, or version change to `package.json` MUST be reflected in this document and accompanied by a corresponding dated entry in `memory.md` explaining the explicit reason for the change.

---

## 1. Production Dependencies (`dependencies`)

| Package Name | Locked Specifier Version | Purpose / Description |
| :--- | :--- | :--- |
| `@google/genai` | `^2.4.0` | Official Google Gen AI SDK for Gemini models |
| `@tailwindcss/vite` | `^4.1.14` | Tailwind CSS v4 Vite plugin |
| `@vitejs/plugin-react` | `^5.0.4` | Fast Refresh and JSX support for React in Vite |
| `lucide-react` | `^0.546.0` | Modern UI Icon library |
| `react` | `^19.0.1` | Core React web framework |
| `react-dom` | `^19.0.1` | React DOM rendering engine |
| `vite` | `^6.2.3` | Next-generation frontend tooling and bundler |
| `express` | `^4.21.2` | Fast, unopinionated Node.js web framework for server.ts |
| `dotenv` | `^17.2.3` | Environment variable loader from `.env` |
| `motion` | `^12.23.24` | Animation engine for React (Framer Motion) |

---

## 2. Development Dependencies (`devDependencies`)

| Package Name | Locked Specifier Version | Purpose / Description |
| :--- | :--- | :--- |
| `@types/node` | `^22.14.0` | TypeScript definitions for Node.js |
| `@types/express` | `^4.17.21` | TypeScript definitions for Express |
| `autoprefixer` | `^10.4.21` | PostCSS plugin to parse CSS and add vendor prefixes |
| `esbuild` | `^0.25.0` | Lightning-fast JavaScript/TypeScript bundler for server build |
| `tailwindcss` | `^4.1.14` | Utility-first CSS framework |
| `tsx` | `^4.21.0` | TypeScript Execute (Node.js runtime for ts files) |
| `typescript` | `~5.8.2` | TypeScript language compiler |
| `vite` | `^6.2.3` | Vite dev server CLI and build tool |
