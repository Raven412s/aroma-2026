import { connectToDb } from '@/lib/mongodb';
import RestaurantStory from '@/models/RestaurantStory';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
    try {
        await connectToDb();
        const story = await RestaurantStory.findOne({ isActive: true });

        if (!story) {
            return NextResponse.json({ message: 'No active story found' }, { status: 404 });
        }

        return NextResponse.json(story);
    } catch (error) {
        console.error('Error fetching restaurant story:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        await connectToDb();

        const story = await RestaurantStory.create(body);
        return NextResponse.json(story, { status: 201 });
    } catch (error: unknown) {
        console.error('Error creating restaurant story:', error);
        let message = 'Internal server error';
        if (error instanceof Error) {
            message = error.message;
        }
        return NextResponse.json(
            { message },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        await connectToDb();

        const story = await RestaurantStory.findByIdAndUpdate(
            body._id,
            { $set: body },
            { new: true, runValidators: true }
        );

        if (!story) {
            return NextResponse.json(
                { message: 'Story not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(story);
    } catch (error: unknown) {
        console.error('Error updating restaurant story:', error);
        let message = 'Internal server error';
        if (error instanceof Error) {
            message = error.message;
        }
        return NextResponse.json(
            { message },
            { status: 500 }
        );
    }
}
