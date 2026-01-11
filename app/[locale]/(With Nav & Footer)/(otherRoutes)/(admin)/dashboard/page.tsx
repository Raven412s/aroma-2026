"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { addDays, addHours, addMonths, endOfDay, endOfMonth, format, startOfDay, startOfMonth } from 'date-fns'
import { Calendar, LayoutDashboard, MessageSquare, Settings, Users, Utensils, FileText, Image as ImageIcon } from "lucide-react"
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

export default function AdminDashboard() {
    const t = useTranslations('AdminDashboard');
    const router = useRouter();
    const [totalMenuItems, setTotalMenuItems] = useState(0);
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('nextHour');

    const fetchDashboardData = useCallback(async () => {
        try {
            // Fetch menu items count
            const menuResponse = await fetch('/api/menu-sections?page=1&limit=1');
            if (!menuResponse.ok) throw new Error('Failed to fetch menu items');
            const menuData = await menuResponse.json();
            setTotalMenuItems(menuData.total);

            // Fetch all reservations
            const reservationsResponse = await fetch('/api/reservations');
            if (!reservationsResponse.ok) throw new Error('Failed to fetch reservations');
            const reservationsData: ReservationsResponse = await reservationsResponse.json();
            // Update to use the correct data structure
            setReservations(Array.isArray(reservationsData.data) ? reservationsData.data : []);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setReservations([]); // Set empty array on error
        } finally {
            setLoading(false);
        }
    }, []); // Empty dependency array since this function doesn't depend on any props or state

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]); // Now we can safely include fetchDashboardData as a dependency

    const getFilteredReservations = (timeFilter: string) => {
        if (!Array.isArray(reservations)) return [];

        const now = new Date();
        let filteredReservations = [...reservations];

        switch (timeFilter) {
            case 'nextHour':
                const nextHour = addHours(now, 1);
                filteredReservations = reservations.filter(res => {
                    const reservationTime = new Date(res.date);
                    reservationTime.setHours(parseInt(res.time.split(':')[0]), parseInt(res.time.split(':')[1].split(' ')[0]));
                    if (res.time.includes('PM') && parseInt(res.time.split(':')[0]) !== 12) {
                        reservationTime.setHours(reservationTime.getHours() + 12);
                    }
                    return reservationTime >= now && reservationTime <= nextHour;
                });
                break;
            case 'today':
                const todayStart = startOfDay(now);
                const todayEnd = endOfDay(now);
                filteredReservations = reservations.filter(res => {
                    const reservationDate = new Date(res.date);
                    return reservationDate >= todayStart && reservationDate <= todayEnd;
                });
                break;
            case 'tomorrow':
                const tomorrowStart = startOfDay(addDays(now, 1));
                const tomorrowEnd = endOfDay(addDays(now, 1));
                filteredReservations = reservations.filter(res => {
                    const reservationDate = new Date(res.date);
                    return reservationDate >= tomorrowStart && reservationDate <= tomorrowEnd;
                });
                break;
            case 'thisMonth':
                const monthStart = startOfMonth(now);
                const monthEnd = endOfMonth(now);
                filteredReservations = reservations.filter(res => {
                    const reservationDate = new Date(res.date);
                    return reservationDate >= monthStart && reservationDate <= monthEnd;
                });
                break;
            case 'nextMonth':
                const nextMonthStart = startOfMonth(addMonths(now, 1));
                const nextMonthEnd = endOfMonth(addMonths(now, 1));
                filteredReservations = reservations.filter(res => {
                    const reservationDate = new Date(res.date);
                    return reservationDate >= nextMonthStart && reservationDate <= nextMonthEnd;
                });
                break;
        }

        return filteredReservations;
    };

    const getConfirmedReservations = (reservations: Reservation[]) => {
        if (!Array.isArray(reservations)) return [];
        return reservations.filter(res => res.status === 'confirmed');
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

    const menuItems = [
        {
            title: t('menuManagement'),
            description: t('menuManagementDesc'),
            icon: <Utensils className="h-6 w-6" />,
            href: '/menu-management',
            color: 'bg-orange-500'
        },
        {
            title: t('reservations'),
            description: t('reservationsDesc'),
            icon: <Calendar className="h-6 w-6" />,
            href: '/reservations-management',
            color: 'bg-blue-500'
        },
        {
            title: t('userManagement'),
            description: t('userManagementDesc'),
            icon: <Users className="h-6 w-6" />,
            href: '/users',
            color: 'bg-green-500'
        },
        {
            title: t('testimonials'),
            description: t('testimonialsDesc'),
            icon: <MessageSquare className="h-6 w-6" />,
            href: '/testimonials-management',
            color: 'bg-pink-500'
        },
        {
            title: 'Restaurant Story',
            description: 'Manage the restaurant story content that appears on the about page',
            icon: <FileText className="h-6 w-6" />,
            href: '/restaurant-story',
            color: 'bg-yellow-500'
        },
        {
            title: 'Menu Copy',
            description: 'Manage the menu intro paragraphs that appear on the menu page',
            icon: <FileText className="h-6 w-6" />,
            href: '/menu-copy',
            color: 'bg-orange-400'
        },
        {
            title: 'Static Images',
            description: 'Manage images used throughout the website with Cloudinary storage',
            icon: <ImageIcon className="h-6 w-6" />,
            href: '/static-images',
            color: 'bg-purple-500'
        },
        {
            title: t('settings'),
            description: t('settingsDesc'),
            icon: <Settings className="h-6 w-6" />,
            href: '/settings',
            color: 'bg-purple-500'
        }
    ];

    return (
        <div className="container mx-auto py-10">
            <div className="flex items-center gap-4 mb-8">
                <LayoutDashboard className="h-8 w-8" />
                <h1 className="text-3xl font-bold">{t('dashboard')}</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems.map((item, index) => (
                    <Card
                        key={index}
                        className="hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                        onClick={() => router.push(item.href)}
                    >
                        <CardHeader>
                            <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-lg ${item.color} text-white`}>
                                    {item.icon}
                                </div>
                                <div>
                                    <CardTitle>{item.title}</CardTitle>
                                    <CardDescription>{item.description}</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Button
                                variant="ghost"
                                className="w-full"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    router.push(item.href);
                                }}
                            >
                                {t('access')}
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Quick Stats Section */}
            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-6">{t('quickStats')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">{t('totalMenuItems')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">{loading ? '...' : totalMenuItems}</p>
                        </CardContent>
                    </Card>
                    <Card className="col-span-2">
                        <CardHeader>
                            <CardTitle className="text-lg">{t('reservations')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="nextHour" className="w-full" onValueChange={setActiveTab}>
                                <TabsList className="grid grid-cols-5 mb-4">
                                    <TabsTrigger value="nextHour">{t('nextHour')}</TabsTrigger>
                                    <TabsTrigger value="today">{t('today')}</TabsTrigger>
                                    <TabsTrigger value="tomorrow">{t('tomorrow')}</TabsTrigger>
                                    <TabsTrigger value="thisMonth">{t('thisMonth')}</TabsTrigger>
                                    <TabsTrigger value="nextMonth">{t('nextMonth')}</TabsTrigger>
                                </TabsList>
                                <TabsContent value={activeTab}>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle className="text-sm">{t('totalReservations')}</CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <p className="text-2xl font-bold">
                                                        {loading ? '...' : getFilteredReservations(activeTab).length}
                                                    </p>
                                                </CardContent>
                                            </Card>
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle className="text-sm">{t('confirmedReservations')}</CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <p className="text-2xl font-bold">
                                                        {loading ? '...' : getConfirmedReservations(getFilteredReservations(activeTab)).length}
                                                    </p>
                                                </CardContent>
                                            </Card>
                                        </div>
                                        <div className="mt-4">
                                            <h3 className="text-lg font-semibold mb-2">{t('upcomingReservations')}</h3>
                                            <div className="space-y-2">
                                                {getFilteredReservations(activeTab)
                                                    .sort((a, b) => {
                                                        const dateA = new Date(a.date);
                                                        const dateB = new Date(b.date);
                                                        const [hoursA, minutesA] = a.time.split(':');
                                                        const [hoursB, minutesB] = b.time.split(':');
                                                        const isPMA = a.time.includes('PM');
                                                        const isPMB = b.time.includes('PM');

                                                        dateA.setHours(
                                                            isPMA && parseInt(hoursA) !== 12 ? parseInt(hoursA) + 12 :
                                                                parseInt(hoursA) === 12 && !isPMA ? 0 :
                                                                    parseInt(hoursA),
                                                            parseInt(minutesA.split(' ')[0]),
                                                            0
                                                        );

                                                        dateB.setHours(
                                                            isPMB && parseInt(hoursB) !== 12 ? parseInt(hoursB) + 12 :
                                                                parseInt(hoursB) === 12 && !isPMB ? 0 :
                                                                    parseInt(hoursB),
                                                            parseInt(minutesB.split(' ')[0]),
                                                            0
                                                        );

                                                        return dateA.getTime() - dateB.getTime();
                                                    })
                                                    .slice(0, 5)
                                                    .map((reservation) => (
                                                        <Card key={reservation._id} className="p-3">
                                                            <div className="flex justify-between items-center">
                                                                <div>
                                                                    <p className="font-medium">{reservation.name}</p>
                                                                    <p className="text-sm text-gray-500">
                                                                        {formatReservationDateTime(reservation.date, reservation.time)}
                                                                    </p>
                                                                </div>
                                                                <div className="text-right">
                                                                    <p className="text-sm">{reservation.guests} {t('guests')}</p>
                                                                    <span className={`inline-block px-2 py-1 rounded-full text-xs ${reservation.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                                                        reservation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                                            'bg-red-100 text-red-800'
                                                                        }`}>
                                                                        {t(reservation.status)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </Card>
                                                    ))}
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">{t('totalUsers')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">156</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
