"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from 'next/navigation'
import { use, useCallback, useEffect, useState } from 'react'
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Loader2, ArrowLeft, Trash2, Plus } from "lucide-react"
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
import { ImageInput } from '@/components/ui/image-input'

interface MenuSectionFormData {
    _id: string;
    title_en: string;
    title_ar: string;
    title_ru: string;
    sections: {
        section_en: string;
        section_ar: string;
        section_ru: string;
        items: {
            _id: string;
            name_en: string;
            name_ar: string;
            name_ru: string;
            description_en: string;
            description_ar: string;
            description_ru: string;
            price: string;
            image?: string;
        }[];
    }[];
}

function cleanSectionForSubmit(section: MenuSectionFormData) {
    return {
        ...section,
        sections: section.sections.map(subSection => ({
            ...subSection,
            items: subSection.items.map(item => {
                // Remove _id if not a valid ObjectId (24 hex chars)
                if (!/^[a-fA-F0-9]{24}$/.test(item._id)) {
                    const { ...rest } = item;
                    return rest;
                }
                return item;
            }),
        })),
    };
}

export default function EditMenuPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [menuSection, setMenuSection] = useState<MenuSectionFormData | null>(null);
    const { id } = use(params);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<
        | { type: 'item'; subIdx: number; itemIdx: number }
        | { type: 'subsection'; subIdx: number }
        | null
    >(null);

    const fetchMenuSection = useCallback(async () => {
        try {
            const response = await fetch(`/api/menu-sections/${id}`);
            if (!response.ok) throw new Error('Failed to fetch menu section');
            const data = await response.json();
            setMenuSection(data);
        } catch (error) {
            console.error('Error fetching menu section:', error);
            toast.error('Failed to fetch menu section.');
            router.push('/menu-management');
        } finally {
            setLoading(false);
        }
    }, [id, router]);

    useEffect(() => {
        fetchMenuSection();
    }, [fetchMenuSection]);

    const handleSectionChange = (field: keyof MenuSectionFormData, value: string) => {
        if (!menuSection) return;
        setMenuSection({ ...menuSection, [field]: value });
    };

    const handleSubSectionChange = (subIdx: number, field: string, value: string) => {
        if (!menuSection) return;
        const newSections = [...menuSection.sections];
        newSections[subIdx] = { ...newSections[subIdx], [field]: value };
        setMenuSection({ ...menuSection, sections: newSections });
    };

    const handleItemChange = (subIdx: number, itemIdx: number, field: string, value: string) => {
        if (!menuSection) return;
        const newSections = [...menuSection.sections];
        const newItems = [...newSections[subIdx].items];
        newItems[itemIdx] = { ...newItems[itemIdx], [field]: value };
        newSections[subIdx] = { ...newSections[subIdx], items: newItems };
        setMenuSection({ ...menuSection, sections: newSections });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!menuSection) return;
        setSaving(true);
        try {
            const cleanedSection = cleanSectionForSubmit(menuSection);
            const response = await fetch(`/api/menu-sections/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(cleanedSection),
            });
            if (!response.ok) throw new Error('Failed to update menu section');
            toast.success('Menu section updated successfully!');
            router.push('/menu-management');
        } catch (error) {
            console.error('Error updating menu section:', error);
            toast.error('Failed to update menu section.');
        } finally {
            setSaving(false);
        }
    };

    const handleAddSubSection = () => {
        if (!menuSection) return;
        const newSubSection = {
            section_en: '',
            section_ar: '',
            section_ru: '',
            items: [],
        };
        setMenuSection({ ...menuSection, sections: [...menuSection.sections, newSubSection] });
    };

    const handleDeleteSubSection = (subIdx: number) => {
        setDeleteTarget({ type: 'subsection', subIdx });
        setDeleteDialogOpen(true);
    };

    const handleDeleteItem = (subIdx: number, itemIdx: number) => {
        setDeleteTarget({ type: 'item', subIdx, itemIdx });
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (!menuSection || !deleteTarget) return;
        if (deleteTarget.type === 'subsection') {
            const newSections = menuSection.sections.filter((_, idx) => idx !== deleteTarget.subIdx);
            setMenuSection({ ...menuSection, sections: newSections });
        } else if (deleteTarget.type === 'item') {
            const newSections = [...menuSection.sections];
            newSections[deleteTarget.subIdx] = {
                ...newSections[deleteTarget.subIdx],
                items: newSections[deleteTarget.subIdx].items.filter((_, idx) => idx !== deleteTarget.itemIdx),
            };
            setMenuSection({ ...menuSection, sections: newSections });
        }
        setDeleteDialogOpen(false);
        setDeleteTarget(null);
    };

    const handleAddItem = (subIdx: number) => {
        if (!menuSection) return;
        const newItem = {
            _id: Math.random().toString(36).slice(2), // temp id for UI
            name_en: '',
            name_ar: '',
            name_ru: '',
            description_en: '',
            description_ar: '',
            description_ru: '',
            price: '',
            image: '',
        };
        const newSections = [...menuSection.sections];
        newSections[subIdx] = {
            ...newSections[subIdx],
            items: [...newSections[subIdx].items, newItem],
        };
        setMenuSection({ ...menuSection, sections: newSections });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    if (!menuSection) {
        return null;
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="max-w-6xl mx-auto space-y-6">
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => router.push('/menu-management')}
                        className="shrink-0"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h1 className="text-3xl font-bold tracking-tight">Edit Menu Section</h1>
                </div>

                <Separator />

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Section titles */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Section Titles</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="title_en">English Title</Label>
                                    <Input
                                        id="title_en"
                                        value={menuSection.title_en}
                                        onChange={e => handleSectionChange('title_en', e.target.value)}
                                        placeholder="e.g. Appetizers"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="title_ar">Arabic Title</Label>
                                    <Input
                                        id="title_ar"
                                        value={menuSection.title_ar}
                                        onChange={e => handleSectionChange('title_ar', e.target.value)}
                                        placeholder="e.g. المقبلات"
                                        dir="rtl"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="title_ru">Russian Title</Label>
                                    <Input
                                        id="title_ru"
                                        value={menuSection.title_ru}
                                        onChange={e => handleSectionChange('title_ru', e.target.value)}
                                        placeholder="e.g. Закуски"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Subsections and items */}
                    {menuSection.sections.map((subSection, subIdx) => (
                        <Card key={subIdx}>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <span>Subsection #{subIdx + 1}</span>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        onClick={() => handleDeleteSubSection(subIdx)}
                                        title="Delete Subsection"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <Label>Section (English)</Label>
                                        <Input
                                            value={subSection.section_en}
                                            onChange={e => handleSubSectionChange(subIdx, 'section_en', e.target.value)}
                                            placeholder="e.g. Cold Appetizers"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Section (Arabic)</Label>
                                        <Input
                                            value={subSection.section_ar}
                                            onChange={e => handleSubSectionChange(subIdx, 'section_ar', e.target.value)}
                                            placeholder="e.g. المقبلات الباردة"
                                            dir="rtl"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Section (Russian)</Label>
                                        <Input
                                            value={subSection.section_ru}
                                            onChange={e => handleSubSectionChange(subIdx, 'section_ru', e.target.value)}
                                            placeholder="e.g. Холодные закуски"
                                        />
                                    </div>
                                </div>

                                {/* Items */}
                                <div className="space-y-4">
                                    <h4 className="font-medium text-lg">Menu Items</h4>
                                    {subSection.items.map((item, itemIdx) => (
                                        <Card key={item._id} className="bg-muted/50">
                                            <CardContent className="p-6 space-y-6">
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                    <div className="space-y-2">
                                                        <Label>Name (English)</Label>
                                                        <Input
                                                            value={item.name_en}
                                                            onChange={e => handleItemChange(subIdx, itemIdx, 'name_en', e.target.value)}
                                                            placeholder="e.g. Hummus"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Name (Arabic)</Label>
                                                        <Input
                                                            value={item.name_ar}
                                                            onChange={e => handleItemChange(subIdx, itemIdx, 'name_ar', e.target.value)}
                                                            placeholder="e.g. الحمص"
                                                            dir="rtl"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Name (Russian)</Label>
                                                        <Input
                                                            value={item.name_ru}
                                                            onChange={e => handleItemChange(subIdx, itemIdx, 'name_ru', e.target.value)}
                                                            placeholder="e.g. Хумус"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                    <div className="space-y-2">
                                                        <Label>Description (English)</Label>
                                                        <Textarea
                                                            value={item.description_en}
                                                            onChange={e => handleItemChange(subIdx, itemIdx, 'description_en', e.target.value)}
                                                            placeholder="e.g. Creamy chickpea dip with tahini"
                                                            rows={3}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Description (Arabic)</Label>
                                                        <Textarea
                                                            value={item.description_ar}
                                                            onChange={e => handleItemChange(subIdx, itemIdx, 'description_ar', e.target.value)}
                                                            placeholder="e.g. غموس الحمص الكريمي مع الطحينة"
                                                            rows={3}
                                                            dir="rtl"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Description (Russian)</Label>
                                                        <Textarea
                                                            value={item.description_ru}
                                                            onChange={e => handleItemChange(subIdx, itemIdx, 'description_ru', e.target.value)}
                                                            placeholder="e.g. Кремовый соус из нута с тахини"
                                                            rows={3}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <Label>Price</Label>
                                                        <div className="relative">
                                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                                                $
                                                            </span>
                                                            <Input
                                                                value={item.price}
                                                                onChange={e => handleItemChange(subIdx, itemIdx, 'price', e.target.value)}
                                                                placeholder="e.g. 8.99"
                                                                className="pl-8"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Image</Label>
                                                        <div className="flex items-center gap-4">

                                                            <div className="flex flex-col gap-2 flex-1">
                                                                <ImageInput
                                                                    value={item.image || ''}
                                                                    onChange={url => handleItemChange(subIdx, itemIdx, 'image', url)}
                                                                    name={`sections.${subIdx}.items.${itemIdx}.image`}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex justify-end">
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="icon"
                                                        onClick={() => handleDeleteItem(subIdx, itemIdx)}
                                                        title="Delete Item"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                    <div className="flex justify-end">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleAddItem(subIdx)}
                                            className="gap-2"
                                        >
                                            <Plus className="h-4 w-4" /> Add Item
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    <div className="flex justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleAddSubSection}
                            className="gap-2"
                        >
                            <Plus className="h-4 w-4" /> Add Subsection
                        </Button>
                    </div>

                    <div className="flex gap-4 justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push('/menu-management')}
                            disabled={saving}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={saving}>
                            {saving ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </div>
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
                        <AlertDialogDescription>
                            {deleteTarget?.type === 'subsection'
                                ? 'Are you sure you want to delete this subsection and all its items? This action cannot be undone.'
                                : 'Are you sure you want to delete this item? This action cannot be undone.'}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} autoFocus>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
