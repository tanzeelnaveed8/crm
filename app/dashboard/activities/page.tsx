'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Pencil, Trash2, Phone, Mail, Calendar, SquareCheck as CheckSquare, FileText } from 'lucide-react';
import { format } from 'date-fns';

type Activity = {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'task' | 'note';
  subject: string;
  description: string | null;
  status: 'pending' | 'completed' | 'cancelled';
  due_date: string | null;
  contact_id: string | null;
  lead_id: string | null;
  deal_id: string | null;
  created_at: string;
};

type Contact = { id: string; first_name: string; last_name: string };
type Lead = { id: string; title: string };
type Deal = { id: string; title: string };

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const typeIcons = {
  call: Phone,
  email: Mail,
  meeting: Calendar,
  task: CheckSquare,
  note: FileText,
};

export default function ActivitiesPage() {
  // ✅ Hardcoded related data
  const [contacts] = useState<Contact[]>([
    { id: '1', first_name: 'Ali', last_name: 'Khan' },
    { id: '2', first_name: 'Sara', last_name: 'Sheikh' },
  ]);

  const [leads] = useState<Lead[]>([
    { id: '10', title: 'Website Redesign' },
    { id: '11', title: 'SEO Campaign' },
  ]);

  const [deals] = useState<Deal[]>([
    { id: '20', title: 'CRM Deal' },
    { id: '21', title: 'Ecommerce Optimization' },
  ]);

  // ✅ Hardcoded activities (initial)
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: '101',
      type: 'call',
      subject: 'Follow-up call with client',
      description: 'Discuss project scope',
      status: 'pending',
      due_date: new Date().toISOString(),
      contact_id: '1',
      lead_id: '10',
      deal_id: null,
      created_at: new Date().toISOString(),
    },
    {
      id: '102',
      type: 'task',
      subject: 'Prepare proposal',
      description: 'Draft proposal for SEO project',
      status: 'completed',
      due_date: null,
      contact_id: '2',
      lead_id: '11',
      deal_id: '21',
      created_at: new Date().toISOString(),
    },
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [formData, setFormData] = useState({
    type: 'task' as Activity['type'],
    subject: '',
    description: '',
    status: 'pending' as Activity['status'],
    due_date: '',
    contact_id: 'none',
    lead_id: 'none',
    deal_id: 'none',
  });

  // ✅ Open Dialog
  const handleOpenDialog = (activity?: Activity) => {
    if (activity) {
      setEditingActivity(activity);
      setFormData({
        type: activity.type,
        subject: activity.subject,
        description: activity.description || '',
        status: activity.status,
        due_date: activity.due_date ? format(new Date(activity.due_date), 'yyyy-MM-dd') : '',
        contact_id: activity.contact_id || 'none',
        lead_id: activity.lead_id || 'none',
        deal_id: activity.deal_id || 'none',
      });
    } else {
      setEditingActivity(null);
      setFormData({
        type: 'task',
        subject: '',
        description: '',
        status: 'pending',
        due_date: '',
        contact_id: 'none',
        lead_id: 'none',
        deal_id: 'none',
      });
    }
    setDialogOpen(true);
  };

  // ✅ Save Activity
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const dataToSave: Activity = {
      id: editingActivity ? editingActivity.id : Date.now().toString(),
      type: formData.type,
      subject: formData.subject,
      description: formData.description,
      status: formData.status,
      due_date: formData.due_date || null,
      contact_id: formData.contact_id === 'none' ? null : formData.contact_id,
      lead_id: formData.lead_id === 'none' ? null : formData.lead_id,
      deal_id: formData.deal_id === 'none' ? null : formData.deal_id,
      created_at: new Date().toISOString(),
    };

    if (editingActivity) {
      setActivities((prev) => prev.map((a) => (a.id === editingActivity.id ? dataToSave : a)));
    } else {
      setActivities((prev) => [dataToSave, ...prev]);
    }

    setDialogOpen(false);
  };

  // ✅ Delete Activity
  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this activity?')) {
      setActivities((prev) => prev.filter((a) => a.id !== id));
    }
  };

  // ✅ Toggle Status
  const handleToggleStatus = (activity: Activity) => {
    const newStatus = activity.status === 'completed' ? 'pending' : 'completed';
    setActivities((prev) =>
      prev.map((a) => (a.id === activity.id ? { ...a, status: newStatus } : a))
    );
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Activities</h1>
              <p className="text-slate-600 mt-1">Track calls, emails, meetings, and tasks</p>
            </div>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Activity
            </Button>
          </div>

          <div className="bg-white rounded-lg border border-slate-200">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activities.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                      No activities yet. Add your first activity to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  activities.map((activity) => {
                    const Icon = typeIcons[activity.type];
                    return (
                      <TableRow key={activity.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-slate-600" />
                            <span className="capitalize">{activity.type}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{activity.subject}</TableCell>
                        <TableCell>
                          <Badge className={statusColors[activity.status]}>
                            {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {activity.due_date ? format(new Date(activity.due_date), 'MMM dd, yyyy') : '-'}
                        </TableCell>
                        <TableCell>
                          {activity.description ? (
                            <span className="text-sm text-slate-600 line-clamp-2">{activity.description}</span>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleToggleStatus(activity)}
                            >
                              <CheckSquare
                                className={`h-4 w-4 ${
                                  activity.status === 'completed'
                                    ? 'text-green-600'
                                    : 'text-slate-400'
                                }`}
                              />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenDialog(activity)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(activity.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Dialog for Create/Edit */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-[500px] w-full p-4">
  <DialogHeader className="pb-2">
    <DialogTitle className="text-lg font-semibold">
      {editingActivity ? 'Edit Activity' : 'Add New Activity'}
    </DialogTitle>
    <DialogDescription className="text-sm text-slate-500">
      {editingActivity ? 'Update activity information' : 'Add a new activity to track'}
    </DialogDescription>
  </DialogHeader>

  <form onSubmit={handleSubmit} className="space-y-3">
    <div className="grid gap-3">
      {/* Type */}
      <div className="space-y-1">
        <Label htmlFor="type">Type</Label>
        <Select
          value={formData.type}
          onValueChange={(value: Activity['type']) => setFormData({ ...formData, type: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="call">Call</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="meeting">Meeting</SelectItem>
            <SelectItem value="task">Task</SelectItem>
            <SelectItem value="note">Note</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Subject */}
      <div className="space-y-1">
        <Label htmlFor="subject">Subject *</Label>
        <Input
          id="subject"
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          required
        />
      </div>

      {/* Status */}
      <div className="space-y-1">
        <Label htmlFor="status">Status</Label>
        <Select
          value={formData.status}
          onValueChange={(value: Activity['status']) => setFormData({ ...formData, status: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Due Date */}
      <div className="space-y-1">
        <Label htmlFor="due_date">Due Date</Label>
        <Input
          id="due_date"
          type="date"
          value={formData.due_date}
          onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
        />
      </div>

      {/* Description */}
      <div className="space-y-1">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={2} // 👈 height kam
        />
      </div>
    </div>

    <DialogFooter className="pt-2">
      <Button type="button" variant="outline" size="sm" onClick={() => setDialogOpen(false)}>
        Cancel
      </Button>
      <Button type="submit" size="sm">
        {editingActivity ? 'Update' : 'Create'}
      </Button>
    </DialogFooter>
  </form>
</DialogContent>
        </Dialog>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
