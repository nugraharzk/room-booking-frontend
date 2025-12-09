# Room Booking Frontend

This is the frontend application for the Room Booking Solution, built with React, TypeScript, and Vite.

## Features

- **Modern UI**: Built with Tailwind CSS and Shadcn UI.
- **Room Management**: Browse and book rooms.
- **Role-Based Access**: Specialized views for Admin, User, and Manager roles.

## Prerequisites

- **Node.js**: Version 22+
- **Docker**: For containerized deployment.
- **Backend**: The `room-booking-solution` backend must be running (default port 5200).

## Getting Started

### Local Development

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3200`.

### Running with Docker

This project includes a Docker configuration for easy deployment.

1. **Build and Run**

   ```bash
   docker-compose up --build
   ```

2. **Access Application**
   Open [http://localhost:3200](http://localhost:3200) in your browser.

   > **Note**: The Docker configuration expects the backend API (`roombooking-api`) to be available on your host machine at port **5200**.

## Project Structure

- `src/`: Source code.
  - `components/`: Reusable UI components.
  - `views/`: Page components.
  - `hooks/`: Custom React hooks.
- `docker-compose.yml`: Docker orchestration.
- `nginx.conf`: Nginx configuration for the container.
