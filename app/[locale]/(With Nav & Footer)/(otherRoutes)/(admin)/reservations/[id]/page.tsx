"use client"

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, Mail, Phone, Users, Utensils, Wine, Cake, MessageSquare } from "lucide-react";

interface Reservation {
    _id: string;
    name: string;
    email: string;
    phone: string;
    date: string;
    time: string;
    guests: number;
    occasion?: string;
    dietaryRestrictions?: string;
    specialRequests?: string;
    tablePreference?: string;
    status: 'pending' | 'confirmed' | 'cancelled';
    createdAt: string;
}

export default function ReservationDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const t = useTranslations('ReservationsManagement');
    const router = useRouter();
    const [reservation, setReservation] = useState<Reservation | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReservation = async () => {
            try {
                const { id } = await params;
                const response = await fetch(`/api/reservations/${id}`);
                if (!response.ok) throw new Error('Failed to fetch reservation');
                const data = await response.json();
                setReservation(data);
            } catch (error) {
                console.error('Error fetching reservation:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchReservation();
    }, [params]);

    const handleStatusChange = async (newStatus: 'confirmed' | 'cancelled') => {
        try {
            const { id } = await params;
            const response = await fetch(`/api/reservations/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) throw new Error('Failed to update reservation status');
            const updatedReservation = await response.json();
            setReservation(updatedReservation);
        } catch (error) {
            console.error('Error updating reservation status:', error);
        }
    };

    const getStatusBadge = (status: string) => {
        const statusStyles = {
            pending: 'bg-yellow-100 text-yellow-800',
            confirmed: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800'
        };

        return (
            <Badge className={statusStyles[status as keyof typeof statusStyles]}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (!reservation) {
        return (
            <div className="container mx-auto py-10">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Reservation Not Found</h1>
                    <Button onClick={() => router.push('/reservations-management')}>
                        Back to Reservations
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-10">
            <div className="mb-6">
                <Button
                    variant="ghost"
                    className="mb-4"
                    onClick={() => router.push('/reservations-management')}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Reservations
                </Button>
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">{t('reservationDetails')}</h1>
                    <div className="flex gap-2">
                        {reservation.status === 'pending' && (
                            <>
                                <Button
                                    variant="outline"
                                    className="text-green-600 hover:text-green-700"
                                    onClick={() => handleStatusChange('confirmed')}
                                >
                                    {t('confirm')}
                                </Button>
                                <Button
                                    variant="outline"
                                    className="text-red-600 hover:text-red-700"
                                    onClick={() => handleStatusChange('cancelled')}
                                >
                                    {t('cancel')}
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid gap-6">
                {/* Status Card */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold mb-1">{t('status')}</h2>
                                {getStatusBadge(reservation.status)}
                            </div>
                            <div className="text-sm text-gray-500">
                                {t('createdAt')}: {new Date(reservation.createdAt).toLocaleString()}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Guest Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">{t('guestInformation')}</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-gray-500" />
                                <div>
                                    <p className="font-medium">{reservation.name}</p>
                                    <p className="text-sm text-gray-500">{reservation.guests} {t('guests')}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail className="h-5 w-5 text-gray-500" />
                                <div>
                                    <p className="font-medium">{t('email')}</p>
                                    <p className="text-sm text-gray-500">{reservation.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone className="h-5 w-5 text-gray-500" />
                                <div>
                                    <p className="font-medium">{t('phone')}</p>
                                    <p className="text-sm text-gray-500">{reservation.phone}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Reservation Details */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">{t('reservationDetails')}</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-gray-500" />
                                <div>
                                    <p className="font-medium">{t('date')}</p>
                                    <p className="text-sm text-gray-500">{new Date(reservation.date).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-5 w-5 text-gray-500" />
                                <div>
                                    <p className="font-medium">{t('time')}</p>
                                    <p className="text-sm text-gray-500">{reservation.time}</p>
                                </div>
                            </div>
                            {reservation.occasion && (
                                <div className="flex items-center gap-2">
                                    <Cake className="h-5 w-5 text-gray-500" />
                                    <div>
                                        <p className="font-medium">{t('occasion')}</p>
                                        <p className="text-sm text-gray-500">{reservation.occasion}</p>
                                    </div>
                                </div>
                            )}
                            {reservation.tablePreference && (
                                <div className="flex items-center gap-2">
                                    <Wine className="h-5 w-5 text-gray-500" />
                                    <div>
                                        <p className="font-medium">{t('tablePreference')}</p>
                                        <p className="text-sm text-gray-500">{reservation.tablePreference}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Additional Information */}
                {(reservation.dietaryRestrictions || reservation.specialRequests) && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl">{t('additionalInformation')}</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            {reservation.dietaryRestrictions && (
                                <div className="flex items-start gap-2">
                                    <Utensils className="h-5 w-5 text-gray-500 mt-1" />
                                    <div>
                                        <p className="font-medium">{t('dietaryRestrictions')}</p>
                                        <p className="text-sm text-gray-500">{reservation.dietaryRestrictions}</p>
                                    </div>
                                </div>
                            )}
                            {reservation.specialRequests && (
                                <div className="flex items-start gap-2">
                                    <MessageSquare className="h-5 w-5 text-gray-500 mt-1" />
                                    <div>
                                        <p className="font-medium">{t('specialRequests')}</p>
                                        <p className="text-sm text-gray-500">{reservation.specialRequests}</p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
