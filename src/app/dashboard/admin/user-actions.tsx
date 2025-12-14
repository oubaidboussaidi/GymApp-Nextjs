'use client';

import { deleteUser, updateUser, toggleUserStatus } from '@/actions/user.actions';
import DeleteConfirmation from '@/components/DeleteConfirmation';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Power } from 'lucide-react';
import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

export default function UserActions({ user }: { user: any }) {
    const [openEdit, setOpenEdit] = useState(false);
    const queryClient = useQueryClient();

    const invalidateUserQueries = () => {
        queryClient.invalidateQueries({ queryKey: ['all-users'] });
        queryClient.invalidateQueries({ queryKey: ['admin-analytics'] });
    };

    const handleDelete = async () => {
        const result = await deleteUser(user._id);
        if (result.success) {
            toast.success('User deleted successfully');
            invalidateUserQueries();
        } else {
            toast.error(result.error || 'Failed to delete user');
        }
    };

    const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const name = formData.get('name') as string;
        const role = formData.get('role') as 'admin' | 'coach' | 'client';

        const result = await updateUser(user._id, { name, role });
        if (result.success) {
            toast.success('User updated successfully');
            setOpenEdit(false);
            invalidateUserQueries();
        } else {
            toast.error(result.error || 'Failed to update user');
        }
    };

    const handleToggleStatus = async () => {
        const result = await toggleUserStatus(user._id);
        if (result.success) {
            toast.success(`User ${user.isActive ? 'deactivated' : 'activated'} successfully`);
            invalidateUserQueries();
        } else {
            toast.error(result.error || 'Failed to toggle user status');
        }
    };

    return (
        <div className="flex items-center justify-end gap-2">
            <Dialog open={openEdit} onOpenChange={setOpenEdit}>
                <DialogTrigger asChild>
                    <Button variant="outline" size="icon">
                        <Pencil className="h-4 w-4" />
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleEdit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" name="name" defaultValue={user.name} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <Select name="role" defaultValue={user.role}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="client">Client</SelectItem>
                                    <SelectItem value="coach">Coach</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button type="submit">Save Changes</Button>
                    </form>
                </DialogContent>
            </Dialog>

            <Button
                variant={user.isActive ? 'outline' : 'default'}
                size="icon"
                onClick={handleToggleStatus}
                title={user.isActive ? 'Deactivate' : 'Activate'}
            >
                <Power className="h-4 w-4" />
            </Button>

            <DeleteConfirmation
                onDelete={handleDelete}
                trigger={
                    <Button variant="destructive" size="icon">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                }
            />
        </div>
    );
}
