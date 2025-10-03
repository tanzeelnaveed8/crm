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
import { Plus, Pencil, Trash2, DollarSign } from 'lucide-react';

type Lead = {
  id: string;
  title: string;
  description: string | null;
  status: 'new' | 'contacted' | 'qualified' | 'unqualified';
  source: string | null;
  value: number;
  contact_id: string | null;
  created_at: string;
};

type Contact = {
  id: string;
  first_name: string;
  last_name: string;
};

const statusColors = {
  new: 'bg-blue-100 text-blue-800',
  contacted: 'bg-yellow-100 text-yellow-800',
  qualified: 'bg-green-100 text-green-800',
  unqualified: 'bg-red-100 text-red-800',
};

export default function LeadsPage() {
  const [contacts] = useState<Contact[]>([
    { id: '1', first_name: 'Ali', last_name: 'Khan' },
    { id: '2', first_name: 'Sara', last_name: 'Sheikh' },
  ]);

  const [leads, setLeads] = useState<Lead[]>([
    {
      id: '101',
      title: 'Website Redesign Project',
      description: 'Client interested in full website redesign.',
      status: 'contacted',
      source: 'Referral',
      value: 2000,
      contact_id: '1',
      created_at: new Date().toISOString(),
    },
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'new' as Lead['status'],
    source: '',
    value: '',
    contact_id: 'none',
  });

  const handleOpenDialog = (lead?: Lead) => {
    if (lead) {
      setEditingLead(lead);
      setFormData({
        title: lead.title,
        description: lead.description || '',
        status: lead.status,
        source: lead.source || '',
        value: lead.value.toString(),
        contact_id: lead.contact_id || 'none',
      });
    } else {
      setEditingLead(null);
      setFormData({
        title: '',
        description: '',
        status: 'new',
        source: '',
        value: '',
        contact_id: 'none',
      });
    }
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSave: Lead = {
      id: editingLead ? editingLead.id : Date.now().toString(),
      title: formData.title,
      description: formData.description,
      status: formData.status,
      source: formData.source,
      value: parseFloat(formData.value) || 0,
      contact_id: formData.contact_id === 'none' ? null : formData.contact_id,
      created_at: new Date().toISOString(),
    };
    if (editingLead) {
      setLeads((prev) => prev.map((l) => (l.id === editingLead.id ? dataToSave : l)));
    } else {
      setLeads((prev) => [dataToSave, ...prev]);
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this lead?')) {
      setLeads((prev) => prev.filter((l) => l.id !== id));
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Leads</h1>
              <p className="text-slate-600 mt-1">Track and manage your sales leads</p>
            </div>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Lead
            </Button>
          </div>

          <div className="bg-white rounded-lg border border-slate-200">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">{lead.title}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[lead.status]}>
                        {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{lead.source || '-'}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-slate-400" />
                        {lead.value.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      {lead.description ? (
                        <span className="text-sm text-slate-600 line-clamp-1">
                          {lead.description}
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(lead)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(lead.id)}>
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Compact Dialog Form */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto p-4">
            <DialogHeader>
              <DialogTitle className="text-lg">
                {editingLead ? 'Edit Lead' : 'Add New Lead'}
              </DialogTitle>
              <DialogDescription className="text-sm">
                {editingLead ? 'Update lead information' : 'Add a new lead to your pipeline'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-3 py-3">
                <div className="space-y-1">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label>Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: Lead['status']) =>
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="qualified">Qualified</SelectItem>
                      <SelectItem value="unqualified">Unqualified</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label>Contact</Label>
                  <Select
                    value={formData.contact_id}
                    onValueChange={(value) => setFormData({ ...formData, contact_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a contact" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {contacts.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.first_name} {c.last_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label>Source</Label>
                  <Input
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Estimated Value</Label>
                  <Input
                    type="number"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Description</Label>
                  <Textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm">
                  {editingLead ? 'Update' : 'Create'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
