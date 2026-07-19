# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
# Semiconductor Wafer Defect Detection - Frontend

## Prerequisites

Install the following before running the project:

- Node.js (v20 or above recommended)
- npm (comes with Node.js)
- Git

## Clone Repository

```bash
git clone <repository-url>
```

## Navigate

```bash
cd Semiconductor_wafer/frontend
```

## Install Dependencies

```bash
npm install
```

## Run Development Server

```bash
npm run dev
```

The application will be available at:

http://localhost:5173

## Build for Production

```bash
npm run build
```

## Preview Production Build

```bash
npm run preview
```

## Installed Packages

- React
- Vite
- Tailwind CSS v4
- React Router DOM
- Axios
- Framer Motion
- Recharts
- Lucide React
- React Hot Toast
- React Dropzone
- clsx
- tailwind-merge

## Project Structure

```
frontend/
│
├── public/
├── src/
│   ├── components/
│   ├── layouts/
│   ├── mock/
│   ├── pages/
│   ├── routes/
│   ├── services/
│   └── main.jsx
│
├── package.json
└── vite.config.js
```
