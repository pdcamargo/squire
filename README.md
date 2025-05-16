# Squire Project

## Overview

Squire is a modern web application built using AdonisJS with Inertia.js and React. It leverages a robust backend and a dynamic frontend to deliver a seamless user experience. The project is structured to ensure scalability, maintainability, and ease of contribution.

### Key Features

- **AdonisJS Backend**: A powerful Node.js framework for building scalable applications.
- **Inertia.js Integration**: Bridges the gap between server-side and client-side rendering.
- **React Frontend**: Utilizes React 19+ for building dynamic and interactive user interfaces.
- **ShadCN/UI Components**: A collection of modern and reusable UI components.
- **Dark Mode**: Enabled by default for a sleek and modern look.

## Project Structure

- **`app/`**: Contains backend controllers, middleware, models, and helpers.
- **`config/`**: Configuration files for various services and settings.
- **`database/`**: Database migrations and seeds.
- **`inertia/`**: Frontend code, including pages, components, and styles.
  - **`inertia/lib/components/ui/`**: Reusable UI components.
  - **`inertia/pages/`**: Application pages rendered by Inertia.js.
- **`public/`**: Static assets like images and icons.
- **`resources/views/`**: Edge templates for server-side rendering.
- **`start/`**: Application entry points and route definitions.

## Contribution Guide

### Branch Naming Pattern

- Use the format: `feature/<description>` for new features.
- Use the format: `fix/<description>` for bug fixes.
- Use the format: `chore/<description>` for maintenance tasks.

### Commit Message Pattern

- Use prefixes like `feat`, `fix`, `chore`, `refactor`, `docs`, `style`, `test`, `build`, or `ci`.
- Example: `feat: add user authentication`.

### How to Contribute

1. Fork the repository and clone it locally.
2. Create a new branch following the naming pattern.
3. Make your changes and commit them with a descriptive message.
4. Push your branch to the remote repository.
5. Create a pull request with a detailed description of your changes.

## Technologies Used

- **AdonisJS**: Backend framework.
- **Inertia.js**: Middleware for server-driven SPA.
- **React 19+**: Frontend library.
- **ShadCN/UI**: Modern UI components.
- **TypeScript**: Strongly typed JavaScript.
- **Docker**: Containerization for development and deployment.

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/squire.git
   ```
2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Documentation

- **Routes**: Defined in `start/routes.ts`.
- **Controllers**: Found in `app/controllers/`.
- **UI Components**: Located in `inertia/lib/components/ui/`.

For detailed documentation, refer to the codebase and comments.

## License

This project is licensed under the MIT License.
