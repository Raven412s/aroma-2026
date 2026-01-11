import { NextResponse } from 'next/server';

import Testimonial from '@/models/Testimonial';
import { connectToDb } from '@/lib/mongodb';

export async function GET() {
    try {
        await connectToDb();
        const testimonials = await Testimonial.find({ isActive: true })
            .sort({ createdAt: -1 })
            .select('customerName message customerImage')
            .lean();

        return NextResponse.json({ testimonials });
    } catch (error) {
        console.error('Error fetching active testimonials:', error);
        return NextResponse.json(
            { error: 'Failed to fetch testimonials' },
            { status: 500 }
        );
    }
}
