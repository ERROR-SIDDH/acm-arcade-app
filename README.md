# Zap Dash: The Reaction Race

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/ERROR-SIDDH/acm-arcade-app)

Zap Dash is a vibrant, real-time multiplayer web application designed for hosting small, fun competitions. An administrator initiates a game session, which generates a unique QR code for players to join. Players scan the code with their mobile devices, enter their names, and are placed in a virtual lobby. The admin can see all joined players in real-time. Once the team is ready, the admin starts the game, launching all players simultaneously into a series of 3-5 engaging puzzles designed to test their reaction time.

The application's frontend precisely measures the time taken to complete each puzzle, summing them up for a total score. Upon completion, a dynamic and beautifully animated leaderboard is displayed to all participants, ranking them by their total time and celebrating the winner. The entire experience is wrapped in a playful, 'Kid Playful' art style, featuring bright, contrasting colors, rounded UI elements, and cheerful animations to create a lighthearted and exciting atmosphere.

## Key Features

-   **Admin Game Management:** A dedicated dashboard for admins to create, monitor, and start game sessions.
-   **Seamless Player Joining:** Players can join a game instantly by scanning a QR code.
-   **Real-time Lobby:** Both admin and players see the lobby update in real-time as new participants join.
-   **Reaction-Time Puzzles:** A series of fun, fast-paced challenges to test player reflexes.
-   **Dynamic Leaderboard:** An animated and visually appealing leaderboard to display final scores and rankings.
-   **Playful & Responsive UI:** A mobile-first design with a vibrant, kid-friendly aesthetic that looks great on any device.

## Technology Stack

-   **Frontend:** React, TypeScript, Vite, React Router
-   **Backend:** Hono on Cloudflare Workers
-   **Styling:** Tailwind CSS, shadcn/ui
-   **State Management:** Zustand (Client), Cloudflare Durable Objects (Server)
-   **Animation:** Framer Motion
-   **Tooling:** Bun, Wrangler

## Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or later)
-   [Bun](https://bun.sh/) package manager
-   A Cloudflare account

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/zap_dash.git
    cd zap_dash
    ```

2.  **Install dependencies:**
    This project uses Bun for package management.
    ```bash
    bun install
    ```

### Running in Development Mode

To start the development server for both the frontend and the backend worker, run:

```bash
bun run dev
```

This command will:
-   Start the Vite development server for the React frontend (usually on `http://localhost:3000`).
-   Start the Wrangler development server for the Hono backend worker.

The application will be accessible at the address provided by the Vite server. API requests from the frontend will be automatically proxied to the local worker instance.

## Project Structure

-   `src/`: Contains the React frontend application source code.
    -   `pages/`: Main pages/views for the application.
    -   `components/`: Reusable React components.
    -   `lib/`: Utility functions, API client, and state management stores.
-   `worker/`: Contains the Hono backend application for the Cloudflare Worker.
    -   `index.ts`: The entry point for the worker.
    -   `user-routes.ts`: API route definitions.
    -   `entities.ts`: Durable Object entity definitions.
-   `shared/`: Contains TypeScript types and interfaces shared between the frontend and backend.

## Deployment

This project is designed for seamless deployment to Cloudflare Pages and Workers.

1.  **Build the project:**
    This command bundles the frontend application and prepares the worker for deployment.
    ```bash
    bun run build
    ```

2.  **Deploy to Cloudflare:**
    Make sure you are logged into your Cloudflare account via the Wrangler CLI (`npx wrangler login`). Then, run the deploy command:
    ```bash
    bun run deploy
    ```

    This will deploy your application to the Cloudflare network. Wrangler will provide you with the URL of your deployed application.

Alternatively, you can deploy directly from your GitHub repository.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/ERROR-SIDDH/acm-arcade-app)