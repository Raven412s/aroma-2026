import { NextResponse } from 'next/server';

import Testimonial from '@/models/Testimonial';
import { connectToDb } from '@/lib/mongodb';

export async function GET(request: Request) {
    try {
        await connectToDb();

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const search = searchParams.get('search') || '';

        const query = search
            ? {
                $or: [
                    { customerName: { $regex: search, $options: 'i' } },
                    { message: { $regex: search, $options: 'i' } },
                ],
            }
            : {};

        const total = await Testimonial.countDocuments(query);
        const testimonials = await Testimonial.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .select('customerName message customerImage isActive createdAt updatedAt');

        return NextResponse.json({
            testimonials,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        console.error('Error fetching testimonials:', error);
        return NextResponse.json(
            { error: 'Failed to fetch testimonials' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        await connectToDb();

        const body = await request.json();
        const testimonial = await Testimonial.create(body);

        return NextResponse.json(testimonial, { status: 201 });
    } catch (error) {
        console.error('Error creating testimonial:', error);
        return NextResponse.json(
            { error: 'Failed to create testimonial' },
            { status: 500 }
        );
    }
}
