import { useState } from 'react';
import { DataTable } from '@/components/admin/DataTable';
import { FormModal } from '@/components/admin/FormModal';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { DetailDrawer } from '@/components/admin/DetailDrawer';
import { AppSettingForm } from '@/components/forms/AppSettingForm';
import type { AppSetting } from '@/types';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

const mockSettings: AppSetting[] = [
  {
    id: '1',
    key: 'app_name',
    value: 'Exam Builder Pro',
    description: 'Application display name',
  },
  {
    id: '2',
    key: 'max_questions_per_exam',
    value: '100',
    description: 'Maximum questions allowed per exam',
  },
  {
    id: '3',
    key: 'default_exam_duration',
    value: '120',
    description: 'Default exam duration in minutes',
  },
];

const columns = [
  {
    key: 'key',
    label: 'Key',
    sortable: true,
    render: (item: AppSetting) => (
      <Badge variant="outline" className="font-mono">{item.key}</Badge>
    )
  },
  { key: 'value', label: 'Value', sortable: false },
  { key: 'description', label: 'Description', sortable: false },
];

export default function AdminSettings() {
  const [settings, setSettings] = useState<AppSetting[]>(mockSettings);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedSetting, setSelectedSetting] = useState<AppSetting | undefined>();

  const handleCreate = () => {
    setSelectedSetting(undefined);
    setFormOpen(true);
  };

  const handleEdit = (setting: AppSetting) => {
    setSelectedSetting(setting);
    setFormOpen(true);
  };

  const handleDelete = (setting: AppSetting) => {
    setSelectedSetting(setting);
    setDeleteOpen(true);
  };

  const handleView = (setting: AppSetting) => {
    setSelectedSetting(setting);
    setDetailOpen(true);
  };

  const handleSubmit = (data: Omit<AppSetting, 'id'>) => {
    if (selectedSetting) {
      setSettings(settings.map(s =>
        s.id === selectedSetting.id
          ? { ...s, ...data }
          : s
      ));
      toast.success('Setting updated successfully');
    } else {
      const newSetting: AppSetting = {
        ...data,
        id: String(Date.now()),
      };
      setSettings([...settings, newSetting]);
      toast.success('Setting created successfully');
    }
    setFormOpen(false);
  };

  const confirmDelete = () => {
    if (selectedSetting) {
      setSettings(settings.filter(s => s.id !== selectedSetting.id));
      toast.success('Setting deleted successfully');
    }
    setDeleteOpen(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">App Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage application configuration
        </p>
      </div>

      <DataTable
        data={settings}
        columns={columns}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        searchPlaceholder="Search settings..."
      />

      <FormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        title={selectedSetting ? 'Edit Setting' : 'Create Setting'}
        description={selectedSetting ? 'Update setting value' : 'Add a new configuration setting'}
      >
        <AppSettingForm
          setting={selectedSetting}
          onSubmit={handleSubmit}
          onCancel={() => setFormOpen(false)}
        />
      </FormModal>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Setting"
        description={`Are you sure you want to delete "${selectedSetting?.key}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
      />

      <DetailDrawer
        open={detailOpen}
        onOpenChange={setDetailOpen}
        title="Setting Details"
      >
        {selectedSetting && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Key</h3>
              <p className="mt-1 font-mono">{selectedSetting.key}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Value</h3>
              <p className="mt-1">{selectedSetting.value}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
              <p className="mt-1">{selectedSetting.description || '-'}</p>
            </div>
          </div>
        )}
      </DetailDrawer>
    </div>
  );
}
