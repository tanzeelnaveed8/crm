'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Pencil, Trash2, Mail, Phone, Building } from 'lucide-react';
import { toast } from 'sonner';

type Contact = {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  position: string | null;
  notes: string | null;
  created_at: string;
};

export default function ContactsPage() {
  const { profile } = useAuth();

  // ✅ Hardcoded starting data
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: "1",
      first_name: "Charles",
      last_name: "Aliyansis",
      email: "charles@demo.com",
      phone: "+92 300 1234567",
      company: "Demo Company",
      position: "Manager",
      notes: "VIP client",
      created_at: new Date().toISOString(),
    },
    {
      id: "2",
      first_name: "Sarah",
      last_name: "Khan",
      email: "sarah@demo.com",
      phone: "+92 333 9876543",
      company: "Tech Solutions",
      position: "Developer",
      notes: "Met at expo",
      created_at: new Date().toISOString(),
    },
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    notes: '',
  });

  const handleOpenDialog = (contact?: Contact) => {
    if (contact) {
      setEditingContact(contact);
      setFormData({
        first_name: contact.first_name,
        last_name: contact.last_name,
        email: contact.email || '',
        phone: contact.phone || '',
        company: contact.company || '',
        position: contact.position || '',
        notes: contact.notes || '',
      });
    } else {
      setEditingContact(null);
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        company: '',
        position: '',
        notes: '',
      });
    }
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingContact) {
      // update contact
      setContacts((prev) =>
        prev.map((c) =>
          c.id === editingContact.id ? { ...c, ...formData } : c
        )
      );
      toast.success('Contact updated successfully');
    } else {
      // create contact
      const newContact: Contact = {
        id: Date.now().toString(),
        ...formData,
        created_at: new Date().toISOString(),
      };
      setContacts((prev) => [newContact, ...prev]);
      toast.success('Contact created successfully');
    }

    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this contact?')) return;

    setContacts((prev) => prev.filter((c) => c.id !== id));
    toast.success('Contact deleted successfully');
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Contacts</h1>
              <p className="text-slate-600 mt-1">Manage your contact database</p>
            </div>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Contact
            </Button>
          </div>

          <div className="bg-white rounded-lg border border-slate-200">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contacts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                      No contacts yet. Add your first contact to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  contacts.map((contact) => (
                    <TableRow key={contact.id}>
                      <TableCell className="font-medium">
                        {contact.first_name} {contact.last_name}
                      </TableCell>
                      <TableCell>
                        {contact.email ? (
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-slate-400" />
                            {contact.email}
                          </div>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {contact.phone ? (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-slate-400" />
                            {contact.phone}
                          </div>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {contact.company ? (
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-slate-400" />
                            {contact.company}
                          </div>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>{contact.position || '-'}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDialog(contact)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(contact.id)}
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
  <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle>{editingContact ? 'Edit Contact' : 'Add New Contact'}</DialogTitle>
      <DialogDescription>
        {editingContact ? 'Update contact information' : 'Add a new contact to your CRM'}
      </DialogDescription>
    </DialogHeader>

    <form onSubmit={handleSubmit}>
      <div className="grid gap-2 py-2"> {/* 👈 height reduce */}
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label htmlFor="first_name">First Name *</Label>
            <Input
              id="first_name"
              value={formData.first_name}
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="last_name">Last Name *</Label>
            <Input
              id="last_name"
              value={formData.last_name}
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="company">Company</Label>
          <Input
            id="company"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="position">Position</Label>
          <Input
            id="position"
            value={formData.position}
            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            rows={2}  // 👈 kam height
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
        </div>
      </div>

      <DialogFooter className="mt-2">
        <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
          Cancel
        </Button>
        <Button type="submit">{editingContact ? 'Update' : 'Create'}</Button>
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
