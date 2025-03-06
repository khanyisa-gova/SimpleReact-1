import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Layout from '../components/Layout';
import UserList from '../components/UserList';
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

const UsersPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  
  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await userApi.getAll();
      return response.data;
    }
  });
  
  const deleteUserMutation = useMutation({
    mutationFn: (id: number) => userApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (err: any) => {
      setError(err.response?.data || 'Failed to delete user');
    }
  });
  
  const handleDeleteUser = (id: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUserMutation.mutate(id);
    }
  };
  
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">User Management</h1>
        
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <UserList 
          users={users || []} 
          onDelete={handleDeleteUser} 
          isLoading={isLoading}
        />
      </div>
    </Layout>
  );
};

export default UsersPage;
