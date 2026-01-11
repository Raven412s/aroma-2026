import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface RestaurantStoryFormProps {
    initialData?: {
        _id?: string;
        tagline: { en: string; ar: string; ru: string };
        description: { en: string; ar: string; ru: string };
        author: { en: string; ar: string; ru: string };
        isActive: boolean;
    };
}

export default function RestaurantStoryForm({ initialData }: RestaurantStoryFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        tagline: {
            en: initialData?.tagline?.en || "",
            ar: initialData?.tagline?.ar || "",
            ru: initialData?.tagline?.ru || "",
        },
        description: {
            en: initialData?.description?.en || "",
            ar: initialData?.description?.ar || "",
            ru: initialData?.description?.ru || "",
        },
        author: {
            en: initialData?.author?.en || "",
            ar: initialData?.author?.ar || "",
            ru: initialData?.author?.ru || "",
        },
        isActive: initialData?.isActive ?? true,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const url = '/api/restaurant-story';
            const method = initialData?._id ? 'PUT' : 'POST';
            const body = initialData?._id ? { ...formData, _id: initialData._id } : formData;

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                throw new Error('Failed to save restaurant story');
            }

            toast.success('Restaurant story saved successfully');
            router.push('/admin/dashboard');
            router.refresh();
        } catch (error) {
            console.error('Error saving restaurant story:', error);
            toast.error('Failed to save restaurant story');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (
        field: 'tagline' | 'description' | 'author',
        lang: 'en' | 'ar' | 'ru',
        value: string
    ) => {
        setFormData(prev => ({
            ...prev,
            [field]: {
                ...prev[field],
                [lang]: value
            }
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {['en', 'ar', 'ru'].map((lang) => (
                <Card key={lang} className="p-6">
                    <h3 className="text-lg font-semibold mb-4 capitalize">{lang} Content</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Tagline
                            </label>
                            <Input
                                value={formData.tagline[lang as keyof typeof formData.tagline]}
                                onChange={(e) => handleInputChange('tagline', lang as 'en' | 'ar' | 'ru', e.target.value)}
                                placeholder={`Enter tagline in ${lang}`}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Description
                            </label>
                            <Textarea
                                value={formData.description[lang as keyof typeof formData.description]}
                                onChange={(e) => handleInputChange('description', lang as 'en' | 'ar' | 'ru', e.target.value)}
                                placeholder={`Enter description in ${lang}`}
                                required
                                rows={4}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Author
                            </label>
                            <Input
                                value={formData.author[lang as keyof typeof formData.author]}
                                onChange={(e) => handleInputChange('author', lang as 'en' | 'ar' | 'ru', e.target.value)}
                                placeholder={`Enter author name in ${lang}`}
                                required
                            />
                        </div>
                    </div>
                </Card>
            ))}

            <div className="flex justify-end gap-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={loading}
                >
                    Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Story'}
                </Button>
            </div>
        </form>
    );
}
