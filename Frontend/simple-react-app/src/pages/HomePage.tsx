import React from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { isAuthenticated, getUserInfo } from '../services/auth';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Users } from 'lucide-react';

const HomePage: React.FC = () => {
  const authenticated = isAuthenticated();
  const userInfo = getUserInfo();

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Welcome to SimpleReact</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>User Management System</CardTitle>
            <CardDescription>
              A simple application for managing users with authentication and authorization
            </CardDescription>
          </CardHeader>
          <CardContent>
            {authenticated ? (
              <div className="space-y-4">
                <p>
                  Welcome back, <span className="font-semibold">{userInfo?.unique_name}</span>!
                </p>
                <p>
                  You are logged in as a{' '}
                  <span className="font-semibold">
                    {Array.isArray(userInfo?.role) 
                      ? userInfo?.role.join(', ') 
                      : userInfo?.role}
                  </span>
                </p>
                <div>
                  <Link to="/users">
                    <Button>
                      <Users className="h-4 w-4 mr-2" />
                      Manage Users
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p>
                  Please log in to access the user management features.
                </p>
                <div className="flex space-x-4">
                  <Link to="/login">
                    <Button>Login</Button>
                  </Link>
                  <Link to="/register">
                    <Button variant="outline">Register</Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>User authentication with JWT tokens</li>
              <li>Role-based authorization</li>
              <li>Complete user management (CRUD operations)</li>
              <li>Secure password handling</li>
              <li>Modern UI with Tailwind CSS</li>
              <li>Distributed tracing with OpenTelemetry</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default HomePage;
