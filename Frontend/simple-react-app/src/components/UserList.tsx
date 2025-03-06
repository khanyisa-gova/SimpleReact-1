import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Edit, Trash2, Plus } from 'lucide-react';

interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  roles: string[];
}

interface UserListProps {
  users: User[];
  onDelete: (id: number) => void;
  isLoading?: boolean;
}

const UserList: React.FC<UserListProps> = ({ users, onDelete, isLoading = false }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Users</h2>
        <Link to="/users/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </Link>
      </div>
      
      {isLoading ? (
        <div className="text-center py-8">Loading users...</div>
      ) : users.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No users found. Create your first user by clicking the "Add User" button.
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                  <TableCell>
                    <Badge variant={user.isActive ? "default" : "secondary"}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.roles.map((role) => (
                      <Badge key={role} variant="outline" className="mr-1">
                        {role}
                      </Badge>
                    ))}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Link to={`/users/edit/${user.id}`}>
                        <Button variant="outline" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => onDelete(user.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default UserList;
