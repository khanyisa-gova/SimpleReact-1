import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import Layout from '../components/Layout';
import UserForm from '../components/UserForm';
import { userApi } from '../services/api';
import { Alert, AlertDescription } from '../components/ui/alert';

const UserCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  
  const createUserMutation = useMutation({
    mutationFn: (userData: any) => userApi.create(userData),
    onSuccess: () => {
      navigate('/users');
    },
    onError: (err: any) => {
      setError(err.response?.data || 'Failed to create user');
    }
  });
  
  const handleSubmit = (userData: any) => {
    createUserMutation.mutate(userData);
  };
  
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Create User</h1>
        
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <UserForm 
          onSubmit={handleSubmit} 
          isLoading={createUserMutation.isPending}
        />
      </div>
    </Layout>
  );
};

export default UserCreatePage;
