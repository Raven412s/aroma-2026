"use client"

import { useState, useEffect } from "react"
import { useForm, type SubmitHandler, type Control } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
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
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { Types } from "mongoose"

const formSchema = z.object({
    customerName: z.string().min(2, {
        message: "Customer name must be at least 2 characters.",
    }),
    customerTitle: z.string().min(2, {
        message: "Customer title must be at least 2 characters.",
    }),
    content: z.string().min(10, {
        message: "Testimonial content must be at least 10 characters.",
    }),
    isActive: z.boolean(),
})

type FormValues = z.infer<typeof formSchema>

interface EditTestimonialFormProps {
    id: Types.ObjectId
}

export default function EditTestimonialForm({ id }: EditTestimonialFormProps) {
    const t = useTranslations("TestimonialsManagement")
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [testimonial, setTestimonial] = useState<FormValues | null>(null)

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            customerName: "",
            customerTitle: "",
            content: "",
            isActive: true,
        },
    })

    useEffect(() => {
        const fetchTestimonial = async () => {
            try {
                const response = await fetch(`/api/testimonials/${id}`)
                if (!response.ok) {
                    throw new Error("Failed to fetch testimonial")
                }
                const data = await response.json()
                setTestimonial(data)
                form.reset({
                    customerName: data.customerName,
                    customerTitle: data.customerTitle,
                    content: data.content,
                    isActive: data.isActive,
                })
            } catch (error) {
                console.error("Error fetching testimonial:", error)
                toast.error(t("fetchError"))
            }
        }

        fetchTestimonial()
    }, [id, form, t])

    const onSubmit: SubmitHandler<FormValues> = async (values) => {
        setIsLoading(true)
        try {
            const response = await fetch(`/api/testimonials/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            })

            if (!response.ok) {
                throw new Error("Failed to update testimonial")
            }

            toast.success(t("updateSuccess"))
            router.push("/admin/testimonials-management")
        } catch (error) {
            console.error("Error updating testimonial:", error)
            toast.error(t("updateError"))
        } finally {
            setIsLoading(false)
        }
    }

    if (!testimonial) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    const control = form.control as Control<FormValues>

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-8">{t("editTestimonial")}</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={control}
                        name="customerName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t("customerName")}</FormLabel>
                                <FormControl>
                                    <Input placeholder={t("customerNamePlaceholder")} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="customerTitle"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t("customerTitle")}</FormLabel>
                                <FormControl>
                                    <Input placeholder={t("customerTitlePlaceholder")} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="content"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t("content")}</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder={t("contentPlaceholder")}
                                        className="min-h-[100px]"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex justify-end space-x-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push("/admin/testimonials-management")}
                        >
                            {t("cancel")}
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {t("saving")}
                                </>
                            ) : (
                                t("save")
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
