import { useState } from 'react';
import { DataTable } from '@/components/admin/DataTable';
import { FormModal } from '@/components/admin/FormModal';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { DetailDrawer } from '@/components/admin/DetailDrawer';
import { ResourceForm } from '@/components/forms/ResourceForm';
import type { Resource } from '@/types';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

const mockResources: Resource[] = [
  {
    id: '1',
    name: 'Algebra Study Guide',
    type: 'PDF',
    url: 'https://example.com/algebra.pdf',
    metadata: { size: '2.5MB', pages: 45 },
    created_at: '2024-01-15',
  },
  {
    id: '2',
    name: 'Math Formula Sheet',
    type: 'Document',
    url: 'https://example.com/formulas.pdf',
    metadata: { size: '500KB', pages: 3 },
    created_at: '2024-01-20',
  },
];

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  {
    key: 'type',
    label: 'Type',
    sortable: true,
    render: (item: Resource) => (
      <Badge variant="outline">{item.type}</Badge>
    )
  },
  {
    key: 'url',
    label: 'URL',
    sortable: false,
    render: (item: Resource) => (
      <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate max-w-xs block">
        {item.url}
      </a>
    )
  },
  {
    key: 'created_at',
    label: 'Created',
    sortable: true,
    render: (item: Resource) => new Date(item.created_at).toLocaleDateString()
  },
];

export default function Resources() {
  const [resources, setResources] = useState<Resource[]>(mockResources);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | undefined>();

  const handleCreate = () => {
    setSelectedResource(undefined);
    setFormOpen(true);
  };

  const handleEdit = (resource: Resource) => {
    setSelectedResource(resource);
    setFormOpen(true);
  };

  const handleDelete = (resource: Resource) => {
    setSelectedResource(resource);
    setDeleteOpen(true);
  };

  const handleView = (resource: Resource) => {
    setSelectedResource(resource);
    setDetailOpen(true);
  };

  const handleSubmit = (data: Omit<Resource, 'id' | 'created_at' | 'metadata'>) => {
    if (selectedResource) {
      setResources(resources.map(r =>
        r.id === selectedResource.id
          ? { ...r, ...data }
          : r
      ));
      toast.success('Resource updated successfully');
    } else {
      const newResource: Resource = {
        ...data,
        id: String(Date.now()),
        created_at: new Date().toISOString(),
        metadata: {},
      };
      setResources([...resources, newResource]);
      toast.success('Resource created successfully');
    }
    setFormOpen(false);
  };

  const confirmDelete = () => {
    if (selectedResource) {
      setResources(resources.filter(r => r.id !== selectedResource.id));
      toast.success('Resource deleted successfully');
    }
    setDeleteOpen(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Resources</h1>
        <p className="text-muted-foreground mt-1">
          Manage educational resources and materials
        </p>
      </div>

      <DataTable
        data={resources}
        columns={columns}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        searchPlaceholder="Search resources..."
      />

      <FormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        title={selectedResource ? 'Edit Resource' : 'Create Resource'}
        description={selectedResource ? 'Update resource details' : 'Add a new resource to the system'}
      >
        <ResourceForm
          resource={selectedResource}
          onSubmit={handleSubmit}
          onCancel={() => setFormOpen(false)}
        />
      </FormModal>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Resource"
        description={`Are you sure you want to delete "${selectedResource?.name}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
      />

      <DetailDrawer
        open={detailOpen}
        onOpenChange={setDetailOpen}
        title="Resource Details"
      >
        {selectedResource && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
              <p className="mt-1">{selectedResource.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Type</h3>
              <p className="mt-1">{selectedResource.type}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">URL</h3>
              <a href={selectedResource.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline mt-1 block">
                {selectedResource.url}
              </a>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Created</h3>
              <p className="mt-1">{new Date(selectedResource.created_at).toLocaleString()}</p>
            </div>
          </div>
        )}
      </DetailDrawer>
    </div>
  );
}
