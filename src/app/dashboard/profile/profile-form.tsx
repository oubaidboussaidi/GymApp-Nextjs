'use client';

import { useState } from 'react';
import { updateUser } from '@/actions/user.actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfileForm({ user }: { user: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(user.image || null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    let imageUrl = user.image;
    const fileInput = (e.target as HTMLFormElement).querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput?.files?.[0]) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', fileInput.files[0]);
        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: uploadFormData,
            });
            const data = await res.json();
            if (data.url) imageUrl = data.url;
        } catch (err) {
            console.error('Upload failed', err);
            toast.error('Image upload failed');
            setLoading(false);
            return;
        }
    }

    const data: any = {
        name: formData.get('name') as string,
        image: imageUrl,
    };

    if (user.role === 'client') {
        data.age = parseInt(formData.get('age') as string);
        data.physicalStats = {
            weight: parseFloat(formData.get('weight') as string),
            squat: parseFloat(formData.get('squat') as string),
            bench: parseFloat(formData.get('bench') as string),
        };
    }

    try {
        const result = await updateUser(user.id, data);
        if (result.success) {
            router.refresh();
            toast.success('Profile updated successfully!');
        } else {
            toast.error('Failed to update profile');
        }
    } catch (error) {
        console.error(error);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Identity</CardTitle>
          <CardDescription>Update your personal information.</CardDescription>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center gap-6">
                    <Avatar className="h-24 w-24">
                        <AvatarImage src={previewUrl || ''} />
                        <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-2 w-full">
                        <Label htmlFor="avatar">Profile Picture</Label>
                        <Input id="avatar" type="file" accept="image/*" onChange={handleImageChange} />
                    </div>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" name="name" defaultValue={user.name} required />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={user.email} disabled className="bg-muted" />
                </div>

                {user.role === 'client' && (
                    <>
                        <div className="grid gap-2">
                            <Label htmlFor="age">Age</Label>
                            <Input id="age" name="age" type="number" defaultValue={user.age} />
                        </div>
                        
                        <div className="border-t pt-6 mt-6">
                            <h3 className="text-lg font-medium mb-4">Physical Stats</h3>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="weight">Weight (kg)</Label>
                                    <Input id="weight" name="weight" type="number" step="0.1" defaultValue={user.physicalStats?.weight} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="squat">Squat (kg)</Label>
                                    <Input id="squat" name="squat" type="number" step="2.5" defaultValue={user.physicalStats?.squat} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="bench">Bench (kg)</Label>
                                    <Input id="bench" name="bench" type="number" step="2.5" defaultValue={user.physicalStats?.bench} />
                                </div>
                            </div>
                        </div>
                    </>
                )}

                <div className="flex justify-end">
                    <Button type="submit" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </div>
            </form>
        </CardContent>
      </Card>
    </div>
  );
}
