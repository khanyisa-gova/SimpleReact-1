import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Layout from '../components/Layout';
import UserForm from '../components/UserForm';
import { userApi } from '../services/api';
import { Alert, AlertDescription } from '../components/ui/alert';

interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  roles: string[];
}

const UserEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ['user', id],
    queryFn: async () => {
      const response = await userApi.getById(Number(id));
      return response.data;
    }
  });
  
  const updateUserMutation = useMutation({
    mutationFn: (userData: any) => userApi.update(Number(id), userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', id] });
      navigate('/users');
    },
    onError: (err: any) => {
      setError(err.response?.data || 'Failed to update user');
    }
  });
  
  const handleSubmit = (userData: any) => {
    updateUserMutation.mutate(userData);
  };
  
  if (isLoading) {
    return (
      <Layout>
        <div className="text-center py-8">Loading user data...</div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Edit User</h1>
        
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {user && (
          <UserForm 
            initialData={user} 
            onSubmit={handleSubmit} 
            isLoading={updateUserMutation.isPending}
          />
        )}
      </div>
    </Layout>
  );
};

export default UserEditPage;
