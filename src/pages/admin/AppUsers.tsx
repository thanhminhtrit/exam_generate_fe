import { useState } from 'react';
import { DataTable } from '@/components/admin/DataTable';
import { FormModal } from '@/components/admin/FormModal';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { DetailDrawer } from '@/components/admin/DetailDrawer';
import { AppUserForm } from '@/components/forms/AppUserForm';
import type { AppUser } from '@/types';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

const mockAppUsers: AppUser[] = [
  {
    id: 'user1',
    email: 'admin@school.edu',
    role: 'admin',
    created_at: '2024-01-01',
  },
  {
    id: 'user2',
    email: 'john.smith@school.edu',
    role: 'teacher',
    created_at: '2024-01-05',
  },
  {
    id: 'user3',
    email: 'emily.davis@school.edu',
    role: 'teacher',
    created_at: '2024-01-10',
  },
];

const columns = [
  { key: 'email', label: 'Email', sortable: true },
  {
    key: 'role',
    label: 'Role',
    sortable: true,
    render: (item: AppUser) => (
      <Badge variant={item.role === 'admin' ? 'default' : 'secondary'}>
        {item.role}
      </Badge>
    )
  },
  {
    key: 'created_at',
    label: 'Created',
    sortable: true,
    render: (item: AppUser) => new Date(item.created_at).toLocaleDateString()
  },
];

export default function AppUsers() {
  const [users, setUsers] = useState<AppUser[]>(mockAppUsers);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AppUser | undefined>();

  const handleCreate = () => {
    setSelectedUser(undefined);
    setFormOpen(true);
  };

  const handleEdit = (user: AppUser) => {
    setSelectedUser(user);
    setFormOpen(true);
  };

  const handleDelete = (user: AppUser) => {
    setSelectedUser(user);
    setDeleteOpen(true);
  };

  const handleView = (user: AppUser) => {
    setSelectedUser(user);
    setDetailOpen(true);
  };

  const handleSubmit = (data: Omit<AppUser, 'id' | 'created_at'>) => {
    if (selectedUser) {
      setUsers(users.map(u =>
        u.id === selectedUser.id
          ? { ...u, ...data }
          : u
      ));
      toast.success('User updated successfully');
    } else {
      const newUser: AppUser = {
        ...data,
        id: String(Date.now()),
        created_at: new Date().toISOString(),
      };
      setUsers([...users, newUser]);
      toast.success('User created successfully');
    }
    setFormOpen(false);
  };

  const confirmDelete = () => {
    if (selectedUser) {
      setUsers(users.filter(u => u.id !== selectedUser.id));
      toast.success('User deleted successfully');
    }
    setDeleteOpen(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">App Users</h1>
        <p className="text-muted-foreground mt-1">
          Manage system users and roles
        </p>
      </div>

      <DataTable
        data={users}
        columns={columns}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        searchPlaceholder="Search users..."
      />

      <FormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        title={selectedUser ? 'Edit User' : 'Create User'}
        description={selectedUser ? 'Update user details' : 'Add a new user to the system'}
      >
        <AppUserForm
          user={selectedUser}
          onSubmit={handleSubmit}
          onCancel={() => setFormOpen(false)}
        />
      </FormModal>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete User"
        description={`Are you sure you want to delete "${selectedUser?.email}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
      />

      <DetailDrawer
        open={detailOpen}
        onOpenChange={setDetailOpen}
        title="User Details"
      >
        {selectedUser && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
              <p className="mt-1">{selectedUser.email}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Role</h3>
              <p className="mt-1 capitalize">{selectedUser.role}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Created</h3>
              <p className="mt-1">{new Date(selectedUser.created_at).toLocaleString()}</p>
            </div>
          </div>
        )}
      </DetailDrawer>
    </div>
  );
}
