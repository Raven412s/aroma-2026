"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from 'date-fns'
import { Calendar, Search } from "lucide-react"
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

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

interface ReservationsResponse {
    data: Reservation[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export default function ReservationsManagement() {
    const t = useTranslations('ReservationsManagement');
    const router = useRouter();
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchReservations = useCallback(async () => {
        try {
            setLoading(true);
            const queryParams = new URLSearchParams({
                page: currentPage.toString(),
                limit: '10',
                ...(searchTerm && { search: searchTerm }),
                ...(statusFilter !== 'all' && { status: statusFilter })
            });

            const response = await fetch(`/api/reservations?${queryParams}`);
            if (!response.ok) throw new Error('Failed to fetch reservations');
            const data: ReservationsResponse = await response.json();
            setReservations(data.data);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Error fetching reservations:', error);
            setReservations([]);
        } finally {
            setLoading(false);
        }
    }, [currentPage, searchTerm, statusFilter]);

    useEffect(() => {
        fetchReservations();
    }, [fetchReservations]);

    const handleSearch = (value: string) => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    const handleStatusChange = (value: string) => {
        setStatusFilter(value);
        setCurrentPage(1);
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const formatReservationDateTime = (date: string, time: string) => {
        try {
            const [hours, minutes] = time.split(':');
            const isPM = time.includes('PM');
            const hour = parseInt(hours);
            const adjustedHour = isPM && hour !== 12 ? hour + 12 : hour === 12 && !isPM ? 0 : hour;

            const dateObj = new Date(date);
            dateObj.setHours(adjustedHour, parseInt(minutes.split(' ')[0]), 0);

            return format(dateObj, 'PPp');
        } catch (error) {
            console.error('Error formatting date:', error);
            return `${date} ${time}`;
        }
    };

    return (
        <div className="container mx-auto py-10">
            <div className="flex items-center gap-4 mb-8">
                <Calendar className="h-8 w-8" />
                <h1 className="text-3xl font-bold">{t('title')}</h1>
            </div>

            {/* Search and Filter Section */}
            <div className="mb-6 flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            placeholder={t('searchPlaceholder')}
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>
                <Select value={statusFilter} onValueChange={handleStatusChange}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder={t('filterByStatus')} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">{t('allStatuses')}</SelectItem>
                        <SelectItem value="pending">{t('pending')}</SelectItem>
                        <SelectItem value="confirmed">{t('confirmed')}</SelectItem>
                        <SelectItem value="cancelled">{t('cancelled')}</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Reservations List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="text-center py-8">{t('loading')}</div>
                ) : reservations.length === 0 ? (
                    <div className="text-center py-8">{t('noReservations')}</div>
                ) : (
                    reservations.map((reservation) => (
                        <Card key={reservation._id} className="hover:shadow-lg transition-shadow duration-200">
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div>
                                        <h3 className="text-lg font-semibold">{reservation.name}</h3>
                                        <p className="text-sm text-gray-500">{reservation.email}</p>
                                        <p className="text-sm text-gray-500">{reservation.phone}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <p className="text-sm">
                                            {formatReservationDateTime(reservation.date, reservation.time)}
                                        </p>
                                        <p className="text-sm">{reservation.guests} {t('guests')}</p>
                                        <span className={`inline-block px-2 py-1 rounded-full text-xs ${reservation.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                            reservation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                            {t(reservation.status)}
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-4 flex justify-end">
                                    <Button
                                        variant="outline"
                                        onClick={() => router.push(`/reservations/${reservation._id}`)}
                                    >
                                        {t('viewDetails')}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-6 flex justify-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        {t('previous')}
                    </Button>
                    <span className="px-4 py-2">
                        {t('page')} {currentPage} {t('of')} {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        {t('next')}
                    </Button>
                </div>
            )}
        </div>
    );
}
