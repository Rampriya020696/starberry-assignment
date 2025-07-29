# Property Search Application

A modern React application for searching and viewing property listings, built with TypeScript and Vite.

## Tech Stack

- **Frontend Framework:** React
- **Language:** TypeScript
- **Build Tool:** Vite
- **Testing:** Vitest
- **Styling:** Tailwind CSS
- **Package Manager:** npm
- **State Management:** React Query

## Features

### Authentication
- Secure login system with email/password authentication
- Protected routes for authenticated users only
- Persistent session management using localStorage
- Demo credentials available for testing
- User-friendly error handling and validation
- Automatic redirect to login for unauthorized access

### Header & Navigation
- Fixed header with welcome message showing logged-in user
- One-click logout functionality
- Persistent across all protected pages
- Responsive design for all screen sizes

### Property Search
- Advanced property search functionality
- Real-time search results
- Property listing cards with key information
- Responsive grid layout for search results
- Property filtering options
- Clean and intuitive search interface

### Property Details
- Detailed property information display
- High-resolution property images
- Comprehensive property specifications
- Location information
- Property features list
- Contact information

### User Experience
- Responsive design for all screen sizes
- Loading states and animations
- Error handling and user feedback
- Clean and modern UI with Tailwind CSS
- Intuitive navigation between pages
- Form validation and error messages

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
- Protected route implementation
- Authentication state management
- Responsive UI components with Tailwind CSS

## Demo Credentials

For testing purposes, use the following credentials:
- Email: admin@starberry.com
- Password: password123



