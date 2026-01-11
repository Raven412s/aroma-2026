"use client"
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { MenuCardCopy } from "@/types";

/**
 * MenuCardCopyForm allows admin to create or update the menu copy (intro paragraphs) for the menu page.
 * The admin can choose to use a single or two paragraphs per language.
 */
export default function MenuCardCopyForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [initialId, setInitialId] = useState<string | null>(null);
    // For each language, store an array of 1 or 2 paragraphs
    const [formData, setFormData] = useState<{
        en: string[];
        ar: string[];
        ru: string[];
    }>({ en: [""], ar: [""], ru: [""] });
    // For each language, store if user wants 1 or 2 paragraphs
    const [paraCount, setParaCount] = useState<{ en: 1 | 2; ar: 1 | 2; ru: 1 | 2 }>({ en: 1, ar: 1, ru: 1 });

    // Fetch the current active MenuCardCopy
    useEffect(() => {
        async function fetchCopy() {
            setLoading(true);
            try {
                const res = await fetch("/api/menu-copy");
                if (res.ok) {
                    const data: MenuCardCopy = await res.json();
                    setInitialId(data._id || null);
                    setFormData({
                        en: data.paragraphs.en.length === 2 ? data.paragraphs.en : [data.paragraphs.en[0] || "", ""],
                        ar: data.paragraphs.ar.length === 2 ? data.paragraphs.ar : [data.paragraphs.ar[0] || "", ""],
                        ru: data.paragraphs.ru.length === 2 ? data.paragraphs.ru : [data.paragraphs.ru[0] || "", ""],
                    });
                    setParaCount({
                        en: data.paragraphs.en.length === 2 ? 2 : 1,
                        ar: data.paragraphs.ar.length === 2 ? 2 : 1,
                        ru: data.paragraphs.ru.length === 2 ? 2 : 1,
                    });
                }
            } catch {
                // No active copy, ignore
            } finally {
                setLoading(false);
            }
        }
        fetchCopy();
    }, []);

    // Handle paragraph count toggle
    const handleParaCountChange = (lang: 'en' | 'ar' | 'ru', count: 1 | 2) => {
        setParaCount(prev => ({ ...prev, [lang]: count }));
        setFormData(prev => ({
            ...prev,
            [lang]: count === 2 ? [prev[lang][0] || "", prev[lang][1] || ""] : [prev[lang][0] || ""]
        }));
    };

    // Handle paragraph text change
    const handleParaChange = (lang: 'en' | 'ar' | 'ru', idx: number, value: string) => {
        setFormData(prev => {
            const arr = [...prev[lang]];
            arr[idx] = value;
            return { ...prev, [lang]: arr };
        });
    };

    // Handle form submit (create or update)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                paragraphs: {
                    en: formData.en.slice(0, paraCount.en),
                    ar: formData.ar.slice(0, paraCount.ar),
                    ru: formData.ru.slice(0, paraCount.ru),
                },
            };
            let res;
            if (initialId) {
                res = await fetch("/api/menu-copy", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ ...payload, _id: initialId }),
                });
            } else {
                res = await fetch("/api/menu-copy", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
            }
            if (!res.ok) throw new Error("Failed to save menu copy");
            toast.success("Menu copy saved successfully");
            router.refresh();
        } catch {
            toast.error("Failed to save menu copy");
        } finally {
            setLoading(false);
            router.push("/dashboard")
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {["en", "ar", "ru"].map((lang) => (
                <Card key={lang} className="p-6">
                    <h3 className="text-lg font-semibold mb-4 capitalize">{lang} Paragraphs</h3>
                    <div className="flex gap-4 mb-4">
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name={`paraCount-${lang}`}
                                checked={paraCount[lang as 'en' | 'ar' | 'ru'] === 1}
                                onChange={() => handleParaCountChange(lang as 'en' | 'ar' | 'ru', 1)}
                                disabled={loading}
                            />
                            Single Paragraph
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name={`paraCount-${lang}`}
                                checked={paraCount[lang as 'en' | 'ar' | 'ru'] === 2}
                                onChange={() => handleParaCountChange(lang as 'en' | 'ar' | 'ru', 2)}
                                disabled={loading}
                            />
                            Two Paragraphs
                        </label>
                    </div>
                    {[...Array(paraCount[lang as 'en' | 'ar' | 'ru'] === 2 ? 2 : 1)].map((_, idx) => (
                        <div key={idx} className="mb-4">
                            <label className="block text-sm font-medium mb-1">
                                Paragraph {idx + 1}
                            </label>
                            <Textarea
                                value={formData[lang as 'en' | 'ar' | 'ru'][idx] || ""}
                                onChange={e => handleParaChange(lang as 'en' | 'ar' | 'ru', idx, e.target.value)}
                                placeholder={`Enter paragraph ${idx + 1} in ${lang}`}
                                required={idx === 0}
                                rows={4}
                                disabled={loading}
                            />
                        </div>
                    ))}
                </Card>
            ))}
            <div className="flex justify-end gap-4">
                <Button type="submit" disabled={loading}>
                    {loading ? "Saving..." : "Save Menu Copy"}
                </Button>
            </div>
        </form>
    );
}
