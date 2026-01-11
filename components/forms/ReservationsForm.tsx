"use client"
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { Cake, Calendar, ChefHat, Clock, Mail, MessageSquare, Phone, User, Users, Utensils, Wine } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const reservationSchema = z.object({
    name: z.string().min(1, 'Name is required').min(2, 'Name must be at least 2 characters'),
    email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
    phone: z.string().min(1, 'Phone number is required').min(10, 'Phone number must be at least 10 digits'),
    date: z.string().min(1, 'Date is required').refine((date) => {
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate >= today;
    }, 'Please select a future date'),
    time: z.string().min(1, 'Time is required'),
    guests: z.string().min(1, 'Number of guests is required'),
    customGuests: z.string().optional(),
    occasion: z.string().optional(),
    dietaryRestrictions: z.string().optional(),
    specialRequests: z.string().optional(),
    tablePreference: z.string().optional()
}).refine((data) => {
    if (data.guests === 'other' && (!data.customGuests || data.customGuests.trim() === '')) {
        return false;
    }
    if (data.guests === 'other' && data.customGuests) {
        const num = parseInt(data.customGuests);
        return !isNaN(num) && num > 0 && num <= 200;
    }
    return true;
}, {
    message: 'Please enter a valid number of guests (1-50)',
    path: ['customGuests']
});

type ReservationFormData = z.infer<typeof reservationSchema>;

const ReservationsForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showCustomGuests, setShowCustomGuests] = useState(false);

    const form = useForm<ReservationFormData>({
        resolver: zodResolver(reservationSchema),
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            date: '',
            time: '',
            guests: '2',
            customGuests: '',
            occasion: '',
            dietaryRestrictions: '',
            specialRequests: '',
            tablePreference: 'no-preference'
        }
    });

    const timeSlots = [
        '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM',
        '2:00 PM', '2:30 PM', '3:00 PM', '6:00 PM', '6:30 PM', '7:00 PM',
        '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM', '10:00 PM'
    ];

    const occasions = [
        'Birthday', 'Anniversary', 'Date Night', 'Business Meeting',
        'Family Gathering', 'Celebration', 'Casual Dining', 'Other'
    ];

    const onSubmit = async (data: ReservationFormData) => {
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/reservations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Failed to create reservation');
            }

            setIsSubmitted(true);
        } catch (error) {
            console.error('Error submitting reservation:', error);
            // You might want to show an error message to the user here
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGuestsChange = (value: string) => {
        setShowCustomGuests(value === 'other');
        form.setValue('guests', value);
        if (value !== 'other') {
            form.setValue('customGuests', '');
        }
    };

    const resetForm = () => {
        setIsSubmitted(false);
        setShowCustomGuests(false);
        form.reset();
    };

    if (isSubmitted) {
        const formData = form.getValues();
        const guestCount = formData.guests === 'other' ? formData.customGuests : formData.guests;

        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center p-4">
                <Card className="max-w-md w-full border-amber-100 shadow-2xl">
                    <CardContent className="p-8 text-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ChefHat className="text-green-600" size={40} />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Reservation Confirmed!</h2>
                        <p className="text-gray-600 mb-6">
                            Thank you, {formData.name}! Your table for {guestCount} guests on {formData.date} at {formData.time} has been reserved.
                        </p>
                        <p className="text-amber-600 font-medium mb-6">
                            We&apos;ll send you a confirmation email shortly.
                        </p>
                        <Button
                            onClick={resetForm}
                            className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                        >
                            Make Another Reservation
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-amber-900 via-orange-800 to-red-900 text-white py-16">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
                        Reserve Your Table at <span className="text-amber-300">Aroma</span>
                    </h1>
                    <p className="text-xl text-amber-100 max-w-2xl mx-auto">
                        Secure your spot for an unforgettable dining experience
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <Card className="border-amber-100 shadow-2xl">
                    <CardContent className="p-8">
                        <Form {...form}>
                            <div onSubmit={form.handleSubmit(onSubmit)}>
                                <div className="grid md:grid-cols-2 gap-8">
                                    {/* Personal Information */}
                                    <div className="space-y-6">
                                        <CardHeader className="px-0 pb-6">
                                            <CardTitle className="text-2xl font-bold text-gray-800 flex items-center">
                                                <User className="text-amber-600 mr-3" size={28} />
                                                Personal Information
                                            </CardTitle>
                                        </CardHeader>

                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Full Name *</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Enter your full name"
                                                            {...field}
                                                            className="focus:ring-2 focus:ring-amber-500"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Email Address *</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                                                            <Input
                                                                type="email"
                                                                placeholder="your@email.com"
                                                                className="pl-10 focus:ring-2 focus:ring-amber-500"
                                                                {...field}
                                                            />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="phone"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Phone Number *</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Phone className="absolute left-3 top-3 text-gray-400" size={20} />
                                                            <Input
                                                                type="tel"
                                                                placeholder="+91 98765 43210"
                                                                className="pl-10 focus:ring-2 focus:ring-amber-500"
                                                                {...field}
                                                            />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {/* Reservation Details */}
                                    <div className="space-y-6">
                                        <CardHeader className="px-0 pb-6">
                                            <CardTitle className="text-2xl font-bold text-gray-800 flex items-center">
                                                <Calendar className="text-amber-600 mr-3" size={28} />
                                                Reservation Details
                                            </CardTitle>
                                        </CardHeader>

                                        <FormField
                                            control={form.control}
                                            name="date"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Date *</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
                                                            <Input
                                                                type="date"
                                                                min={new Date().toISOString().split('T')[0]}
                                                                className="pl-10 focus:ring-2 focus:ring-amber-500"
                                                                {...field}
                                                            />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="time"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Time *</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <div className="relative">
                                                                <Clock className="absolute left-3 top-3 text-gray-400 z-10" size={20} />
                                                                <SelectTrigger className="pl-10 focus:ring-2 focus:ring-amber-500">
                                                                    <SelectValue placeholder="Select time" />
                                                                </SelectTrigger>
                                                            </div>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {timeSlots.map(time => (
                                                                <SelectItem key={time} value={time}>{time}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="guests"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Number of Guests *</FormLabel>
                                                    <Select onValueChange={handleGuestsChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <div className="relative">
                                                                <Users className="absolute left-3 top-3 text-gray-400 z-10" size={20} />
                                                                <SelectTrigger className="pl-10 focus:ring-2 focus:ring-amber-500">
                                                                    <SelectValue placeholder="Select guests" />
                                                                </SelectTrigger>
                                                            </div>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {[...Array(12)].map((_, i) => (
                                                                <SelectItem key={i + 1} value={String(i + 1)}>
                                                                    {i + 1} {i === 0 ? 'Guest' : 'Guests'}
                                                                </SelectItem>
                                                            ))}
                                                            <SelectItem value="other">Other (Custom)</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {showCustomGuests && (
                                            <FormField
                                                control={form.control}
                                                name="customGuests"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Enter Number of Guests *</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="number"
                                                                placeholder="Enter number (1-50)"
                                                                min="1"
                                                                max="50"
                                                                className="focus:ring-2 focus:ring-amber-500"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        )}
                                    </div>
                                </div>

                                {/* Additional Information */}
                                <div className="mt-8 space-y-6">
                                    <CardHeader className="px-0 pb-6">
                                        <CardTitle className="text-2xl font-bold text-gray-800 flex items-center">
                                            <Utensils className="text-amber-600 mr-3" size={28} />
                                            Additional Information
                                        </CardTitle>
                                    </CardHeader>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <FormField
                                            control={form.control}
                                            name="occasion"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Occasion</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <div className="relative">
                                                                <Cake className="absolute left-3 top-3 text-gray-400 z-10" size={20} />
                                                                <SelectTrigger className="pl-10 focus:ring-2 focus:ring-amber-500">
                                                                    <SelectValue placeholder="Select occasion" />
                                                                </SelectTrigger>
                                                            </div>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {occasions.map(occasion => (
                                                                <SelectItem key={occasion} value={occasion}>{occasion}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="tablePreference"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Table Preference</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <div className="relative">
                                                                <Wine className="absolute left-3 top-3 text-gray-400 z-10" size={20} />
                                                                <SelectTrigger className="pl-10 focus:ring-2 focus:ring-amber-500">
                                                                    <SelectValue placeholder="Select preference" />
                                                                </SelectTrigger>
                                                            </div>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="no-preference">No Preference</SelectItem>
                                                            <SelectItem value="window">Window Seating</SelectItem>
                                                            <SelectItem value="private">Private Booth</SelectItem>
                                                            <SelectItem value="outdoor">Outdoor Patio</SelectItem>
                                                            <SelectItem value="bar">Bar Seating</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="dietaryRestrictions"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Dietary Restrictions</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="e.g., Vegetarian, Gluten-free, Allergies"
                                                        className="focus:ring-2 focus:ring-amber-500"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="specialRequests"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Special Requests</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <MessageSquare className="absolute left-3 top-3 text-gray-400" size={20} />
                                                        <Textarea
                                                            placeholder="Any special requests or notes for your reservation..."
                                                            className="pl-10 focus:ring-2 focus:ring-amber-500 resize-none"
                                                            rows={4}
                                                            {...field}
                                                        />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Submit Button */}
                                <div className="mt-8 text-center">
                                    <Button
                                        type="button"
                                        onClick={form.handleSubmit(onSubmit)}
                                        disabled={isSubmitting}
                                        className={`w-full md:w-auto px-12 py-6 text-lg font-semibold ${isSubmitting
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700'
                                            }`}
                                    >
                                        {isSubmitting ? (
                                            <div className="flex items-center justify-center">
                                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                                                Processing...
                                            </div>
                                        ) : (
                                            'Confirm Reservation'
                                        )}
                                    </Button>
                                </div>

                                <div className="mt-6 text-center text-sm text-gray-600">
                                    <p>
                                        By making a reservation, you agree to our terms and conditions.
                                        <br />
                                        We&apos;ll contact you to confirm your booking within 24 hours.
                                    </p>
                                </div>
                            </div>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ReservationsForm;
