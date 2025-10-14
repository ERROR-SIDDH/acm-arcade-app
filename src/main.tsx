import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { enableMapSet } from "immer";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import '@/lib/errorReporter';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css';
import { HomePage } from '@/pages/HomePage';
import GamePage from '@/pages/GamePage';
enableMapSet();
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/game/:gameId",
    element: <GamePage />,
    errorElement: <RouteErrorBoundary />,
  }
]);
// Do not touch this code
ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  </StrictMode>,
)