"use client"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { ImageInput } from "@/components/ui/image-input"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Edit,
    Grid3X3,
    Image as ImageIcon,
    List,
    Plus,
    Search,
    Trash2,
    Download
} from "lucide-react"
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

interface StaticImage {
    _id: string;
    name: string;
    description?: string;
    category: 'hero' | 'gallery' | 'logo' | 'background' | 'separator' | 'menu' | 'about' | 'testimonial';
    imageUrl: string;
    cloudinaryPublicId?: string;
    altText: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    category: z.enum(['hero', 'gallery', 'logo', 'background', 'separator', 'menu', 'about', 'testimonial']),
    imageUrl: z.string().min(1, "Image URL is required"),
    altText: z.string().min(1, "Alt text is required"),
    isActive: z.boolean(),
})

type FormValues = z.infer<typeof formSchema>

const categories = [
    { value: 'hero', label: 'Hero Images' },
    { value: 'gallery', label: 'Gallery Images' },
    { value: 'logo', label: 'Logo Images' },
    { value: 'background', label: 'Background Images' },
    { value: 'separator', label: 'Separator Images' },
    { value: 'menu', label: 'Menu Images' },
    { value: 'about', label: 'About Page Images' },
    { value: 'testimonial', label: 'Testimonial Images' },
]

export default function StaticImagesPage() {
    const [images, setImages] = useState<StaticImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [selectedImage, setSelectedImage] = useState<StaticImage | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [imageToDelete, setImageToDelete] = useState<StaticImage | null>(null);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            description: '',
            category: 'hero',
            imageUrl: '',
            altText: '',
            isActive: true,
        },
    });

    const fetchImages = useCallback(async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            if (categoryFilter && categoryFilter !== 'all') params.append('category', categoryFilter);
            if (statusFilter && statusFilter !== 'all') params.append('isActive', statusFilter);

            const response = await fetch(`/api/static-images?${params.toString()}`);
            if (!response.ok) throw new Error('Failed to fetch images');

            const data = await response.json();
            setImages(data);
        } catch (error) {
            console.error('Error fetching images:', error);
            toast.error('Failed to fetch images');
        } finally {
            setLoading(false);
        }
    }, [search, categoryFilter, statusFilter]);

    useEffect(() => {
        fetchImages();
    }, [fetchImages]);

    const handleSubmit = async (values: FormValues) => {
        try {
            const url = selectedImage ? `/api/static-images/${selectedImage._id}` : '/api/static-images';
            const method = selectedImage ? 'PUT' : 'POST';
            const body = selectedImage ? { ...values, _id: selectedImage._id } : values;

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to save image');
            }

            toast.success(selectedImage ? 'Image updated successfully' : 'Image created successfully');
            setIsDialogOpen(false);
            form.reset();
            setSelectedImage(null);
            fetchImages();
        } catch (error) {
            console.error('Error saving image:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to save image');
        }
    };

    const handleEdit = (image: StaticImage) => {
        setSelectedImage(image);
        form.reset({
            name: image.name,
            description: image.description || '',
            category: image.category,
            imageUrl: image.imageUrl,
            altText: image.altText,
            isActive: image.isActive,
        });
        setIsDialogOpen(true);
    };

    const handleDelete = (image: StaticImage) => {
        setImageToDelete(image);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!imageToDelete) return;

        try {
            const response = await fetch(`/api/static-images/${imageToDelete._id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete image');
            }

            toast.success('Image deleted successfully');
            setIsDeleteDialogOpen(false);
            setImageToDelete(null);
            fetchImages();
        } catch (error) {
            console.error('Error deleting image:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to delete image');
        }
    };

    const handleDownload = async (image: StaticImage) => {
        try {
            const response = await fetch(image.imageUrl);
            if (!response.ok) throw new Error('Failed to fetch image');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${image.name}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast.success('Image downloaded successfully');
        } catch (error) {
            console.error('Error downloading image:', error);
            toast.error('Failed to download image');
        }
    };

    const filteredImages = images.filter(image => {
        const matchesSearch = !search ||
            image.name.toLowerCase().includes(search.toLowerCase()) ||
            image.description?.toLowerCase().includes(search.toLowerCase()) ||
            image.altText.toLowerCase().includes(search.toLowerCase());

        const matchesCategory = !categoryFilter || categoryFilter === 'all' || image.category === categoryFilter;
        const matchesStatus = !statusFilter || statusFilter === 'all' ||
            (statusFilter === 'true' && image.isActive) ||
            (statusFilter === 'false' && !image.isActive);

        return matchesSearch && matchesCategory && matchesStatus;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Static Images Management</h1>
                        <p className="text-muted-foreground text-sm">
                            Manage images used throughout the website
                        </p>
                    </div>
                    <Button onClick={() => {
                        setSelectedImage(null);
                        form.reset();
                        setIsDialogOpen(true);
                    }} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add New Image
                    </Button>
                </div>

                <Separator />

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <Input
                            placeholder="Search images..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Select value={categoryFilter || undefined} onValueChange={setCategoryFilter}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {categories.map((category) => (
                                <SelectItem key={category.value} value={category.value}>
                                    {category.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={statusFilter || undefined} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full sm:w-[140px]">
                            <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="true">Active</SelectItem>
                            <SelectItem value="false">Inactive</SelectItem>
                        </SelectContent>
                    </Select>
                    <div className="flex gap-2">
                        <Button
                            variant={viewMode === 'grid' ? 'default' : 'outline'}
                            size="icon"
                            onClick={() => setViewMode('grid')}
                        >
                            <Grid3X3 className="h-4 w-4" />
                        </Button>
                        <Button
                            variant={viewMode === 'list' ? 'default' : 'outline'}
                            size="icon"
                            onClick={() => setViewMode('list')}
                        >
                            <List className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Images Grid/List */}
                {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredImages.map((image) => (
                            <Card key={image._id} className="overflow-hidden">
                                <div className="relative aspect-square">
                                    <Image
                                        src={image.imageUrl}
                                        alt={image.altText}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute top-2 right-2">
                                        <Badge variant={image.isActive ? "default" : "secondary"}>
                                            {image.isActive ? "Active" : "Inactive"}
                                        </Badge>
                                    </div>
                                </div>
                                <CardHeader className="p-4">
                                    <CardTitle className="text-lg">{image.name}</CardTitle>
                                    <p className="text-sm text-muted-foreground">{image.description}</p>
                                    <div className="flex items-center justify-between mt-2">
                                        <Badge variant="outline">{image.category}</Badge>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => handleDownload(image)}
                                                title="Download image"
                                            >
                                                <Download className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => handleEdit(image)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => handleDelete(image)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredImages.map((image) => (
                            <Card key={image._id}>
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-4">
                                        <div className="relative w-20 h-20 flex-shrink-0">
                                            <Image
                                                src={image.imageUrl}
                                                alt={image.altText}
                                                fill
                                                className="object-cover rounded-md"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold">{image.name}</h3>
                                            <p className="text-sm text-muted-foreground">{image.description}</p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <Badge variant="outline">{image.category}</Badge>
                                                <Badge variant={image.isActive ? "default" : "secondary"}>
                                                    {image.isActive ? "Active" : "Inactive"}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => handleDownload(image)}
                                                title="Download image"
                                            >
                                                <Download className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => handleEdit(image)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => handleDelete(image)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {filteredImages.length === 0 && (
                    <div className="text-center py-12">
                        <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No images found</h3>
                        <p className="text-gray-500">Try adjusting your search or filters</p>
                    </div>
                )}
            </div>

            {/* Add/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>
                            {selectedImage ? 'Edit Image' : 'Add New Image'}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedImage ? 'Update the image details below.' : 'Add a new image to the website.'}
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter image name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Category</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value || undefined}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select category" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {categories.map((category) => (
                                                        <SelectItem key={category.value} value={category.value}>
                                                            {category.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Enter image description" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="imageUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Image</FormLabel>
                                        <FormControl>
                                            <ImageInput
                                                value={field.value}
                                                onChange={field.onChange}
                                                oldImageUrl={selectedImage?.imageUrl}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="altText"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Alt Text</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter alt text for accessibility" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="isActive"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">Active</FormLabel>
                                            <div className="text-sm text-muted-foreground">
                                                Make this image available on the website
                                            </div>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit">
                                    {selectedImage ? 'Update Image' : 'Add Image'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Image</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete &quot;{imageToDelete?.name}&quot;? This action cannot be undone and will remove the image from Cloudinary storage.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
