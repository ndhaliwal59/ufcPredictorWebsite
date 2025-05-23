# UFC Predictor

A React/TypeScript UFC fight prediction website that compares AI-generated odds with sportsbooks to identify value bets.

## Features

- Modern dark-themed UI optimized for UFC content
- Responsive navigation with mobile menu support
- Fight prediction cards showing AI win probabilities vs bookmaker odds
- "How It Works" page explaining the prediction methodology
- Events page with detailed fighter comparisons

## Project Structure

```
src/
├── assets/         # Static assets like images
├── components/     # React components including UI components
│   └── ui/         # Reusable UI components built with Radix UI and Tailwind
├── hooks/          # Custom React hooks
├── lib/            # Utility functions and type definitions
├── pages/          # Page components
└── App.tsx         # Main application component with routing
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Technologies Used

- React
- TypeScript
- Tailwind CSS
- Radix UI
- React Query
- Wouter (for routing)
- Lucide React (for icons)

## File Structure Overview

- `src/pages/` - Contains main page components (Home, Events, HowItWorks)
- `src/components/` - Contains all UI components including section components
- `src/lib/types.ts` - Contains TypeScript interface definitions for data models
- `src/lib/utils.ts` - Contains utility functions for the application

## Notes

This is a frontend-only project. In a production environment, you would connect this to a backend API that provides the fight prediction data.