# Property Search Application

A modern React application for searching and viewing property listings, built with TypeScript and Vite.

## Tech Stack

- **Frontend Framework:** React
- **Language:** TypeScript
- **Build Tool:** Vite
- **Testing:** Vitest
- **Styling:** CSS
- **Package Manager:** npm

## Features

- Property search functionality
- Property details view
- User authentication (Login)
- Responsive design

## Getting Started

### Installation

1. Clone the repository:
```bash
git clone [your-repo-url]
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run tests
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Testing

The project uses Vitest for testing. Test files are located in the `src/__tests__` directory.

To run tests:
```bash
npm run test
```

## Project Configuration

- `vite.config.ts` - Vite configuration
- `tsconfig.json` - TypeScript configuration
- `eslint.config.js` - ESLint configuration

## Development

The project follows a component-based architecture with TypeScript for type safety. Key features include:

- Custom hooks for data fetching (`useProperties`)
- Separate service layer for API calls
- Type definitions for better code maintainability
- Page-based routing structure



