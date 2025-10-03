'use client';

import { useState } from 'react';
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
import { Plus, Pencil, Trash2, DollarSign, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

type Deal = {
  id: string;
  title: string;
  description: string | null;
  stage: 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
  value: number;
  probability: number;
  expected_close_date: string | null;
  contact_id: string | null;
  created_at: string;
};

type Contact = {
  id: string;
  first_name: string;
  last_name: string;
};

const stageColors = {
  prospecting: 'bg-slate-100 text-slate-800',
  qualification: 'bg-blue-100 text-blue-800',
  proposal: 'bg-yellow-100 text-yellow-800',
  negotiation: 'bg-orange-100 text-orange-800',
  closed_won: 'bg-green-100 text-green-800',
  closed_lost: 'bg-red-100 text-red-800',
};

export default function DealsPage() {
  const [contacts] = useState<Contact[]>([
    { id: 'c1', first_name: 'Ali', last_name: 'Khan' },
    { id: 'c2', first_name: 'Sara', last_name: 'Ahmed' },
  ]);

  const [deals, setDeals] = useState<Deal[]>([
    {
      id: 'd1',
      title: 'Website Redesign',
      description: 'Client wants a full redesign',
      stage: 'proposal',
      value: 5000,
      probability: 70,
      expected_close_date: '2025-10-15',
      contact_id: 'c1',
      created_at: new Date().toISOString(),
    },
    {
      id: 'd2',
      title: 'SEO Project',
      description: 'Ongoing SEO work',
      stage: 'negotiation',
      value: 2000,
      probability: 60,
      expected_close_date: '2025-11-01',
      contact_id: 'c2',
      created_at: new Date().toISOString(),
    },
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    stage: 'prospecting' as Deal['stage'],
    value: '',
    probability: '50',
    expected_close_date: '',
    contact_id: 'none',
  });

  const handleOpenDialog = (deal?: Deal) => {
    if (deal) {
      setEditingDeal(deal);
      setFormData({
        title: deal.title,
        description: deal.description || '',
        stage: deal.stage,
        value: deal.value.toString(),
        probability: deal.probability.toString(),
        expected_close_date: deal.expected_close_date || '',
        contact_id: deal.contact_id || 'none',
      });
    } else {
      setEditingDeal(null);
      setFormData({
        title: '',
        description: '',
        stage: 'prospecting',
        value: '',
        probability: '50',
        expected_close_date: '',
        contact_id: 'none',
      });
    }
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const dataToSave: Deal = {
      id: editingDeal ? editingDeal.id : Date.now().toString(),
      title: formData.title,
      description: formData.description,
      stage: formData.stage,
      value: parseFloat(formData.value) || 0,
      probability: parseInt(formData.probability) || 50,
      expected_close_date: formData.expected_close_date || null,
      contact_id: formData.contact_id === 'none' ? null : formData.contact_id,
      created_at: new Date().toISOString(),
    };

    if (editingDeal) {
      setDeals(deals.map(d => (d.id === editingDeal.id ? dataToSave : d)));
      toast.success('Deal updated successfully');
    } else {
      setDeals([dataToSave, ...deals]);
      toast.success('Deal created successfully');
    }

    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this deal?')) return;
    setDeals(deals.filter(d => d.id !== id));
    toast.success('Deal deleted successfully');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Deals</h1>
            <p className="text-slate-600 mt-1">Manage your sales pipeline</p>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="mr-2 h-4 w-4" />
            Add Deal
          </Button>
        </div>

        <div className="bg-white rounded-lg border border-slate-200">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Probability</TableHead>
                <TableHead>Expected Close</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                    No deals yet. Add your first deal to get started.
                  </TableCell>
                </TableRow>
              ) : (
                deals.map((deal) => (
                  <TableRow key={deal.id}>
                    <TableCell className="font-medium">{deal.title}</TableCell>
                    <TableCell>
                      <Badge className={stageColors[deal.stage]}>
                        {deal.stage.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-slate-400" />
                        {deal.value.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4 text-slate-400" />
                        {deal.probability}%
                      </div>
                    </TableCell>
                    <TableCell>
                      {deal.expected_close_date ? format(new Date(deal.expected_close_date), 'MMM dd, yyyy') : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDialog(deal)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(deal.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        {/* 👇 Yeh line form ki width aur height ko control karegi */}
        <DialogContent className="sm:max-w-[480px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingDeal ? 'Edit Deal' : 'Add New Deal'}</DialogTitle>
            <DialogDescription>
              {editingDeal ? 'Update deal information' : 'Add a new deal to your pipeline'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stage">Stage</Label>
                <Select value={formData.stage} onValueChange={(value: Deal['stage']) => setFormData({ ...formData, stage: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prospecting">Prospecting</SelectItem>
                    <SelectItem value="qualification">Qualification</SelectItem>
                    <SelectItem value="proposal">Proposal</SelectItem>
                    <SelectItem value="negotiation">Negotiation</SelectItem>
                    <SelectItem value="closed_won">Closed Won</SelectItem>
                    <SelectItem value="closed_lost">Closed Lost</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact">Contact</Label>
                <Select
                  value={formData.contact_id}
                  onValueChange={(value) => setFormData({ ...formData, contact_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a contact" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {contacts.map((contact) => (
                      <SelectItem key={contact.id} value={contact.id}>
                        {contact.first_name} {contact.last_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="value">Value</Label>
                  <Input
                    id="value"
                    type="number"
                    step="0.01"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="probability">Probability (%)</Label>
                  <Input
                    id="probability"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.probability}
                    onChange={(e) => setFormData({ ...formData, probability: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="expected_close_date">Expected Close Date</Label>
                <Input
                  id="expected_close_date"
                  type="date"
                  value={formData.expected_close_date}
                  onChange={(e) => setFormData({ ...formData, expected_close_date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">{editingDeal ? 'Update' : 'Create'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
