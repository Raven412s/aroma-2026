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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Types } from 'mongoose'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { Input } from "@/components/ui/input"
import { useDebounce } from "@/hooks/useDebounce"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { Trash2, Plus, Pencil, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'

interface PaginationInfo {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

interface MenuItemWithContext {
    _id: Types.ObjectId;
    name_en: string;
    name_ar: string;
    name_ru: string;
    description_en: string;
    description_ar: string;
    description_ru: string;
    price: string;
    image?: string;
    section: string;
    title: string;
}

interface MenuSectionWithContext {
    _id: string;
    title_en: string;
    title_ar: string;
    title_ru: string;
    sections: {
        section_en: string;
        section_ar: string;
        section_ru: string;
        items: MenuItemWithContext[];
    }[];
}

export default function MenuManagementPage() {
    const t = useTranslations('MenuManagement');
    const router = useRouter();
    const [menuItems, setMenuItems] = useState<MenuItemWithContext[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
    const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
    const [pagination, setPagination] = useState<PaginationInfo>({
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0
    });
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);
    const [menuSections, setMenuSections] = useState<MenuSectionWithContext[]>([]);

    const fetchMenuItems = useCallback(async () => {
        try {
            setLoading(true);
            let url = `/api/menu-sections?page=${pagination.page}&limit=${pagination.limit}`;
            if (debouncedSearch) {
                url += `&search=${encodeURIComponent(debouncedSearch)}`;
            }
            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch menu items');
            const data = await response.json();
            if (debouncedSearch) {
                setMenuSections([]);
                setMenuItems(data.data);
                setPagination({
                    total: data.total,
                    page: data.page,
                    limit: data.limit,
                    totalPages: data.totalPages
                });
            } else {
                setMenuSections(data.data);
                setMenuItems([]);
                setPagination({
                    total: data.total,
                    page: data.page,
                    limit: data.limit,
                    totalPages: data.totalPages
                });
            }
        } catch (error) {
            console.error('Error fetching menu items:', error);
        } finally {
            setLoading(false);
        }
    }, [pagination.page, pagination.limit, debouncedSearch]);

    useEffect(() => {
        fetchMenuItems();
    }, [fetchMenuItems]);

    const handleDelete = async (id: string) => {
        try {
            const response = await fetch(`/api/menu-sections/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete menu item');
            fetchMenuItems();
            toast.success("Menu item deleted successfully");
        } catch (error) {
            console.error('Error deleting menu item:', error);
            toast.error("Failed to delete menu item");
        }
    };

    const handleBulkDelete = async () => {
        try {
            const deletePromises = Array.from(selectedItems).map(id =>
                fetch(`/api/menu-sections/${id}`, {
                    method: 'DELETE',
                })
            );

            await Promise.all(deletePromises);
            setSelectedItems(new Set());
            fetchMenuItems();
            toast.success(`${selectedItems.size} items deleted successfully`);
        } catch (error) {
            console.error('Error deleting menu items:', error);
            toast.error("Failed to delete selected items");
        }
    };

    const toggleSelectAll = () => {
        if (selectedItems.size === menuItems.length) {
            setSelectedItems(new Set());
        } else {
            setSelectedItems(new Set(menuItems.map(item => item._id.toString())));
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

    const handleEdit = (sectionId: string, subSectionIdx?: number, itemIdx?: number) => {
        let url = `/edit-menu/${sectionId}`;
        if (typeof subSectionIdx === 'number' && typeof itemIdx === 'number') {
            url += `?subSectionIdx=${subSectionIdx}&itemIdx=${itemIdx}`;
        }
        router.push(url);
    };

    const handlePageChange = (newPage: number) => {
        setPagination(prev => ({ ...prev, page: newPage }));
    };

    const handleLimitChange = (newLimit: string) => {
        setPagination(prev => ({ ...prev, limit: parseInt(newLimit), page: 1 }));
    };

    if (loading && !debouncedSearch) {
        return (
            <div className="container mx-auto py-10 space-y-4">
                <div className="flex justify-between items-center">
                    <Skeleton className="h-9 w-64" />
                    <div className="flex gap-2">
                        <Skeleton className="h-9 w-32" />
                        <Skeleton className="h-9 w-32" />
                    </div>
                </div>
                <Skeleton className="h-10 w-full max-w-xs ml-auto" />
                <Skeleton className="h-[500px] w-full rounded-md" />
                <div className="flex justify-between">
                    <Skeleton className="h-9 w-48" />
                    <Skeleton className="h-9 w-64" />
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">{t('menuManagement')}</h1>
                        <p className="text-muted-foreground text-sm">
                            Manage your restaurant menu items and categories
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                        {selectedItems.size > 0 && (
                            <Button
                                variant="destructive"
                                onClick={() => setBulkDeleteDialogOpen(true)}
                                className="gap-2"
                            >
                                <Trash2 className="h-4 w-4" />
                                {t('deleteSelected')} ({selectedItems.size})
                            </Button>
                        )}
                        <Button onClick={() => router.push('/add-menu')} className="gap-2">
                            <Plus className="h-4 w-4" />
                            {t('addNewItem')}
                        </Button>
                    </div>
                </div>

                <Separator />

                {/* Search Bar */}
                <div className="relative max-w-md ml-auto">
                    <Input
                        type="text"
                        placeholder="Search menu items..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="pl-10"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </div>
                </div>

                {/* Content */}
                {debouncedSearch ? (
                    <Card>
                        <CardHeader>
                            <CardTitle>Search Results</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {menuItems.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-muted-foreground">No items found matching your search</p>
                                </div>
                            ) : (
                                <div className="rounded-md border overflow-hidden">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[50px]">
                                                    <Checkbox
                                                        checked={selectedItems.size === menuItems.length && menuItems.length > 0}
                                                        onCheckedChange={toggleSelectAll}
                                                    />
                                                </TableHead>
                                                <TableHead>Image</TableHead>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Section</TableHead>
                                                <TableHead>Price</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {menuItems.map((item) => (
                                                <TableRow key={item._id.toString()}>
                                                    <TableCell>
                                                        <Checkbox
                                                            checked={selectedItems.has(item._id.toString())}
                                                            onCheckedChange={() => toggleSelectItem(item._id.toString())}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        {item.image ? (
                                                            <Image
                                                                src={item.image}
                                                                alt={item.name_en}
                                                                className="w-12 h-12 object-cover rounded-md border"
                                                                width={48}
                                                                height={48}
                                                            />
                                                        ) : (
                                                            <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center">
                                                                <span className="text-xs text-muted-foreground">No image</span>
                                                            </div>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="font-medium">{item.name_en}</TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className="whitespace-nowrap">
                                                            {item.title} - {item.section}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>${item.price}</TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => handleEdit(item._id.toString())}
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => {
                                                                    setItemToDelete(item._id.toString());
                                                                    setDeleteDialogOpen(true);
                                                                }}
                                                            >
                                                                <Trash2 className="h-4 w-4 text-destructive" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-6">
                        {menuSections.map((section) => (
                            <Card key={section._id}>
                                <CardHeader className="bg-muted/50">
                                    <div className="flex justify-between items-center">
                                        <CardTitle>{section.title_en}</CardTitle>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleEdit(section._id)}
                                        >
                                            Edit Section
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-0">
                                    {section.sections.map((subSection, subIdx) => (
                                        <div key={`${section._id}-${subIdx}`} className="border-b last:border-b-0">
                                            <div className="px-6 py-4 bg-muted/25 flex justify-between items-center">
                                                <h3 className="font-semibold">{subSection.section_en}</h3>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleEdit(section._id, subIdx)}
                                                >
                                                    Edit Subsection
                                                </Button>
                                            </div>
                                            <Table>
                                                <TableBody>
                                                    {subSection.items.map((item, itemIdx) => (
                                                        <TableRow key={item._id.toString()} className="hover:bg-muted/10">
                                                            <TableCell className="w-20">
                                                                {item.image ? (
                                                                    <Image
                                                                        src={item.image}
                                                                        alt={item.name_en}
                                                                        className="w-12 h-12 object-cover rounded-md border"
                                                                        width={48}
                                                                        height={48}
                                                                    />
                                                                ) : (
                                                                    <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center">
                                                                        <span className="text-xs text-muted-foreground">No image</span>
                                                                    </div>
                                                                )}
                                                            </TableCell>
                                                            <TableCell className="font-medium">{item.name_en}</TableCell>
                                                            <TableCell className="text-muted-foreground line-clamp-1">
                                                                {item.description_en}
                                                            </TableCell>
                                                            <TableCell className="font-medium">${item.price}</TableCell>
                                                            <TableCell className="text-right w-24">
                                                                <div className="flex justify-end gap-2">
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        onClick={() => handleEdit(section._id, subIdx, itemIdx)}
                                                                    >
                                                                        <Pencil className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        onClick={() => {
                                                                            setItemToDelete(item._id.toString());
                                                                            setDeleteDialogOpen(true);
                                                                        }}
                                                                    >
                                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                                    </Button>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Pagination Controls */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                        {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                        {pagination.total} items
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground whitespace-nowrap">
                                Rows per page:
                            </span>
                            <Select
                                value={pagination.limit.toString()}
                                onValueChange={handleLimitChange}
                            >
                                <SelectTrigger className="w-[80px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="5">5</SelectItem>
                                    <SelectItem value="10">10</SelectItem>
                                    <SelectItem value="20">20</SelectItem>
                                    <SelectItem value="50">50</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(pagination.page - 1)}
                                disabled={pagination.page === 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <span className="text-sm">
                                Page {pagination.page} of {pagination.totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(pagination.page + 1)}
                                disabled={pagination.page === pagination.totalPages || pagination.totalPages === 0}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Single Item Delete Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the menu item.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                if (itemToDelete) {
                                    handleDelete(itemToDelete);
                                    setDeleteDialogOpen(false);
                                    setItemToDelete(null);
                                }
                            }}
                            className="bg-destructive hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Bulk Delete Dialog */}
            <AlertDialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete {selectedItems.size} items?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the selected menu items.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                handleBulkDelete();
                                setBulkDeleteDialogOpen(false);
                            }}
                            className="bg-destructive hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
