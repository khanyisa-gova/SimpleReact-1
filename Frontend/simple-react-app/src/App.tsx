import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { initTelemetry } from './telemetry';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UsersPage from './pages/UsersPage';
import UserCreatePage from './pages/UserCreatePage';
import UserEditPage from './pages/UserEditPage';
import './App.css';

// Initialize OpenTelemetry
initTelemetry();

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route 
            path="/users" 
            element={
              <ProtectedRoute>
                <UsersPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/users/create" 
            element={
              <ProtectedRoute>
                <UserCreatePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/users/edit/:id" 
            element={
              <ProtectedRoute>
                <UserEditPage />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
