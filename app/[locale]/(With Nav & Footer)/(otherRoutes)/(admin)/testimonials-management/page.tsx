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
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useDebounce } from '@/hooks/useDebounce'
import { Search } from "lucide-react"
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

interface Testimonial {
    _id: string;
    customerName: string;
    message: string;
    customerImage: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

interface TestimonialsResponse {
    testimonials: Testimonial[];
    total: number;
    page: number;
    totalPages: number;
}

export default function TestimonialsManagementPage() {
    const t = useTranslations('TestimonialsManagement');
    const router = useRouter();
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
    const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);

    const fetchTestimonials = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/testimonials?page=${page}&search=${debouncedSearch}`);
            if (!response.ok) {
                throw new Error('Failed to fetch testimonials');
            }
            const data: TestimonialsResponse = await response.json();
            setTestimonials(data.testimonials || []);
            setTotalPages(data.totalPages || 1);
        } catch (error) {
            console.error('Error fetching testimonials:', error);
            toast.error(t('fetchError'));
        } finally {
            setLoading(false);
        }
    }, [page, debouncedSearch, t]);

    useEffect(() => {
        fetchTestimonials();
    }, [fetchTestimonials]);

    const handleStatusChange = async (id: string, isActive: boolean) => {
        try {
            const response = await fetch(`/api/testimonials/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ isActive }),
            });

            if (!response.ok) {
                throw new Error('Failed to update testimonial status');
            }

            setTestimonials(prevTestimonials =>
                prevTestimonials.map(testimonial =>
                    testimonial._id === id
                        ? { ...testimonial, isActive }
                        : testimonial
                )
            );

            toast.success(t('statusUpdated'));
        } catch (error) {
            console.error('Error updating testimonial status:', error);
            toast.error(t('updateError'));
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm(t('confirmDelete'))) {
            return;
        }

        try {
            const response = await fetch(`/api/testimonials/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete testimonial');
            }

            setTestimonials(prevTestimonials =>
                prevTestimonials.filter(testimonial => testimonial._id !== id)
            );

            toast.success(t('testimonialDeleted'));
        } catch (error) {
            console.error('Error deleting testimonial:', error);
            toast.error(t('deleteError'));
        }
    };

    const toggleSelectAll = () => {
        if (selectedItems.size === testimonials.length) {
            setSelectedItems(new Set());
        } else {
            setSelectedItems(new Set(testimonials.map(item => item._id)));
        }
    };

    const toggleSelectItem = (id: string) => {
        const newSelected = new Set(selectedItems);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedItems(newSelected);
    };

    const handleEdit = (id: string) => {
        router.push(`/edit-testimonial/${id}`);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">{t('title')}</h1>
                <div className="flex gap-2">
                    {selectedItems.size > 0 && (
                        <Button
                            variant="destructive"
                            onClick={() => setBulkDeleteDialogOpen(true)}
                        >
                            {t('deleteSelected')} ({selectedItems.size})
                        </Button>
                    )}
                    <Button onClick={() => router.push('/add-testimonial')}>
                        {t('addTestimonial')}
                    </Button>
                </div>
            </div>

            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                    placeholder={t('searchPlaceholder')}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                />
            </div>

            {loading ? (
                <div className="text-center py-10">{t('loading')}</div>
            ) : testimonials.length === 0 ? (
                <div className="text-center py-10">{t('noTestimonials')}</div>
            ) : (
                <>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]">
                                    <Checkbox
                                        checked={selectedItems.size === testimonials.length}
                                        onCheckedChange={toggleSelectAll}
                                    />
                                </TableHead>
                                <TableHead>{t('customerName')}</TableHead>
                                <TableHead>{t('message')}</TableHead>
                                <TableHead>{t('status')}</TableHead>
                                <TableHead>{t('actions')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {testimonials.map((testimonial) => (
                                <TableRow key={testimonial._id}>
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedItems.has(testimonial._id)}
                                            onCheckedChange={() => toggleSelectItem(testimonial._id)}
                                        />
                                    </TableCell>
                                    <TableCell>{testimonial.customerName}</TableCell>
                                    <TableCell className="max-w-md truncate">{testimonial.message}</TableCell>
                                    <TableCell>
                                        <Switch
                                            checked={testimonial.isActive}
                                            onCheckedChange={(checked) =>
                                                handleStatusChange(testimonial._id, checked)
                                            }
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleEdit(testimonial._id)}
                                            >
                                                {t('edit')}
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => {
                                                    setItemToDelete(testimonial._id);
                                                    setDeleteDialogOpen(true);
                                                }}
                                            >
                                                {t('delete')}
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {totalPages > 1 && (
                        <div className="flex justify-center gap-2 mt-4">
                            <Button
                                variant="outline"
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                            >
                                {t('previous')}
                            </Button>
                            <span className="py-2">
                                {t('page')} {page} {t('of')} {totalPages}
                            </span>
                            <Button
                                variant="outline"
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                            >
                                {t('next')}
                            </Button>
                        </div>
                    )}
                </>
            )}

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t('deleteConfirmation')}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {t('deleteWarning')}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                if (itemToDelete) {
                                    handleDelete(itemToDelete);
                                    setDeleteDialogOpen(false);
                                }
                            }}
                        >
                            {t('delete')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Bulk Delete Confirmation Dialog */}
            <AlertDialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t('bulkDeleteConfirmation')}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {t('bulkDeleteWarning', { count: selectedItems.size })}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                // Implement bulk delete logic here
                                setBulkDeleteDialogOpen(false);
                            }}
                        >
                            {t('delete')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
