"use client"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ImageInput } from "@/components/ui/image-input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"
import { Trash2 } from "lucide-react"
import { useState } from "react"

const itemSchema = z.object({
    // English fields
    name_en: z.string().min(1, "English name is required"),
    description_en: z.string().min(1, "English description is required"),

    // Arabic fields
    name_ar: z.string().min(1, "Arabic name is required"),
    description_ar: z.string().min(1, "Arabic description is required"),

    // Russian fields
    name_ru: z.string().min(1, "Russian name is required"),
    description_ru: z.string().min(1, "Russian description is required"),

    // Common fields
    price: z.string().min(1, "Price is required"),
    image: z
        .string()
        .refine(
            (val) => !val || val.startsWith("http") || val.startsWith("/gallery"),
            { message: "Must be a valid image path or URL" }
        ),
})

const subSectionSchema = z.object({
    section_en: z.string().optional(),
    section_ar: z.string().optional(),
    section_ru: z.string().optional(),
    items: z.array(itemSchema),
})

const formSchema = z.object({
    title_en: z.string().min(1, "English title is required"),
    title_ar: z.string().min(1, "Arabic title is required"),
    title_ru: z.string().min(1, "Russian title is required"),
    sections: z.array(subSectionSchema),
})

type FormValues = z.infer<typeof formSchema>

type Language = 'en' | 'ar' | 'ru'

export default function AddMenuItemForm() {
    const [activeLanguage, setActiveLanguage] = useState<Language>('en')
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title_en: "",
            title_ar: "",
            title_ru: "",
            sections: [{
                section_en: "",
                section_ar: "",
                section_ru: "",
                items: [{
                    name_en: "",
                    name_ar: "",
                    name_ru: "",
                    description_en: "",
                    description_ar: "",
                    description_ru: "",
                    price: "",
                    image: "",
                }],
            }],
        },
        mode: "onChange",
    })

    const {
        fields: sectionFields,
        append: appendSection,
        remove: removeSection,
    } = useFieldArray({
        control: form.control,
        name: "sections",
    })

    const onSubmit = async (data: FormValues) => {
        try {
            console.log("Submitting data:", data)
            const response = await fetch("/api/menu-sections", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })

            if (!response.ok) {
                throw new Error("Failed to save menu section")
            }

            await response.json()
            toast.success("Menu section saved successfully")
            form.reset()
        } catch (error) {
            console.error("Error saving menu section:", error)
            toast.error("Failed to save menu section. Please try again later.")
        }
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 max-w-4xl mx-auto p-8"
            >
                <LanguageTabs
                    activeLang={activeLanguage}
                    setActiveLang={setActiveLanguage}
                />

                {/* Title */}
                <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name={`title_${activeLanguage}`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Menu Section Title ({activeLanguage.toUpperCase()})</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder={
                                            activeLanguage === 'en' ? "e.g., Starters, Signature, etc." :
                                                activeLanguage === 'ar' ? "مثال: المقبلات، التوقيعات، إلخ." :
                                                    "например, Закуски, Фирменные блюда и т.д."
                                        }
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Subsections */}
                {sectionFields.map((section, sectionIndex) => (
                    <div
                        key={section.id}
                        className="border p-4 rounded-lg space-y-4 bg-gray-50 relative"
                    >
                        <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="absolute top-2 right-2 text-red-500"
                            onClick={() => removeSection(sectionIndex)}
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>

                        <FormField
                            control={form.control}
                            name={`sections.${sectionIndex}.section_${activeLanguage}`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Subsection Label ({activeLanguage.toUpperCase()})</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder={
                                                activeLanguage === 'en' ? "e.g., New, Recommended, etc." :
                                                    activeLanguage === 'ar' ? "مثال: جديد، موصى به، إلخ." :
                                                        "например, Новое, Рекомендуемые и т.д."
                                            }
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <ItemFields
                            sectionIndex={sectionIndex}
                            form={form}
                            activeLanguage={activeLanguage}
                        />
                    </div>
                ))}

                <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                        appendSection({
                            section_en: "",
                            section_ar: "",
                            section_ru: "",
                            items: [{
                                name_en: "",
                                name_ar: "",
                                name_ru: "",
                                description_en: "",
                                description_ar: "",
                                description_ru: "",
                                price: "",
                                image: "",
                            }],
                        })
                    }
                >
                    Add New Subsection
                </Button>

                <Button type="submit" className="w-full">
                    Save Menu Section
                </Button>
            </form>
        </Form>
    )
}

function LanguageTabs({ activeLang, setActiveLang }: {
    activeLang: Language,
    setActiveLang: (lang: Language) => void
}) {
    return (
        <div className="flex border-b mb-4">
            <button
                type="button"
                className={`px-4 py-2 ${activeLang === 'en' ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-500'}`}
                onClick={() => setActiveLang('en')}
            >
                English
            </button>
            <button
                type="button"
                className={`px-4 py-2 ${activeLang === 'ar' ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-500'}`}
                onClick={() => setActiveLang('ar')}
            >
                العربية
            </button>
            <button
                type="button"
                className={`px-4 py-2 ${activeLang === 'ru' ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-500'}`}
                onClick={() => setActiveLang('ru')}
            >
                Русский
            </button>
        </div>
    )
}

function ItemFields({
    sectionIndex,
    form,
    activeLanguage,
}: {
    sectionIndex: number
    form: ReturnType<typeof useForm<FormValues>>
    activeLanguage: Language
}) {
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: `sections.${sectionIndex}.items`,
    })

    const renderField = (itemIndex: number, fieldBaseName: string) => {
        const fieldName = fieldBaseName.includes('name') || fieldBaseName.includes('description')
            ? `${fieldBaseName}_${activeLanguage}`
            : fieldBaseName;

        if (fieldName === 'image') {
            return (
                <FormField
                    control={form.control}
                    name={`sections.${sectionIndex}.items.${itemIndex}.image`}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Image</FormLabel>
                            <FormControl>
                                <ImageInput
                                    value={field.value}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    name={field.name}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            )
        }

        const fieldPath = `sections.${sectionIndex}.items.${itemIndex}.${fieldName}` as `sections.${number}.items.${number}.${'name_en' | 'name_ar' | 'name_ru' | 'description_en' | 'description_ar' | 'description_ru' | 'price' | 'image'}`;

        return (
            <FormField
                control={form.control}
                name={fieldPath}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            {fieldBaseName === 'name' ? 'Name' :
                                fieldBaseName === 'description' ? 'Description' :
                                    'Price'} ({activeLanguage.toUpperCase()})
                        </FormLabel>
                        <FormControl>
                            <Input
                                placeholder={
                                    fieldName === "price" ? "$12.00" :
                                        fieldBaseName === "name" ?
                                            (activeLanguage === 'en' ? "Item name" :
                                                activeLanguage === 'ar' ? "اسم العنصر" :
                                                    "Название блюда") :
                                            (activeLanguage === 'en' ? "Item description" :
                                                activeLanguage === 'ar' ? "وصف العنصر" :
                                                    "Описание блюда")
                                }
                                {...field}
                                value={String(field.value || '')}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        )
    }

    return (
        <div className="space-y-4">
            <h4 className="font-semibold text-lg">Items</h4>
            {fields.map((item, itemIndex) => (
                <div key={item.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end relative">
                    {['name', 'description', 'price', 'image'].map((fieldBaseName) => (
                        <div key={`${item.id}-${fieldBaseName}`}>
                            {renderField(itemIndex, fieldBaseName)}
                        </div>
                    ))}
                    <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="absolute -top-2 -right-2 text-red-500"
                        onClick={() => remove(itemIndex)}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            ))}
            <Button
                type="button"
                variant="secondary"
                onClick={() =>
                    append({
                        name_en: "",
                        name_ar: "",
                        name_ru: "",
                        description_en: "",
                        description_ar: "",
                        description_ru: "",
                        price: "",
                        image: "",
                    })
                }
            >
                Add Item
            </Button>
        </div>
    )
}
