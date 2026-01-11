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
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useForm } from "react-hook-form"
import { toast } from 'sonner'
import * as z from "zod"

const formSchema = z.object({
    customerName: z.string().min(2, {
        message: "Customer name must be at least 2 characters.",
    }),
    message: z.string().min(10, {
        message: "Message must be at least 10 characters.",
    }),
    isActive: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

export default function AddTestimonialPage() {
    const t = useTranslations('TestimonialsManagement');
    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            customerName: "",
            message: "",
            isActive: true,
        },
    });

    async function onSubmit(values: FormValues) {
        try {
            const response = await fetch('/api/testimonials', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...values,
                    customerImage: '/testimonial-avatar.jpg', // Static image path
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create testimonial');
            }

            toast.success(t('testimonialCreated'));
            router.push('/testimonials-management');
        } catch (error) {
            console.error('Error creating testimonial:', error);
            toast.error(t('testimonialCreationFailed'));
        }
    }

    return (
        <div className="container mx-auto py-10">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">{t('addNewTestimonial')}</h1>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="customerName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('customerName')}</FormLabel>
                                    <FormControl>
                                        <Input placeholder={t('enterCustomerName')} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="message"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('message')}</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder={t('enterMessage')}
                                            className="min-h-[100px]"
                                            {...field}
                                        />
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
                                        <FormLabel className="text-base">
                                            {t('status')}
                                        </FormLabel>
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

                        <div className="flex justify-end gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.push('/testimonials-management')}
                            >
                                {t('cancel')}
                            </Button>
                            <Button type="submit">{t('save')}</Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}
