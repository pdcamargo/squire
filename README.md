# Squire Project

Squire is a TypeScript-based web application built with AdonisJS and Inertia.js. It provides a robust backend framework combined with a modern React-based frontend. This project is designed to deliver a seamless user experience with features like authentication, dynamic dashboards, and runtime interactions.

## Features

- **AdonisJS Backend**: A powerful backend framework with controllers, middleware, and models.
- **Inertia.js Frontend**: A modern React-based frontend with reusable UI components.
- **Authentication**: Middleware for handling authentication and guest access.
- **Dynamic Dashboards**: Interactive pages for managing user data and settings.
- **Runtime Interactions**: Real-time features for enhanced user engagement.

## Project Structure

- **Backend**:

  - `app/controllers`: Handles HTTP requests and responses.
  - `app/middleware`: Middleware for authentication and other request handling.
  - `app/models`: Database models for managing data.
  - `app/validators`: Validation logic for user inputs.
  - `config`: Configuration files for the application.

- **Frontend**:

  - `inertia/app`: Entry point for the React application.
  - `inertia/lib/components/ui`: Reusable UI components like buttons, forms, and tables.
  - `inertia/pages`: Page components for different routes.

- **Database**:
  - `database/migrations`: Migration files for setting up the database schema.

## Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/your-repo/squire.git
   cd squire
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up the environment variables:

   - Copy `.env.example` to `.env` and configure the necessary variables.

4. Run the database migrations:

   ```bash
   node ace migration:run
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

- Access the application at `http://localhost:3333`.
- Use the dashboard to manage user data and settings.
- Explore runtime features for real-time interactions.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License.
