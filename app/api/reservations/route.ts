import { connectToDb } from '@/lib/mongodb';
import { Reservation } from '@/models/Reservation';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Connect to the database
        await connectToDb();

        // Convert date string to Date object
        const reservationData = {
            ...body,
            date: new Date(body.date),
            guests: parseInt(body.guests === 'other' ? body.customGuests : body.guests)
        };

        // Create a new reservation
        const reservation = await Reservation.create(reservationData);

        return NextResponse.json(reservation, { status: 201 });
    } catch (error) {
        console.error('Error creating reservation:', error);
        return NextResponse.json(
            { error: 'Failed to create reservation' },
            { status: 500 }
        );
    }
}

interface ReservationQuery {
    page?: string;
    limit?: string;
    search?: string;
    status?: string;
}

interface ReservationFilter {
    $or?: Array<{
        [key: string]: { $regex: string; $options: string };
    }>;
    status?: string;
}

export async function GET(request: Request) {
    try {
        await connectToDb();
        const { searchParams } = new URL(request.url);
        const query: ReservationQuery = {
            page: searchParams.get('page') || undefined,
            limit: searchParams.get('limit') || undefined,
            search: searchParams.get('search') || undefined,
            status: searchParams.get('status') || undefined,
        };

        const page = parseInt(query.page || '1');
        const limit = parseInt(query.limit || '10');
        const skip = (page - 1) * limit;

        let filter: ReservationFilter = {};
        if (query.search) {
            filter = {
                $or: [
                    { name: { $regex: query.search, $options: 'i' } },
                    { email: { $regex: query.search, $options: 'i' } },
                    { phone: { $regex: query.search, $options: 'i' } },
                ],
            };
        }

        if (query.status) {
            filter.status = query.status;
        }

        const [reservations, total] = await Promise.all([
            Reservation.find(filter)
                .sort({ date: -1, time: -1 })
                .skip(skip)
                .limit(limit),
            Reservation.countDocuments(filter),
        ]);

        return NextResponse.json({
            data: reservations,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        console.error('Error fetching reservations:', error);
        return NextResponse.json(
            { error: 'Failed to fetch reservations' },
            { status: 500 }
        );
    }
}
